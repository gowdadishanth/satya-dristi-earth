import { useEffect, useRef, useState } from "react";
import { Satellite, Radio, Compass, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { cn } from "./ui";

interface Target {
  id: string;
  name: string;
  alt: string;
  speed: string;
  sensor: string;
  band: string;
  angle: number; // degrees 0-360
  distRatio: number; // 0 to 1
  lastHitTime: number;
}

export function OrbitalRadarScope({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [audioFeedback, setAudioFeedback] = useState(false);
  const [sweepRate, setSweepRate] = useState<"normal" | "fast">("normal");

  const targetsRef = useRef<Target[]>([
    {
      id: "nisar",
      name: "NISAR Observatory",
      alt: "747 km",
      speed: "7.48 km/s",
      sensor: "Active Microwave SAR",
      band: "L-band (24cm) + S-band (9cm)",
      angle: 42,
      distRatio: 0.62,
      lastHitTime: 0,
    },
    {
      id: "s1c",
      name: "Sentinel-1C (ESA)",
      alt: "693 km",
      speed: "7.51 km/s",
      sensor: "C-SAR Radar",
      band: "C-band (5.5cm)",
      angle: 195,
      distRatio: 0.78,
      lastHitTime: 0,
    },
    {
      id: "s2a",
      name: "Sentinel-2A (Copernicus)",
      alt: "786 km",
      speed: "7.46 km/s",
      sensor: "MSI 13-Band Optical",
      band: "VNIR & SWIR",
      angle: 310,
      distRatio: 0.48,
      lastHitTime: 0,
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 10;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Radar Canvas Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
      bgGrad.addColorStop(0, "#DCE0C6");
      bgGrad.addColorStop(0.8, "#D0D5B5");
      bgGrad.addColorStop(1, "#C4CA9F");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Concentric Range Rings in Muted Forest Sage (#789575)
      const ringSteps = [0.25, 0.5, 0.75, 1];
      ringSteps.forEach((step, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * step, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(120, 149, 117, 0.35)";
        ctx.lineWidth = idx === ringSteps.length - 1 ? 2 : 1;
        ctx.stroke();

        // Distance range labels
        ctx.fillStyle = "#2E4030";
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${Math.round(750 * step)} km`, cx + 4, cy - radius * step + 12);
      });

      // Azimuth Crosshair Axes
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.strokeStyle = "rgba(120, 149, 117, 0.40)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Diagonal Guideline Ticks (45°, 135°, etc.)
      for (let a = 0; a < 360; a += 45) {
        const rad = (a * Math.PI) / 180;
        const x1 = cx + (radius - 6) * Math.cos(rad);
        const y1 = cy + (radius - 6) * Math.sin(rad);
        const x2 = cx + radius * Math.cos(rad);
        const y2 = cy + radius * Math.sin(rad);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(120, 149, 117, 0.65)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Sweep Beam with Phosphor Trail Decay
      const trailAngle = (Math.PI * 2) / 7;
      const grad = ctx.createConicGradient(angle - Math.PI / 2, cx, cy);
      grad.addColorStop(0, "rgba(120, 149, 117, 0.45)");
      grad.addColorStop(trailAngle / (Math.PI * 2), "rgba(120, 149, 117, 0.0)");
      grad.addColorStop(1, "rgba(120, 149, 117, 0.0)");

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - trailAngle, angle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Sharp Leading Sweep Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = "#466B44";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Target Satellites & Dynamic Ping Hits
      const now = performance.now();
      const currentDeg = (((angle * 180) / Math.PI) % 360 + 360) % 360;

      targetsRef.current.forEach((t) => {
        const tRad = (t.angle * Math.PI) / 180;
        const tx = cx + radius * t.distRatio * Math.cos(tRad);
        const ty = cy + radius * t.distRatio * Math.sin(tRad);

        // Check if sweep beam just passed target
        const diff = Math.abs(currentDeg - t.angle);
        if (diff < 3 || diff > 357) {
          t.lastHitTime = now;
        }

        const timeSinceHit = now - t.lastHitTime;
        const isFresh = timeSinceHit < 1800;
        const pingAlpha = isFresh ? 1 - timeSinceHit / 1800 : 0.25;

        // Expanding Ping Ripple
        if (isFresh && timeSinceHit < 900) {
          const rippleRadius = (timeSinceHit / 900) * 22;
          ctx.beginPath();
          ctx.arc(tx, ty, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(46, 125, 50, ${1 - timeSinceHit / 900})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Target Blip Dot
        ctx.beginPath();
        ctx.arc(tx, ty, t.id === "nisar" ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = t.id === "nisar" ? "#141F16" : "#2E7D32";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Target Label
        ctx.fillStyle = `rgba(20, 31, 22, ${Math.max(pingAlpha, 0.75)})`;
        ctx.font = t.id === "nisar" ? "bold 10px 'JetBrains Mono', monospace" : "9px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(t.name.split(" ")[0], tx + 8, ty + 3);
      });

      // Center Ground Station Beacon
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#141F16";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Advance Sweep Beam Angle
      const speedStep = sweepRate === "fast" ? 0.038 : 0.022;
      angle = (angle + speedStep) % (Math.PI * 2);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [sweepRate]);

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Scope Viewport */}
      <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-[#789575]/50 bg-[#D4DAAF] shadow-md">
        <canvas ref={canvasRef} className="h-full w-full block cursor-crosshair" />

        {/* Live Status Overlay Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#141F16] border border-[#789575]/40 backdrop-blur-md shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]"></span>
          </span>
          <span>LIVE TRACK</span>
        </div>

        {/* Orbit Speed Toggle Button */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSweepRate((r) => (r === "normal" ? "fast" : "normal"))}
            className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[9.5px] font-mono font-bold text-[#2E4030] border border-[#789575]/40 hover:bg-white hover:text-[#141F16] transition-colors cursor-pointer shadow-xs"
            title="Toggle Radar Sweep Rate"
          >
            <RefreshCw className="h-2.5 w-2.5" />
            <span>{sweepRate === "fast" ? "4.0x" : "1.0x"}</span>
          </button>
        </div>
      </div>

      {/* Target Quick Selectors */}
      <div className="mt-3.5 grid w-full grid-cols-3 gap-1.5">
        {targetsRef.current.map((t) => {
          const isSelected = selectedTarget?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTarget(isSelected ? null : t)}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-left font-mono text-[10px] transition-all cursor-pointer",
                isSelected
                  ? "border-[#789575] bg-[#789575] text-white font-bold shadow-xs"
                  : "border-[#789575]/35 bg-white/70 text-[#141F16] hover:bg-white hover:border-[#789575]"
              )}
            >
              <div className="truncate font-bold">{t.id.toUpperCase()}</div>
              <div className={cn("text-[9px] truncate", isSelected ? "text-white/85" : "text-[#2E4030]")}>
                {t.alt}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Target Readout Inspector */}
      {selectedTarget && (
        <div className="mt-2.5 w-full rounded-xl border border-[#789575]/40 bg-white/90 p-2.5 font-mono text-xs text-[#141F16] shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#789575]/25 pb-1">
            <span className="font-bold text-[#2E7D32]">{selectedTarget.name}</span>
            <span className="text-[10px] text-[#2E4030]">{selectedTarget.speed}</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] text-[#2E4030]">
            <div>Sensor: <strong className="text-[#141F16]">{selectedTarget.sensor}</strong></div>
            <div>Bands: <strong className="text-[#141F16]">{selectedTarget.band}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
