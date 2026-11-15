import { useEffect, useState } from "react";
import {
  GlassCard,
  StoryChapter,
  Button,
  Badge,
  Eyebrow,
  GlowBadge,
  cn,
} from "../components/ui";
import {
  SatImage,
  OverlayChange,
  OverlayGrounding,
  REGIONS,
} from "../components/SatImage";
import { ConfBadge, TaskIcon } from "../components/bits";
import {
  IconDownload,
  IconClose,
  IconCheck,
  IconTriangle,
} from "../components/icons";
import { FileText, Download, ShieldCheck } from "lucide-react";
import { api, type ReportItem } from "../lib/api";

export function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notify = (kind: "ok" | "err", text: string) => {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 3500);
  };

  const loadReports = () => {
    setLoading(true);
    setError(null);
    api.reports
      .list()
      .then((data) => {
        if (data && data.length > 0) {
          setReports(
            data.map((r) => ({
              id: r.report_id,
              analysis_id: r.analysis_id,
              query: r.query,
              task: r.task,
              input: r.input,
              date: r.date,
              time: r.time,
              confidence: r.confidence,
              status: r.status,
              answer: r.answer,
              pdf_filename: r.pdf_filename,
              json_filename: r.json_filename,
            }))
          );
        } else {
          setReports([]);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setReports([]);
        const rawMsg = err?.message || "";
        if (rawMsg.includes("Authorization") || rawMsg.includes("UNAUTHORIZED")) {
          setError("Authentication required. Please sign in to view verified reports.");
        } else {
          setError(rawMsg || "Failed to load reports from server.");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReports();
  }, []);

  const report = reports.find((a) => a.id === openId);

  const downloadPdf = async (rep: any) => {
    if (busyId) return;
    setBusyId(rep.id);
    notify("ok", "Generating verified ReportLab PDF with embedded satellite evidence…");
    try {
      await api.reports.downloadPdf(rep.id, rep.pdf_filename);
      notify("ok", `Downloaded ${rep.pdf_filename || `SatyaDristi_Report_${rep.id}.pdf`}`);
    } catch (err: any) {
      notify("err", err.message || "Report download failed");
    } finally {
      setBusyId(null);
    }
  };

  const downloadJson = async (rep: any) => {
    try {
      await api.reports.downloadJson(rep.id, rep.json_filename);
      notify("ok", `Downloaded ${rep.json_filename || `SatyaDristi_Report_${rep.id}.json`}`);
    } catch (err: any) {
      notify("err", err.message || "Download failed");
    }
  };

  return (
    <div className="space-y-6">
      <StoryChapter
        chapter="Dossiers"
        badge="Publication-Grade Intelligence"
        title="Verified Reports & Earth Observation Artifacts"
        subtitle="Download official, audit-compliant PDF reports containing vector charts, calibrated sensor agreements, and high-resolution satellite imagery."
      />

      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl fade-up border",
            toast.kind === "ok"
              ? "bg-[#162418]/95 border-[#789575]/50 text-[#E5E8CE] shadow-[0_0_20px_rgba(120,149,117,0.25)]"
              : "bg-[#281212]/95 border-rose-500/40 text-rose-300"
          )}
        >
          {toast.kind === "ok" ? (
            <IconCheck className="h-4 w-4 text-[#79ed91]" />
          ) : (
            <IconTriangle className="h-4 w-4" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {error && !loading && (
        <GlassCard className="p-8 text-center text-xs text-rose-400 space-y-3">
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
        </GlassCard>
      )}

      {loading && (
        <GlassCard className="p-12 text-center text-xs text-[#4B634E] font-mono">
          Loading verified reports...
        </GlassCard>
      )}

      {!loading && !error && reports.length === 0 && (
        <GlassCard className="p-12 text-center text-xs text-[#4B634E]">
          No reports generated yet. Run an analysis in the workbench to generate verified publication reports.
        </GlassCard>
      )}

      {reports.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((a) => (
            <GlassCard key={a.id} className="p-0 overflow-hidden flex flex-col justify-between bg-white/85">
              <div>
                <SatImage bbox={REGIONS.corridor} className="h-32 w-full border-b border-[#789575]/25">
                  {a.task === "Bi-Temporal Change" && <OverlayChange />}
                  {a.task === "Grounding" && <OverlayGrounding />}
                </SatImage>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <TaskIcon task={a.task} className="h-4 w-4 text-[#789575]" />
                    <span className="mono text-[11px] font-semibold text-foreground/80">
                      {a.id}
                    </span>
                    <span className="ml-auto">
                      <ConfBadge level={a.confidence} />
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    "{a.query}"
                  </p>

                  <dl className="mono mt-4 grid grid-cols-2 gap-y-1.5 text-[11px] text-muted-foreground border-t border-[#789575]/20 pt-3">
                    <dt>Task Type</dt>
                    <dd className="text-right text-foreground">{a.task}</dd>
                    <dt>Sensor Mode</dt>
                    <dd className="text-right text-foreground">{a.input}</dd>
                    <dt>Acquired</dt>
                    <dd className="text-right text-foreground">{a.date}</dd>
                    <dt>Verification</dt>
                    <dd className="text-right text-[#79ed91] font-semibold">{a.status}</dd>
                  </dl>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-white/[0.06] p-4 bg-white/[0.02]">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpenId(a.id)}
                >
                  Inspect
                </Button>
                <Button
                  size="sm"
                  variant="accent"
                  icon={<Download className="h-3.5 w-3.5" />}
                  disabled={busyId === a.id}
                  onClick={() => downloadPdf(a)}
                >
                  {busyId === a.id ? "Generating…" : "PDF"}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {report && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md"
          onClick={() => setOpenId(null)}
        >
          <div className="my-8 w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <GlassCard glow="mint" className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <span className="mono text-xs uppercase tracking-wider text-muted-foreground">
                    Report {report.id}
                  </span>
                  <Badge tone="accent">{report.task}</Badge>
                </div>
                <button
                  className="focus-ring rounded-lg p-1.5 hover:bg-white/[0.06] text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setOpenId(null)}
                  aria-label="Close"
                >
                  <IconClose />
                </button>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <Eyebrow>Executive Finding</Eyebrow>
                  <p className="mt-2 text-base font-semibold leading-relaxed text-foreground">
                    "{report.answer}"
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-[1.3fr_1fr]">
                  <SatImage
                    bbox={REGIONS.corridor}
                    className="aspect-[4/3] w-full rounded-2xl border border-white/10"
                  >
                    {report.task === "Bi-Temporal Change" && <OverlayChange />}
                    {report.task === "Grounding" && <OverlayGrounding />}
                  </SatImage>

                  <div className="space-y-4">
                    <div>
                      <Eyebrow>Sensor & Geometry Metadata</Eyebrow>
                      <dl className="mono mt-2 space-y-1.5 text-xs">
                        <div className="flex justify-between border-b border-white/[0.04] pb-1">
                          <dt className="text-muted-foreground">Input</dt>
                          <dd className="text-foreground">{report.input}</dd>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.04] pb-1">
                          <dt className="text-muted-foreground">Platform</dt>
                          <dd className="text-foreground">Sentinel-2 / NISAR L-band</dd>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.04] pb-1">
                          <dt className="text-muted-foreground">CRS</dt>
                          <dd className="text-foreground">EPSG:4326</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Format</dt>
                          <dd className="text-foreground">Cloud-Optimized GeoTIFF</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="border-t border-white/[0.06] pt-4">
                      <Eyebrow>Sensor Consensus Confidence</Eyebrow>
                      <div className="mt-2">
                        <ConfBadge level={report.confidence} />
                        <p className="mono mt-2 text-[11px] text-muted-foreground leading-relaxed">
                          Cross-checked against spectral thresholds, double-bounce geometric echoes, and spatial co-registration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadJson(report)}
                  >
                    JSON Telemetry
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Download className="h-4 w-4" />}
                    disabled={busyId === report.id}
                    onClick={() => downloadPdf(report)}
                  >
                    {busyId === report.id
                      ? "Compiling PDF…"
                      : "Download Verified PDF Report"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
