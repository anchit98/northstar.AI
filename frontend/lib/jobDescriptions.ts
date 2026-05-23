import "server-only";
import fs from "fs";
import path from "path";

const JD_DIR = path.join(process.cwd(), "../inputs/job_descriptions");

const EXCLUDED = new Set(["readme.md", "readme", "template.md"]);

export function listJobDescriptionFiles(): string[] {
  if (!fs.existsSync(JD_DIR)) return [];
  return fs
    .readdirSync(JD_DIR)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .filter((f) => !EXCLUDED.has(f.toLowerCase()))
    .sort();
}

export function countJobDescriptionFiles(): number {
  return listJobDescriptionFiles().length;
}
