import type { IntelFeedTab } from "./intelFeedTabs";

export type IntelSourceOption = {
  id: string;
  name: string;
  count?: number;
  ok?: boolean;
  enabled?: boolean;
  category?: string;
};

const TECH_NEWS_CATEGORY = "Tech News";

export function parseSourceIdsParam(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildSourcesQueryParam(ids: string[]): string | undefined {
  if (ids.length === 0) return undefined;
  return ids.join(",");
}

export function sourceNamesForIds(
  ids: string[],
  options: IntelSourceOption[]
): Set<string> {
  const byId = new Map(options.map((o) => [o.id, o.name]));
  const names = new Set<string>();
  for (const id of ids) {
    const name = byId.get(id);
    if (name) names.add(name);
  }
  return names;
}

export function filterOptionsForTab(
  options: IntelSourceOption[],
  tab: IntelFeedTab
): IntelSourceOption[] {
  if (tab === "tech-news") {
    return options.filter((o) => o.category === TECH_NEWS_CATEGORY);
  }
  return options.filter((o) => o.category !== TECH_NEWS_CATEGORY);
}

/** Filter daily feed markdown to selected sources (by display name on **Source:** line). */
export function filterFeedBySourceNames(content: string, names: Set<string>): string {
  if (names.size === 0) return content;

  const parts = content.split(/\n---\n/);
  const kept: string[] = [];

  for (const part of parts) {
    const match = part.match(/- \*\*Source:\*\*\s*(.+)/);
    if (!match) {
      kept.push(part);
      continue;
    }
    if (names.has(match[1].trim())) kept.push(part);
  }

  let result = kept.join("\n---\n");
  result = stripEmptySections(result);
  if (!result.trim()) {
    return "_No items match the selected sources for this date/tab. Clear the filter or pick other sources._";
  }
  return result;
}

function stripEmptySections(content: string): string {
  const chunks = content.split(/^## /m);
  if (chunks.length <= 1) return content;

  const preamble = chunks[0]?.trim() ?? "";
  const sections = chunks.slice(1).map((block) => {
    const nl = block.indexOf("\n");
    const heading = nl === -1 ? block.trim() : block.slice(0, nl).trim();
    const body = nl === -1 ? "" : block.slice(nl + 1);
    const hasItem = /- \*\*Source:\*\*/.test(body);
    return { heading, body, hasItem };
  });

  const nonEmpty = sections.filter((s) => s.hasItem);
  if (nonEmpty.length === 0) return preamble;

  const body = nonEmpty.map((s) => `## ${s.heading}\n${s.body}`.trimEnd()).join("\n\n");
  return preamble ? `${preamble}\n\n${body}` : body;
}

/** Filter sources.md body to selected ### source blocks. */
export function filterRegistryMarkdown(content: string, names: Set<string>): string {
  if (names.size === 0) return content;

  const chunks = content.split(/^### /m);
  const intro = chunks[0] ?? "";
  const kept = chunks.slice(1).filter((block) => {
    const name = block.split("\n")[0]?.trim();
    return name && names.has(name);
  });

  if (kept.length === 0) {
    return "_No sources match the current filter. Clear the filter to see the full registry._";
  }

  return intro + kept.map((c) => `### ${c}`).join("");
}
