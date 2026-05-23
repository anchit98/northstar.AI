/**
 * Move intel feed/weekly/posts files older than N days to outputs/intel/_archive/
 * Usage: npm run intel:archive [-- --days=90] [-- --dry-run]
 */
import fs from "fs";
import path from "path";
import { INTEL_DIR } from "./lib/sources.js";

const ARCHIVE_ROOT = path.join(INTEL_DIR, "_archive");

const SUBDIRS = ["feed", "weekly", "posts"] as const;

function parseArgs(): { days: number; dryRun: boolean } {
  let days = 90;
  let dryRun = false;
  for (const arg of process.argv.slice(2)) {
    if (arg === "--dry-run") dryRun = true;
    const m = arg.match(/^--days=(\d+)$/);
    if (m) days = Number(m[1]);
  }
  return { days, dryRun };
}

function fileAgeDays(filePath: string): number {
  const stat = fs.statSync(filePath);
  return (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24);
}

function archiveDir(
  sub: (typeof SUBDIRS)[number],
  days: number,
  dryRun: boolean
): number {
  const srcDir = path.join(INTEL_DIR, sub);
  if (!fs.existsSync(srcDir)) return 0;

  const destDir = path.join(ARCHIVE_ROOT, sub);
  if (!dryRun && !fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  let moved = 0;
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith(".md") || name === "README.md") continue;
    const full = path.join(srcDir, name);
    if (!fs.statSync(full).isFile()) continue;
    if (fileAgeDays(full) < days) continue;

    const dest = path.join(destDir, name);
    if (dryRun) {
      console.log(`[dry-run] would move ${sub}/${name} → _archive/${sub}/`);
    } else {
      fs.renameSync(full, dest);
      console.log(`Archived ${sub}/${name}`);
    }
    moved++;
  }
  return moved;
}

function main() {
  const { days, dryRun } = parseArgs();
  console.log(`[intel:archive] files older than ${days} days${dryRun ? " (dry-run)" : ""}`);

  let total = 0;
  for (const sub of SUBDIRS) {
    total += archiveDir(sub, days, dryRun);
  }

  console.log(total === 0 ? "Nothing to archive." : `Done. ${total} file(s) processed.`);
}

main();
