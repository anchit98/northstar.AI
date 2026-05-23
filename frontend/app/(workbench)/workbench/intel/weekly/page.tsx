import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { IntelPageFilter } from "@/components/IntelPageFilter";
import { IntelWeeklyGenerate } from "@/components/IntelWeeklyGenerate";
import { IntelWeeklyViewer } from "@/components/IntelWeeklyViewer";
import {
  getFeedMarkdownForWeek,
  getIntelWeeklyByWeek,
  getIsoWeekId,
  listFeedDates,
  listIntelWeekIds,
} from "@/lib/intel";
import { getGroqModelLabel } from "@/lib/groq";

type PageProps = {
  searchParams?: { sources?: string };
};

export default function IntelWeeklyPage({ searchParams }: PageProps) {
  const currentWeek = getIsoWeekId();
  const weekContext = getFeedMarkdownForWeek(currentWeek);
  const weekIds = listIntelWeekIds();
  const displayWeek = weekIds[0] ?? currentWeek;
  const latest =
    weekIds.length > 0 ? getIntelWeeklyByWeek(weekIds[0]) : getIntelWeeklyByWeek(currentWeek);
  const feedCount = listFeedDates().length;
  const groqModel = getGroqModelLabel();

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Weekly synthesis</h1>
        <p className="text-body-md text-on-surface-variant">
          On-demand Groq briefing from your RSS feed files (DEC-25). Independent of LinkedIn post
          generation — cites feed URLs only; positioning from personal_branding §1.
        </p>
        <p className="text-xs font-mono text-on-surface-variant mt-2">
          Model: <code className="text-primary">{groqModel}</code> · {feedCount} feed day
          {feedCount === 1 ? "" : "s"} stored
        </p>
      </div>

      <IntelWeeklyGenerate
        currentWeek={currentWeek}
        feedDaysInWeek={weekContext.files.length}
        totalFeedDays={feedCount}
        lastGeneratedWeek={weekIds[0]}
      />

      <IntelPageFilter searchParams={searchParams} />

      {latest ? (
        <IntelWeeklyViewer content={latest.content} week={latest.week} />
      ) : (
        <p className="text-sm text-on-surface-variant">
          No weekly file yet for <code className="text-primary">{displayWeek}</code>. Click{" "}
          <strong className="text-on-surface">Generate this week&apos;s summary</strong> when you have
          feed data.
        </p>
      )}

      {weekIds.length > 1 && (
        <p className="text-xs font-mono text-on-surface-variant">
          Older weeks: {weekIds.slice(1, 5).join(", ")}
        </p>
      )}

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
