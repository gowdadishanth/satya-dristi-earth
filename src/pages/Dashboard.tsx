import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Waves,
  Trees,
  MountainSnow,
  Building2,
  Radio,
  Satellite,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  MapPin,
  Flame,
  CheckCircle2,
} from "lucide-react";
import type { Route } from "../App";
import {
  GlassCard,
  StoryChapter,
  StatsCard,
  NarrativeCard,
  GlowBadge,
  Button,
  Badge,
  Eyebrow,
  Confidence,
  StatDot,
  cn,
} from "../components/ui";
import {
  SatImage,
  OverlayChange,
  OverlayGrid,
  ScaleTag,
  REGIONS,
  OverlayDynamicGrounding,
  OverlayImageLayer,
} from "../components/SatImage";
import { analyses as sampleAnalyses } from "../lib/data";
import { ConfBadge, TaskIcon } from "../components/bits";
import { OrbitalRadarScope } from "../components/OrbitalRadarScope";
import { NisarRadarPulse } from "../components/NisarRadarPulse";
import { TemporalSwipeSlider } from "../components/TemporalSwipeSlider";
import {
  api,
  getAnalysisImageUrl,
  type AnalysisRecord,
  type SystemHealth,
} from "../lib/api";

type ModalityView = "optical" | "sar" | "change";

