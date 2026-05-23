import { Suspense } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { IntelSourceFilter } from "@/components/IntelSourceFilter";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  applyRegistrySourceFilter,
  formatFetchedAt,
  getLatestFeed,
  getSourcesDocument,
  listIntelRegistrySources,
  mergeSourceOptions,
  parseSourceIdsParam,
  sourceNamesForIds,
} from "@/lib/intel";

type PageProps = {
  searchParams: { sources?: string; filter?: string; tab?: string };
};

export default function IntelSourcesPage({ searchParams }: PageProps) {
  const { content, meta } = getSourcesDocument();
  const latest = getLatestFeed();
  const registry = listIntelRegistrySources();
  const sourceOptions = mergeSourceOptions(registry, latest?.meta.source_results);
  const sourceIds = parseSourceIdsParam(searchParams.sources);
  const filteredContent = applyRegistrySourceFilter(content, sourceIds, sourceOptions);
  const selectedNames = sourceNamesForIds(sourceIds, sourceOptions);

  const health = new Map(
    latest?.meta.source_results?.map((r) => [r.id, r] as const) ?? []
  );

  const healthList = registry
    .map((r) => health.get(r.id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .filter((r) => selectedNames.size === 0 || selectedNames.has(r.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const disabledCount = registry.filter((r) => !r.enabled).length;
  const deadCount = latest?.meta.sources_dead ?? 0;

  const feedHref =
    sourceIds.length > 0
      ? `/workbench/intel/feed?sources=${encodeURIComponent(sourceIds.join(","))}`
      : "/workbench/intel/feed";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-2">Intel sources</h1>
          <p className="text-body-md text-on-surface-variant">
            Curated RSS registry — edit <code className="text-primary">outputs/intel/sources.md</code> to
            add or disable feeds. LinkedIn profiles have no public RSS (manual reading links).
          </p>
        </div>
        <Link
          href={feedHref}
          className="inline-flex items-center gap-2 text-primary font-mono text-label-md hover:underline"
        >
          View feed
          <MaterialIcon name="arrow_forward" className="text-[18px]" />
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="no-print rounded-xl border border-border-subtle bg-surface-container p-4 text-sm text-on-surface-variant">
            Loading source filter…
          </div>
        }
      >
        <IntelSourceFilter sources={sourceOptions} selectedSourceIds={sourceIds} />
      </Suspense>

      {(deadCount > 0 || disabledCount > 0) && (
        <div className="no-print flex flex-wrap gap-2 items-center text-sm">
          {deadCount > 0 && (
            <span className="px-2 py-1 rounded font-mono text-label-sm border border-red-400/40 bg-red-400/10 text-red-400">
              {deadCount} dead on last fetch
            </span>
          )}
          {disabledCount > 0 && (
            <span className="px-2 py-1 rounded font-mono text-label-sm border border-outline-variant bg-surface-variant/30 text-on-surface-variant">
              {disabledCount} disabled in registry
            </span>
          )}
          <span className="text-on-surface-variant text-xs">
            Set <code className="text-primary">enabled: false</code> in sources.md for broken feeds.
          </span>
        </div>
      )}

      {latest && (
        <div className="bg-surface-container border border-border-subtle rounded-xl p-4 flex flex-wrap gap-4 text-sm">
          <span className="font-mono text-label-sm text-on-surface-variant uppercase w-full">
            Health from latest fetch ({latest.date})
          </span>
          <span>
            Fetched: <strong className="text-on-surface">{formatFetchedAt(latest.meta.fetched_at)}</strong>
          </span>
          <span>
            <span className="text-success-green font-semibold">{latest.meta.sources_healthy}</span> healthy
          </span>
          <span>
            <span className="text-red-400 font-semibold">{latest.meta.sources_dead}</span> failed
          </span>
        </div>
      )}

      {healthList.length > 0 && (
        <section className="no-print">
          <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
            Per-source status (last fetch)
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {healthList.map((r) => (
              <li
                key={r.id}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm ${
                  r.ok
                    ? "border-success-green/25 bg-success-green/5"
                    : "border-red-400/25 bg-red-400/5"
                }`}
              >
                <span className="text-on-surface truncate">{r.name}</span>
                <span className="font-mono text-label-sm shrink-0 flex items-center gap-2">
                  {registry.find((x) => x.id === r.id)?.enabled === false && (
                    <span className="text-on-surface-variant text-label-sm">off</span>
                  )}
                  {r.ok ? (
                    <span className="text-success-green">{r.count} items</span>
                  ) : (
                    <span
                      className="px-1.5 py-0.5 rounded border border-red-400/40 bg-red-400/10 text-red-400"
                      title={r.error}
                    >
                      Dead
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8">
        <MarkdownRenderer content={filteredContent} />
      </div>

      <footer className="font-mono text-label-sm text-on-surface-variant">
        Synced from outputs/intel/sources.md
        {meta.version ? ` v${meta.version}` : ""}
        {meta.updated ? ` · updated ${meta.updated}` : ""}
      </footer>
    </div>
  );
}
