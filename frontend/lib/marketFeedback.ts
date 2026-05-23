import "server-only";
import { getMarkdownContent, type ContentMeta } from "@/lib/content";

export type OutreachLogRow = {
  date: string;
  channel: string;
  audience: string;
  company: string;
  contact: string;
  touch: string;
  response: string;
  signal: string;
  notes: string;
};

export type OfferRecord = {
  company: string;
  date: string;
  base_lpa: number;
  equity?: string;
  status: string;
  notes?: string;
};

export type LinkedInRollout = {
  week1_headline_skills: boolean;
  week2_about: boolean;
  week3_experience: boolean;
  open_to_work_recruiter_only: boolean;
  share_updates_disabled: boolean;
  stealth_audit_done: boolean;
};

export type MarketMetrics = {
  email_outreach_sent: number;
  email_responses: number;
  linkedin_requests_sent: number;
  linkedin_accepted: number;
  linkedin_replies: number;
  callbacks: number;
  phone_screens: number;
  onsite_rounds: number;
  final_rounds: number;
};

export type PivotTrigger = {
  id: string;
  title: string;
  description: string;
  status: "inactive" | "watch" | "triggered" | "override";
  action: string;
  ecRef?: string;
};

export type MarketFeedbackData = {
  meta: ContentMeta;
  markdown: string;
  status: string;
  deploymentStart: string;
  daysDeployed: number;
  activeVariant: string;
  linkedin: LinkedInRollout;
  metrics: MarketMetrics;
  iterations: {
    phase4_positioning: number;
    phase3_seniority: number;
    comp_tier: number;
  };
  feedbackSignals: {
    too_junior: string[];
    over_reaching: string[];
    positive_fit: string[];
  };
  offers: OfferRecord[];
  pivotOverride: string | null;
  outreachLog: OutreachLogRow[];
  totalOutreach: number;
  totalResponses: number;
  responseRate: number;
  canEvaluatePivot: boolean;
  pivotTriggers: PivotTrigger[];
  audienceSummary: Record<string, { positive: number; negative: number }>;
};

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") return parseInt(v, 10) || fallback;
  return fallback;
}

function bool(v: unknown): boolean {
  return v === true || v === "true";
}

function strArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function parseOffers(v: unknown): OfferRecord[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((o): o is Record<string, unknown> => typeof o === "object" && o !== null)
    .map((o) => ({
      company: String(o.company ?? "—"),
      date: String(o.date ?? "—"),
      base_lpa: num(o.base_lpa),
      equity: o.equity ? String(o.equity) : undefined,
      status: String(o.status ?? "—"),
      notes: o.notes ? String(o.notes) : undefined,
    }));
}

function parseOutreachLog(content: string): OutreachLogRow[] {
  const section = content.match(/## 4\. Outreach Log[\s\S]*?(?=\n## |\n---\n|$)/);
  if (!section) return [];

  const lines = section[0].split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 3) return [];

  const rows: OutreachLogRow[] = [];
  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i]
      .split("|")
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length);
    if (cols.length < 9) continue;
    if (cols[0].startsWith("_") || cols[0].toLowerCase() === "date") continue;

    rows.push({
      date: cols[0],
      channel: cols[1],
      audience: cols[2],
      company: cols[3],
      contact: cols[4],
      touch: cols[5],
      response: cols[6],
      signal: cols[7],
      notes: cols[8],
    });
  }
  return rows;
}