export function Dashboard({ navigate }: { navigate: (r: Route) => void }) {
  const [latest, setLatest] = useState<any>(sampleAnalyses[0]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [activeModality, setActiveModality] = useState<ModalityView>("change");
  const [activeStudyRegion, setActiveStudyRegion] = useState<"urbanWater" | "corridor" | "delta">("urbanWater");

  useEffect(() => {
    let mounted = true;

    // Load recent analyses from backend
    api.history
      .list({ limit: 1 })
      .then((records) => {
        if (mounted && records && records.length > 0) {
          const rec = records[0];
          setLatest({
            id: rec.analysis_id,
            query: rec.query,
            task: rec.task,
            input: rec.input,
            date: rec.date,
            time: rec.time,
            confidence: rec.confidence,
            agreements: rec.agreements,
            status: rec.status,
            answer: rec.answer,
            observed_evidence: rec.observed_evidence,
            model_interpretation: rec.model_interpretation,
            model_used: rec.model_used,
            primary_image_path: rec.primary_image_path,
            evidence_path: rec.evidence_path,
            boxes: rec.boxes,
            execution_trace: rec.execution_trace,
          });
        }
      })
      .catch(() => {});

    // Load system telemetry
    api.system
      .getHealth()
      .then((health) => {
        if (mounted) setSystemHealth(health);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const isReal = Boolean(
    latest.id && latest.id.startsWith("AN-") && latest.id.length > 8
  );
  const primaryImg =
    isReal && latest.primary_image_path
      ? latest.primary_image_path.startsWith("http") ||
        latest.primary_image_path.startsWith("/api")
        ? latest.primary_image_path
        : getAnalysisImageUrl(latest.id, "primary")
      : undefined;
  const evidenceImg =
    isReal && latest.evidence_path
      ? latest.evidence_path.startsWith("http") ||
        latest.evidence_path.startsWith("/api")
        ? latest.evidence_path
        : getAnalysisImageUrl(latest.id, "evidence")
      : undefined;

  return (
    <div className="space-y-14 pb-20 text-[#18261B]">
      {/* =========================================================
          CHAPTER 1: THE PULSE OF EARTH'S SURFACE (HERO BENTO)
          ========================================================= */}
      <section>
        <StoryChapter
          chapter="01"
          badge="Earth Observation Intelligence · NISAR Science"
          title="The Cosmic Waltz: Earth's Surface in Motion"
          subtitle="From wetland retraction to forest canopy loss, farming moisture shifts, glacier velocity, and centimeter-scale earthquake subsidence, Earth is in a constant waltz of change. Active Synthetic Aperture Radar (SAR) cuts through clouds day and night to observe these rhythms."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Hero Story Bento Card (Spans 2 columns) */}
          <GlassCard
            glow="sage"
            className="lg:col-span-2 p-7 sm:p-8 flex flex-col justify-between h-full bg-white/80"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#789575]/25 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#789575] text-[#E5E8CE] shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#18261B] tracking-tight">
                      NASA-ISRO Radar Earth Observatory
                    </h3>
                    <p className="text-xs text-[#4B634E] font-mono">
                      Active Microwave Remote Sensing · L-Band (24cm) & S-Band (9cm)
                    </p>
                  </div>
                </div>
                <GlowBadge tone="sage">Orbital Stream Active</GlowBadge>
              </div>

              <div className="mt-5 space-y-3.5">
                <p className="text-[15px] leading-relaxed text-[#18261B]">
                  While optical satellites rely on sunlight and clear skies,
                  <strong className="text-[#18261B] font-bold"> NISAR emits its own microwave radiation</strong>.
                  Radar pulses react with the ground and bounce back, directly characterizing
                  <em> surface roughness</em>, <em>structural geometry</em>, and <em>dielectric properties</em>.
                </p>

                <p className="text-[13.5px] leading-relaxed text-[#2B3B2C]">
                  Because liquid water possesses an exceptionally high dielectric constant (~80 vs ~4 for dry soils),
                  SAR data highlights flood inundation, soil moisture swelling, and wetland boundaries with extraordinary fidelity.
                  Repeat-pass InSAR measures sub-centimeter land movement for earthquakes, coastal subsidence, and glaciers.
                </p>
              </div>

              {/* 4 Mission Spec Metrics in 1 neat row */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#789575]/20 pt-4">
                <div className="rounded-xl border border-[#789575]/30 bg-[#E5E8CE]/60 p-3 text-center">
                  <span className="mono text-[10px] font-bold uppercase text-[#4B634E] block">
                    Swath Width
                  </span>
                  <span className="text-xl font-bold font-mono text-[#18261B] mt-1 block">
                    242 km
                  </span>
                  <span className="text-[10px] text-[#4B634E] font-medium">Global Scan</span>
                </div>
                <div className="rounded-xl border border-[#789575]/30 bg-[#E5E8CE]/60 p-3 text-center">
                  <span className="mono text-[10px] font-bold uppercase text-[#4B634E] block">
                    Repeat Cycle
                  </span>
                  <span className="text-xl font-bold font-mono text-[#18261B] mt-1 block">
                    12 Days
                  </span>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">Temporal Orbit</span>
                </div>
                <div className="rounded-xl border border-[#789575]/30 bg-[#E5E8CE]/60 p-3 text-center">
                  <span className="mono text-[10px] font-bold uppercase text-[#4B634E] block">
                    Resolution
                  </span>
                  <span className="text-xl font-bold font-mono text-[#18261B] mt-1 block">
                    3 - 10 m
                  </span>
                  <span className="text-[10px] text-[#4B634E] font-medium">High Precision</span>
                </div>
                <div className="rounded-xl border border-[#789575]/30 bg-[#E5E8CE]/60 p-3 text-center">
                  <span className="mono text-[10px] font-bold uppercase text-[#4B634E] block">
                    Deformation
                  </span>
                  <span className="text-xl font-bold font-mono text-[#18261B] mt-1 block">
                    &lt; 1 cm
                  </span>
                  <span className="text-[10px] text-[#C28E3A] font-semibold">InSAR Phase</span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#789575]/25 pt-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-ping" />
                <span className="mono text-xs text-[#2B3B2C]">
                  Ready to process multimodal questions across global AOI benchmarks.
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("analyze")}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Launch Analysis Workspace
              </Button>
            </div>
          </GlassCard>

          {/* Right Console Card: Equal height with left card */}
          <GlassCard glow="sage" className="p-7 sm:p-8 flex flex-col justify-between h-full bg-white/80">
            <div>
              <div className="flex items-center justify-between border-b border-[#789575]/25 pb-3.5">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[#2E7D32] animate-pulse" />
                  <span className="text-sm font-bold text-[#141F16] uppercase tracking-wider">
                    Orbital Telemetry
                  </span>
                </div>
                <Badge tone="ok">All-Weather</Badge>
              </div>

              {/* Dynamic Interactive Radar Scope */}
              <div className="my-3">
                <OrbitalRadarScope />
              </div>

              <dl className="mono space-y-2 text-xs text-[#2B3B2C] border-t border-[#789575]/20 pt-3">
                <div className="flex justify-between border-b border-[#789575]/15 pb-1">
                  <span className="text-[#2E4030]">Radar Frequency</span>
                  <strong className="text-[#141F16]">1.25 GHz (L-band)</strong>
                </div>
                <div className="flex justify-between border-b border-[#789575]/15 pb-1">
                  <span className="text-[#2E4030]">Polarizations</span>
                  <strong className="text-[#141F16]">Quad-Pol (HH/HV/VH/VV)</strong>
                </div>
                <div className="flex justify-between border-b border-[#789575]/15 pb-1">
                  <span className="text-[#2E4030]">Target Benchmark</span>
                  <strong className="text-[#2E7D32]">Hyderabad (17.42° N)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2E4030]">Hardware Engine</span>
                  <strong className="text-[#141F16]">
                    {systemHealth?.preferred_device?.toUpperCase() || "Accelerated Engine"}
                  </strong>
                </div>
              </dl>
            </div>

            <div className="mt-4 border-t border-[#789575]/25 pt-2.5 text-center">
              <span className="mono text-[10.5px] text-[#2E4030] font-semibold">
                Live Providers: Copernicus STAC + AWS Earth Search
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Interactive Microwave Physics & Backscatter Wave Simulator */}
        <div className="mt-8">
          <NisarRadarPulse />
        </div>
      </section>

      {/* =========================================================
          CHAPTER 2: 4 RHYTHMS OF SURFACE CHANGE (BENTO METRICS)
          ========================================================= */}
      <section>
        <StoryChapter
          chapter="02"
          badge="Surface Change Detection Matrix"
          title="Tracking Earth's Four Primary Rhythms"
          subtitle="Radar backscatter characterizes physical roughness and dielectric properties to monitor wetlands, forests, glaciers, and urban expansion around the world."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {/* 1. Wetlands & Inundation */}
          <StatsCard
            title="Wetland & Water"
            value="847 km²"
            change={-12.3}
            subtitle="Krishna Basin & Hussain Sagar"
            badge="Dielectric High"
            accent="sage"
            icon={<Waves className="h-6 w-6" />}
          />

          {/* 2. Forest Structure */}
          <StatsCard
            title="Forest Canopy"
            value="2,340 km²"
            change={-8.3}
            subtitle="Eastern Ghats Reserve"
            badge="Volume Scattering"
            accent="emerald"
            icon={<Trees className="h-6 w-6" />}
          />

          {/* 3. Glaciers & Ice Dynamics */}
          <StatsCard
            title="Glacier Velocity"
            value="15.7 m/yr"
            change={-15.7}
            subtitle="Himalayan Siachen Benchmark"
            badge="InSAR Phase Drift"
            accent="bone"
            icon={<MountainSnow className="h-6 w-6" />}
          />

          {/* 4. Urban Expansion & Subsidence */}
          <StatsCard
            title="Urban Footprint"
            value="1,230 km²"
            change={23.1}
            subtitle="Hyderabad Metropolitan AOI"
            badge="Double-Bounce"
            accent="amber"
            icon={<Building2 className="h-6 w-6" />}
          />
        </div>
      </section>

      {/* =========================================================
          CHAPTER 3: THE VISUAL EVIDENCE (RADAR VS OPTICAL VIEWER)
          ========================================================= */}
      <section>
        <StoryChapter
          chapter="03"
          badge="Multimodal Remote Sensing Evidence"
          title="Looking Through the Clouds: Optical vs Radar Fusion"
          subtitle="Compare true-color optical observations with synthetic aperture radar backscatter. Examine how specular reflection distinguishes water bodies from double-bounce urban structures."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Large Centerpiece Satellite Viewer (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
            <GlassCard className="p-0 overflow-hidden flex-1 bg-white/85">
              {/* Viewer Control Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#789575]/25 px-5 py-3.5 bg-white/70">
                <div className="flex items-center gap-2.5">
                  <TaskIcon
                    task={latest.task}
                    className="h-4 w-4 text-[#789575]"
                  />
                  <span className="text-sm font-bold text-[#18261B]">
                    {latest.task}
                  </span>
                  <Badge tone="accent">
                    {isReal ? "Authentic Observation" : "High-Clarity Demonstration Scene"}
                  </Badge>
                </div>

                {/* Modality Tabs */}
                <div className="flex items-center gap-1 rounded-xl border border-[#789575]/40 bg-[#E5E8CE]/80 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveModality("optical")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer",
                      activeModality === "optical"
                        ? "bg-[#789575] text-[#E5E8CE] font-bold shadow-xs"
                        : "text-[#2B3B2C] hover:text-[#18261B]"
                    )}
                  >
                    Optical (S2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModality("sar")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer",
                      activeModality === "sar"
                        ? "bg-[#223326] text-[#E5E8CE] font-bold shadow-xs"
                        : "text-[#2B3B2C] hover:text-[#18261B]"
                    )}
                  >
                    SAR (NISAR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModality("change")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer",
                      activeModality === "change"
                        ? "bg-[#789575] text-[#E5E8CE] font-bold shadow-xs"
                        : "text-[#2B3B2C] hover:text-[#18261B]"
                    )}
                  >
                    Change Mask
                  </button>
                </div>
              </div>

              {/* Satellite Canvas */}
              <SatImage
                src={primaryImg}
                treatment={activeModality === "sar" ? "sar" : "optical"}
                bbox={REGIONS[activeStudyRegion]}
                className="aspect-[16/10] w-full"
              >
                {activeModality === "change" && (
                  <>
                    {evidenceImg ? (
                      <OverlayImageLayer src={evidenceImg} opacity={0.85} />
                    ) : (
                      <OverlayChange />
                    )}
                    {latest.boxes && latest.boxes.length > 0 && (
                      <OverlayDynamicGrounding boxes={latest.boxes} />
                    )}
                  </>
                )}
                <OverlayGrid />
                <ScaleTag>
                  {isReal
                    ? "Sentinel-2 / World Imagery · Sub-Meter Multispectral"
                    : `${activeStudyRegion === "urbanWater" ? "Hussain Sagar" : activeStudyRegion === "corridor" ? "Krishna Corridor" : "Coastal Delta"} · 10 m/px · EPSG:4326`}
                </ScaleTag>
                <span className="mono absolute bottom-3 right-3 rounded-lg bg-[#E5E8CE]/95 border border-[#789575]/50 px-2.5 py-1 text-[10px] font-bold text-[#18261B] backdrop-blur-md shadow-2xs">
                  {activeStudyRegion === "urbanWater"
                    ? "Hyderabad AOI (17.42° N, 78.47° E)"
                    : activeStudyRegion === "corridor"
                    ? "Krishna River (16.51° N, 80.64° E)"
                    : "Coastal Delta (16.20° N, 81.15° E)"}
                </span>
              </SatImage>

              {/* Restrained Radar & Optical Legend */}
              <div className="flex flex-wrap items-center gap-4 border-t border-[#789575]/25 px-5 py-3.5 bg-white/70 text-xs">
                <LegendDot
                  color="#2E7D32"
                  label="Double-Bounce Built-Up (Infrastructure)"
                />
                <LegendDot
                  color="#789575"
                  label="Specular Water Reflection (High Dielectric)"
                />
                <LegendDot
                  color="#C28E3A"
                  label="High-Confidence Surface Change"
                />
                <LegendDot
                  color="#4B634E"
                  label="Stable Bedrock Baseline"
                />
                <div className="ml-auto flex items-center gap-2">
                  <span className="mono text-xs text-[#4B634E]">
                    Study Area:
                  </span>
                  <select
                    value={activeStudyRegion}
                    onChange={(e) => setActiveStudyRegion(e.target.value as any)}
                    className="mono rounded-lg border border-[#789575]/40 bg-white/90 px-2.5 py-1 text-xs text-[#18261B] focus-ring cursor-pointer"
                  >
                    <option value="urbanWater" className="bg-[#E5E8CE]">Hussain Sagar (Urban + Lake)</option>
                    <option value="corridor" className="bg-[#E5E8CE]">Krishna Corridor (River + Farm)</option>
                    <option value="delta" className="bg-[#E5E8CE]">Coastal Delta (Wetland)</option>
                  </select>
                </div>
              </div>
            </GlassCard>

            {/* Asynchronous Execution Pipeline Timeline (From Documentation Architecture) */}
            <GlassCard className="p-5 bg-white/80">
              <div className="flex items-center justify-between border-b border-[#789575]/25 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#789575]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18261B]">
                    7-Stage Asynchronous Analysis Execution Pipeline
                  </span>
                </div>
                <Badge tone="ok">Pipeline Nominal</Badge>
              </div>

              <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { n: "1", title: "Validating", sub: "AOI & CRS" },
                  { n: "2", title: "Routing", sub: "Intent Class" },
                  { n: "3", title: "Retrieval", sub: "Clip AOI Raster" },
                  { n: "4", title: "Inference", sub: "Spectral Analysis" },
                  { n: "5", title: "Evidence", sub: "Render Overlays" },
                  { n: "6", title: "Confidence", sub: "Multi-Signal" },
                  { n: "7", title: "Reports", sub: "PDF Artifact" },
                ].map((st, i) => (
                  <div
                    key={st.n}
                    className="relative rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-2.5 text-center shadow-2xs"
                  >
                    <span className="mono text-[10.5px] font-bold text-[#18261B] block">
                      {st.n}. {st.title}
                    </span>
                    <span className="text-[10px] text-[#4B634E] truncate block mt-0.5">
                      {st.sub}
                    </span>
                    {i < 6 && (
                      <span className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 text-[#789575] text-xs font-extrabold">
                        ›
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Analysis Side Panel (1 col): Equal total height */}
          <aside className="flex flex-col justify-between space-y-4">
            {/* Current Query & Answer Card */}
            <GlassCard className="p-6 bg-white/80">
              <Eyebrow>Current Scientific Query</Eyebrow>
              <p className="mt-2 text-sm font-bold leading-snug text-[#18261B]">
                "{latest.query}"
              </p>
              <div className="mt-3 rounded-xl border border-[#789575]/30 bg-[#E5E8CE]/60 p-3.5 text-xs leading-relaxed text-[#18261B]">
                {latest.answer}
              </div>

              <div className="mt-4 border-t border-[#789575]/20 pt-3.5">
                <Confidence
                  level={latest.confidence}
                  agreements={
                    latest.agreements || [
                      { label: "Optical Multispectral Agreement", state: "agree" },
                      { label: "SAR Backscatter Calibration", state: "agree" },
                      { label: "Temporal Difference Coherence", state: "agree" },
                    ]
                  }
                />
              </div>
            </GlassCard>

            {/* Remote Sensing Physical Drivers */}
            <GlassCard glow="sage" className="p-6 flex-1 flex flex-col justify-between bg-white/80">
              <div>
                <Eyebrow>Physical SAR Drivers Hypothesized</Eyebrow>

                <div className="mt-3 space-y-2.5">
                  <div className="rounded-xl border border-[#789575]/25 bg-[#E5E8CE]/60 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#18261B]">
                      <Waves className="h-3.5 w-3.5 text-[#789575]" />
                      <span>Dielectric Constant Effect</span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-[#2B3B2C]">
                      Water reflects microwave energy like a mirror away from the receiver, generating distinctive specular low-backscatter signatures.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#789575]/25 bg-[#E5E8CE]/60 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#18261B]">
                      <Building2 className="h-3.5 w-3.5 text-[#2E7D32]" />
                      <span>Double-Bounce Geometry</span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-[#2B3B2C]">
                      Right-angle street-to-building interfaces return microwave pulses directly to the antenna, isolating urban expansion.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#789575]/25 bg-[#E5E8CE]/60 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#18261B]">
                      <Trees className="h-3.5 w-3.5 text-[#C28E3A]" />
                      <span>Volume Scattering in Canopies</span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-[#2B3B2C]">
                      Multiple reflections within leaf structures depolarize HH signals to HV, measuring biomass health and wildfire scars.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#789575]/20 pt-3 text-center">
                <span className="mono text-[10.5px] text-[#2E4030] font-semibold">
                  NISAR Level-2 GCOV (Geocoded Polarimetric Covariance)
                </span>
              </div>
            </GlassCard>
          </aside>
        </div>

        {/* Interactive Bi-Temporal Wipe Comparison Slider */}
        <div className="mt-8">
          <TemporalSwipeSlider />
        </div>
      </section>

      {/* =========================================================
          CHAPTER 4: WHAT IT MEANS & NEXT ACTIONS (STORY CALL TO ACTION)
          ========================================================= */}
      <section>
        <StoryChapter
          chapter="04"
          badge="Actionable Insights & Societal Benefit"
          title="Translating Radar Waves into Planetary Protection"
          subtitle="Empowering scientists, urban planners, disaster response teams, and local communities with transparent, evidence-grounded satellite intelligence."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <NarrativeCard
            title="Scientific Hypothesis: Urban Encroachment & Wetland Retreat"
            narrative="Across the Hyderabad and Krishna basin study zones, rapid urbanization has encroached upon peripheral wetlands. The L-band SAR backscatter reveals an unmistakable increase in double-bounce corner reflectors (+23.1%), while optical indices confirm that surface water bodies have contracted by 12.3% due to sediment deposition and seasonal withdrawal."
            author="Satya Dristi Remote Sensing Ensemble"
            badge="Verified Hypotheses"
            className="md:col-span-2"
          >
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate("reports")}
                icon={<ShieldCheck className="h-4 w-4" />}
              >
                Inspect Official Dossiers
              </Button>
            </div>
          </NarrativeCard>

          {/* Quick Action Bento Card: Equal height */}
          <GlassCard glow="sage" className="p-7 sm:p-8 flex flex-col justify-between h-full bg-[#DFE2C7] border-[#789575]/40">
            <div>
              <div className="flex items-center gap-2 border-b border-[#789575]/25 pb-3.5">
                <Compass className="h-4 w-4 text-[#789575]" />
                <h4 className="text-sm font-bold text-[#18261B] uppercase tracking-wider">
                  Explore Any Location on Earth
                </h4>
              </div>

              <p className="mt-3.5 text-xs leading-relaxed text-[#2B3B2C]">
                Drop bounding boxes anywhere on Earth. Investigate deforestation in the Amazon,
                glacier retreat in Siachen, or post-wildfire damage in California.
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="rounded-xl border border-[#789575]/30 bg-white/70 p-3 flex items-center justify-between text-xs">
                  <span className="text-[#4B634E]">Custom AOI Drag-to-Draw</span>
                  <span className="mono text-[#18261B] font-bold">STAC Enabled</span>
                </div>
                <div className="rounded-xl border border-[#789575]/30 bg-white/70 p-3 flex items-center justify-between text-xs">
                  <span className="text-[#4B634E]">Bi-Temporal InSAR Baseline</span>
                  <span className="mono text-[#2E7D32] font-bold">2016 - 2026</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="mt-6 w-full"
              onClick={() => navigate("analyze")}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Start New Analysis
            </Button>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
        style={{ background: color }}
      />
      <span className="text-[#2B3B2C] text-xs">{label}</span>
    </div>
  );
}
