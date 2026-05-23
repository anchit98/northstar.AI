import { getMarkdownContent } from "@/lib/content";
import { PositioningVariants } from "@/components/PositioningVariants";
import { SyncFooter } from "@/components/SyncFooter";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function PositioningPage() {
  const { content, meta } = getMarkdownContent("positioning_strategy.md", "analysis");

  return (
    <div className="flex flex-col gap-10">
      <PositioningVariants />
      <section className="border-t border-outline-variant pt-8">
        <h2 className="text-headline-md font-semibold text-on-surface mb-4">Full strategy document</h2>
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8">
          <MarkdownRenderer content={content} />
        </div>
      </section>
      <SyncFooter meta={meta} />
    </div>
  );
}
