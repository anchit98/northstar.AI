import "server-only";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";

const REPO_ROOT = path.join(process.cwd(), "..");
const OUTPUTS_DIR = path.join(REPO_ROOT, "outputs");
const ARCHIVE_DIR = path.join(OUTPUTS_DIR, "archive");

import type { DiffLayout } from "./versionTypes";
export type { DiffLayout } from "./versionTypes";

export type VersionEntry = {
  versionId: string;
  label: string;
  date: string;
  sha256: string;
  isCurrent: boolean;
  why?: string;
  gatesPassed: string[];
  phase?: string;
};

export type ArtifactManifest = {
  artifactPath: string;
  displayName: string;
  diffLayout: DiffLayout;
  category: "resume" | "linkedin" | "interview" | "branding" | "outreach" | "other";
  current: VersionEntry | null;
  archived: VersionEntry[];
};

export type ArchiveFolderMeta = {
  versionId: string;
  date: string;
  why: string;
  gatesPassed: string[];
  phase?: string;
  artifacts: string[];
};

const DISPLAY_NAMES: Record<string, string> = {
  "resume_ats_optimized.md": "ATS-Optimized Resume",
  "resume_one_page.md": "One-Page Resume",
  "linkedin_rewrite.md": "LinkedIn Rewrite",
  "interview_positioning.md": "Interview Positioning",
  "personal_branding.md": "Personal Branding",
  "pdf_export_guide.md": "PDF Export Guide",
};

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex").slice(0, 12);
}

function extractVersionFromMarkdown(raw: string): { version: string; date: string } {
  const versionMatch = raw.match(/Version:\s*([\d.]+)/i);
  const dateMatch = raw.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
  return {
    version: versionMatch?.[1] ?? "unknown",
    date: dateMatch?.[1] ?? "—",
  };
}

function diffLayoutFor(artifactPath: string): DiffLayout {
  if (artifactPath.startsWith("outreach/")) return "unified";
  if (artifactPath.includes("resume")) return "split";
  return "unified";
}

function categoryFor(artifactPath: string): ArtifactManifest["category"] {
  if (artifactPath.includes("resume")) return "resume";
  if (artifactPath.includes("linkedin")) return "linkedin";
  if (artifactPath.includes("interview")) return "interview";
  if (artifactPath.includes("branding")) return "branding";
  if (artifactPath.startsWith("outreach/")) return "outreach";
  return "other";
}

function displayNameFor(artifactPath: string): string {
  if (DISPLAY_NAMES[artifactPath]) return DISPLAY_NAMES[artifactPath];
  const base = path.basename(artifactPath, ".md").replace(/_/g, " ");
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

function readChangelog(versionDir: string): ArchiveFolderMeta | null {
  const changelogPath = path.join(versionDir, "_changelog.md");
  if (!fs.existsSync(changelogPath)) return null;

  const raw = fs.readFileSync(changelogPath, "utf8");
  const { data, content } = matter(raw);
  const whyMatch = content.match(/## Why\s*\n+([\s\S]*?)(?=\n## |$)/);
  const artifactsMatch = content.match(/## Artifacts archived\s*\n+([\s\S]*?)(?=\n## |$)/);
  const artifacts: string[] = [];
  if (artifactsMatch) {
    for (const line of artifactsMatch[1].split("\n")) {
      const item = line.replace(/^-\s*/, "").trim();
      if (item.endsWith(".md")) artifacts.push(item);
    }
  }

  const rawDate = data.date;
  const dateStr =
    typeof rawDate === "string"
      ? rawDate
      : rawDate instanceof Date
        ? rawDate.toISOString().split("T")[0]
        : "—";

  return {
    versionId: (data.version as string) || path.basename(versionDir),
    date: dateStr,
    why: whyMatch?.[1]?.trim() ?? "",
    gatesPassed: Array.isArray(data.gates_passed)
      ? (data.gates_passed as string[])
      : [],
    phase: data.phase != null ? String(data.phase) : undefined,
    artifacts,
  };
}

function listArchiveVersionDirs(): string[] {
  if (!fs.existsSync(ARCHIVE_DIR)) return [];
  return fs
    .readdirSync(ARCHIVE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => {
      const pa = a.replace(/^v/, "").split(".").map(Number);
      const pb = b.replace(/^v/, "").split(".").map(Number);
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
        if (diff !== 0) return diff;
      }
      return 0;
    });
}

function discoverArtifactPaths(): string[] {
  const paths = new Set<string>();

  if (fs.existsSync(OUTPUTS_DIR)) {
    for (const name of fs.readdirSync(OUTPUTS_DIR)) {
      if (name.endsWith(".md")) paths.add(name);
    }
    const outreachDir = path.join(OUTPUTS_DIR, "outreach");
    if (fs.existsSync(outreachDir)) {
      for (const name of fs.readdirSync(outreachDir)) {
        if (name.endsWith(".md")) paths.add(`outreach/${name}`);
      }
    }
  }

  for (const vDir of listArchiveVersionDirs()) {
    const folder = path.join(ARCHIVE_DIR, vDir);
    walkMdFiles(folder, "", (rel) => {
      if (rel !== "_changelog.md") paths.add(rel.replace(/\\/g, "/"));
    });
  }

  return Array.from(paths).sort();
}

function walkMdFiles(
  dir: string,
  prefix: string,
  onFile: (relativePath: string) => void
): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMdFiles(full, rel, onFile);
    } else if (entry.name.endsWith(".md")) {
      onFile(rel);
    }
  }
}

