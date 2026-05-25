import { getMarkdownContent } from "@/lib/content";
import { parseBrandingSections } from "@/lib/brandingSections";
import { BrandingViewer } from "@/components/BrandingViewer";
import { SyncFooter } from "@/components/SyncFooter";

export default function BrandingPage() {
  const { content, meta } = getMarkdownContent("personal_branding.md");
  const sections = parseBrandingSections(content);

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Personal Branding</h1>
        <p className="text-body-lg text-on-surface-variant">
          Positioning, LinkedIn, content pillars, networking, and interview intro scripts — by topic.
        </p>
      </div>
      <div className="min-w-0 w-full max-w-full">
        <BrandingViewer sections={sections} />
      </div>
      <SyncFooter meta={meta} />
    </div>
  );
}
