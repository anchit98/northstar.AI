import type { PhaseTimelineEntry, QualityGateEntry } from "@/lib/phaseTimeline";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

const STATUS_ICON: Record<string, { icon: string; className: string }> = {
  complete: { icon: "check_circle", className: "text-success-green" },
  in_progress: { icon: "pending", className: "text-metrics-gold" },
  pending: { icon: "radio_button_unchecked", className: "text-on-surface-variant" },
};

type PhaseTimelineProps = {
  phases: PhaseTimelineEntry[];
  gates: QualityGateEntry[];
};

export function PhaseTimeline({ phases, gates }: PhaseTimelineProps) {
  const pipelinePhases = phases.filter((p) => p.phase <= 11);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-headline-md font-semibold text-on-surface mb-1">Pipeline phases</h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Parsed from <code className="text-primary">docs/architecture.md</code> activity checkboxes at build time
          (EC-7.2).
        </p>
        <div className="overflow-x-auto pb-2">
          <ol className="flex gap-2 min-w-max">
            {pipelinePhases.map((p) => {
              const st = STATUS_ICON[p.status];
              return (
                <li
                  key={p.phase}
                  className={cn(
                    "flex flex-col items-center gap-2 w-24 shrink-0 p-3 rounded-xl border",
                    p.status === "complete"
                      ? "border-success-green/25 bg-success-green/5"
                      : p.status === "in_progress"
                        ? "border-metrics-gold/25 bg-metrics-gold/5"
                        : "border-border-subtle bg-surface-container"
                  )}
                  title={`${p.completed}/${p.total} activities`}
                >
                  <MaterialIcon name={st.icon} className={cn("text-[22px]", st.className)} />
                  <span className="font-mono text-label-sm text-on-surface">P{p.phase}</span>
                  <span className="text-[10px] text-center text-on-surface-variant leading-tight line-clamp-2">
                    {p.title.split("(")[0].trim()}
                  </span>
                  {p.qualityGate && (
                    <span className="font-mono text-[10px] text-primary">{p.qualityGate}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section>
        <h3 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
          Quality gates (G1–G10)
        </h3>
        <div className="flex flex-wrap gap-2">
          {gates.map((g) => {
            const st = STATUS_ICON[g.status];
            return (
              <span
                key={g.id}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-label-sm font-mono",
                  g.status === "complete"
                    ? "border-success-green/30 bg-success-green/10 text-success-green"
                    : g.status === "in_progress"
                      ? "border-metrics-gold/30 bg-metrics-gold/10 text-metrics-gold"
                      : "border-outline-variant bg-surface-container text-on-surface-variant"
                )}
                title={`Phase ${g.phase}`}
              >
                <MaterialIcon name={st.icon} className={cn("text-[16px]", st.className)} />
                {g.id}
              </span>
            );
          })}
        </div>
      </section>
    </div>
  );
}
