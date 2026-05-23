import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const OUTPUTS_DIR = path.join(process.cwd(), "../outputs");
const ANALYSIS_DIR = path.join(process.cwd(), "../analysis");

export type ContentMeta = {
  version?: string;
  date?: string;
  sourceFile: string;
  baseDir: "outputs" | "analysis";
};

export function getMarkdownContent(
  filePath: string,
  baseDir: "outputs" | "analysis" = "outputs"
) {
  const directory = baseDir === "outputs" ? OUTPUTS_DIR : ANALYSIS_DIR;
  const fullPath = path.join(directory, filePath);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const version = extractVersion(fileContents, data);
    const rawDate = data.date;
    const date =
      typeof rawDate === "string"
        ? rawDate
        : rawDate instanceof Date
          ? rawDate.toISOString().split("T")[0]
          : extractDate(fileContents) || "2026-05-16";
    return {
      data,
      content,
      meta: {
        version,
        date,
        sourceFile: filePath,
        baseDir,
      } satisfies ContentMeta,
    };
  } catch (error) {
    console.error(`Error reading markdown file at ${fullPath}:`, error);
    return {
      data: {},
      content: "Content not found.",
      meta: {
        version: "unknown",
        date: "—",
        sourceFile: filePath,
        baseDir,
      } satisfies ContentMeta,
    };
  }
}

function extractVersion(content: string, data: Record<string, unknown>): string {
  if (typeof data.version === "string") return data.version;
  const match = content.match(/Version:\s*([\d.]+)/i);
  return match?.[1] ?? "1.1";
}

function extractDate(content: string): string | undefined {
  const match = content.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
  return match?.[1];
}

export function getSyncLabel(meta: ContentMeta): string {
  const prefix = meta.baseDir === "outputs" ? "outputs" : "analysis";
  return `Synced from \`${prefix}/${meta.sourceFile}\` v${meta.version}`;
}

export function getArchiveVersions(artifactName: string) {
  const archiveDir = path.join(OUTPUTS_DIR, "archive");
  const versions: { version: string; date: string; content: string }[] = [];

  if (!fs.existsSync(archiveDir)) return versions;

  const versionDirs = fs.readdirSync(archiveDir);

  for (const vDir of versionDirs) {
    const filePath = path.join(archiveDir, vDir, artifactName);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const stat = fs.statSync(filePath);
      versions.push({
        version: vDir,
        date: (data.date as string) || stat.mtime.toISOString().split("T")[0],
        content,
      });
    }
  }

  return versions.sort((a, b) => b.version.localeCompare(a.version));
}
