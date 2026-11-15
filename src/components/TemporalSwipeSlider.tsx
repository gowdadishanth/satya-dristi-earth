import { useState, useRef, useCallback, useEffect } from "react";
import { Sliders, Sparkles, MapPin, Calendar, Layers } from "lucide-react";
import { SatImage, REGIONS } from "./SatImage";
import { cn } from "./ui";

interface StudySite {
  id: string;
  name: string;
  location: string;
  region: keyof typeof REGIONS;
  epochBefore: string;
  epochAfter: string;
  changeStat: string;
  phenomenon: string;
  treatment: "optical" | "sar";
}

const STUDY_SITES: StudySite[] = [
  {
    id: "hyderabad",
    name: "Hyderabad Metropolitan & Hussain Sagar",
    location: "17.42° N, 78.47° E",
    region: "urbanWater",
    epochBefore: "2020 Baseline (Dry Season)",
    epochAfter: "2024 SAR Dual-Pol (Post-Monsoon)",
    changeStat: "+23.1 km² Built-Up Growth · -4.2 km² Wetland Fringe",
    phenomenon: "Double-bounce urban expansion into historic wetland buffers",
    treatment: "sar",
  },
  {
    id: "krishna",
    name: "Krishna River Basin Corridor",
    location: "16.51° N, 80.64° E",
    region: "corridor",
    epochBefore: "2021 Pre-Flood Baseline",
    epochAfter: "2024 Inundation Event",
    changeStat: "+148 km² Water Surface Inundation",
    phenomenon: "High dielectric specular reflection mapping flood extent",
    treatment: "optical",
  },
  {
    id: "delta",
    name: "Godavari Coastal Mangrove Delta",
    location: "16.75° N, 82.25° E",
    region: "delta",
    epochBefore: "2022 Forest Cover",
    epochAfter: "2024 Canopy Regeneration",
    changeStat: "+12.4% L-band Canopy Volume Scattering",
    phenomenon: "Canopy biomass tracking and tidal marsh extension",
    treatment: "sar",
  },
];

export function TemporalSwipeSlider({ className }: { className?: string }) {
  const [activeSite, setActiveSite] = useState<StudySite>(STUDY_SITES[0]);
  const [sliderPos, setSliderPos] = useState(52); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onPointerDown = () => setIsDragging(true);
  const onPointerUp = () => setIsDragging(false);

  useEffect(() => {
    const onGlobalMove = (e: PointerEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onGlobalUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("pointermove", onGlobalMove);
      window.addEventListener("pointerup", onGlobalUp);
    }
    return () => {
      window.removeEventListener("pointermove", onGlobalMove);
      window.removeEventListener("pointerup", onGlobalUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border-2 border-[#789575]/45 bg-white/90 p-5 shadow-sm", className)}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#789575]/25 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#789575] text-white shadow-xs">
            <Sliders className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-[#141F16] tracking-tight">
              Bi-Temporal Interactive Surface Change Slider
            </h4>
            <p className="text-[11px] font-mono text-[#2E4030]">
              Drag slider to inspect surface changes across multi-year radar acquisitions
            </p>
          </div>
        </div>

        {/* Site Selector Tabs */}
        <div className="flex rounded-lg border border-[#789575]/40 bg-[#E5E8CE]/60 p-0.5 text-xs font-mono">
          {STUDY_SITES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSite(s)}
              className={cn(
                "rounded px-2.5 py-1 font-bold transition-all cursor-pointer",
                activeSite.id === s.id ? "bg-[#789575] text-white shadow-xs" : "text-[#2E4030] hover:text-[#141F16]"
              )}
            >
              {s.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Viewport */}
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          onPointerDown();
          handleMove(e.clientX);
        }}
        className="relative my-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#789575]/40 bg-[#D4DAAF] select-none cursor-ew-resize shadow-inner"
      >
        {/* Layer 1: "After" Scene (Background base) */}
        <div className="absolute inset-0">
          <SatImage
            bbox={REGIONS[activeSite.region]}
            treatment={activeSite.treatment}
            epoch="after"
            className="h-full w-full object-cover"
          />
          {/* Label Top-Right */}
          <div className="absolute top-3 right-3 rounded-md bg-white/85 px-2.5 py-1 text-[11px] font-mono font-bold text-[#141F16] border border-[#789575]/40 shadow-xs backdrop-blur-sm pointer-events-none">
            {activeSite.epochAfter}
          </div>
        </div>

        {/* Layer 2: "Before" Scene (Clipped by sliderPos) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div style={{ width: containerRef.current?.clientWidth || "100%", height: "100%" }}>
            <SatImage
              bbox={REGIONS[activeSite.region]}
              treatment="optical"
              epoch="before"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Label Top-Left */}
          <div className="absolute top-3 left-3 rounded-md bg-[#141F16]/85 px-2.5 py-1 text-[11px] font-mono font-bold text-[#E5E8CE] border border-white/20 shadow-xs backdrop-blur-sm pointer-events-none">
            {activeSite.epochBefore}
          </div>
        </div>

        {/* The Animated Divider Bar */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-[#2E7D32] shadow-[0_0_12px_#2E7D32]"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Floating Handle Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#789575] text-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
            <Sliders className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Instruction pill at bottom */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 pointer-events-none rounded-full bg-white/80 px-3 py-0.5 text-[10px] font-mono font-bold text-[#141F16] border border-[#789575]/40 backdrop-blur-sm shadow-xs">
          ◀ Drag slider to reveal radar change detection ▶
        </div>
      </div>

      {/* Surface Change Analysis Bar */}
      <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#789575]" />
            <span className="font-bold text-[#141F16]">{activeSite.name}</span>
            <span className="mono text-[11px] text-[#2E4030]">({activeSite.location})</span>
          </div>
          <div className="mono font-bold text-[#2E7D32] bg-white/80 px-2.5 py-1 rounded-md border border-[#789575]/30">
            {activeSite.changeStat}
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#233325] font-medium">
          <strong>Physical Driver: </strong>{activeSite.phenomenon}.
        </p>
      </div>
    </div>
  );
}
