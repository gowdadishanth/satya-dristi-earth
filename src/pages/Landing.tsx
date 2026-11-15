import { useState } from "react";
import {
  Satellite,
  Waves,
  Trees,
  MountainSnow,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Radio,
  CheckCircle2,
} from "lucide-react";
import type { Route } from "../App";
import { Brand } from "../components/Shell";
import {
  GlassCard,
  GlowBadge,
  Button,
  Eyebrow,
  Badge,
  Confidence,
  cn,
} from "../components/ui";
import {
  SatImage,
  OverlayGrounding,
  ScaleTag,
  REGIONS,
} from "../components/SatImage";
import { capabilities, pipelineSteps, domains } from "../lib/data";
import {
  IconOptical,
  IconSar,
  IconChange,
  IconGrounding,
  IconArrow,
  IconEvidence,
  IconTrace,
  IconDownload,
  IconStatus,
  IconLayers,
} from "../components/icons";
import { AuthModal } from "../components/AuthModal";
import { CosmicWaltzMesh } from "../components/CosmicWaltzMesh";

const capIcon: Record<string, any> = {
  optical: IconOptical,
  sar: IconSar,
  change: IconChange,
  grounding: IconGrounding,
};

export function Landing({ navigate }: { navigate: (r: Route) => void }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="app-bg min-h-screen text-[#141F16]">
      {/* Top Glass Navigation */}
      <header className="sticky top-0 z-30 glass-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-10">
            <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            <nav className="hidden items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#2E4030] font-semibold md:flex">
              <a href="#challenge" className="hover:text-[#789575] transition-colors">
                The Challenge
              </a>
              <a href="#capabilities" className="hover:text-[#789575] transition-colors">
                Radar Modalities
              </a>
              <a href="#pipeline" className="hover:text-[#789575] transition-colors">
                7-Stage Pipeline
              </a>
              <a href="#evidence" className="hover:text-[#789575] transition-colors">
                Evidence
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleSignIn}>
              Sign in
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("dashboard")}
              icon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Story Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section: Story of Earth's Dance */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-16 pt-14 lg:pt-20 overflow-hidden">
        {/* Generative Topographic Harmonic Wave Mesh (The Cosmic Waltz in Motion) */}
        <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
          <CosmicWaltzMesh />
        </div>

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="fade-up">
            <div className="flex flex-wrap items-center gap-2.5">
              <GlowBadge tone="sage">Earth Observation System</GlowBadge>
              <span className="mono text-xs text-[#2E4030] font-bold uppercase tracking-widest">
                NISAR Mission Science
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#141F16] sm:text-5xl lg:text-6xl">
              Earth is dancing.<br />
              <span className="text-[#789575]">
                Watch it through radar.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#233325] font-medium">
              From wetland loss to forest wildfires, earthquakes, and glacier movement,
              Earth is in an endless waltz of surface change.
              <strong className="text-[#141F16] font-bold"> Satya Dristi</strong> fuses active microwave SAR from NISAR with Sentinel-2 optical data,
              transforming raw backscatter and dielectric signatures into interactive, evidence-grounded stories.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("dashboard")}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Launch Story Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("analyze")}
                icon={<Satellite className="h-4 w-4 text-[#789575]" />}
              >
                Open Analysis Workspace
              </Button>
            </div>

            <div className="mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-[#2E4030] font-bold">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#789575] shadow-xs" />
                L-Band + S-Band SAR
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2E7D32] shadow-xs" />
                Sentinel-2 Multispectral
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#C28E3A] shadow-xs" />
                InSAR Sub-Centimeter
              </span>
            </div>
          </div>

          {/* Interactive Workspace Preview */}
          <WorkspacePreview onOpen={() => navigate("analyze")} />
        </div>
      </section>

      {/* The NASA Challenge Theme Bento */}
      <section id="challenge" className="mx-auto max-w-7xl px-6 lg:px-10 py-20 border-t border-[#789575]/25">
        <SectionHead
          badge="Earth Science In Motion"
          title="The 4 Rhythms of Earth's Dynamic Surface"
          sub="NISAR's active radar reveals physical structure and dielectric moisture shifts across four critical planetary phenomena."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          <GlassCard glow="sage" className="p-7 flex flex-col justify-between h-full bg-white/85">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#789575]/20 text-[#141F16] border border-[#789575]/40 font-bold">
                <Waves className="h-6 w-6 text-[#789575]" />
              </div>
              <h3 className="mt-5 text-base font-bold text-[#141F16]">
                Wetlands & Floods
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#2E4030]">
                Water's high dielectric constant creates specular reflection, giving instant visibility
                into flooded communities, expanding wetlands, and soil moisture reserves.
              </p>
            </div>
            <div className="mt-5 border-t border-[#789575]/25 pt-3 font-mono text-xs font-bold text-[#789575]">
              Dielectric Constant ε ~ 80
            </div>
          </GlassCard>

          <GlassCard glow="sage" className="p-7 flex flex-col justify-between h-full bg-white/85">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#789575]/20 text-[#141F16] border border-[#789575]/40">
                <Trees className="h-6 w-6 text-[#789575]" />
              </div>
              <h3 className="mt-5 text-base font-bold text-[#141F16]">
                Forest Biomass
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#2E4030]">
                L-band microwaves penetrate dense forest canopies to quantify aboveground biomass,
                tracking wildfire scar recovery and illegal deforestation without cloud interference.
              </p>
            </div>
            <div className="mt-5 border-t border-[#789575]/25 pt-3 font-mono text-xs font-bold text-[#789575]">
              Volume Scattering & Depol
            </div>
          </GlassCard>

          <GlassCard glow="ochre" className="p-7 flex flex-col justify-between h-full bg-white/85">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C28E3A]/20 text-[#734A12] border border-[#C28E3A]/35">
                <MountainSnow className="h-6 w-6 text-[#734A12]" />
              </div>
              <h3 className="mt-5 text-base font-bold text-[#141F16]">
                Glaciers & Ice Sheets
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#2E4030]">
                Differential InSAR tracks glacier velocity at centimeter-precision over 12-day orbital intervals,
                capturing Siachen and polar ice dynamics as climate changes.
              </p>
            </div>
            <div className="mt-5 border-t border-[#789575]/25 pt-3 font-mono text-xs font-bold text-[#734A12]">
              Centimeter-Scale InSAR
            </div>
          </GlassCard>

          <GlassCard glow="none" className="p-7 flex flex-col justify-between h-full bg-white/85">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#789575]/20 text-[#141F16] border border-[#789575]/40">
                <Building2 className="h-6 w-6 text-[#789575]" />
              </div>
              <h3 className="mt-5 text-base font-bold text-[#141F16]">
                Urban Subsidence
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#2E4030]">
                Concrete walls form geometric right-angle double-bounce reflectors, isolating urban sprawl
                from rural buffers and detecting millimeter-level structural subsidence.
              </p>
            </div>
            <div className="mt-5 border-t border-[#789575]/25 pt-3 font-mono text-xs font-bold text-[#789575]">
              Double-Bounce Geometry
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="mx-auto max-w-7xl px-6 lg:px-10 py-20 border-t border-[#789575]/25">
        <SectionHead
          badge="Intelligent Sensor Routing"
          title="One Unified Workspace for Multimodal Earth Intelligence"
          sub="Natural language queries are deterministically classified and routed to specialist spectral and remote-sensing pipelines."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {capabilities.map((c) => {
            const Icon = capIcon[c.icon];
            return (
              <GlassCard key={c.key} className="p-7 flex flex-col justify-between h-full bg-white/85">
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#789575]/20 text-[#141F16] border border-[#789575]/40">
                    <Icon className="h-6 w-6 text-[#789575]" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-[#141F16]">{c.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#2E4030]">{c.body}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* 7-Stage Pipeline */}
      <section id="pipeline" className="border-t border-[#789575]/25 bg-[#DFE2C7]/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <SectionHead
            badge="Auditable & Verifiable"
            title="How Satya Dristi Analyzes Every Scene"
            sub="Every query traverses the same 7-stage asynchronous pipeline from STAC ingestion to publication-grade report."
          />

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineSteps.map((s, i) => (
              <li key={s} className="relative">
                <GlassCard className="p-6 h-full flex flex-col justify-between bg-white/90">
                  <div className="flex items-center justify-between">
                    <span className="mono grid h-8 w-8 place-items-center rounded-xl border border-[#789575]/45 bg-[#789575] text-xs font-bold text-white shadow-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mono text-[10px] text-[#2E4030] uppercase font-bold">
                      Stage {i + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#141F16] leading-snug">
                    {s}
                  </p>
                </GlassCard>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 border-t border-[#789575]/25">
        <GlassCard
          glow="sage"
          className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-12 bg-white/90"
        >
          <div>
            <GlowBadge tone="sage">Ready For Exploration</GlowBadge>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#141F16] sm:text-3xl">
              Track Earth's Surface Changes Today
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#233325] font-medium">
              Select any study area on Earth, query SAR radar backscatter, and generate
              verifiable intelligence for active microwave Earth observation.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("dashboard")}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Enter Story Dashboard
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#789575]/25 bg-[#D7DAC0]/70 text-[#141F16]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:px-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#2E4030] font-medium">
              Interactive multimodal satellite intelligence for tracking Earth's surface change.
              Active microwave and multispectral Earth observation platform.
            </p>
          </div>

          <div>
            <Eyebrow>Satellite Data Sources</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-xs text-[#2E4030] font-medium">
              <li className="hover:text-[#789575] transition-colors cursor-pointer">NASA Earthdata Search</li>
              <li className="hover:text-[#789575] transition-colors cursor-pointer">ASF SAR Vertex Archive</li>
              <li className="hover:text-[#789575] transition-colors cursor-pointer">NISAR Data User Guide</li>
              <li className="hover:text-[#789575] transition-colors cursor-pointer">RADARSAT RCM & SAOCOM</li>
            </ul>
          </div>

          <div>
            <Eyebrow>Modality Tools</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-xs text-[#2E4030] font-medium">
              <li className="hover:text-[#789575] transition-colors cursor-pointer">Visual Question Answering</li>
              <li className="hover:text-[#789575] transition-colors cursor-pointer">Bi-Temporal Change (CVA)</li>
              <li className="hover:text-[#789575] transition-colors cursor-pointer">Optical + SAR Cross-Fusion</li>
              <li className="hover:text-[#789575] transition-colors cursor-pointer">Dynamic Spatial Grounding</li>
            </ul>
          </div>

          <div>
            <Eyebrow>Navigation</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-xs text-[#2E4030] font-medium">
              <li>
                <button
                  onClick={() => navigate("dashboard")}
                  className="hover:text-[#789575] transition-colors text-left cursor-pointer font-medium"
                >
                  Story Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("analyze")}
                  className="hover:text-[#789575] transition-colors text-left cursor-pointer font-medium"
                >
                  Analysis Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("reports")}
                  className="hover:text-[#789575] transition-colors text-left cursor-pointer font-medium"
                >
                  Verified Reports
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#789575]/20">
          <div className="mono mx-auto flex max-w-7xl flex-col gap-2 px-6 lg:px-10 py-5 text-xs text-[#2E4030] font-semibold sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Satya Dristi · Active Microwave Remote Sensing</span>
            <span>Multimodal Earth Observation Intelligence</span>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate("dashboard");
        }}
      />
    </div>
  );
}

function SectionHead({
  badge,
  title,
  sub,
}: {
  badge?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="max-w-3xl">
      {badge && <GlowBadge tone="sage">{badge}</GlowBadge>}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#141F16] sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-sm leading-relaxed text-[#233325] font-medium">{sub}</p>}
    </div>
  );
}

function WorkspacePreview({ onOpen }: { onOpen: () => void }) {
  return (
    <GlassCard glow="sage" className="p-0 overflow-hidden fade-up bg-white/90">
      <div className="flex items-center justify-between border-b border-[#789575]/25 px-6 py-4 bg-[#E5E8CE]/80">
        <div className="flex items-center gap-2">
          <span className="mono text-xs uppercase tracking-wider text-[#2E4030] font-bold">
            Analysis Workspace
          </span>
          <GlowBadge tone="sage">NISAR L-band Active</GlowBadge>
        </div>
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-[#789575]/40" />
          <span className="h-2 w-2 rounded-full bg-[#789575]/40" />
          <span className="h-2 w-2 rounded-full bg-[#789575]/40" />
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[1.3fr_1fr]">
        <SatImage
          bbox={REGIONS.urbanWater}
          className="min-h-[250px] rounded-2xl border border-[#789575]/35"
        >
          <OverlayGrounding />
          <ScaleTag>NISAR Radar · Hyderabad AOI</ScaleTag>
        </SatImage>

        <div className="flex flex-col justify-between gap-3">
          <div>
            <Eyebrow>Challenge Query</Eyebrow>
            <p className="mt-1.5 text-xs font-bold leading-snug text-[#141F16]">
              "Detect wetland boundary contraction and urban built-up expansion."
            </p>
          </div>

          <div className="border-t border-[#789575]/25 pt-2.5">
            <Eyebrow>Radar Interpretation</Eyebrow>
            <p className="mt-1 text-xs leading-relaxed text-[#233325] font-medium">
              High-dielectric specular reservoir mapped in center; double-bounce urban structures confirmed along perimeter.
            </p>
          </div>

          <div className="border-t border-[#789575]/25 pt-2.5">
            <Confidence level="High" agreements={[]} compact />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 px-3.5 py-2">
            <IconLayers className="h-4 w-4 text-[#789575]" />
            <span className="mono text-[10px] uppercase tracking-wide text-[#141F16] font-bold">
              Dual-Pol SAR · InSAR · Grounding
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="focus-ring flex w-full items-center justify-center gap-2 border-t border-[#789575]/25 py-3.5 text-xs font-bold text-[#141F16] hover:bg-[#789575]/15 hover:text-[#789575] transition-colors cursor-pointer"
      >
        Open In Interactive Workspace <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </GlassCard>
  );
}
