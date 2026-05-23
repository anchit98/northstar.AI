import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { IntelSource } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../../..");
export const INTEL_DIR = path.join(REPO_ROOT, "outputs", "intel");
export const SOURCES_PATH = path.join(INTEL_DIR, "sources.md");
export const FEED_DIR = path.join(INTEL_DIR, "feed");

/** Unwrap `[url](url)` from editor auto-linking — RSS fetch needs bare URLs. */
function unwrapFieldUrl(value: string): string {
  const md = value.match(/^\[([^\]]+)\]\([^)]+\)$/);
  return (md ? md[1] : value).trim();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function parseSources(markdown: string): IntelSource[] {
  const sources: IntelSource[] = [];
  const sections = markdown.split(/^## /m).slice(1);

  for (const section of sections) {
    const lines = section.split("\n");
    const category = lines[0]?.trim() ?? "Uncategorized";
    if (category.startsWith("Health log")) continue;

    let sectionContentFilter: IntelSource["contentFilter"];
    for (const line of lines.slice(1)) {
      const filterMatch = line.match(/^\s*-\s*\*\*content_filter:\*\*\s*(\S+)/i);
      if (filterMatch?.[1] === "ai-pm") sectionContentFilter = "ai-pm";
    }

    const blocks = section.split(/^### /m).slice(1);
    for (const block of blocks) {
      const blockLines = block.split("\n");
      const name = blockLines[0]?.trim();
      if (!name) continue;

      let enabled = true;
      let rssUrl = "";
      let note: string | undefined;
      let feedGroup: string | undefined;
      let web: string | undefined;
      let twitter: string | undefined;
      let linkedin: string | undefined;

      for (const line of blockLines.slice(1)) {
        const enabledMatch = line.match(/^\s*-\s*\*\*enabled:\*\*\s*(true|false)/i);
        const rssMatch = line.match(/^\s*-\s*\*\*rss:\*\*\s*(.+)/i);
        const noteMatch = line.match(/^\s*-\s*\*\*note:\*\*\s*(.+)/i);
        const groupMatch = line.match(/^\s*-\s*\*\*feed_group:\*\*\s*(.+)/i);
        const webMatch = line.match(/^\s*-\s*\*\*web:\*\*\s*(.+)/i);
        const twitterMatch = line.match(/^\s*-\s*\*\*twitter:\*\*\s*(.+)/i);
        const linkedinMatch = line.match(/^\s*-\s*\*\*linkedin:\*\*\s*(.+)/i);
        if (enabledMatch) enabled = enabledMatch[1].toLowerCase() === "true";
        if (rssMatch) rssUrl = unwrapFieldUrl(rssMatch[1]);
        if (noteMatch) note = noteMatch[1].trim();
        if (groupMatch) feedGroup = groupMatch[1].trim();
        if (webMatch) web = unwrapFieldUrl(webMatch[1]);
        if (twitterMatch) twitter = unwrapFieldUrl(twitterMatch[1]);
        if (linkedinMatch) linkedin = unwrapFieldUrl(linkedinMatch[1]);
      }

      if (!rssUrl) continue;

      sources.push({
        id: slugify(name),
        name,
        category,
        rssUrl,
        enabled,
        note,
        feedGroup,
        web,
        twitter,
        linkedin,
        contentFilter: sectionContentFilter,
      });
    }
  }

  return sources;
}

export function loadSources(): IntelSource[] {
  const raw = fs.readFileSync(SOURCES_PATH, "utf8");
  return parseSources(raw);
}
