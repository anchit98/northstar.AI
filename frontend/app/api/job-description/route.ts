import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const JD_DIR = path.join(process.cwd(), "../inputs/job_descriptions");

function filenameFromTitle(title: string): string | null {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  if (!s || s === "readme") return null;
  return `${s}.md`;
}

export async function POST(request: NextRequest) {
  let body: { title?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content || content.length > 200_000) {
    return NextResponse.json({ error: "content required (max 200k chars)" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  let filename: string;
  if (title) {
    const f = filenameFromTitle(title);
    if (!f) {
      return NextResponse.json({ error: "Invalid title — use letters/numbers" }, { status: 400 });
    }
    filename = f;
  } else {
    filename = `jd-pasted-${stamp}.md`;
  }

  if (!fs.existsSync(JD_DIR)) {
    fs.mkdirSync(JD_DIR, { recursive: true });
  }

  const header = title ? `# ${title}\n\n> Pasted via NorthStar AI · ${new Date().toISOString().slice(0, 10)}\n\n` : `# JD · ${stamp}\n\n`;
  const fullPath = path.join(JD_DIR, filename);
  if (fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "File already exists; choose another title" }, { status: 409 });
  }

  fs.writeFileSync(fullPath, `${header}${content}\n`, "utf8");

  return NextResponse.json({ ok: true, path: `inputs/job_descriptions/${filename}` });
}
