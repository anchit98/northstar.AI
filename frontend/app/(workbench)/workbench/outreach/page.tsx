import { getMarkdownContent } from "@/lib/content";
import { OUTREACH_FILES, type OutreachTab } from "@/lib/constants";
import { OutreachWorkbench } from "@/components/OutreachWorkbench";
import { SyncFooter } from "@/components/SyncFooter";

export default function OutreachPage() {
  const contents = Object.fromEntries(
    (Object.keys(OUTREACH_FILES) as OutreachTab[]).map((tab) => {
      const { content } = getMarkdownContent(OUTREACH_FILES[tab]);
      return [tab, content];
    })
  ) as Record<OutreachTab, string>;

  const meta = getMarkdownContent(OUTREACH_FILES.founders).meta;

  return (
    <div>
      <OutreachWorkbench contents={contents} />
      <SyncFooter meta={{ ...meta, sourceFile: "outreach/*.md" }} />
    </div>
  );
}
