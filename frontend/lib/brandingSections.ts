/** Split personal_branding.md body into ## sections for tabbed UI. */

export type BrandingSection = {
  id: string;
  label: string;
  content: string;
};

const LABEL_OVERRIDES: Record<string, string> = {
  "1. core positioning statement": "Positioning",
  "2. linkedin profile optimization": "LinkedIn",
  "3. content pillars (for linkedin posting)": "Content pillars",
  "4. networking strategy (pre-phase 5)": "Networking",
  "5. interview introductions": "Introductions",
};

function slugifyHeading(heading: string): string {
  const base = heading
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "section";
}

function labelForHeading(heading: string): string {
  const key = heading.replace(/^\d+\.\s*/, "").toLowerCase().trim();
  const numbered = heading.toLowerCase().trim();
  return (
    LABEL_OVERRIDES[numbered] ??
    LABEL_OVERRIDES[key] ??
    heading.replace(/^\d+\.\s*/, "").trim()
  );
}

export function parseBrandingSections(markdown: string): BrandingSection[] {
  const chunks = markdown.split(/^## /m);
  const intro = chunks[0]?.trim() ?? "";

  const sections: BrandingSection[] = [];

  if (intro) {
    sections.push({
      id: "overview",
      label: "Overview",
      content: intro,
    });
  }

  for (const block of chunks.slice(1)) {
    const nl = block.indexOf("\n");
    const heading = nl === -1 ? block.trim() : block.slice(0, nl).trim();
    const body = nl === -1 ? "" : block.slice(nl + 1).trim();
    sections.push({
      id: slugifyHeading(heading),
      label: labelForHeading(heading),
      content: `## ${heading}\n\n${body}`.trim(),
    });
  }

  return sections;
}
