import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { groqChatWithFallback } from "@/lib/groq";
import {
  applyModelToGeneratedDoc,
  intelCitationWarnings,
  resolveFeedContext,
  todayIsoWeekIst,
  type FeedInputMode,
} from "@/lib/intelGenerate";
import { readBrandingPositioningSection } from "@/lib/intel";

const WEEKLY_DIR = path.join(process.cwd(), "../outputs/intel/weekly");
const PROMPT_PATH = path.join(process.cwd(), "../prompts/intel_weekly.md");

export async function POST(request: NextRequest) {
  let body: { week?: string; mode?: FeedInputMode };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const mode: FeedInputMode = body.mode === "rolling-7" ? "rolling-7" : "iso-week";
  const weekId =
    typeof body.week === "string" && /^\d{4}-W\d{2}$/.test(body.week)
      ? body.week
      : todayIsoWeekIst();

  const feedContext = resolveFeedContext({ mode, weekId });

  if (feedContext.files.length === 0) {
    return NextResponse.json(
      {
        error:
          mode === "iso-week"
            ? `No feed files for ISO week ${weekId}. Run intel:fetch or try rolling-7 mode.`
            : "No feed files in the last 7 days. Run npm run intel:fetch from repo root.",
      },
      { status: 400 }
    );
  }

  const positioning = readBrandingPositioningSection();
  const promptSpec = fs.existsSync(PROMPT_PATH) ? fs.readFileSync(PROMPT_PATH, "utf8") : "";

  const system = `You synthesize weekly PM/AI intel briefings from RSS feed files only.
Follow prompts/intel_weekly.md exactly. Output valid markdown only — no preamble.
Never invent metrics or news. Every external claim must link to a URL from the feed context.
Use the five required sections in order.`;

  const user = `ISO week label: ${weekId}
Mode: ${mode}
Week range: ${feedContext.rangeStart} – ${feedContext.rangeEnd}
Feed files (${feedContext.files.length}): ${feedContext.files.join(", ")}
Approximate item count: ${feedContext.itemCount}

--- personal_branding.md (positioning) ---
${positioning}

--- feed items ---
${feedContext.markdown}

--- prompt spec ---
${promptSpec.slice(0, 4000)}

Produce YAML frontmatter (week, generated_at, feed_days_included, model placeholder, item_count, week_start, week_end) then the five sections.`;

  try {
    const { content: generated, model: modelUsed } = await groqChatWithFallback(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { maxTokens: 5000 }
    );

    const generatedAt = new Date().toISOString();
    const fallbackDoc = `---
week: ${weekId}
generated_at: "${generatedAt}"
feed_days_included: ${feedContext.files.length}
model: ${modelUsed}
item_count: ${feedContext.itemCount}
week_start: ${feedContext.rangeStart}
week_end: ${feedContext.rangeEnd}
mode: ${mode}
---

# Weekly synthesis — ${weekId}

> Generated on-demand (DEC-25). Review citations before sharing.

${generated.trim()}
`;

    const doc = applyModelToGeneratedDoc(generated, modelUsed, fallbackDoc);

    if (!fs.existsSync(WEEKLY_DIR)) fs.mkdirSync(WEEKLY_DIR, { recursive: true });
    const outPath = path.join(WEEKLY_DIR, `${weekId}.md`);
    fs.writeFileSync(outPath, doc, "utf8");

    const warnings = intelCitationWarnings(generated, feedContext.urls, {
      notInFeedLabel: "URL not in week feed files",
    });

    return NextResponse.json({
      ok: true,
      path: `outputs/intel/weekly/${weekId}.md`,
      week: weekId,
      feedDays: feedContext.files.length,
      warnings,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