function resolveArtifactFile(artifactPath: string, versionId: "current" | string): string | null {
  if (versionId === "current") {
    const currentPath = path.join(OUTPUTS_DIR, artifactPath);
    return fs.existsSync(currentPath) ? currentPath : null;
  }
  const archivedPath = path.join(ARCHIVE_DIR, versionId, artifactPath);
  return fs.existsSync(archivedPath) ? archivedPath : null;
}

export function getArchiveFolderMetas(): ArchiveFolderMeta[] {
  return listArchiveVersionDirs()
    .map((vDir) => readChangelog(path.join(ARCHIVE_DIR, vDir)))
    .filter((m): m is ArchiveFolderMeta => m !== null);
}

export function getVersionManifest(): ArtifactManifest[] {
  const artifactPaths = discoverArtifactPaths();
  const archiveDirs = listArchiveVersionDirs();
  const folderMetas = new Map<string, ArchiveFolderMeta>();
  for (const vDir of archiveDirs) {
    const meta = readChangelog(path.join(ARCHIVE_DIR, vDir));
    if (meta) folderMetas.set(vDir, meta);
  }

  return artifactPaths.map((artifactPath) => {
    const currentFile = resolveArtifactFile(artifactPath, "current");
    let current: VersionEntry | null = null;

    if (currentFile) {
      const raw = fs.readFileSync(currentFile, "utf8");
      const { version, date } = extractVersionFromMarkdown(raw);
      current = {
        versionId: "current",
        label: `v${version} (current)`,
        date,
        sha256: sha256(raw),
        isCurrent: true,
        gatesPassed: [],
      };
    }

    const archived: VersionEntry[] = [];
    for (const vDir of archiveDirs) {
      const filePath = path.join(ARCHIVE_DIR, vDir, artifactPath);
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, "utf8");
      const meta = folderMetas.get(vDir);
      const { date } = extractVersionFromMarkdown(raw);
      archived.push({
        versionId: vDir,
        label: vDir,
        date: meta?.date ?? date,
        sha256: sha256(raw),
        isCurrent: false,
        why: meta?.why,
        gatesPassed: meta?.gatesPassed ?? [],
        phase: meta?.phase,
      });
    }

    return {
      artifactPath,
      displayName: displayNameFor(artifactPath),
      diffLayout: diffLayoutFor(artifactPath),
      category: categoryFor(artifactPath),
      current,
      archived,
    };
  });
}

export function readArtifactAtVersion(
  artifactPath: string,
  versionId: string
): string | null {
  const filePath = resolveArtifactFile(
    artifactPath,
    versionId === "current" ? "current" : versionId
  );
  if (!filePath) return null;
  return fs.readFileSync(filePath, "utf8");
}

/** All version ids available for an artifact (current + archived, newest archived first). */
export function getVersionOptionsForArtifact(manifest: ArtifactManifest): VersionEntry[] {
  const list: VersionEntry[] = [];
  if (manifest.current) list.push(manifest.current);
  list.push(...manifest.archived);
  return list;
}

/** Preload text for compare UI — only paths that exist. */
export function buildArtifactContentMap(
  artifactPath: string,
  versionIds: string[]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const id of versionIds) {
    const text = readArtifactAtVersion(artifactPath, id);
    if (text != null) map[id] = text;
  }
  return map;
}

export function getRecentArchiveEvents(limit = 5): {
  versionId: string;
  date: string;
  why: string;
  gatesPassed: string[];
}[] {
  return getArchiveFolderMetas()
    .slice(0, limit)
    .map((m) => ({
      versionId: m.versionId,
      date: m.date,
      why: m.why,
      gatesPassed: m.gatesPassed,
    }));
}
