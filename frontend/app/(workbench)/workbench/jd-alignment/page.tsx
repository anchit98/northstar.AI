import Link from "next/link";
import { getMarkdownContent } from "@/lib/content";
import { countJobDescriptionFiles, listJobDescriptionFiles } from "@/lib/jobDescriptions";
import { SyncFooter } from "@/components/SyncFooter";
import { JdPasteForm } from "@/components/JdPasteForm";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function JdAlignmentPage() {
  const files = listJobDescriptionFiles();
  const count = countJobDescriptionFiles();
  const synthesis = getMarkdownContent("jd_corpus_synthesis.md", "analysis");
  const status = typeof synthesis.data.status === "string" ? synthesis.data.status : "—";

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">JD alignment (Phase 11)</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Collect a <strong className="text-on-surface">corpus of ~20 PM job descriptions</strong>, extract recurring
          keywords, map them to verified experience, then refresh resumes (DEC-9, DEC-4). Single-JD paste below is for
          ongoing additions; full corpus analysis lives in{" "}
          <code className="text-primary">analysis/jd_corpus_synthesis.md</code>.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase">JD files</p>
          <p className="text-metric-display font-extrabold text-metrics-gold">{count}</p>
          <p className="text-sm text-on-surface-variant">Target: 20 · see inputs/job_descriptions/</p>
        </div>
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase">Synthesis status</p>
          <p className="text-xl font-semibold text-on-surface capitalize mt-2">{status}</p>
        </div>
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 flex flex-col justify-center">
          <Link
            href="/resume/ats"
            className="inline-flex items-center gap-2 text-primary font-mono text-label-md hover:underline"
          >
            View ATS resume <MaterialIcon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>
      </section>

      <section className="bg-surface-raised border border-border-subtle rounded-xl p-6">
        <h2 className="text-headline-md font-semibold mb-4 flex items-center gap-2">
          <MaterialIcon name="folder_open" className="text-primary" />
          Corpus files
        </h2>
        {files.length === 0 ? (
          <p className="text-on-surface-variant text-sm">
            No JD markdown files yet. Add <code className="text-primary">jd-01.md</code> …{" "}
            <code className="text-primary">jd-20.md</code> under{" "}
            <code className="text-primary">inputs/job_descriptions/</code> or use the form below.
          </p>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm text-on-surface-variant font-mono">
            {files.map((f) => (
              <li key={f}>
                <code className="text-primary">inputs/job_descriptions/{f}</code>
              </li>
            ))}
          </ul>
        )}
      </section>

      <JdPasteForm />

      <section className="border-t border-outline-variant pt-8">
        <h2 className="text-headline-md font-semibold mb-4">Synthesis artifact</h2>
        <div className="bg-surface-default border border-border-subtle rounded-xl p-6 max-h-[480px] overflow-y-auto">
          <MarkdownRenderer content={synthesis.content} />
        </div>
      </section>

      <div className="rounded-xl border border-dashed border-metrics-gold/40 bg-metrics-gold/5 p-4 text-sm text-on-surface-variant">
        <strong className="text-metrics-gold">Next step after 20 JDs are in:</strong> run the prompt in{" "}
        <code className="text-primary">prompts/jd_corpus_analysis.md</code>, fill{" "}
        <code className="text-primary">analysis/jd_corpus_synthesis.md</code>, then update{" "}
        <code className="text-primary">outputs/resume_ats_optimized.md</code> and{" "}
        <code className="text-primary">outputs/resume_one_page.md</code> and archive prior versions (DEC-11).
      </div>

      <SyncFooter meta={synthesis.meta} />
    </div>
  );
}
