import { Suspense } from "react";
import Link from "next/link";
import { IntelSourceFilter } from "@/components/IntelSourceFilter";
import {
  getLatestFeed,
  listIntelRegistrySources,
  mergeSourceOptions,
  parseSourceIdsParam,
} from "@/lib/intel";

type IntelPageFilterProps = {
  searchParams?: { sources?: string; filter?: string; tab?: string };
};

export function IntelPageFilter({ searchParams }: IntelPageFilterProps) {
  const latest = getLatestFeed();
  const registry = listIntelRegistrySources();
  const sourceOptions = mergeSourceOptions(registry, latest?.meta.source_results);
  const sourceIds = parseSourceIdsParam(searchParams?.sources);

  const feedParams = new URLSearchParams();
  if (sourceIds.length > 0) {
    feedParams.set("sources", sourceIds.join(","));
  }
  const feedHref = feedParams.toString()
    ? `/workbench/intel/feed?${feedParams.toString()}`
    : "/workbench/intel/feed";

  const filterLabel =
    sourceIds.length === 0
      ? "all sources"
      : `${sourceIds.length} source${sourceIds.length === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-3">
      <Suspense
        fallback={
          <div className="no-print rounded-xl border border-border-subtle bg-surface-container p-4 text-sm text-on-surface-variant">
            Loading source filter…
          </div>
        }
      >
        <IntelSourceFilter sources={sourceOptions} selectedSourceIds={sourceIds} />
      </Suspense>
      <Link
        href={feedHref}
        className="text-primary font-mono text-label-sm hover:underline w-fit no-print"
      >
        Open daily feed — {filterLabel} →
      </Link>
    </div>
  );
}
