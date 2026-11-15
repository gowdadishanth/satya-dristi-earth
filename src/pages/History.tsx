import { useEffect, useState } from "react";
import type { Route } from "../App";
import { GlassCard, StoryChapter, Eyebrow, GlowBadge, cn } from "../components/ui";
import { type TaskType } from "../lib/data";
import { ConfBadge, TaskIcon } from "../components/bits";
import { IconSearch, IconArrow } from "../components/icons";
import { api, type AnalysisRecord } from "../lib/api";

const taskFilters: (TaskType | "All")[] = [
  "All",
  "Single-Image VQA",
  "Bi-Temporal Change",
  "Optical + SAR Fusion",
  "Grounding",
];

export function History({ navigate }: { navigate: (r: Route) => void }) {
  const [q, setQ] = useState("");
  const [task, setTask] = useState<TaskType | "All">("All");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api.history
      .list({
        task: task === "All" ? undefined : task,
        q: q.trim() || undefined,
      })
      .then((data) => {
        if (mounted) {
          if (data && data.length > 0) {
            setRecords(
              data.map((d) => ({
                id: d.analysis_id,
                query: d.query,
                task: d.task,
                date: d.date,
                input: d.input,
                confidence: d.confidence,
                answer: d.answer,
              }))
            );
          } else {
            setRecords([]);
          }
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (mounted) {
          setRecords([]);
          const rawMsg = err?.message || "";
          if (rawMsg.includes("Authorization") || rawMsg.includes("UNAUTHORIZED")) {
            setError("Authentication required. Please sign in to view historical analyses.");
          } else {
            setError(rawMsg || "Failed to load historical analyses.");
          }
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [q, task]);

  return (
    <div className="space-y-6">
      <StoryChapter
        chapter="Archives"
        badge="Temporal Observation Logs"
        title="Analysis History & Observation Registry"
        subtitle="Retrieve, filter, and inspect past multimodal analyses, temporal change detections, and specialist remote-sensing executions."
      />

      {/* Filter Glass Card */}
      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search historical observations or natural queries…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs font-mono text-foreground focus-ring placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {taskFilters.map((t) => (
              <button
                key={t}
                onClick={() => setTask(t)}
                className={cn(
                  "focus-ring rounded-xl border px-3 py-1.5 text-xs font-mono transition-all cursor-pointer",
                  task === t
                    ? "border-[#789575] bg-[#789575] text-[#E5E8CE] font-bold shadow-xs"
                    : "border-[#789575]/30 bg-white/60 text-[#2B3B2C] hover:bg-white hover:text-[#18261B]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Results Table Glass Card */}
      <GlassCard className="p-0 overflow-hidden bg-white/85">
        <div className="hidden grid-cols-[1fr_160px_110px_120px_90px_40px] gap-3 border-b border-[#789575]/25 px-5 py-3.5 md:grid bg-white/70">
          {["Observation Query", "Task Type", "Acquired", "Sensor Modality", "Confidence", ""].map((h) => (
            <Eyebrow key={h}>{h}</Eyebrow>
          ))}
        </div>

        {records.map((a) => (
          <button
            key={a.id}
            onClick={() => navigate("analyze")}
            className="grid w-full grid-cols-1 gap-2 border-b border-[#789575]/15 px-5 py-4 text-left last:border-0 hover:bg-white/80 transition-colors focus-ring cursor-pointer md:grid-cols-[1fr_160px_110px_120px_90px_40px] md:items-center md:gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/80 border border-[#789575]/30 text-foreground shrink-0">
                <TaskIcon task={a.task} className="h-4 w-4 text-[#789575]" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="truncate block text-[13.5px] font-semibold text-foreground">
                  {a.query}
                </span>
                <span className="mono text-[10.5px] text-muted-foreground block truncate">
                  ID: {a.id}
                </span>
              </div>
            </div>
            <span className="mono text-xs text-muted-foreground">{a.task}</span>
            <span className="mono text-xs text-muted-foreground">{a.date}</span>
            <span className="mono text-xs text-foreground/80">{a.input}</span>
            <div>
              <ConfBadge level={a.confidence} />
            </div>
            <div className="flex justify-end">
              <IconArrow className="hidden h-4 w-4 text-muted-foreground md:block group-hover:text-foreground" />
            </div>
          </button>
        ))}

        {records.length === 0 && !loading && !error && (
          <div className="px-6 py-12 text-center text-xs text-muted-foreground">
            No analyses match your search criteria. Run an analysis in the workspace to log observations.
          </div>
        )}

        {error && !loading && (
          <div className="px-6 py-10 text-center text-xs text-rose-400 space-y-3">
            <div>{error}</div>
            {error.toLowerCase().includes("sign in") && (
              <div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#789575] hover:bg-[#8fae8c] text-[#0d160e] text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Sign In with Google →
                </button>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="px-6 py-12 text-center text-xs text-muted-foreground font-mono">
            Loading historical observations...
          </div>
        )}
      </GlassCard>
    </div>
  );
}