function daysBetween(start: string, end: Date): number {
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return 0;
  return Math.max(0, Math.floor((end.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

function buildAudienceSummary(log: OutreachLogRow[]) {
  const summary: Record<string, { positive: number; negative: number }> = {
    Recruiter: { positive: 0, negative: 0 },
    HM: { positive: 0, negative: 0 },
    Founder: { positive: 0, negative: 0 },
    Referral: { positive: 0, negative: 0 },
    Talent: { positive: 0, negative: 0 },
  };

  for (const row of log) {
    const key = row.audience.trim();
    if (!summary[key]) summary[key] = { positive: 0, negative: 0 };
    const resp = row.response.toLowerCase();
    const sig = row.signal.toLowerCase();
    if (resp === "positive" || resp === "callback" || sig === "strong_fit") {
      summary[key].positive += 1;
    }
    if (resp === "negative" || sig === "too_junior" || sig === "over_reaching" || sig === "role_mismatch") {
      summary[key].negative += 1;
    }
  }
  return summary;
}

function evaluatePivots(params: {
  canEvaluate: boolean;
  totalOutreach: number;
  responseRate: number;
  tooJunior: string[];
  overReaching: string[];
  iterations: MarketFeedbackData["iterations"];
  offers: OfferRecord[];
  compFloor: number;
  pivotOverride: string | null;
}): PivotTrigger[] {
  const { canEvaluate, totalOutreach, responseRate, tooJunior, overReaching, iterations, offers, compFloor, pivotOverride } =
    params;

  const triggers: PivotTrigger[] = [
    {
      id: "low_response",
      title: "Low response rate",
      description: "< 5% responses over ≥ 50 outreach attempts (after EC-6.1 minimum met)",
      status: "inactive",
      action: "Re-enter Phase 4 — keyword & positioning strategy",
      ecRef: "DEC-16",
    },
    {
      id: "too_junior",
      title: "Recurring “too junior” feedback",
      description: "≥ 3 distinct sources reporting seniority gap",
      status: "inactive",
      action: "Re-enter Phase 3 — seniority signaling in bullets",
      ecRef: "EC-6.4",
    },
    {
      id: "over_reaching",
      title: "Recurring “over-reaching” feedback",
      description: "≥ 3 distinct sources — comp or scope misalignment",
      status: "inactive",
      action: "Re-tune DEC-6 compensation tier (floor band)",
      ecRef: "DEC-6",
    },
    {
      id: "below_floor_offers",
      title: "Offers below floor band",
      description: `Offers > 20% below ₹${compFloor}L floor`,
      status: "inactive",
      action: "Negotiate per interview_positioning.md §3 or walk away",
      ecRef: "EC-X.3",
    },
    {
      id: "iteration_fatigue",
      title: "Iteration cap warning",
      description: "Max 2–3 cycles per pivot reason (EC-6.2) — then push volume",
      status: "inactive",
      action: "Stop tweaking · increase outbound",
      ecRef: "EC-6.2",
    },
  ];

  if (pivotOverride) {
    return triggers.map((t) => ({
      ...t,
      status: t.id === "low_response" ? "override" : t.status,
      description: `${t.description} · Override: ${pivotOverride}`,
    }));
  }

  if (!canEvaluate) {
    return triggers.map((t) => ({ ...t, status: "watch" as const }));
  }

  if (totalOutreach >= 50 && responseRate < 5) {
    const t = triggers.find((x) => x.id === "low_response")!;
    t.status = iterations.phase4_positioning >= 3 ? "watch" : "triggered";
  }

  if (tooJunior.length >= 3) {
    const t = triggers.find((x) => x.id === "too_junior")!;
    t.status = iterations.phase3_seniority >= 3 ? "watch" : "triggered";
  }

  if (overReaching.length >= 3) {
    const t = triggers.find((x) => x.id === "over_reaching")!;
    t.status = iterations.comp_tier >= 3 ? "watch" : "triggered";
  }

  const belowFloor = offers.filter((o) => o.base_lpa > 0 && o.base_lpa < compFloor * 0.8);
  if (belowFloor.length > 0) {
    const t = triggers.find((x) => x.id === "below_floor_offers")!;
    t.status = iterations.comp_tier >= 3 ? "watch" : "triggered";
  }

  if (
    iterations.phase4_positioning >= 2 ||
    iterations.phase3_seniority >= 2 ||
    iterations.comp_tier >= 2
  ) {
    const t = triggers.find((x) => x.id === "iteration_fatigue")!;
    t.status = "triggered";
  }

  return triggers;
}

export function getMarketFeedback(): MarketFeedbackData | null {
  const { data, content, meta } = getMarkdownContent("market_feedback.md", "analysis");
  if (content === "Content not found.") return null;

  const linkedinRaw = (data.linkedin ?? {}) as Record<string, unknown>;
  const metricsRaw = (data.metrics ?? {}) as Record<string, unknown>;
  const iterRaw = (data.iterations ?? {}) as Record<string, unknown>;
  const signalsRaw = (data.feedback_signals ?? {}) as Record<string, unknown>;

  const deploymentStart = String(data.deployment_start ?? "2026-05-17");
  const daysDeployed = daysBetween(deploymentStart, new Date());

  const metrics: MarketMetrics = {
    email_outreach_sent: num(metricsRaw.email_outreach_sent),
    email_responses: num(metricsRaw.email_responses),
    linkedin_requests_sent: num(metricsRaw.linkedin_requests_sent),
    linkedin_accepted: num(metricsRaw.linkedin_accepted),
    linkedin_replies: num(metricsRaw.linkedin_replies),
    callbacks: num(metricsRaw.callbacks),
    phone_screens: num(metricsRaw.phone_screens),
    onsite_rounds: num(metricsRaw.onsite_rounds),
    final_rounds: num(metricsRaw.final_rounds),
  };

  const outreachLog = parseOutreachLog(content);
  const logSends = outreachLog.filter((r) => !r.date.startsWith("_")).length;

  const totalOutreach =
    metrics.email_outreach_sent + metrics.linkedin_requests_sent + logSends;
  const totalResponses =
    metrics.email_responses +
    metrics.linkedin_replies +
    outreachLog.filter((r) => ["positive", "callback"].includes(r.response.toLowerCase())).length;

  const responseRate = totalOutreach > 0 ? Math.round((totalResponses / totalOutreach) * 1000) / 10 : 0;
  const canEvaluatePivot = totalOutreach >= 30 && daysDeployed >= 14;

  const tooJunior = [...strArr(signalsRaw.too_junior), ...outreachLog.filter((r) => r.signal.toLowerCase() === "too_junior").map((r) => r.company)].filter(
    (v, i, a) => v && a.indexOf(v) === i
  );
  const overReaching = strArr(signalsRaw.over_reaching);

  const compFloor = num(data.comp_floor_lpa, 25);

  return {
    meta,
    markdown: content,
    status: String(data.status ?? "active"),
    deploymentStart,
    daysDeployed,
    activeVariant: String(data.active_narrative_variant ?? "A"),
    linkedin: {
      week1_headline_skills: bool(linkedinRaw.week1_headline_skills),
      week2_about: bool(linkedinRaw.week2_about),
      week3_experience: bool(linkedinRaw.week3_experience),
      open_to_work_recruiter_only: bool(linkedinRaw.open_to_work_recruiter_only),
      share_updates_disabled: bool(linkedinRaw.share_updates_disabled),
      stealth_audit_done: bool(linkedinRaw.stealth_audit_done),
    },
    metrics,
    iterations: {
      phase4_positioning: num(iterRaw.phase4_positioning),
      phase3_seniority: num(iterRaw.phase3_seniority),
      comp_tier: num(iterRaw.comp_tier),
    },
    feedbackSignals: {
      too_junior: tooJunior,
      over_reaching: overReaching,
      positive_fit: strArr(signalsRaw.positive_fit),
    },
    offers: parseOffers(data.offers),
    pivotOverride: data.pivot_override ? String(data.pivot_override) : null,
    outreachLog: outreachLog.filter((r) => !r.date.startsWith("_")),
    totalOutreach,
    totalResponses,
    responseRate,
    canEvaluatePivot,
    pivotTriggers: evaluatePivots({
      canEvaluate: canEvaluatePivot,
      totalOutreach,
      responseRate,
      tooJunior,
      overReaching,
      iterations: {
        phase4_positioning: num(iterRaw.phase4_positioning),
        phase3_seniority: num(iterRaw.phase3_seniority),
        comp_tier: num(iterRaw.comp_tier),
      },
      offers: parseOffers(data.offers),
      compFloor,
      pivotOverride: data.pivot_override ? String(data.pivot_override) : null,
    }),
    audienceSummary: buildAudienceSummary(outreachLog),
  };
}
