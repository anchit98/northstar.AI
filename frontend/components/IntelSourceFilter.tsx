"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildSourcesQueryParam, type IntelSourceOption } from "@/lib/intelFilters";

type IntelSourceFilterProps = {
  sources: IntelSourceOption[];
  /** From server searchParams — avoids hydration mismatch with useSearchParams on first paint. */
  selectedSourceIds: string[];
  className?: string;
};

export function IntelSourceFilter({
  sources,
  selectedSourceIds,
  className,
}: IntelSourceFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const selectedIds = selectedSourceIds;

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sources;
    return sources.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)
    );
  }, [sources, query]);

  function pushSources(ids: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    const encoded = buildSourcesQueryParam(ids);
    if (encoded) params.set("sources", encoded);
    else params.delete("sources");
    params.delete("filter");
    params.delete("tab");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    pushSources(next);
  }

  const withItems = sources.filter((s) => (s.count ?? 0) > 0).map((s) => s.id);

  if (sources.length === 0) return null;

  return (
    <section
      className={cn(
        "no-print rounded-xl border border-border-subtle bg-surface-container p-4 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
            Sources
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {selectedIds.length === 0
              ? "Showing all sources"
              : `${selectedIds.length} selected`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => pushSources([])}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border border-border-subtle text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
          >
            All
          </button>
          {withItems.length > 0 && (
            <button
              type="button"
              onClick={() => pushSources(withItems)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-metrics-gold/30 text-metrics-gold hover:bg-metrics-gold/10"
            >
              With items today
            </button>
          )}
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => pushSources([])}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-border-subtle text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <input
        type="search"
        placeholder="Search sources…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surface-raised border border-border-subtle rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant"
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {filteredList.map((s) => {
          const checked = selectedIds.includes(s.id);
          return (
            <li key={s.id}>
              <label
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors",
                  checked
                    ? "border-private-workbench/40 bg-private-workbench/10"
                    : "border-border-subtle hover:border-outline-variant"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(s.id)}
                  className="rounded border-outline-variant text-private-workbench focus:ring-private-workbench"
                />
                <span className="flex-1 truncate text-on-surface">{s.name}</span>
                {typeof s.count === "number" && (
                  <span className="font-mono text-label-sm text-metrics-gold shrink-0">{s.count}</span>
                )}
                {s.enabled === false && (
                  <span className="font-mono text-label-sm text-on-surface-variant shrink-0">off</span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
