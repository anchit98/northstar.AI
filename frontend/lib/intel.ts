import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compactFeedMarkdown } from "./intelFeedCompact";

const INTEL_DIR = path.join(process.cwd(), "../outputs/intel");
const FEED_DIR = path.join(INTEL_DIR, "feed");
const INPUTS_DIR = path.join(process.cwd(), "../inputs");
const LINKEDIN_STYLE_PATH = path.join(INPUTS_DIR, "linkedin_style.md");

export type SourceResult = {
  id: string;
  name: string;
  ok: boolean;
  count: number;
  error?: string;
};

export type FeedMeta = {
  date: string;
  fetched_at: string;
  sources_healthy: number;
  sources_dead: number;
  item_count: number;
  source_results: SourceResult[];
};

export type FeedDocument = {
  content: string;
  meta: FeedMeta;
};

function parseFeedMeta(data: Record<string, unknown>, date: string): FeedMeta {
  const results = Array.isArray(data.source_results) ? data.source_results : [];
  return {
    date: typeof data.date === "string" ? data.date : date,
    fetched_at: typeof data.fetched_at === "string" ? data.fetched_at : "—",
    sources_healthy: typeof data.sources_healthy === "number" ? data.sources_healthy : 0,
    sources_dead: typeof data.sources_dead === "number" ? data.sources_dead : 0,
    item_count: typeof data.item_count === "number" ? data.item_count : 0,
    source_results: results.map((r) => {
      const row = r as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        name: String(row.name ?? ""),
        ok: Boolean(row.ok),
        count: typeof row.count === "number" ? row.count : 0,
        error: typeof row.error === "string" ? row.error : undefined,
      };
    }),
  };
}

