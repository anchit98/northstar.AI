import "server-only";
import fs from "fs";
import path from "path";

export type PhaseStatus = "complete" | "in_progress" | "pending";

export type PhaseTimelineEntry = {
  phase: number;
  title: string;
  status: PhaseStatus;
  completed: number;
  total: number;
  qualityGate?: string;
};

export type QualityGateEntry = {
  id: string;
  label: string;
  phase: number;
  status: PhaseStatus;
};

const ARCHITECTURE_PATH = path.join(process.cwd(), "../docs/architecture.md");

const GATE_BY_PHASE: Record<number, string> = {
  1: "G1",
  2: "G2",
  3: "G3",
  4: "G4",
  5: "G5",
  7: "G6",
  8: "G7",
  9: "G8",
  11: "G10",
  12: "G11",
};

function phaseStatus(completed: number, total: number): PhaseStatus {
  if (total === 0) return "pending";
  if (completed >= total) return "complete";
  if (completed > 0) return "in_progress";
  return "pending";
}

function parsePhaseSection(body: string): { completed: number; total: number } {
  const activities = body.match(/^- \[[ x]\]/gm) ?? [];
  const total = activities.length;
  const completed = activities.filter((line) => line.includes("[x]")).length;
  return { completed, total };
}

export function getPhaseTimeline(): {
  phases: PhaseTimelineEntry[];
  gates: QualityGateEntry[];
  parsedAt: string;
} {
  let content = "";
  try {
    content = fs.readFileSync(ARCHITECTURE_PATH, "utf8");
  } catch {
    return { phases: [], gates: [], parsedAt: new Date().toISOString() };
  }

  const phases: PhaseTimelineEntry[] = [];
  const phaseHeader = /^### Phase (\d+):([^\n]+)/gm;
  const sections: { num: number; title: string; start: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = phaseHeader.exec(content)) !== null) {
    sections.push({
      num: parseInt(match[1], 10),
      title: match[2].trim(),
      start: match.index,
    });
  }

  for (let i = 0; i < sections.length; i++) {
    const { num, title, start } = sections[i];
    const end = i + 1 < sections.length ? sections[i + 1].start : content.length;
    const body = content.slice(start, end);
    const { completed, total } = parsePhaseSection(body);
    phases.push({
      phase: num,
      title,
      status: phaseStatus(completed, total),
      completed,
      total,
      qualityGate: GATE_BY_PHASE[num],
    });
  }

  const gates: QualityGateEntry[] = phases
    .filter((p) => p.qualityGate)
    .map((p) => ({
      id: p.qualityGate!,
      label: p.qualityGate!,
      phase: p.phase,
      status: p.status,
    }));

  return {
    phases,
    gates,
    parsedAt: new Date().toISOString(),
  };
}
