import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { IconCheck, IconTriangle, IconClose } from "./icons";

export function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/* =========================================================
   PALE SAGE IVORY & MUTED FOREST SAGE EDITORIAL BENTO-GRID
   Base: #E5E8CE (Pale Sage Ivory) & #789575 (Muted Forest Sage)
   ========================================================= */

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glow?: "sage" | "ochre" | "none" | "cyan" | "indigo";
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  hoverEffect = true,
  ...motionProps
}: GlassCardProps) {
  const glowClass =
    glow === "sage" || glow === "cyan"
      ? "glass-card-sage"
      : glow === "ochre" || glow === "indigo"
      ? "glass-card-glow"
      : "glass-card";

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, scale: 1.004 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn("relative overflow-hidden p-6 sm:p-7 flex flex-col", glowClass, className)}
      {...motionProps}
    >
      {glow !== "none" && (
        <div
          className={cn(
            "pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl opacity-60",
            glow === "sage" || glow === "cyan" ? "bg-[#789575]/25" : "bg-[#c28e3a]/20"
          )}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ---------------- Storytelling Chapter Header ---------------- */
export function StoryChapter({
  chapter,
  title,
  subtitle,
  badge = "NISAR Earth Observation Stream",
  className,
}: {
  chapter: string;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}) {
  return (
    <div className={cn("story-chapter mb-5", className)}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="story-badge">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#789575] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#789575]"></span>
          </span>
          Chapter {chapter}
        </span>
        <span className="mono text-xs font-semibold uppercase tracking-wider text-[#4B634E]">
          {badge}
        </span>
      </div>
      <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#18261B] sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#2B3B2C]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------------- Bento StatsCard Component ---------------- */
export interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: ReactNode;
  subtitle?: string;
  badge?: string;
  accent?: "sage" | "bone" | "amber" | "emerald" | "cyan" | "indigo";
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  subtitle,
  badge,
  accent = "sage",
  className,
}: StatsCardProps) {
  const isPositive = change >= 0;

  const accentStyles = {
    sage: "bg-[#789575]/20 text-[#18261B] border-[#789575]/45",
    bone: "bg-[#E5E8CE] text-[#18261B] border-[#789575]/35",
    amber: "bg-[#C28E3A]/20 text-[#734A12] border-[#C28E3A]/45",
    emerald: "bg-[#789575]/25 text-[#183B1E] border-[#789575]/50",
    cyan: "bg-[#789575]/20 text-[#18261B] border-[#789575]/45",
    indigo: "bg-[#223326]/15 text-[#18261B] border-[#223326]/30",
  }[accent];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.008 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#789575]/35 bg-white/80 p-6 backdrop-blur-xl shadow-xs transition-all hover:border-[#789575]/70 hover:shadow-md flex flex-col justify-between h-full text-[#18261B]",
        className
      )}
    >
      {/* Corner ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl bg-[#789575]/15" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B634E] truncate">
                {title}
              </span>
              {badge && (
                <span className="mono rounded-full bg-[#789575]/15 px-2 py-0.5 text-[10px] font-semibold text-[#18261B] border border-[#789575]/35 shrink-0">
                  {badge}
                </span>
              )}
            </div>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#18261B] font-mono">
              {value}
            </h3>
          </div>

          {icon && (
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner",
                accentStyles
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-[#789575]/20 pt-3.5 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold font-mono shrink-0",
            isPositive
              ? "bg-[#789575]/25 text-[#183B1E] border border-[#789575]/45"
              : "bg-rose-500/15 text-rose-700 border border-rose-500/30"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(change)}%
        </span>
        {subtitle && (
          <span className="text-xs text-[#4B634E] truncate text-right">
            {subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ---------------- Story Narrative Card ---------------- */
export function NarrativeCard({
  chapter,
  title,
  narrative,
  author = "NISAR Science Team",
  badge = "Active Observation",
  children,
  className,
}: {
  chapter?: string;
  title: string;
  narrative: string;
  author?: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <GlassCard
      glow="sage"
      className={cn("border-l-4 border-l-[#789575] bg-white/85 p-7 sm:p-8 flex flex-col justify-between h-full text-[#18261B]", className)}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#789575]/25 pb-3.5">
          <div className="flex items-center gap-2">
            {chapter && <span className="story-badge">Chapter {chapter}</span>}
            <span className="mono text-xs font-bold text-[#18261B] uppercase tracking-wider">
              {title}
            </span>
          </div>
          <span className="mono rounded-full bg-[#789575]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#18261B] border border-[#789575]/45">
            {badge}
          </span>
        </div>

        <p className="mt-4 text-[15.5px] leading-relaxed text-[#18261B] font-medium italic">
          "{narrative}"
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#789575]/20 pt-3.5 text-xs text-[#4B634E]">
        <span className="mono text-xs">
          Origin: <strong className="text-[#18261B] font-semibold">{author}</strong>
        </span>
        {children}
      </div>
    </GlassCard>
  );
}

/* ---------------- GlowBadge Component ---------------- */
export function GlowBadge({
  children,
  tone = "sage",
  className,
}: {
  children: ReactNode;
  tone?: "sage" | "bone" | "amber" | "emerald" | "neutral" | "cyan" | "indigo";
  className?: string;
}) {
  const tones = {
    sage: "bg-[#789575]/20 border-[#789575]/50 text-[#18261B] shadow-xs",
    bone: "bg-white/70 border-[#789575]/35 text-[#18261B] shadow-xs",
    amber: "bg-[#C28E3A]/20 border-[#C28E3A]/45 text-[#734A12] shadow-xs",
    emerald: "bg-[#789575]/25 border-[#789575]/45 text-[#183B1E] shadow-xs",
    neutral: "bg-white/60 border-[#789575]/25 text-[#4B634E]",
    cyan: "bg-[#789575]/20 border-[#789575]/50 text-[#18261B] shadow-xs",
    indigo: "bg-[#223326]/15 border-[#223326]/30 text-[#18261B] shadow-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-medium backdrop-blur-md",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* =========================================================
   LEGACY / RETRO-COMPATIBLE SYSTEM EXPORTS
   ========================================================= */

/* ---------------- Panel ---------------- */
export function Panel({
  children,
  className,
  raised,
  inset,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  raised?: boolean;
  inset?: boolean;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "panel",
        raised && "panel-raised",
        inset && "panel-inset",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Button ---------------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};
export function Button({
  variant = "outline",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus-ring disabled:opacity-45 disabled:pointer-events-none select-none whitespace-nowrap cursor-pointer";
  const sizes =
    size === "sm"
      ? "text-xs px-3.5 h-8"
      : size === "lg"
      ? "text-sm px-6 h-11 font-bold shadow-md"
      : "text-sm px-4.5 h-10";
  const variants: Record<string, string> = {
    primary:
      "bg-[#789575] text-[#E5E8CE] font-bold shadow-sm hover:bg-[#688565] hover:shadow-md active:scale-[0.98]",
    accent:
      "bg-[#223326] text-[#E5E8CE] font-bold hover:bg-[#18261B] shadow-sm active:scale-[0.98]",
    outline:
      "border-1.5 border-[#789575]/50 bg-white/70 hover:bg-white text-[#18261B] hover:border-[#789575]",
    ghost: "hover:bg-[#789575]/15 text-[#2B3B2C] hover:text-[#18261B]",
  };
  return (
    <button className={cn(base, sizes, variants[variant], className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "ok" | "warn" | "err";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/70 text-[#2B3B2C] border-[#789575]/30",
    accent: "bg-[#789575]/20 text-[#18261B] border-[#789575]/45",
    ok: "text-[#183B1E] border-[#789575]/45 bg-[#789575]/25",
    warn: "text-[#734A12] border-[#C28E3A]/45 bg-[#C28E3A]/20",
    err: "text-rose-700 border-rose-500/35 bg-rose-500/15",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-none tracking-wide uppercase font-mono",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Eyebrow / label ---------------- */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.1em] text-[#4B634E] font-mono",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------------- Section title ---------------- */
export function StatDot({ tone }: { tone: "ok" | "warn" | "err" | "idle" }) {
  const c = {
    ok: "#2E7D32",
    warn: "#C28E3A",
    err: "#D32F2F",
    idle: "#789575",
  }[tone];
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{
        background: c,
        boxShadow: tone === "ok" ? "0 0 8px rgba(46,125,50,0.4)" : undefined,
      }}
    />
  );
}

/* ---------------- Confidence component ---------------- */
export type Agreement = { label: string; state: "agree" | "partial" | "absent" };

export function Confidence({
  level,
  agreements,
  compact,
}: {
  level: "High" | "Moderate" | "Low";
  agreements: Agreement[];
  compact?: boolean;
}) {
  const color = {
    High: "#2E7D32",
    Moderate: "#C28E3A",
    Low: "#D32F2F",
  }[level];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Eyebrow>Confidence Level</Eyebrow>
        <span
          className="inline-flex items-center gap-1.5 text-sm font-bold font-mono"
          style={{ color }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: color }}
          />
          {level}
        </span>
      </div>
      {!compact && (
        <>
          <div className="mt-3">
            <Eyebrow>Sensor Agreement Matrix</Eyebrow>
            <dl className="mt-2 divide-y divide-[#789575]/20 rounded-xl border border-[#789575]/30 bg-white/60">
              {agreements.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center justify-between px-3 py-2 text-xs"
                >
                  <dt className="text-[#2B3B2C]">
                    {a.label}
                  </dt>
                  <dd>
                    {a.state === "agree" && (
                      <IconCheck
                        className="h-4 w-4"
                        style={{ color: "#2E7D32" }}
                      />
                    )}
                    {a.state === "partial" && (
                      <IconTriangle
                        className="h-4 w-4"
                        style={{ color: "#C28E3A" }}
                      />
                    )}
                    {a.state === "absent" && (
                      <IconClose className="h-4 w-4 text-[#789575]" />
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-[#4B634E]">
            {level === "Moderate"
              ? "SAR shows partial agreement with optical predictions; magnitude of change is indicative."
              : "Calibrated cross-sensor agreement between optical, SAR, and temporal pipelines."}
          </p>
        </>
      )}
    </div>
  );
}
