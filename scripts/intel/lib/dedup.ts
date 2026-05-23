import fs from "fs";
import path from "path";
import type { FeedItem } from "./types.js";

const PLACEHOLDER_SUMMARY = "_No description in feed._";
const MIN_SUMMARY_CHARS_FOR_CONTENT_DEDUP = 80;
const DEFAULT_LOOKBACK_DAYS = 14;

export type FeedDedupIndex = {
  links: Set<string>;
  sourceTitles: Set<string>;
  sourceContent: Set<string>;
};

export function createDedupIndex(): FeedDedupIndex {
  return {
    links: new Set(),
    sourceTitles: new Set(),
    sourceContent: new Set(),
  };
}

/** Normalize URL for comparison (must match fetch.ts). */
export function normalizeLink(url: string): string {
  try {
    const u = new URL(url);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
      (k) => u.searchParams.delete(k)
    );
    u.hash = "";
    return u.toString();
  } catch {
    return url.trim();
  }
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s@#/-]/g, "")
    .trim();
}

function normalizeSummaryBody(summary: string): string {
  return summary
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
}

function sourceTitleKey(sourceKey: string, title: string): string {
  return `${sourceKey}::${normalizeTitle(title)}`;
}

function sourceContentKey(sourceKey: string, summary: string): string | null {
  const body = normalizeSummaryBody(summary);
  if (body.length < MIN_SUMMARY_CHARS_FOR_CONTENT_DEDUP) return null;
  if (body === PLACEHOLDER_SUMMARY.toLowerCase()) return null;
  return `${sourceKey}::${body}`;
}

export function registerFeedItem(index: FeedDedupIndex, item: FeedItem): void {
  const sourceKey = item.sourceId || item.sourceName;
  index.links.add(normalizeLink(item.link));
  index.sourceTitles.add(sourceTitleKey(sourceKey, item.title));
  const contentKey = sourceContentKey(sourceKey, item.summary);
  if (contentKey) index.sourceContent.add(contentKey);
}

export function isDuplicateFeedItem(index: FeedDedupIndex, item: FeedItem): boolean {
  const sourceKey = item.sourceId || item.sourceName;
  if (index.links.has(normalizeLink(item.link))) return true;
  if (index.sourceTitles.has(sourceTitleKey(sourceKey, item.title))) return true;
  const contentKey = sourceContentKey(sourceKey, item.summary);
  if (contentKey && index.sourceContent.has(contentKey)) return true;
  return false;
}

type ParsedFeedEntry = {
  title: string;
  sourceName: string;
  link: string;
  summary: string;
};

/** Parse a daily feed markdown file into entries for dedup indexing. */
export function parseFeedFileEntries(markdown: string): ParsedFeedEntry[] {
  const entries: ParsedFeedEntry[] = [];
  const body = markdown.replace(/^---[\s\S]*?---\n*/m, "");

  for (const block of body.split(/\n---\n/)) {
    const titleMatch = block.match(/^#{3,4}\s+(.+)$/m);
    const sourceMatch = block.match(/^- \*\*Source:\*\*\s+(.+)$/m);
    const linkMatch = block.match(/^- \*\*Link:\*\*\s+(.+)$/m);
    if (!titleMatch || !sourceMatch || !linkMatch) continue;

    const linkLine = linkMatch.index! + linkMatch[0].length;
    const afterMeta = block.slice(linkLine);
    const summary = afterMeta
      .replace(/^\s*\n+/, "")
      .replace(/\n+---\s*$/m, "")
      .trim();

    entries.push({
      title: titleMatch[1].trim(),
      sourceName: sourceMatch[1].trim(),
      link: linkMatch[1].trim(),
      summary: summary || PLACEHOLDER_SUMMARY,
    });
  }

  return entries;
}

function registerParsedEntry(index: FeedDedupIndex, entry: ParsedFeedEntry): void {
  const sourceKey = entry.sourceName;
  index.links.add(normalizeLink(entry.link));
  index.sourceTitles.add(sourceTitleKey(sourceKey, entry.title));
  const contentKey = sourceContentKey(sourceKey, entry.summary);
  if (contentKey) index.sourceContent.add(contentKey);
}

/**
 * Load fingerprints from prior daily feed files (before `beforeDate`).
 * Skips re-showing items already captured on a previous day.
 */
export function loadPriorDedupIndex(
  feedDir: string,
  beforeDate: string,
  lookbackDays = DEFAULT_LOOKBACK_DAYS
): FeedDedupIndex {
  const index = createDedupIndex();
  if (!fs.existsSync(feedDir)) return index;

  const cutoff = new Date(`${beforeDate}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - lookbackDays);

  const files = fs
    .readdirSync(feedDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((d) => d < beforeDate && new Date(`${d}T00:00:00Z`) >= cutoff)
    .sort();

  for (const date of files) {
    const filePath = path.join(feedDir, `${date}.md`);
    try {
      const md = fs.readFileSync(filePath, "utf8");
      for (const entry of parseFeedFileEntries(md)) {
        registerParsedEntry(index, entry);
      }
    } catch {
      // ignore unreadable prior files
    }
  }

  return index;
}
