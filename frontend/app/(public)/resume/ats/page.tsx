import { getMarkdownContent } from "@/lib/content";
import { ResumeViewer } from "@/components/ResumeViewer";
import { SyncFooter } from "@/components/SyncFooter";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ResumeAtsPage() {
  const { content, meta } = getMarkdownContent("resume_ats_optimized.md");

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/resume"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary font-mono no-print"
      >
        <MaterialIcon name="arrow_back" className="text-[18px]" />
        Back to resumes
      </Link>
      <ResumeViewer content={content} variant="ats" title="ATS-Optimized Resume" />
      <SyncFooter meta={meta} />
    </div>
  );
}
