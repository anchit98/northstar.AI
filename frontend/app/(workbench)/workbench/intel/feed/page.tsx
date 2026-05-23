import { Suspense } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { IntelFeedNav } from "@/components/IntelFeedNav";
import { IntelSourceFilter } from "@/components/IntelSourceFilter";
import {
  applyFeedSourceFilter,
  formatFetchedAt,
  getFeedByDate,
  listFeedDates,
  listIntelRegistrySources,
  mergeSourceOptions,
  parseSourceIdsParam,
} from "@/lib/intel";

type PageProps = {
  searchParams: { date?: string; sources?: string; filter?: string; tab?: string };
};

function FeedBody({
  selectedDate,
  sourceIds,
}: {
  selectedDate: string;
  sourceIds: string[];
}) {
  const feed = getFeedByDate(selectedDate);

  if (!feed) {
    return (
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 text-on-surface-variant">
        No feed file for <strong className="text-on-surface">{selectedDate}</strong>. Run{" "}
        <code className="text-primary">npm run intel:fetch</code> from the repo root.
      </div>
    );
  }

  const { meta, content } = feed;
  const registry = listIntelRegistrySources();
  const sourceOptions = mergeSourceOptions(registry, meta.source_results);
  const filteredContent = applyFeedSourceFilter(content, sourceIds, sourceOptions);

  const filterLabel =
    sourceIds.length === 0
      ? "All sources"
      : sourceOptions
          .filter((o) => sourceIds.includes(o.id))
          .map((o) => o.name)
          .join(", ");

  return (
    <>
      <Suspense
        fallback={
          <div className="no-print rounded-xl border border-border-subtle bg-surface-container p-4 text-sm text-on-surface-variant">
            Loading source filter…
          </div>
        }
      >
        <IntelSourceFilter sources={sourceOptions} selectedSourceIds={sourceIds} />
      </Suspense>

      <div className="flex flex-wrap gap-4 text-sm font-mono text-on-surface-variant no-print">
        <span>
          Fetched: <span className="text-on-surface">{formatFetchedAt(meta.fetched_at)}</span>
        </span>
        <span>
          All items: <span className="text-metrics-gold">{meta.item_count}</span>
        </span>
        <span>
          Showing: <span className="text-primary">{filterLabel}</span>
        </span>
        <span>
          Sources:{" "}
          <span className="text-success-green">{meta.sources_healthy} ok</span>
          {meta.sources_dead > 0 && (
            <>
              {" "}
              · <span className="text-red-400">{meta.sources_dead} dead</span>
            </>
          )}
        </span>
      </div>
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8">
        <MarkdownRenderer content={filteredContent} />
      </div>
    </>
  );
}

export default function IntelFeedPage({ searchParams }: PageProps) {
  const dates = listFeedDates();
  const selectedDate =
    searchParams.date && dates.includes(searchParams.date)
      ? searchParams.date
      : dates[0] ?? "";
  const sourceIds = parseSourceIdsParam(searchParams.sources);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Daily intel feed</h1>
        <p className="text-body-md text-on-surface-variant">
          Raw RSS — no LLM. Pick one or more sources by name (newsletters, blogs, people on X, pubs).
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-on-surface-variant">Loading dates…</p>}>
        <IntelFeedNav dates={dates} selectedDate={selectedDate} />
      </Suspense>

      {selectedDate ? (
        <FeedBody selectedDate={selectedDate} sourceIds={sourceIds} />
      ) : (
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 text-on-surface-variant">
          No feed files in <code className="text-primary">outputs/intel/feed/</code> yet.
        </div>
      )}

      <footer className="font-mono text-label-sm text-on-surface-variant">
        {selectedDate
          ? `Synced from outputs/intel/feed/${selectedDate}.md${
              sourceIds.length ? ` · sources: ${sourceIds.join(",")}` : ""
            }`
          : "outputs/intel/feed/ — empty"}
      </footer>
    </div>
  );
}
