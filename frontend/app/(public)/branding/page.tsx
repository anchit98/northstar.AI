import { getMarkdownContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { SyncFooter } from "@/components/SyncFooter";

export default function BrandingPage() {
  const { content, meta } = getMarkdownContent("personal_branding.md");

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Personal Branding</h1>
        <p className="text-body-lg text-on-surface-variant">
          Content pillars, LinkedIn optimization, and networking strategy — public-safe per content contract.
        </p>
      </div>
      <MarkdownRenderer content={content} />
      <SyncFooter meta={meta} />
    </div>
  );
}
