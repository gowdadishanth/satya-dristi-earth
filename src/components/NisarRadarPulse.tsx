import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Waves, Trees, Building2, MountainSnow, Radio, Play, Pause, RotateCcw, Info } from "lucide-react";
import { cn } from "./ui";

export type ScatteringMode = "specular" | "volume" | "doublebounce" | "insar";
export type RadarBand = "L-band" | "S-band";

interface ModeDetail {
  id: ScatteringMode;
  name: string;
  subtitle: string;
  physics: string;
  phenomenon: string;
  dielectric: string;
  returnStrength: "Very Low (Dark)" | "Moderate (Diffuse)" | "Extreme (Bright)" | "Phase Fringe Shift";
}

const MODES: Record<ScatteringMode, ModeDetail> = {
  specular: {
    id: "specular",
    name: "Specular Reflection",
    subtitle: "Wetlands, Reservoirs & Floods",
    physics: "Smooth liquid water acts as a mirror. Microwave pulses bounce forward away from the satellite antenna.",
    phenomenon: "Flood Extent Mapping & Soil Moisture",
    dielectric: "High Dielectric Constant (ε ~ 80)",
    returnStrength: "Very Low (Dark)",
  },
  volume: {
    id: "volume",
    name: "Volume Scattering",
    subtitle: "Forest Canopies & Vegetation",
    physics: "Microwaves bounce multiple times inside branches and foliage, rotating polarization (HH → HV).",
    phenomenon: "Canopy Biomass & Wildfire Recovery",
    dielectric: "Vegetation Moisture & Structure",
    returnStrength: "Moderate (Diffuse)",
  },
  doublebounce: {
    id: "doublebounce",
    name: "Double-Bounce Geometry",
    subtitle: "Urban Buildings & Infrastructure",
    physics: "Right-angle intersections between ground and vertical walls form retro-reflectors, bouncing pulses directly back.",
    phenomenon: "Urban Sprawl & Infrastructure Integrity",
    dielectric: "Concrete & Metallic Reflectors",
    returnStrength: "Extreme (Bright)",
  },
  insar: {
    id: "insar",
    name: "InSAR Phase Interferometry",
    subtitle: "Earthquakes, Subsidence & Glaciers",
    physics: "Comparing radar wave phase differences across 12-day orbital intervals detects sub-centimeter surface shifts.",
    phenomenon: "Centimeter Ground Deformation",
    dielectric: "Interferometric Wave Coherence",
    returnStrength: "Phase Fringe Shift",
  },
};

