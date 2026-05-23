/** Canonical pillar IDs — must match prompts/intel_post.md and personal_branding.md §3 */

export const INTEL_CONTENT_PILLARS = [
  {
    id: "pillar-1" as const,
    title: 'Pillar 1: Industry Takes (PM & AI)',
    short: "Industry takes",
    description: "React to news and trends; sharp POV for founders and product leaders.",
  },
  {
    id: "pillar-2" as const,
    title: 'Pillar 2: AI-Native PM Craft (The "How-To")',
    short: "AI-native craft",
    description: "How you build with AI — RAG, agents, MCP, Cursor; builder credibility.",
  },
  {
    id: "pillar-3" as const,
    title: 'Pillar 3: Product Ops & Delivery (The "Impact")',
    short: "Product ops & delivery",
    description: "Intake, adoption, internal tools, cross-functional delivery at scale.",
  },
  {
    id: "pillar-4" as const,
    title: "Pillar 4: PM Journey (Not Just a BA)",
    short: "PM journey",
    description: "Early-career PM voice; BA→PM path; fellowship, teardowns, lessons for aspiring PMs.",
  },
] as const;

export type IntelPillarId = (typeof INTEL_CONTENT_PILLARS)[number]["id"];

export const INTEL_PILLAR_IDS: IntelPillarId[] = INTEL_CONTENT_PILLARS.map((p) => p.id);

export function isIntelPillarId(value: unknown): value is IntelPillarId {
  return typeof value === "string" && (INTEL_PILLAR_IDS as string[]).includes(value);
}

/** User always picks one pillar per generation run (no forced rotation). */
export function parsePillarFilter(value: unknown): IntelPillarId {
  return isIntelPillarId(value) ? value : "pillar-1";
}
