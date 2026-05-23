"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { INTEL_CONTENT_PILLARS, type IntelPillarId } from "@/lib/intelPillars";

type IntelPostsGenerateProps = {
  ready: boolean;
  currentWeek: string;
  feedDaysInWeek: number;
  totalFeedDays: number;
  hasWeeklyForWeek: boolean;
  lastGeneratedDate?: string;
};

export function IntelPostsGenerate({
  ready,
  currentWeek,
  feedDaysInWeek,
  totalFeedDays,
  hasWeeklyForWeek,
  lastGeneratedDate,
}: IntelPostsGenerateProps) {
  const router = useRouter();
  const [pillar, setPillar] = useState<IntelPillarId>("pillar-1");
  const [mode, setMode] = useState<"iso-week" | "rolling-7">("rolling-7");
  const [includeWeekly, setIncludeWeekly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMeta = INTEL_CONTENT_PILLARS.find((p) => p.id === pillar);

  const canGenerate = ready && (mode === "rolling-7" ? totalFeedDays > 0 : feedDaysInWeek > 0);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/intel/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillar,
          mode,
          week: currentWeek,
          rollingDays: 7,
          includeWeekly: pillar === "pillar-1" && includeWeekly && hasWeeklyForWeek,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-private-workbench/30 bg-private-workbench/5 p-5 flex flex-col gap-4 no-print">
      <h2 className="font-mono text-label-sm text-private-workbench uppercase tracking-wider">
        Generate post ideas
      </h2>
      <p className="text-sm text-on-surface-variant">
        Pick <strong className="text-on-surface">one pillar</strong> per run — you choose what to post, no
        forced rotation. Two draft variants each time.
      </p>
      {lastGeneratedDate && (
        <p className="text-sm text-on-surface-variant">
          Last file: <code className="text-primary">outputs/intel/posts/{lastGeneratedDate}.md</code>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-mono text-label-sm text-on-surface-variant">Pillar (required)</label>
        <select
          value={pillar}
          onChange={(e) => setPillar(e.target.value as IntelPillarId)}
          disabled={!ready || loading}
          className="bg-surface-container border border-border-subtle rounded-lg px-3 py-2 text-sm font-mono w-full max-w-md"
        >
          {INTEL_CONTENT_PILLARS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.short}
            </option>
          ))}
        </select>
        {selectedMeta && (
          <p className="text-sm text-on-surface-variant">{selectedMeta.description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="font-mono text-label-sm text-on-surface-variant">Feed range</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "iso-week" | "rolling-7")}
          disabled={!ready || loading}
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
          <MaterialIcon name={loading ? "hourglass_empty" : "auto_awesome"} className="text-[18px]" />
          {loading ? "Generating…" : "Generate 2 drafts"}
        </button>
      </div>

      {pillar === "pillar-1" && (
        <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={includeWeekly}
            onChange={(e) => setIncludeWeekly(e.target.checked)}
            disabled={!ready || loading || !hasWeeklyForWeek}
            className="rounded border-border-subtle"
          />
          Include weekly synthesis as theme context (Industry takes)
        </label>
      )}

      {!ready && (
        <p className="text-sm text-metrics-gold">
          Complete voice samples in inputs/linkedin_style.md (min 3 posts + voice notes, status: ready).
        </p>
      )}
      {ready && mode === "iso-week" && feedDaysInWeek === 0 && totalFeedDays > 0 && (
        <p className="text-sm text-metrics-gold">
          ISO week has no feeds yet — use rolling last 7 feed days for Industry takes.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-400 font-mono">
          {error}
          {error.includes("GROQ_API_KEY") && (
            <span className="block mt-1 text-on-surface-variant">
              Add <code>GROQ_API_KEY=...</code> to frontend/.env
            </span>
          )}
        </p>
      )}
    </section>
  );
}
