import {
  GlassCard,
  StoryChapter,
  Button,
  Eyebrow,
  Badge,
  GlowBadge,
  cn,
} from "../components/ui";
import { useTheme, type Surface, type Appearance, type Density } from "../lib/theme";
import { IconCheck } from "../components/icons";

const surfaces: { key: Surface; name: string; desc: string }[] = [
  {
    key: "default",
    name: "Glassmorphism · Bento V22",
    desc: "Modern semi-transparent frosted surfaces, 24px curvature, heavy backdrop blur and ambient glows.",
  },
  {
    key: "neo",
    name: "Tactile NeoMorphism",
    desc: "Subtle raised physical surfaces and soft inset controls.",
  },
];

export function Settings() {
  const { surface, setSurface, appearance, setAppearance, density, setDensity } = useTheme();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <StoryChapter
        chapter="Config"
        badge="System & Display Configuration"
        title="Settings & Remote Sensing Preferences"
        sub="Configure visual surfaces, active sensor ingestions, and pipeline routing defaults."
      />

      {/* Appearance */}
      <section className="space-y-4">
        <Eyebrow>Display System & Surface Treatment</Eyebrow>
        <div className="grid gap-4 sm:grid-cols-2">
          {surfaces.map((s) => (
            <button
              key={s.key}
              onClick={() => setSurface(s.key)}
              className={cn(
                "focus-ring rounded-2xl border p-2 text-left transition-all cursor-pointer",
                surface === s.key
                  ? "border-[#79ed91]/60 bg-[#79ed91]/10 shadow-[0_0_15px_rgba(121,237,145,0.2)]"
                  : "border-white/10 hover:border-white/20 bg-white/[0.02]"
              )}
            >
              <ThemePreview surface={s.key} />
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{s.name}</span>
                  {surface === s.key && (
                    <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-[#79ed91] text-[#071a0b]">
                      <IconCheck className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <GlassCard className="p-4">
            <Eyebrow>Appearance Mode</Eyebrow>
            <Segmented<Appearance>
              value={appearance}
              onChange={setAppearance}
              options={[
                ["dark", "Dark (Default)"],
                ["light", "Light"],
                ["system", "System"],
              ]}
            />
          </GlassCard>

          <GlassCard className="p-4">
            <Eyebrow>Interface Density</Eyebrow>
            <Segmented<Density>
              value={density}
              onChange={setDensity}
              options={[
                ["comfortable", "Comfortable"],
                ["compact", "Compact"],
              ]}
            />
          </GlassCard>
        </div>

        {/* Color Palette Showcase */}
        <GlassCard className="p-6 bg-white/85">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Active Color Palette</Eyebrow>
              <h4 className="mt-1 text-sm font-bold text-[#141F16]">
                Satya Dristi: Earth Science & Remote Sensing (#E5E8CE & #789575)
              </h4>
            </div>
            <GlowBadge tone="sage">Active Palette</GlowBadge>
          </div>
          <p className="mt-1.5 text-xs text-[#2E4030] leading-relaxed font-medium">
            Botanical Earth-Observation palette featuring #E5E8CE Pale Sage Ivory surfaces, #789575 Muted Forest Sage borders, deep spruce slate contrast, and warm ochre flow indicators.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3 text-left">
              <div className="h-8 rounded-lg bg-[#789575] shadow-xs" />
              <div className="mt-2 text-xs font-bold text-[#141F16]">Forest Sage</div>
              <div className="mono text-[10px] text-[#2E4030] font-semibold">#789575</div>
            </div>

            <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3 text-left">
              <div className="h-8 rounded-lg bg-[#E5E8CE] border border-[#789575]/40" />
              <div className="mt-2 text-xs font-bold text-[#141F16]">Pale Sage Ivory</div>
              <div className="mono text-[10px] text-[#2E4030] font-semibold">#E5E8CE</div>
            </div>

            <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3 text-left">
              <div className="h-8 rounded-lg bg-[#141F16]" />
              <div className="mt-2 text-xs font-bold text-[#141F16]">Spruce Slate</div>
              <div className="mono text-[10px] text-[#2E4030] font-semibold">#141F16</div>
            </div>

            <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3 text-left">
              <div className="h-8 rounded-lg bg-[#2E7D32]" />
              <div className="mt-2 text-xs font-bold text-[#141F16]">Chlorophyll Green</div>
              <div className="mono text-[10px] text-[#2E4030] font-semibold">#2E7D32</div>
            </div>

            <div className="rounded-xl border border-[#789575]/35 bg-[#E5E8CE]/60 p-3 text-left">
              <div className="h-8 rounded-lg bg-[#C28E3A]" />
              <div className="mt-2 text-xs font-bold text-[#141F16]">Earth Amber</div>
              <div className="mono text-[10px] text-[#2E4030] font-semibold">#C28E3A</div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Analysis preferences */}
      <section className="space-y-4">
        <Eyebrow>Pipeline Automation & Modality</Eyebrow>
        <GlassCard className="divide-y divide-white/[0.06] p-0 overflow-hidden">
          <Toggle label="Auto-select specialist tools" desc="Automatically choose sensor pipelines based on natural language query intent." on />
          <Toggle label="Require input compatibility check" desc="Validate CRS, format and spatial co-registration before inference." on />
          <Toggle label="Attach execution trace to reports" desc="Include the complete auditable trace in official PDF exports." on />
          <Toggle label="Flag low-confidence results" desc="Surface uncertainty when specialist predictions disagree." on />
        </GlassCard>
      </section>

      {/* About */}
      <section className="space-y-4">
        <Eyebrow>Mission & Platform</Eyebrow>
        <GlassCard className="p-6">
          <p className="text-sm font-bold text-foreground">Satya Dristi — Multimodal Earth Observation Intelligence</p>
          <p className="mono mt-1 text-xs text-muted-foreground">
            Earth Observation Intelligence Platform · NISAR Radar Science
          </p>
          <div className="mt-4 flex gap-3">
            <Button size="sm" variant="outline">NISAR User Guide</Button>
            <Button size="sm" variant="outline">ASF Vertex Search</Button>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="mt-2 inline-flex w-full gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "flex-1 rounded-lg px-3 py-1.5 text-xs font-mono transition-all focus-ring cursor-pointer",
            value === v
              ? "bg-[#4dbe55] text-[#081a0c] font-bold shadow-xs"
              : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  desc,
  on = false,
}: {
  label: string;
  desc: string;
  on?: boolean;
}) {
  const id = label.replace(/\s/g, "");
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 p-5 hover:bg-white/[0.02] transition-colors"
    >
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{desc}</span>
      </span>
      <span className="mt-0.5">
        <input
          id={id}
          type="checkbox"
          defaultChecked={on}
          className="peer sr-only"
        />
        <span className="relative block h-5 w-9 rounded-full bg-white/20 transition-colors peer-checked:bg-[#79ed91] peer-focus-visible:ring-2 peer-focus-visible:ring-ring after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-4" />
      </span>
    </label>
  );
}

function ThemePreview({ surface }: { surface: Surface }) {
  const card =
    surface === "neo"
      ? "bg-white/[0.05] rounded-xl border border-white/15 shadow-[3px_3px_7px_rgba(0,0,0,0.6)]"
      : "bg-white/[0.05] rounded-xl border border-white/10 backdrop-blur-md";
  return (
    <div className="rounded-xl bg-[#0b100e] p-3 border border-white/10">
      <div className="flex gap-2">
        <div className={cn("h-8 flex-1", card)} />
        <div className="h-8 w-8 rounded-lg bg-[#4dbe55]" />
      </div>
      <div className={cn("mt-2 h-5", card)} />
    </div>
  );
}
