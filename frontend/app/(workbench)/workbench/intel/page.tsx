import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { IntelPageFilter } from "@/components/IntelPageFilter";
import {
  formatFetchedAt,
  getLatestFeed,
  listFeedDates,
  parseSourceIdsParam,
} from "@/lib/intel";

type PageProps = {
  searchParams?: { sources?: string; filter?: string; tab?: string };
};

const HUB_CARDS = [
  {
    href: "/workbench/intel/feed",
    title: "Daily feed",
    description: "Raw RSS — filter by individual source or person (newsletter, X, blog, pub).",
    icon: "newspaper",
    ready: true,
  },
  {
    href: "/workbench/intel/sources",
    title: "Source registry",
    description: "Curated feeds in outputs/intel/sources.md with fetch health.",
    icon: "rss_feed",
    ready: true,
  },
  {
    href: "/workbench/intel/weekly",
    title: "Weekly synthesis",
    description: "On-demand Groq weekly briefing from feed files (ISO week or rolling 7 days).",
    icon: "calendar_month",
    ready: true,
  },
  {
    href: "/workbench/intel/posts",
    title: "LinkedIn post ideas",
    description: "On-demand Groq drafts — voice samples, pillars, ISO week or rolling feed (optional weekly themes).",
    icon: "edit_note",
    ready: true,
  },
];

export default function IntelHubPage({ searchParams }: PageProps) {
  const latest = getLatestFeed();
  const feedCount = listFeedDates().length;
  const sourceIds = parseSourceIdsParam(searchParams?.sources);

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <section>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Intel & content</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Phase 12 — PM + AI RSS reader. Daily ingest is automated (no LLM); weekly summaries and LinkedIn
          drafts are on-demand only (manual buttons).
        </p>
      </section>

      <IntelPageFilter searchParams={searchParams} />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase">Feed days stored</p>
          <p className="text-metric-display font-extrabold text-metrics-gold">{feedCount}</p>
          <p className="text-sm text-on-surface-variant">outputs/intel/feed/</p>
        </div>
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase">Latest fetch</p>
          <p className="text-xl font-semibold text-on-surface mt-2">
            {latest ? formatFetchedAt(latest.meta.fetched_at) : "—"}
          </p>
          <p className="text-sm text-on-surface-variant">
            {latest ? latest.date : "Run npm run intel:fetch"}
          </p>
        </div>
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase">Last ingest health</p>
          {latest ? (
            <p className="text-xl font-semibold text-on-surface mt-2">
              <span className="text-success-green">{latest.meta.sources_healthy}</span>
              <span className="text-on-surface-variant mx-1">/</span>
              <span className="text-red-400">{latest.meta.sources_dead}</span>
              <span className="text-sm font-normal text-on-surface-variant ml-2">ok / dead</span>
            </p>
          ) : (
            <p className="text-xl font-semibold text-on-surface mt-2">—</p>
          )}
          <p className="text-sm text-on-surface-variant">
            {latest ? `${latest.meta.item_count} items` : "No feed file yet"}
            {sourceIds.length > 0 ? ` · ${sourceIds.length} source filter(s)` : ""}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HUB_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`bg-surface-raised border p-6 rounded-xl flex flex-col gap-3 transition-colors group ${
              card.ready
                ? "border-border-subtle hover:border-private-workbench/50"
                : "border-dashed border-outline-variant hover:border-on-surface-variant/40 opacity-90"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-lg bg-private-workbench/10 text-private-workbench flex items-center justify-center">
                <MaterialIcon name={card.icon} />
              </div>
              {!card.ready && (
                <span className="px-2 py-0.5 rounded bg-surface-variant/50 text-on-surface-variant font-mono text-label-sm border border-outline-variant">
                  Soon
                </span>
              )}
            </div>
            <h2 className="font-bold text-on-surface">{card.title}</h2>
            <p className="text-sm text-on-surface-variant flex-1">{card.description}</p>
          </Link>
        ))}
      </div>

      <footer className="font-mono text-label-sm text-on-surface-variant border-t border-outline-variant pt-6">
        Synced from <code className="text-primary">outputs/intel/feed/</code> · cron{" "}
        <code className="text-primary">intel-daily.yml</code> (no Groq on daily path)
      </footer>
    </div>
  );
}
