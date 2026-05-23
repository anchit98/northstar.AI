"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { splitPostVariants } from "@/lib/intelPostFormat";

type IntelPostViewerProps = {
  content: string;
  date: string;
};

export function IntelPostViewer({ content, date }: IntelPostViewerProps) {
  const variants = splitPostVariants(content);

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
        Drafts — {date}
      </h2>
      <p className="text-xs text-on-surface-variant">
        Copy pastes the post only (no Hook/Body labels, no pillar metadata).
      </p>
      {variants.map((v) => (
        <div
          key={v.title}
          className="bg-surface-raised border border-border-subtle rounded-xl p-6 flex flex-col gap-4"
        >
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-on-surface">{v.title}</h3>
              {v.pillar && (
                <span className="font-mono text-label-sm px-2 py-0.5 rounded border border-outline-variant text-metrics-gold">
                  {v.pillar}
                </span>
              )}
            </div>
            <CopyButton text={v.postText} label="Copy post" variant="workbench" />
          </div>
          <MarkdownRenderer content={v.postText} />
        </div>
      ))}
      <div className="border-t border-outline-variant pt-4">
        <CopyButton
          text={variants.map((v) => v.postText).join("\n\n---\n\n")}
          label="Copy all posts"
          variant="workbench"
        />
      </div>
    </section>
  );
}
