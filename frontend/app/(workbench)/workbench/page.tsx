import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getRecentArchiveEvents } from "@/lib/versions";
import { getMarkdownContent } from "@/lib/content";

const CARDS = [
  {
    href: "/workbench/outreach",
    title: "Outreach Templates",
    description: "Cold emails, LinkedIn DMs, cadence guide, and company-type filters.",
    icon: "mail",
  },
  {
    href: "/workbench/interview",
    title: "Interview Prep",
    description: "STAR stories grouped by competency and compensation negotiation playbook.",
    icon: "forum",
  },
  {
    href: "/workbench/positioning",
    title: "Positioning Strategy",
    description: "Narrative variants A/B/C and company-type messaging matrix.",
    icon: "layers",
  },
  {
    href: "/workbench/jd-alignment",
    title: "JD alignment",
    description: "Phase 11 — corpus keywords, synthesis, paste new JDs (resume tuning).",
    icon: "psychology",
  },
  {
    href: "/workbench/intel",
    title: "Intel & content",
    description: "Phase 12 — daily PM/AI RSS feed, source registry (no LLM on ingest).",
    icon: "newspaper",
  },
  {
    href: "/workbench/versions",
    title: "Version History",
    description: "Archive diffs, phase timeline, compare-any-two (G8).",
    icon: "history",
  },
  {
    href: "/workbench/feedback",
    title: "Market Feedback",
    description: "Phase 6 tracker — metrics, pivot triggers (DEC-16), outreach log.",
    icon: "insights",
  },
  {
    href: "/resume",
    title: "Download Resumes",
    description: "Shortcut to public ATS and one-page viewers.",
    icon: "description",
    external: false,
    public: true,
  },
];

export default function WorkbenchDashboardPage() {
  const resumeMeta = getMarkdownContent("resume_ats_optimized.md");
  const recentArchives = getRecentArchiveEvents(3);

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-2">Welcome back, Anchit.</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 text-success-green font-mono text-label-sm uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
              System synced
            </span>
            <span className="text-on-surface-variant font-mono text-label-sm sm:text-label-md break-words">
              Last synced: {resumeMeta.meta.date} · v{resumeMeta.meta.version}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-dashed border-metrics-gold bg-metrics-gold/5 w-full sm:w-fit">
          <MaterialIcon name="track_changes" className="text-metrics-gold text-[20px]" />
          <span className="font-mono text-label-md text-metrics-gold">Active narrative: Variant A</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`bg-surface-raised border p-6 rounded-xl flex flex-col gap-3 transition-colors group ${
              card.public
                ? "border-outline-variant hover:border-primary"
                : "border-border-subtle hover:border-private-workbench/50"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                card.public ? "bg-primary/10 text-primary" : "bg-private-workbench/10 text-private-workbench"
              }`}
            >
              <MaterialIcon name={card.icon} />
            </div>
            <h2 className="font-bold text-on-surface">{card.title}</h2>
            <p className="text-sm text-on-surface-variant flex-1">{card.description}</p>
          </Link>
        ))}
      </div>

      <section className="border-t border-outline-variant pt-8">
        <h3 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mb-4">
          Recent activity
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-sm bg-surface-container p-3 rounded-lg border border-border-subtle">
            <span className="font-mono text-on-surface-variant w-24">{resumeMeta.meta.date}</span>
            <span className="px-2 py-0.5 rounded bg-success-green/10 text-success-green font-mono text-label-sm border border-success-green/20">
              Current
            </span>
            <span className="text-on-surface">
              outputs/ v{resumeMeta.meta.version} — canonical source (EC-X.4)
            </span>
          </div>
          {recentArchives.map((ev) => (
            <div
              key={ev.versionId}
              className="flex items-center gap-4 text-sm bg-surface-container p-3 rounded-lg border border-border-subtle"
            >
              <span className="font-mono text-on-surface-variant w-24">{ev.date}</span>
              <span className="px-2 py-0.5 rounded bg-surface-variant/50 text-on-surface-variant font-mono text-label-sm border border-outline-variant">
                Archived
              </span>
              <span className="text-on-surface line-clamp-1">
                {ev.versionId}: {ev.why}
              </span>
            </div>
          ))}
          <Link href="/workbench/versions" className="text-primary font-mono text-label-sm hover:underline w-fit">
            Full version history →
          </Link>
        </div>
      </section>

      <footer className="font-mono text-label-sm text-on-surface-variant">
        Synced from pipeline outputs v{resumeMeta.meta.version} (EC-7.2)
      </footer>
    </div>
  );
}