export function NisarRadarPulse({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeMode, setActiveMode] = useState<ScatteringMode>("specular");
  const [band, setBand] = useState<RadarBand>("L-band");
  const [isPlaying, setIsPlaying] = useState(true);
  const [pulseCount, setPulseCount] = useState(0);

  const modeRef = useRef(activeMode);
  modeRef.current = activeMode;
  const bandRef = useRef(band);
  bandRef.current = band;
  const playRef = useRef(isPlaying);
  playRef.current = isPlaying;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle waves emitted from radar
    interface PulseWave {
      progress: number; // 0 to 1 down, 1 to 2 returning
      x: number;
      y: number;
      reflected: boolean;
      strength: number;
    }

    const waves: PulseWave[] = [];
    let lastEmit = 0;

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#DDE2C6");
      skyGrad.addColorStop(0.65, "#CAD1AE");
      skyGrad.addColorStop(1, "#B4BD93");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Satellite position at top left
      const satX = 80;
      const satY = 45;
      const groundY = h - 65;

      // Draw Horizon Ground Terrain based on active mode
      ctx.save();
      if (modeRef.current === "specular") {
        // Flat specular water surface
        ctx.fillStyle = "#4B6B56";
        ctx.fillRect(0, groundY, w, h - groundY);

        // Water specular highlight shimmer
        ctx.strokeStyle = "rgba(229, 232, 206, 0.45)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          const waveX = (t * 40 + i * 90) % w;
          ctx.beginPath();
          ctx.moveTo(waveX, groundY + 12 + i * 8);
          ctx.lineTo(waveX + 50, groundY + 12 + i * 8);
          ctx.stroke();
        }

        // Label Water
        ctx.fillStyle = "#E5E8CE";
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillText("WATER RESERVOIR (ε ≈ 80)", w / 2 - 80, groundY + 36);
      } else if (modeRef.current === "volume") {
        // Forest terrain with canopy trees
        ctx.fillStyle = "#364F37";
        ctx.fillRect(0, groundY + 10, w, h - groundY - 10);

        // Draw multiple tree canopy crowns
        for (let tx = 30; tx < w - 20; tx += 45) {
          ctx.fillStyle = "#263B27";
          ctx.fillRect(tx + 12, groundY, 6, 25); // trunk

          ctx.beginPath();
          ctx.arc(tx + 15, groundY - 8, 22, 0, Math.PI * 2);
          ctx.fillStyle = "#426143";
          ctx.fill();
          ctx.strokeStyle = "rgba(120, 149, 117, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.fillStyle = "#E5E8CE";
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillText("DENSE FOREST CANOPY (VOLUME SCATTERING)", w / 2 - 120, groundY + 45);
      } else if (modeRef.current === "doublebounce") {
        // Urban ground + buildings with right angles
        ctx.fillStyle = "#455446";
        ctx.fillRect(0, groundY, w, h - groundY);

        // Draw geometric buildings
        const bldgs = [
          { x: w * 0.42, w: 55, h: 65 },
          { x: w * 0.62, w: 75, h: 85 },
        ];
        bldgs.forEach((b) => {
          ctx.fillStyle = "#2D382D";
          ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
          ctx.strokeStyle = "rgba(120, 149, 117, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(b.x, groundY - b.h, b.w, b.h);

          // Right-angle 90° corner reflector marker
          ctx.beginPath();
          ctx.moveTo(b.x - 12, groundY);
          ctx.lineTo(b.x, groundY);
          ctx.lineTo(b.x, groundY - 12);
          ctx.strokeStyle = "#C28E3A";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        });

        ctx.fillStyle = "#E5E8CE";
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillText("URBAN DOUBLE-BOUNCE CORNER REFLECTOR (90°)", w / 2 - 130, groundY + 45);
      } else if (modeRef.current === "insar") {
        // InSAR colorful deformation fringes across hills
        ctx.fillStyle = "#384739";
        ctx.fillRect(0, groundY, w, h - groundY);

        // Draw InSAR colored phase fringes (sinusoidal topographic bands)
        for (let fx = 0; fx < w; fx += 4) {
          const phase = Math.sin(fx * 0.04 + t * 2) * 0.5 + 0.5;
          const r = Math.round(70 + phase * 180);
          const g = Math.round(140 + (1 - phase) * 80);
          const b = Math.round(80 + phase * 60);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(fx, groundY + 12, 4, 18);
        }

        ctx.fillStyle = "#E5E8CE";
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillText("InSAR REPEAT-PASS PHASE FRINGES (<1 cm SHIFT)", w / 2 - 130, groundY + 45);
      }
      ctx.restore();

      // Emit radar pulses from satellite
      if (playRef.current && t - lastEmit > 0.85) {
        lastEmit = t;
        waves.push({
          progress: 0,
          x: satX,
          y: satY,
          reflected: false,
          strength: 1.0,
        });
        setPulseCount((c) => c + 1);
      }

      // Target impact coordinates on the ground
      const targetImpactX = w * 0.55;
      const targetImpactY = groundY;

      // Draw Satellite at orbit top-left
      ctx.save();
      ctx.translate(satX, satY);

      // Radar Reflector Dish
      ctx.beginPath();
      ctx.arc(0, 0, 16, Math.PI * 0.1, Math.PI * 0.8);
      ctx.strokeStyle = "#141F16";
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Satellite Body Box
      ctx.fillStyle = "#2E4030";
      ctx.fillRect(-12, -22, 24, 16);
      ctx.strokeStyle = "#789575";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-12, -22, 24, 16);

      // Solar Panels
      ctx.fillStyle = "#1E2C20";
      ctx.fillRect(-42, -18, 28, 9);
      ctx.fillRect(14, -18, 28, 9);
      ctx.strokeStyle = "#4B634E";
      ctx.strokeRect(-42, -18, 28, 9);
      ctx.strokeRect(14, -18, 28, 9);

      // Antenna Feed Horn emitting microwaves
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, 14);
      ctx.strokeStyle = "#C28E3A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#141F16";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText("NISAR", -16, -26);

      ctx.restore();

      // Draw Main Radar Swath Beam Cone
      ctx.save();
      const beamGrad = ctx.createLinearGradient(satX, satY, targetImpactX, targetImpactY);
      beamGrad.addColorStop(0, "rgba(120, 149, 117, 0.45)");
      beamGrad.addColorStop(1, "rgba(120, 149, 117, 0.08)");
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(satX + 8, satY + 12);
      ctx.lineTo(targetImpactX - 60, targetImpactY);
      ctx.lineTo(targetImpactX + 60, targetImpactY);
      ctx.closePath();
      ctx.fill();

      // Look angle reference axis
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(46, 64, 48, 0.35)";
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(targetImpactX, targetImpactY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Render Active Microwave Pulse Waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const p = waves[i];

        if (p.progress <= 1) {
          // Pulse traveling DOWN toward ground
          const curX = satX + (targetImpactX - satX) * p.progress;
          const curY = satY + (targetImpactY - satY) * p.progress;

          // Draw oscillating wave front
          const waveFreq = bandRef.current === "L-band" ? 14 : 26;
          const waveColor = bandRef.current === "L-band" ? "rgba(46, 125, 50, 0.85)" : "rgba(194, 142, 58, 0.85)";

          ctx.beginPath();
          ctx.arc(curX, curY, waveFreq * (0.4 + p.progress * 0.8), -Math.PI * 0.4, Math.PI * 0.1);
          ctx.strokeStyle = waveColor;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else {
          // Pulse REFLECTED from ground
          const returnProg = p.progress - 1; // 0 to 1

          if (modeRef.current === "specular") {
            // Forward bounce away from sat
            const fwdX = targetImpactX + returnProg * 180;
            const fwdY = targetImpactY - returnProg * 110;
            ctx.beginPath();
            ctx.arc(fwdX, fwdY, 14, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(46, 125, 50, 0.35)";
            ctx.fill();

            // Label "Bounces Away!"
            if (returnProg < 0.6) {
              ctx.fillStyle = "#141F16";
              ctx.font = "bold 10px 'JetBrains Mono', monospace";
              ctx.fillText("Bounces Away (Specular Loss)", fwdX + 10, fwdY - 6);
            }
          } else if (modeRef.current === "volume") {
            // Multiple diffuse rays scattered everywhere
            const angles = [-0.2, 0.4, 0.9, -0.7];
            angles.forEach((ang) => {
              const dx = targetImpactX + Math.cos(ang) * returnProg * 90;
              const dy = targetImpactY - Math.sin(Math.abs(ang)) * returnProg * 90;
              ctx.beginPath();
              ctx.arc(dx, dy, 3, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(75, 99, 78, 0.65)";
              ctx.fill();
            });
          } else if (modeRef.current === "doublebounce") {
            // Strong laser-like retro-reflection direct back to satellite!
            const retroX = targetImpactX - (targetImpactX - satX) * returnProg;
            const retroY = targetImpactY - (targetImpactY - satY) * returnProg;
            ctx.beginPath();
            ctx.arc(retroX, retroY, 8 + Math.sin(t * 10) * 2, 0, Math.PI * 2);
            ctx.fillStyle = "#C28E3A";
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Direct laser beam
            ctx.strokeStyle = "rgba(194, 142, 58, 0.7)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(targetImpactX, targetImpactY);
            ctx.lineTo(retroX, retroY);
            ctx.stroke();
          } else if (modeRef.current === "insar") {
            // Fringe phase wave return
            const returnX = targetImpactX - (targetImpactX - satX) * returnProg;
            const returnY = targetImpactY - (targetImpactY - satY) * returnProg;
            ctx.beginPath();
            ctx.arc(returnX, returnY, 12, 0, Math.PI * 2);
            ctx.strokeStyle = `hsl(${(t * 120 + returnProg * 180) % 360}, 65%, 45%)`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
        }

        if (playRef.current) {
          p.progress += 0.016;
        }

        // Remove wave when completed cycle
        if (p.progress > 2) {
          waves.splice(i, 1);
        }
      }

      ctx.restore();

      if (playRef.current) {
        t += 0.016;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const currentModeInfo = MODES[activeMode];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border-2 border-[#789575]/45 bg-white/90 p-5 shadow-sm", className)}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#789575]/25 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#789575] text-white shadow-xs">
            <Radio className="h-4 w-4 animate-pulse" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-[#141F16] tracking-tight">
              Interactive NISAR Radar Wave Simulator
            </h4>
            <p className="text-[11px] font-mono text-[#2E4030]">
              Active Microwave Backscatter & Surface Scattering Mechanics
            </p>
          </div>
        </div>

        {/* Band and Playback Controls */}
        <div className="flex items-center gap-2">
          {/* L-Band vs S-Band Toggle */}
          <div className="flex rounded-lg border border-[#789575]/40 bg-[#E5E8CE]/60 p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setBand("L-band")}
              className={cn(
                "rounded px-2.5 py-1 font-bold transition-all cursor-pointer",
                band === "L-band" ? "bg-[#789575] text-white shadow-xs" : "text-[#2E4030] hover:text-[#141F16]"
              )}
            >
              L-band (24cm)
            </button>
            <button
              type="button"
              onClick={() => setBand("S-band")}
              className={cn(
                "rounded px-2.5 py-1 font-bold transition-all cursor-pointer",
                band === "S-band" ? "bg-[#C28E3A] text-white shadow-xs" : "text-[#2E4030] hover:text-[#141F16]"
              )}
            >
              S-band (9cm)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#789575]/40 bg-[#E5E8CE]/80 text-[#141F16] hover:bg-white transition-colors cursor-pointer"
            title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Scattering Mode Selector Pills */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { id: "specular", label: "Specular (Water)", icon: Waves, color: "#2E7D32" },
          { id: "volume", label: "Volume (Forest)", icon: Trees, color: "#364F37" },
          { id: "doublebounce", label: "Double-Bounce (Urban)", icon: Building2, color: "#C28E3A" },
          { id: "insar", label: "InSAR (Deformation)", icon: MountainSnow, color: "#789575" },
        ].map((m) => {
          const active = activeMode === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMode(m.id as ScatteringMode)}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all cursor-pointer",
                active
                  ? "border-[#789575] bg-[#789575] text-white shadow-sm font-bold"
                  : "border-[#789575]/35 bg-white/70 text-[#141F16] hover:bg-white hover:border-[#789575]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="truncate text-xs font-semibold">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* Interactive Waveform Canvas Viewport */}
      <div className="relative my-4 aspect-[16/8] w-full overflow-hidden rounded-xl border border-[#789575]/40 bg-[#D4DAAF] shadow-inner">
        <canvas ref={canvasRef} className="h-full w-full block" />

        {/* Live Legend Watermark */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-md bg-white/80 px-2 py-1 text-[10px] font-mono font-bold text-[#141F16] border border-[#789575]/40 backdrop-blur-sm">
          <span>MODE: {currentModeInfo.name.toUpperCase()}</span>
          <span>·</span>
          <span>RETURN: {currentModeInfo.returnStrength}</span>
        </div>
      </div>

      {/* Physical Explanation Box */}
      <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3.5">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[#789575] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-[#141F16]">
              {currentModeInfo.name} — {currentModeInfo.subtitle}
            </h5>
            <p className="text-xs leading-relaxed text-[#233325] font-medium">
              {currentModeInfo.physics}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="rounded bg-white/80 px-2 py-0.5 text-[#141F16] border border-[#789575]/30">
                Earth Rhythm: <strong>{currentModeInfo.phenomenon}</strong>
              </span>
              <span className="rounded bg-white/80 px-2 py-0.5 text-[#2E7D32] border border-[#789575]/30 font-semibold">
                Dielectric: <strong>{currentModeInfo.dielectric}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
