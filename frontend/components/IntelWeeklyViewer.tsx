"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";

type IntelWeeklyViewerProps = {
  content: string;
  week: string;
};

export function IntelWeeklyViewer({ content, week }: IntelWeeklyViewerProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
          Weekly briefing — {week}
        </h2>
        <CopyButton text={content} label="Copy briefing" variant="workbench" />
      </div>
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
        <MarkdownRenderer content={content} />
      </div>
    </section>
  );
}
