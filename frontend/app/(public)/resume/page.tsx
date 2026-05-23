import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const VARIANTS = [
  {
    href: "/resume/ats",
    title: "ATS-Optimized Resume",
    description:
      "Keyword-dense format for job portals and recruiter ATS systems. Maximizes parse rate and Jobscan alignment.",
    badge: "Job applications",
    icon: "description",
  },
  {
    href: "/resume/one-page",
    title: "One-Page PM Resume",
    description:
      "Premium one-page layout for founders, hiring managers, and warm intros. Projects-first narrative.",
    badge: "Founders & HMs",
    icon: "article",
  },
];

export default function ResumeHubPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Resumes</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Two variants from the same canonical bullet set (DEC-9). Choose based on channel — never mix messaging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VARIANTS.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="group bg-surface-raised border border-border-subtle rounded-xl p-8 flex flex-col gap-6 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                <MaterialIcon name={v.icon} />
              </div>
              <span className="font-mono text-label-sm text-metrics-gold uppercase tracking-wider border border-dashed border-metrics-gold/50 px-2 py-1 rounded-full">
                {v.badge}
              </span>
            </div>
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface group-hover:text-primary transition-colors mb-2">
                {v.title}
              </h2>
              <p className="text-body-md text-on-surface-variant">{v.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-primary font-mono text-label-md mt-auto">
              Open viewer
              <MaterialIcon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

      <p className="font-mono text-label-sm text-on-surface-variant">
        Synced from <code className="text-primary">outputs/resume_*.md</code> v1.1 · PDF export per{" "}
        <code className="text-primary">outputs/pdf_export_guide.md</code>
      </p>
    </div>
  );
}
