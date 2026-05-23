import type { FeedItem, FeedManifest } from "./types.js";

function escapeYamlString(value: string): string {
  if (/[:#\n]/.test(value)) return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  return value;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSummary(raw: string | undefined): string {
  if (!raw) return "_No description in feed._";
  const text = stripHtml(raw);
  return text.length > 1200 ? `${text.slice(0, 1197)}...` : text;
}

export function buildFeedMarkdown(
  manifest: FeedManifest,
  itemsByCategory: Map<string, FeedItem[]>
): string {
  const lines: string[] = [
    "---",
    `date: ${manifest.date}`,
    `fetched_at: ${escapeYamlString(manifest.fetched_at)}`,
    `sources_healthy: ${manifest.sources_healthy}`,
    `sources_dead: ${manifest.sources_dead}`,
    `item_count: ${manifest.item_count}`,
    "source_results:",
    ...manifest.source_results.map(
      (r) =>
        `  - id: ${r.id}\n    name: ${escapeYamlString(r.name)}\n    ok: ${r.ok}\n    count: ${r.count}${r.error ? `\n    error: ${escapeYamlString(r.error)}` : ""}`
    ),
    "---",
    "",
    `# PM & AI feed — ${manifest.date}`,
    "",
    "> Raw RSS items only. No LLM summarization (DEC-25).",
    "",
  ];

  for (const [category, items] of itemsByCategory) {
    if (items.length === 0) continue;
    lines.push(`## ${category}`, "");
    if (category === "Tech News") {
      lines.push(
        "> AI, product, and startup-related headlines only (`content_filter: ai-pm`).",
        ""
      );
    }

    const byGroup = new Map<string | undefined, FeedItem[]>();
    for (const item of items) {
      const key = item.feedGroup;
      const list = byGroup.get(key) ?? [];
      list.push(item);
      byGroup.set(key, list);
    }

    const groupOrder = [...byGroup.keys()].sort((a, b) => {
      if (!a) return 1;
      if (!b) return -1;
      return a.localeCompare(b);
    });

    for (const group of groupOrder) {
      const groupItems = byGroup.get(group) ?? [];
      if (group) {
        lines.push(`### ${group}`, "");
      }
      for (const item of groupItems) {
        const heading = group ? `#### ${item.title}` : `### ${item.title}`;
        lines.push(
          heading,
          "",
          `- **Source:** ${item.sourceName}`,
          `- **Published:** ${item.published}`,
          `- **Link:** ${item.link}`,
          "",
          item.summary,
          "",
          "---",
          ""
        );
      }
    }
  }

  if (manifest.item_count === 0) {
    lines.push("_No new items in the last 48 hours from enabled sources._", "");
  }

  return lines.join("\n");
}
