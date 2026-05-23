import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { groqChatWithFallback, getConfiguredGroqModel } from "@/lib/groq";
import {
  applyModelToGeneratedDoc,
  intelCitationWarnings,
  resolveFeedContext,
  todayIsoWeekIst,
  type FeedInputMode,
} from "@/lib/intelGenerate";
import { readBrandingPositioningSection } from "@/lib/intel";
import { tryWriteIntelFile } from "@/lib/intelPersist";

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

  const feedContext = resolveFeedContext({
    mode,
    weekId,
    maxFeedChars: mode === "rolling-7" ? 28_000 : 38_000,
  });

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
Configured Groq model: ${getConfiguredGroqModel()}

--- personal_branding.md (positioning) ---
${positioning}

--- feed items (compact summaries) ---
${feedContext.markdown}

--- prompt spec ---
${promptSpec.slice(0, 4000)}

Produce YAML frontmatter (week, generated_at, feed_days_included, model placeholder, item_count, week_start, week_end) then the five sections.`;

  try {
    const {
      content: generated,
      model: modelUsed,
      retriedWithShrink,
      usedFallbackModel,
    } = await groqChatWithFallback(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { model: getConfiguredGroqModel(), maxTokens: 5000 }
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
    const outPath = path.join(WEEKLY_DIR, `${weekId}.md`);
    const writeResult = tryWriteIntelFile(outPath, doc);

    const warnings = intelCitationWarnings(generated, feedContext.urls, {
      notInFeedLabel: "URL not in week feed files",
    });

    if (usedFallbackModel) {
      warnings.unshift(
        `Used fallback model ${modelUsed} after context limits — set GROQ_MODEL on Vercel to your preferred model (${getConfiguredGroqModel()}).`
      );
    } else if (retriedWithShrink) {
      warnings.unshift("Feed context was shrunk and retried on your configured model.");
    }

    return NextResponse.json({
      ok: true,
      path: writeResult.persisted ? `outputs/intel/weekly/${weekId}.md` : undefined,
      week: weekId,
      feedDays: feedContext.files.length,
      model: modelUsed,
      configuredModel: getConfiguredGroqModel(),
      persisted: writeResult.persisted,
      storageNote: writeResult.error,
      content: doc,
      warnings,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        error: message,
        configuredModel: getConfiguredGroqModel(),
        hint: "If token/context errors persist, try rolling-7 with fewer feed days or set GROQ_MODEL in Vercel env.",
      },
      { status: 502 }
    );
  }
}
