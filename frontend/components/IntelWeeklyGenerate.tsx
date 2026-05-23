"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { IntelWeeklyViewer } from "@/components/IntelWeeklyViewer";

type IntelWeeklyGenerateProps = {
  currentWeek: string;
  feedDaysInWeek: number;
  totalFeedDays: number;
  lastGeneratedWeek?: string;
};

export function IntelWeeklyGenerate({
  currentWeek,
  feedDaysInWeek,
  totalFeedDays,
  lastGeneratedWeek,
}: IntelWeeklyGenerateProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"iso-week" | "rolling-7">("iso-week");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [preview, setPreview] = useState<{
    content: string;
    week: string;
    model: string;
    persisted: boolean;
  } | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setWarnings([]);
    setPreview(null);
    try {
      const res = await fetch("/api/intel/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week: currentWeek, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          [data.error, data.hint, data.configuredModel ? `Configured: ${data.configuredModel}` : ""]
            .filter(Boolean)
            .join(" — ")
        );
        return;
      }
      if (Array.isArray(data.warnings) && data.warnings.length > 0) {
        setWarnings(data.warnings);
      }
      if (typeof data.content === "string") {
        setPreview({
          content: data.content,
          week: data.week ?? currentWeek,
          model: data.model ?? data.configuredModel ?? "unknown",
          persisted: Boolean(data.persisted),
        });
      }
      if (data.persisted) {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = mode === "rolling-7" ? totalFeedDays > 0 : feedDaysInWeek > 0;

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-xl border border-private-workbench/30 bg-private-workbench/5 p-5 flex flex-col gap-4 no-print">
        <h2 className="font-mono text-label-sm text-private-workbench uppercase tracking-wider">
          Generate this week&apos;s summary (Phase C)
        </h2>
        <p className="text-sm text-on-surface-variant">
          Week <code className="text-primary">{currentWeek}</code>
          {feedDaysInWeek > 0 ? (
            <>
              {" "}
              · {feedDaysInWeek} feed file{feedDaysInWeek === 1 ? "" : "s"} in range
            </>
          ) : (
            <span className="text-metrics-gold"> · no feed files yet for this ISO week</span>
          )}
        </p>
        {lastGeneratedWeek && (
          <p className="text-sm text-on-surface-variant">
            Last saved file:{" "}
            <code className="text-primary">outputs/intel/weekly/{lastGeneratedWeek}.md</code>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-mono text-label-sm text-on-surface-variant">Input range</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "iso-week" | "rolling-7")}
            disabled={loading}
            className="bg-surface-container border border-border-subtle rounded-lg px-3 py-2 text-sm font-mono"
          >
            <option value="iso-week">ISO week (Mon–Sun)</option>
            <option value="rolling-7">Rolling last 7 feed days</option>
          </select>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-private-workbench text-black font-mono text-label-md disabled:opacity-50"
          >
            <MaterialIcon name={loading ? "hourglass_empty" : "summarize"} className="text-[18px]" />
            {loading ? "Synthesizing…" : "Generate this week's summary"}
          </button>
        </div>
        {mode === "iso-week" && feedDaysInWeek === 0 && (
          <p className="text-sm text-metrics-gold">
            No daily feeds fall in this ISO week yet. Use <strong>rolling last 7 feed days</strong> or run{" "}
            <code>npm run intel:fetch</code> until the week has data.
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 font-mono whitespace-pre-wrap">
            {error}
            {error.includes("GROQ_API_KEY") && (
              <span className="block mt-1 text-on-surface-variant">
                Add <code>GROQ_API_KEY=...</code> to Vercel env (and local frontend/.env)
              </span>
            )}
          </p>
        )}
        {warnings.length > 0 && (
          <div className="text-sm text-metrics-gold border border-metrics-gold/30 rounded-lg p-3">
            <p className="font-mono text-label-sm mb-1">Notes</p>
            <ul className="list-disc pl-5">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {preview && (
        <div className="flex flex-col gap-3">
          {!preview.persisted && (
            <p className="text-sm text-metrics-gold border border-metrics-gold/30 rounded-lg p-3 font-mono">
              Preview only (not saved to disk on Vercel). Copy below or run locally to commit to the repo.
            </p>
          )}
          <p className="text-xs font-mono text-on-surface-variant">
            Generated with model: <code className="text-primary">{preview.model}</code>
          </p>
          <IntelWeeklyViewer content={preview.content} week={preview.week} />
        </div>
      )}
    </section>
  );
}
