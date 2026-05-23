export type IntelFeedTab = "intel" | "tech-news";

export const INTEL_FEED_TABS: { id: IntelFeedTab; label: string; description: string }[] = [
  {
    id: "intel",
    label: "PM & AI Intel",
    description: "Newsletters, PM craft, AI labs, builders, India startup",
  },
  {
    id: "tech-news",
    label: "Tech News",
    description: "TechCrunch, Verge, TNW, WIRED, Tech in Asia — AI/PM filtered",
  },
];

export function parseIntelFeedTab(raw: string | undefined): IntelFeedTab {
  return raw === "tech-news" ? "tech-news" : "intel";
}
