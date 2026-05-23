/**
 * Phase 12 — Daily RSS fetch (NO LLM — DEC-25)
 * Usage: npm run intel:fetch [-- --date=YYYY-MM-DD]
 */
import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import { FEED_DIR, loadSources } from "./lib/sources.js";
import { matchesAiPmContent } from "./lib/filter.js";
import { buildFeedMarkdown, normalizeSummary } from "./lib/markdown.js";
import type { FeedItem, FeedManifest, SourceFetchResult } from "./lib/types.js";

const parser = new Parser({
  timeout: 20000,
  headers: { "User-Agent": "NorthStarAI-Intel-Fetch/1.0 (personal RSS reader)" },
});

const MAX_AGE_HOURS = 48;

function parseArgs(): { date: string } {
  const arg = process.argv.find((a) => a.startsWith("--date"));
  if (arg) {
    const d = arg.split("=")[1];
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) return { date: d };
  }
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const day = String(ist.getDate()).padStart(2, "0");
  return { date: `${y}-${m}-${day}` };
}

function normalizeUrl(url: string): string {
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

function itemDate(item: { isoDate?: string; pubDate?: string }): Date | null {
  const raw = item.isoDate ?? item.pubDate;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function withinWindow(d: Date, cutoff: Date): boolean {
  return d >= cutoff;
}

async function fetchSource(
  source: ReturnType<typeof loadSources>[0]
): Promise<SourceFetchResult> {
  try {
    const feed = await parser.parseURL(source.rssUrl);
    const cutoff = new Date(Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000);
    const items: FeedItem[] = [];

    for (const entry of feed.items ?? []) {
      const link = entry.link ?? entry.guid;
      if (!entry.title) continue;
      const pub = itemDate(entry);
      if (pub && !withinWindow(pub, cutoff)) continue;

      const summary = normalizeSummary(
        entry.contentSnippet ?? entry.summary ?? entry.content
      );
      if (source.contentFilter === "ai-pm") {
        if (!matchesAiPmContent(entry.title.trim(), summary)) continue;
      }

      if (!link) continue;

      items.push({
        title: entry.title.trim(),
        link: normalizeUrl(link),
        published: pub ? pub.toISOString() : "unknown",
        summary,
        sourceId: source.id,
        sourceName: source.name,
        category: source.category,
        feedGroup: source.feedGroup,
      });
    }

    return { source, ok: true, items };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { source, ok: false, error: message, items: [] };
  }
}

async function main() {
  const { date } = parseArgs();
  const sources = loadSources().filter((s) => s.enabled);

  if (!fs.existsSync(FEED_DIR)) fs.mkdirSync(FEED_DIR, { recursive: true });

  console.log(`[intel:fetch] ${date} — ${sources.length} enabled sources (no LLM)`);

  const results: SourceFetchResult[] = [];
  for (const source of sources) {
    const result = await fetchSource(source);
    results.push(result);
    const status = result.ok ? `ok (${result.items.length})` : `FAIL: ${result.error}`;
    console.log(`  • ${source.name}: ${status}`);
  }

  const seen = new Set<string>();
  const allItems: FeedItem[] = [];
  for (const r of results) {
    for (const item of r.items) {
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      allItems.push(item);
    }
  }

  allItems.sort((a, b) => {
    const ta = a.published === "unknown" ? 0 : new Date(a.published).getTime();
    const tb = b.published === "unknown" ? 0 : new Date(b.published).getTime();
    return tb - ta;
  });

  const itemsByCategory = new Map<string, FeedItem[]>();
  for (const item of allItems) {
    const list = itemsByCategory.get(item.category) ?? [];
    list.push(item);
    itemsByCategory.set(item.category, list);
  }

  const healthy = results.filter((r) => r.ok).length;
  const dead = results.filter((r) => !r.ok).length;

  const manifest: FeedManifest = {
    date,
    fetched_at: new Date().toISOString(),
    sources_healthy: healthy,
    sources_dead: dead,
    item_count: allItems.length,
    source_results: results.map((r) => ({
      id: r.source.id,
      name: r.source.name,
      ok: r.ok,
      error: r.error,
      count: r.items.length,
    })),
  };

  const outPath = path.join(FEED_DIR, `${date}.md`);
  fs.writeFileSync(outPath, buildFeedMarkdown(manifest, itemsByCategory), "utf8");
  console.log(`\nWrote ${outPath} (${allItems.length} items, ${healthy} healthy / ${dead} dead)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