export function listFeedDates(): string[] {
  if (!fs.existsSync(FEED_DIR)) return [];
  return fs
    .readdirSync(FEED_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => f.replace(/\.md$/, ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getFeedByDate(date: string): FeedDocument | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const fullPath = path.join(FEED_DIR, `${date}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { content, meta: parseFeedMeta(data as Record<string, unknown>, date) };
}

export function getLatestFeed(): { date: string; meta: FeedMeta } | null {
  const dates = listFeedDates();
  if (dates.length === 0) return null;
  const date = dates[0];
  const feed = getFeedByDate(date);
  if (!feed) return null;
  return { date, meta: feed.meta };
}

export function getSourcesDocument(): {
  content: string;
  meta: { version?: string; updated?: string };
} {
  const fullPath = path.join(INTEL_DIR, "sources.md");
  if (!fs.existsSync(fullPath)) {
    return { content: "_sources.md not found._", meta: {} };
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  try {
    const { data, content } = matter(raw);
    return {
      content,
      meta: {
        version: typeof data.version === "string" ? data.version : undefined,
        updated: typeof data.updated === "string" ? data.updated : undefined,
      },
    };
  } catch (error) {
    console.error(`Invalid frontmatter in ${fullPath}:`, error);
    const stripped = raw.replace(/^---[\s\S]*?---\s*\n?/, "");
    return { content: stripped || raw, meta: {} };
  }
}

export function sourceHealthById(
  sourceResults: SourceResult[] | undefined
): Map<string, SourceResult> {
  const map = new Map<string, SourceResult>();
  if (!sourceResults) return map;
  for (const r of sourceResults) {
    if (r.id) map.set(r.id, r);
  }
  return map;
}

import {
  filterFeedBySourceNames,
  filterRegistryMarkdown,
  sourceNamesForIds,
  type IntelSourceOption,
} from "./intelFilters";

export type { IntelSourceOption } from "./intelFilters";
export { parseSourceIdsParam, sourceNamesForIds } from "./intelFilters";

/** Filter daily feed markdown to selected registry source ids. */
export function applyFeedSourceFilter(
  content: string,
  sourceIds: string[],
  options: IntelSourceOption[]
): string {
  const names = sourceNamesForIds(sourceIds, options);
  if (names.size === 0) return content;
  return filterFeedBySourceNames(content, names);
}

/** Filter sources.md body to selected registry source ids. */
export function applyRegistrySourceFilter(
  content: string,
  sourceIds: string[],
  options: IntelSourceOption[]
): string {
  const names = sourceNamesForIds(sourceIds, options);
  if (names.size === 0) return content;
  return filterRegistryMarkdown(content, names);
}

export type RegistrySource = {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
};

function slugifySourceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/** Parse outputs/intel/sources.md for filter UI (registry). */
export function listIntelRegistrySources(): RegistrySource[] {
  const fullPath = path.join(INTEL_DIR, "sources.md");
  if (!fs.existsSync(fullPath)) return [];

  let raw = fs.readFileSync(fullPath, "utf8");
  try {
    const parsed = matter(raw);
    raw = parsed.content;
  } catch {
    raw = raw.replace(/^---[\s\S]*?---\s*\n?/, "");
  }

  const sources: RegistrySource[] = [];
  const sections = raw.split(/^## /m).slice(1);

  for (const section of sections) {
    const lines = section.split("\n");
    const category = lines[0]?.trim() ?? "Uncategorized";
    if (category.startsWith("Health log")) continue;

    const blocks = section.split(/^### /m).slice(1);
    for (const block of blocks) {
      const name = block.split("\n")[0]?.trim();
      if (!name) continue;
      const enabledMatch = block.match(/^\s*-\s*\*\*enabled:\*\*\s*(true|false)/im);
      const enabled = enabledMatch ? enabledMatch[1].toLowerCase() === "true" : true;
      sources.push({
        id: slugifySourceName(name),
        name,
        category,
        enabled,
      });
    }
  }

  return sources;
}

/** Merge registry names with latest feed counts for filter labels. */
export function mergeSourceOptions(
  registry: RegistrySource[],
  feedResults: SourceResult[] | undefined
): { id: string; name: string; count?: number; ok?: boolean; enabled?: boolean; category?: string }[] {
  const countById = new Map(feedResults?.map((r) => [r.id, r]) ?? []);
  return registry
    .map((r) => {
      const feed = countById.get(r.id);
      return {
        id: r.id,
        name: r.name,
        category: r.category,
        enabled: r.enabled,
        count: feed?.count,
        ok: feed?.ok,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type LinkedinStyleStatus = {
  exists: boolean;
  status: "template" | "ready" | "unknown";
  samplesFilled: number;
  samplesTarget: number;
  samplesRequired: number;
  voiceNotesFilled: boolean;
  readyForGeneration: boolean;
  sourceFile: string;
};

export function getLinkedinStyleStatus(): LinkedinStyleStatus {
  const fallback: LinkedinStyleStatus = {
    exists: false,
    status: "unknown",
    samplesFilled: 0,
    samplesTarget: 5,
    samplesRequired: 3,
    voiceNotesFilled: false,
    readyForGeneration: false,
    sourceFile: "inputs/linkedin_style.md",
  };

  if (!fs.existsSync(LINKEDIN_STYLE_PATH)) return fallback;

  const raw = fs.readFileSync(LINKEDIN_STYLE_PATH, "utf8");
  let content = raw;
  let status: LinkedinStyleStatus["status"] = "unknown";
  let samplesTarget = 5;
  let samplesRequired = 3;

  try {
    const { data, content: body } = matter(raw);
    content = body;
    if (data.status === "template" || data.status === "ready") status = data.status;
    if (typeof data.samples_target === "number") samplesTarget = data.samples_target;
    if (typeof data.samples_required === "number") samplesRequired = data.samples_required;
  } catch {
    content = raw.replace(/^---[\s\S]*?---\s*\n?/, "");
  }

  const sampleBlocks = content.split(/^## Sample \d+/m).slice(1);
  const filled = sampleBlocks.filter((block) => {
    const text = block.replace(/_Paste post here\._/gi, "").trim();
    return text.length > 80;
  }).length;

  const voiceSection = content.match(/## Voice notes[\s\S]*$/i)?.[0] ?? "";
  const voiceNotesFilled =
    /## Voice notes/i.test(content) &&
    voiceSection.split("\n").filter((l) => l.trim().startsWith("-") && l.trim().length > 3).length >=
      2;

  const readyForGeneration =
    status === "ready" || (filled >= samplesRequired && voiceNotesFilled);

  return {
    exists: true,
    status,
    samplesFilled: filled,
    samplesTarget,
    samplesRequired,
    voiceNotesFilled,
    readyForGeneration,
    sourceFile: "inputs/linkedin_style.md",
  };
}

const POSTS_DIR = path.join(INTEL_DIR, "posts");
const WEEKLY_DIR = path.join(INTEL_DIR, "weekly");

/** ISO week id e.g. 2026-W21 (UTC-based week numbering). */
export function getIsoWeekId(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function formatUtcDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Monday–Sunday (UTC) for an ISO week id. */
export function getIsoWeekDateRange(weekId: string): { start: string; end: string } | null {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);
  if (week < 1 || week > 53) return null;

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { start: formatUtcDate(monday), end: formatUtcDate(sunday) };
}

export function listFeedDatesForWeek(weekId: string): string[] {
  const range = getIsoWeekDateRange(weekId);
  if (!range) return [];
  return listFeedDates().filter((d) => d >= range.start && d <= range.end);
}

export function getFeedMarkdownForWeek(
  weekId: string,
  maxChars = 38_000
): {
  week: string;
  files: string[];
  markdown: string;
  urls: Set<string>;
  itemCount: number;
  weekStart: string;
  weekEnd: string;
} {
  const range = getIsoWeekDateRange(weekId);
  const weekStart = range?.start ?? "";
  const weekEnd = range?.end ?? "";
  const dates = listFeedDatesForWeek(weekId);
  const parts: string[] = [];
  const urls = new Set<string>();
  let itemCount = 0;

  for (const date of dates) {
    const feed = getFeedByDate(date);
    if (!feed) continue;
    itemCount += feed.meta.item_count;
    parts.push(`# Feed ${date}\n\n${feed.content}`);
    Array.from(feed.content.matchAll(/\*\*Link:\*\*\s*(https?:\/\/[^\s]+)/g), (m) =>
      urls.add(m[1].trim())
    );
  }

  const markdown = compactFeedMarkdown(parts.join("\n\n---\n\n"), maxChars);

  return {
    week: weekId,
    files: dates,
    markdown,
    urls,
    itemCount,
    weekStart,
    weekEnd,
  };
}

/** Rolling last N calendar days of feed (alternative to ISO week). */
export function getFeedMarkdownRollingDays(
  days: number,
  maxChars = 30_000
): {
  files: string[];
  markdown: string;
  urls: Set<string>;
  itemCount: number;
} {
  const dates = listFeedDates().slice(0, days);
  const parts: string[] = [];
  const urls = new Set<string>();
  let itemCount = 0;

  for (const date of dates) {
    const feed = getFeedByDate(date);
    if (!feed) continue;
    itemCount += feed.meta.item_count;
    parts.push(`# Feed ${date}\n\n${feed.content}`);
    Array.from(feed.content.matchAll(/\*\*Link:\*\*\s*(https?:\/\/[^\s]+)/g), (m) =>
      urls.add(m[1].trim())
    );
  }

  const markdown = compactFeedMarkdown(parts.join("\n\n---\n\n"), maxChars);

  return { files: dates, markdown, urls, itemCount };
}

export function listIntelWeekIds(): string[] {
  if (!fs.existsSync(WEEKLY_DIR)) return [];
  return fs
    .readdirSync(WEEKLY_DIR)
    .filter((f) => /^\d{4}-W\d{2}\.md$/.test(f))
    .map((f) => f.replace(/\.md$/, ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getIntelWeeklyByWeek(
  weekId: string
): { content: string; week: string; meta: Record<string, unknown> } | null {
  if (!/^\d{4}-W\d{2}$/.test(weekId)) return null;
  const fullPath = path.join(WEEKLY_DIR, `${weekId}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { content, week: weekId, meta: data as Record<string, unknown> };
}

export function readBrandingPositioningSection(maxChars = 3_000): string {
  const brandingPath = path.join(process.cwd(), "../outputs/personal_branding.md");
  if (!fs.existsSync(brandingPath)) return "";
  const raw = fs.readFileSync(brandingPath, "utf8");
  const match = raw.match(/## 1\. Core Positioning Statement[\s\S]*?(?=\n## \d+\.|$)/);
  const section = match?.[0]?.trim() ?? "";
  if (section.length <= maxChars) return section;
  return `${section.slice(0, maxChars)}\n\n_[Positioning truncated]_`;
}

export function listIntelPostDates(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => f.replace(/\.md$/, ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getIntelPostByDate(
  date: string
): { content: string; date: string; meta: Record<string, unknown> } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const fullPath = path.join(POSTS_DIR, `${date}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { content, date, meta: data as Record<string, unknown> };
}

/** Optional Phase C context for post generation (themes only — not required). */
export function readWeeklySynthesisExcerpt(weekId: string, maxChars = 4_000): string {
  const weekly = getIntelWeeklyByWeek(weekId);
  if (!weekly) return "";
  const slice = weekly.content.trim();
  if (slice.length <= maxChars) return slice;
  return `${slice.slice(0, maxChars)}\n\n_[Weekly synthesis truncated]_`;
}

export function getRecentFeedMarkdown(days = 7, maxChars = 55_000): {
  files: string[];
  markdown: string;
  urls: Set<string>;
} {
  const rolling = getFeedMarkdownRollingDays(days, maxChars);
  return { files: rolling.files, markdown: rolling.markdown, urls: rolling.urls };
}

export function readLinkedinStyleRaw(): string {
  if (!fs.existsSync(LINKEDIN_STYLE_PATH)) return "";
  return fs.readFileSync(LINKEDIN_STYLE_PATH, "utf8");
}

/** Samples + voice notes only — keeps Groq requests under context limits. */
export function readLinkedinStyleForPrompt(maxChars = 22_000): string {
  let raw = readLinkedinStyleRaw();
  try {
    const { content } = matter(raw);
    raw = content;
  } catch {
    raw = raw.replace(/^---[\s\S]*?---\s*\n?/, "");
  }
  const start = raw.search(/^## Sample \d/m);
  const slice = start >= 0 ? raw.slice(start) : raw;
  if (slice.length <= maxChars) return slice;
  return `${slice.slice(0, maxChars)}\n\n_[Style samples truncated for API limit]_`;
}

export function readBrandingPillarsSection(): string {
  const brandingPath = path.join(process.cwd(), "../outputs/personal_branding.md");
  if (!fs.existsSync(brandingPath)) return "";
  const raw = fs.readFileSync(brandingPath, "utf8");
  const match = raw.match(/## 3\. Content Pillars[\s\S]*?(?=\n## \d+\.|$)/);
  return match?.[0]?.trim() ?? "";
}

export function formatFetchedAt(iso: string): string {
  if (!iso || iso === "—") return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
