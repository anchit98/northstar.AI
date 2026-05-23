import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { IntelPageFilter } from "@/components/IntelPageFilter";
import { IntelPostsGenerate } from "@/components/IntelPostsGenerate";
import { IntelPostViewer } from "@/components/IntelPostViewer";
import {
  getFeedMarkdownForWeek,
  getIntelPostByDate,
  getIntelWeeklyByWeek,
  getIsoWeekId,
  getLinkedinStyleStatus,
  listFeedDates,
  listIntelPostDates,
} from "@/lib/intel";
import { getGroqModelLabel } from "@/lib/groq";
import { INTEL_CONTENT_PILLARS } from "@/lib/intelPillars";

type PageProps = {
  searchParams?: { sources?: string };
};

export default function IntelPostsPage({ searchParams }: PageProps) {
  const style = getLinkedinStyleStatus();
  const currentWeek = getIsoWeekId();
  const weekContext = getFeedMarkdownForWeek(currentWeek);
  const hasWeeklyForWeek = Boolean(getIntelWeeklyByWeek(currentWeek));
  const postDates = listIntelPostDates();
  const latestPost = postDates[0] ? getIntelPostByDate(postDates[0]) : null;
  const feedCount = listFeedDates().length;
  const groqModel = getGroqModelLabel();

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">LinkedIn post ideas</h1>
        <p className="text-body-md text-on-surface-variant">
          Pick one of four pillars per run (Industry takes, AI craft, Ops, PM journey). Proof optional.
          You choose what to post — no rotation. Review and copy manually; no auto-post.
        </p>
        <p className="text-xs font-mono text-on-surface-variant mt-2">
          Model: <code className="text-primary">{groqModel}</code> · {feedCount} feed day
          {feedCount === 1 ? "" : "s"} stored
        </p>
      </div>

      <section className="rounded-xl border border-border-subtle bg-surface-container p-5 flex flex-col gap-3">
        <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
          Voice samples
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`px-2 py-0.5 rounded font-mono text-label-sm border ${
              style.readyForGeneration
                ? "border-success-green/30 bg-success-green/10 text-success-green"
                : "border-metrics-gold/30 bg-metrics-gold/10 text-metrics-gold"
            }`}
          >
            {style.readyForGeneration ? "Ready" : "Incomplete"}
          </span>
          <span className="text-on-surface-variant">
            {style.samplesFilled} samples · voice notes {style.voiceNotesFilled ? "yes" : "no"}
          </span>
          <span className="font-mono text-label-sm text-on-surface-variant">status: {style.status}</span>
        </div>
        {!style.readyForGeneration && (
          <p className="text-sm text-metrics-gold font-mono">
            Edit <code className="text-primary">inputs/linkedin_style.md</code> in the repo (min 3 samples +
            voice notes, <code>status: ready</code>).
          </p>
        )}
      </section>

      <IntelPostsGenerate
        ready={style.readyForGeneration}
        currentWeek={currentWeek}
        feedDaysInWeek={weekContext.files.length}
        totalFeedDays={feedCount}
        hasWeeklyForWeek={hasWeeklyForWeek}
        lastGeneratedDate={postDates[0]}
      />

      <section className="rounded-xl border border-border-subtle bg-surface-raised p-5">
        <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
          Content pillars
        </h2>
        <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
          {INTEL_CONTENT_PILLARS.map((p) => (
            <li key={p.id}>
              <span className="font-mono text-metrics-gold">{p.short}</span>
              <span className="block text-on-surface-variant/90 mt-0.5">{p.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <IntelPageFilter searchParams={searchParams} />

      <p className="text-sm text-on-surface-variant border border-border-subtle rounded-lg p-3 no-print">
        <strong className="text-on-surface">G5-lite:</strong> Review and edit every draft before copying to
        LinkedIn. No auto-post. Do not share metrics or claims you cannot verify (DEC-4).
      </p>

      {latestPost ? (
        <IntelPostViewer content={latestPost.content} date={latestPost.date} />
      ) : (
        <p className="text-sm text-on-surface-variant">
          No drafts yet. Click <strong className="text-on-surface">Generate new ideas</strong> when voice
          samples are ready.
        </p>
      )}

      {postDates.length > 1 && (
        <p className="text-xs font-mono text-on-surface-variant">
          Older runs: {postDates.slice(1, 5).join(", ")}
        </p>
      )}

      <Link
        href="/workbench/intel/weekly"
        className="inline-flex items-center gap-2 text-primary font-mono text-label-md hover:underline w-fit"
      >
        <MaterialIcon name="calendar_month" className="text-[18px]" />
        Weekly synthesis (Phase C)
      </Link>
      <Link
        href="/workbench/intel/feed"
        className="inline-flex items-center gap-2 text-primary font-mono text-label-md hover:underline w-fit"
      >
        <MaterialIcon name="newspaper" className="text-[18px]" />
        Browse daily feed
      </Link>
      <Link href="/workbench/intel" className="text-on-surface-variant font-mono text-label-sm hover:underline w-fit">
        ← Intel hub
      </Link>
    </div>
  );
}
