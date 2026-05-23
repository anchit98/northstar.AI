import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { groqChatWithFallback } from "@/lib/groq";
import { isWorkbenchAuthorized } from "@/lib/intelAuth";
import {
  applyModelToGeneratedDoc,
  resolveFeedContext,
  todayIsoDateIst,
  todayIsoWeekIst,
  type FeedInputMode,
} from "@/lib/intelGenerate";
import {
  getLinkedinStyleStatus,
  readBrandingPillarsSection,
  readLinkedinStyleForPrompt,
  readWeeklySynthesisExcerpt,
} from "@/lib/intel";
import { INTEL_CONTENT_PILLARS, parsePillarFilter } from "@/lib/intelPillars";

const POSTS_DIR = path.join(process.cwd(), "../outputs/intel/posts");
const PROMPT_PATH = path.join(process.cwd(), "../prompts/intel_post.md");
const VARIANT_COUNT = 2;

export async function POST(request: NextRequest) {
  if (!isWorkbenchAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const styleStatus = getLinkedinStyleStatus();
  if (!styleStatus.readyForGeneration) {
    return NextResponse.json(
      {
        error:
          "linkedin_style.md not ready — paste at least 3 samples and voice notes, set status: ready",
      },
      { status: 400 }
    );
  }

  let body: {
    pillar?: string;
    mode?: FeedInputMode;
    week?: string;
    rollingDays?: number;
    includeWeekly?: boolean;
  };
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
  const pillarFilter = parsePillarFilter(body.pillar);
  const rollingDays =
    typeof body.rollingDays === "number" ? Math.min(14, Math.max(1, body.rollingDays)) : 7;
  const includeWeekly = body.includeWeekly !== false;

  const feedContext = resolveFeedContext({ mode, weekId, rollingDays });

  if (feedContext.files.length === 0) {
    return NextResponse.json(
      {
        error:
          mode === "iso-week"
            ? `No feed files for ISO week ${weekId}. Run intel:fetch or try rolling-7 mode.`
            : "No feed files available. Run npm run intel:fetch from repo root.",
      },
      { status: 400 }
    );
  }

  const styleRaw = readLinkedinStyleForPrompt();
  const pillars = readBrandingPillarsSection();
  const weeklyExcerpt = includeWeekly ? readWeeklySynthesisExcerpt(weekId) : "";
  const promptSpec = fs.existsSync(PROMPT_PATH) ? fs.readFileSync(PROMPT_PATH, "utf8") : "";
  const selected = INTEL_CONTENT_PILLARS.find((p) => p.id === pillarFilter)!;
  const pillarList = INTEL_CONTENT_PILLARS.map(
    (p) => `- ${p.id}: ${p.title} — ${p.description}`
  ).join("\n");

  const system = `You write ready-to-paste LinkedIn posts for an early-career AI-native Product Manager in India (NOT a Business Analyst).
Audience: Series B founders, product leaders, recruiters, hiring managers, TAs, aspiring PMs, PM peers.
Follow prompts/intel_post.md. Output valid markdown only — no preamble.
Metrics and portfolio proof are OPTIONAL — use only when natural; never invent numbers.
Do NOT use Hook:/Body:/CTA:/Hashtags:/Sources cited: labels.
Each variant is one flowing post matching linkedin_style.md.
Do NOT add citation link lists. Refer to news by name only when needed.
Generate exactly ${VARIANT_COUNT} variants for ONE pillar only: ${pillarFilter} (${selected.title}).
Every variant MUST end with <!-- meta: ${pillarFilter} --> on its own line.`;

  const user = `Date (IST): ${todayIsoDateIst()}
Selected pillar (only this one): ${pillarFilter} — ${selected.title}
${selected.description}

ISO week: ${weekId}
Feed input mode: ${mode}
Feed range: ${feedContext.rangeStart} – ${feedContext.rangeEnd}
Feed files (${feedContext.files.length}): ${feedContext.files.join(", ")}
Style source: linkedin_style

All pillars (reference — do not write for other pillars):
${pillarList}

--- personal_branding.md §3 ---
${pillars}

--- linkedin_style.md (samples + voice notes) ---
${styleRaw}

--- intel feed items ---
${feedContext.markdown}

${
  weeklyExcerpt
    ? `--- optional weekly synthesis (themes only — no link lists) ---\n${weeklyExcerpt}\n`
    : ""
}

--- prompt spec ---
${promptSpec.slice(0, 4000)}

Produce YAML frontmatter then ${VARIANT_COUNT} variants for ${pillarFilter} only.
Each variant: ## Variant N — short title, full post, then <!-- meta: ${pillarFilter} -->.
No labeled fields. No source URL lists.`;

  try {
    const { content: generated, model: modelUsed } = await groqChatWithFallback(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { maxTokens: 5000 }
    );

    const date = todayIsoDateIst();
    const generatedAt = new Date().toISOString();
    const styleSource =
      styleStatus.samplesFilled >= 3 ? "linkedin_style" : "personal_branding_fallback";

    const fallbackDoc = `---
date: ${date}
generated_at: "${generatedAt}"
model: ${modelUsed}
feed_days_included: ${feedContext.files.length}
item_count: ${feedContext.itemCount}
week: ${weekId}
week_start: ${feedContext.rangeStart}
week_end: ${feedContext.rangeEnd}
mode: ${mode}
pillar_filter: ${pillarFilter}
style_source: ${styleSource}
samples_used: ${styleStatus.samplesFilled}
weekly_context_included: ${weeklyExcerpt.length > 0}
---

# LinkedIn post ideas — ${date}

> Generated on-demand (DEC-25, DEC-26). Review before posting. No auto-publish.

${generated.trim()}
`;

    const doc = applyModelToGeneratedDoc(generated, modelUsed, fallbackDoc);

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    const outPath = path.join(POSTS_DIR, `${date}.md`);
    fs.writeFileSync(outPath, doc, "utf8");

    return NextResponse.json({
      ok: true,
      path: `outputs/intel/posts/${date}.md`,
      date,
      week: weekId,
      feedDays: feedContext.files.length,
      weeklyContextUsed: weeklyExcerpt.length > 0,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
