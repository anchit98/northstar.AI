"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { RESUME_PDFS } from "@/lib/constants";

type ResumeViewerProps = {
  content: string;
  variant: "ats" | "one-page";
  title: string;
};

export function ResumeViewer({ content, variant, title }: ResumeViewerProps) {
  const pdfPath = variant === "ats" ? RESUME_PDFS.ats : RESUME_PDFS.onePage;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">{title}</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Print-friendly view · source matches markdown exactly
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={pdfPath}
            download
            className="inline-flex items-center gap-2 rounded-full bg-primary-container text-on-primary-container px-4 py-2 font-mono text-label-md hover:opacity-90 transition-opacity"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Download PDF
          </a>
          <CopyButton text={content} label="Copy as text" />
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-raised text-on-surface px-4 py-2 font-mono text-label-md hover:bg-surface-container-high transition-colors"
          >
            <MaterialIcon name="print" className="text-[18px]" />
            Print
          </button>
        </div>
      </div>

      <article className="bg-white text-black rounded-xl border border-outline-variant p-4 sm:p-8 md:p-12 print:border-0 print:p-0 print:rounded-none shadow-sm overflow-x-auto">
        <MarkdownRenderer content={content} className="prose-resume" />
      </article>
    </div>
  );
}
