import { getMarkdownContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { SyncFooter } from "@/components/SyncFooter";
import { CopyButton } from "@/components/CopyButton";
import { PrintButton } from "@/components/PrintButton";

export default function InterviewPage() {
  const { content, meta } = getMarkdownContent("interview_positioning.md");

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-2">Interview & compensation</h1>
          <p className="text-body-md text-on-surface-variant">
            STAR stories by competency · negotiation playbook (DEC-6) · print-friendly
          </p>
        </div>
        <div className="flex gap-3">
          <CopyButton text={content} label="Copy all" variant="workbench" />
          <PrintButton />
        </div>
      </div>
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8 print:border-0 print:bg-white print:text-black">
        <MarkdownRenderer content={content} highlightHooks />
      </div>
      <SyncFooter meta={meta} />
    </div>
  );
}
