import "server-only";
import {
  getFeedMarkdownForWeek,
  getFeedMarkdownRollingDays,
  getIsoWeekId,
} from "@/lib/intel";

export type FeedInputMode = "iso-week" | "rolling-7";

export type ResolvedFeedContext = {
  weekId: string;
  mode: FeedInputMode;
  files: string[];
  markdown: string;
  urls: Set<string>;
  itemCount: number;
  rangeStart: string;
  rangeEnd: string;
};

export function getIstNow(): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

export function todayIsoDateIst(): string {
  const ist = getIstNow();
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const d = String(ist.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIsoWeekIst(): string {
  return getIsoWeekId(getIstNow());
}

export function resolveFeedContext(options: {
  mode: FeedInputMode;
  weekId: string;
  rollingDays?: number;
}): ResolvedFeedContext {
  const { mode, weekId } = options;
  const rollingDays = Math.min(14, Math.max(1, options.rollingDays ?? 7));

  if (mode === "rolling-7") {
    const rolling = getFeedMarkdownRollingDays(rollingDays);
    return {
      weekId,
      mode,
      files: rolling.files,
      markdown: rolling.markdown,
      urls: rolling.urls,
      itemCount: rolling.itemCount,
      rangeStart: rolling.files[rolling.files.length - 1] ?? "",
      rangeEnd: rolling.files[0] ?? "",
    };
  }

  const week = getFeedMarkdownForWeek(weekId);
  return {
    weekId,
    mode,
    files: week.files,
    markdown: week.markdown,
    urls: week.urls,
    itemCount: week.itemCount,
    rangeStart: week.weekStart,
    rangeEnd: week.weekEnd,
  };
}

export function extractUrlsFromText(text: string): string[] {
  return Array.from(text.matchAll(/https?:\/\/[^\s)>\]]+/g), (m) => m[0]);
}

export function intelCitationWarnings(
  output: string,
  allowedUrls: Set<string>,
  options?: {
    skipUrlPatterns?: RegExp[];
    notInFeedLabel?: string;
  }
): string[] {
  const skip = options?.skipUrlPatterns ?? [];
  const label = options?.notInFeedLabel ?? "URL not in feed files";
  const warnings: string[] = [];

  for (const url of extractUrlsFromText(output)) {
    if (skip.some((re) => re.test(url))) continue;
    if (url.includes("personal_branding")) continue;

    const inFeed = Array.from(allowedUrls).some((f) => {
      try {
        const host = new URL(f).hostname;
        return url.includes(f) || f.includes(url) || url.includes(host);
      } catch {
        return url.includes(f) || f.includes(url);
      }
    });

    if (!inFeed) {
      warnings.push(`${label}: ${url}`);
    }
  }

  return warnings.slice(0, 10);
}

/** Ensure server-written frontmatter uses the actual Groq model id. */
export function applyModelToGeneratedDoc(
  generated: string,
  model: string,
  fallbackDoc: string
): string {
  const bodyTrimmed = generated.trim();
  if (!bodyTrimmed.startsWith("---") || !bodyTrimmed.includes("generated_at")) {
    return fallbackDoc;
  }

  return bodyTrimmed.replace(/^---\n([\s\S]*?)\n---/, (fm) => {
    if (/^model:/m.test(fm)) {
      return fm.replace(/^model:.*/m, `model: ${model}`);
    }
    const block = fm.slice(4, -4).trimEnd();
    return `---\n${block}\nmodel: ${model}\n---`;
  });
}
