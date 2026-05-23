import "server-only";
import fs from "fs";
import path from "path";

/** Vercel serverless has a read-only filesystem under /var/task. */
export function canPersistIntelOutputs(): boolean {
  if (process.env.VERCEL) return false;
  if (process.env.INTEL_DISABLE_FS_WRITE === "1") return false;
  return true;
}

export function tryWriteIntelFile(
  filePath: string,
  content: string
): { persisted: boolean; path?: string; error?: string } {
  if (!canPersistIntelOutputs()) {
    return {
      persisted: false,
      error: "Read-only filesystem on Vercel — output returned in the UI only. Copy or run locally to save to the repo.",
    };
  }

  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
    return { persisted: true, path: filePath };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { persisted: false, error: message };
  }
}
