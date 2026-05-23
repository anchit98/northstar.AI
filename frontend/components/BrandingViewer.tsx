"use client";

import { useMemo, useState } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { parseBrandingSections } from "@/lib/brandingSections";
import { cn } from "@/lib/utils";

type BrandingViewerProps = {
  content: string;
};

function extractIntroScript(markdown: string): string | null {
  const match = markdown.match(/```(?:text)?\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? null;
}

function IntroductionsPanel({ content }: { content: string }) {
  const { preamble, blocks } = useMemo(() => {
    const body = content.replace(/^##[^\n]+\n+/, "");
    const parts = body.split(/^### /m);
    const pre = parts[0]?.trim() ?? "";
    const variants = parts.slice(1).map((block) => {
      const nl = block.indexOf("\n");
      const title = nl === -1 ? block.trim() : block.slice(0, nl).trim();
      const variantBody = nl === -1 ? "" : block.slice(nl + 1).trim();
      const script = extractIntroScript(variantBody);
      return { title, body: `### ${title}\n\n${variantBody}`, script };
    });
    return { preamble: pre, blocks: variants };
  }, [content]);

  return (
    <div className="flex flex-col gap-8">
      {preamble ? <MarkdownRenderer content={preamble} /> : null}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {blocks.map((b) => (
          <article
            key={b.title}
            className="bg-surface-raised border border-border-subtle rounded-xl p-6 flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-headline-md font-semibold text-on-surface">{b.title}</h3>
              {b.script && <CopyButton text={b.script} label="Copy script" />}
            </div>
            <MarkdownRenderer content={b.body} />
          </article>
        ))}
      </div>
    </div>
  );
}

export function BrandingViewer({ content }: BrandingViewerProps) {
  const sections = useMemo(() => parseBrandingSections(content), [content]);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "overview");

  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  if (!active) {
    return <MarkdownRenderer content={content} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex border-b border-outline-variant overflow-x-auto no-print gap-1"
        role="tablist"
        aria-label="Branding topics"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={activeId === s.id}
            onClick={() => setActiveId(s.id)}
            className={cn(
              "px-4 sm:px-6 py-3 font-mono text-label-md whitespace-nowrap transition-colors shrink-0",
              activeId === s.id
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="min-h-[12rem]">
        {active.id === "interview-introductions" ? (
          <IntroductionsPanel content={active.content} />
        ) : (
          <MarkdownRenderer content={active.content} />
        )}
      </div>
    </div>
  );
}
