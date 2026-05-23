import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { SyncFooter } from "@/components/SyncFooter";
import { LinkedInLimitsBanner } from "@/components/LinkedInLimitsBanner";
import type { MarketFeedbackData, PivotTrigger } from "@/lib/marketFeedback";
import { cn } from "@/lib/utils";

function MetricCard({
  label,
  value,
  sub,
  gold,
}: {
  label: string;
  value: string | number;
  sub?: string;
  gold?: boolean;
}) {
  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 flex flex-col gap-1">
      <span className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
      <span className={cn("type-metric-responsive leading-none", gold ? "text-metrics-gold" : "text-on-surface")}>
        {value}
      </span>
      {sub && <span className="text-sm text-on-surface-variant">{sub}</span>}
    </div>
  );
}

function PivotStatusBadge({ status }: { status: PivotTrigger["status"] }) {
  const styles = {
    inactive: "bg-surface-container text-on-surface-variant border-outline-variant",
    watch: "bg-metrics-gold/10 text-metrics-gold border-metrics-gold/30",
    triggered: "bg-error-container/20 text-error border-error/40",
    override: "bg-private-workbench/15 text-private-workbench border-private-workbench/30",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full font-mono text-label-sm border uppercase", styles[status])}>
      {status}
    </span>
  );
}

const DEPLOYMENT_STEPS: {
  key: keyof MarketFeedbackData["linkedin"];
  label: string;
  week?: string;
}[] = [
  { key: "stealth_audit_done", label: "Stealth visibility audit (EC-6.5)" },
  { key: "share_updates_disabled", label: "â€œShare profile updatesâ€ disabled" },
  { key: "week1_headline_skills", label: "Week 1: Headline + Skills", week: "1" },
  { key: "week2_about", label: "Week 2: About section", week: "2" },
  { key: "week3_experience", label: "Week 3: Experience", week: "3" },
  { key: "open_to_work_recruiter_only", label: "Open to Work â€” recruiters only (EC-X.5)" },
];

export function MarketFeedbackDashboard({ data }: { data: MarketFeedbackData }) {
  const linkedinDone = Object.values(data.linkedin).filter(Boolean).length;
  const sampleProgress = Math.min(100, Math.round((data.totalOutreach / 30) * 50 + (data.daysDeployed / 14) * 50));

  return (
    <div className="flex flex-col gap-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-2">Market feedback</h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Phase 6 deployment tracker (DEC-15). Edit{" "}
            <code className="text-primary">analysis/market_feedback.md</code> â€” rebuild refreshes dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-private-workbench/10 text-private-workbench font-mono text-label-sm border border-private-workbench/25">
            Variant {data.activeVariant}
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-label-sm border border-border-subtle capitalize">
            {data.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {!data.canEvaluatePivot && (
        <div className="flex gap-3 items-start bg-metrics-gold/5 border border-dashed border-metrics-gold/40 rounded-xl p-4" role="status">
          <MaterialIcon name="hourglass_empty" className="text-metrics-gold shrink-0" />
          <div>
            <p className="font-mono text-label-md text-metrics-gold uppercase tracking-wider mb-1">EC-6.1 â€” Hold pivots</p>
            <p className="text-sm text-on-surface-variant">
              Need â‰¥ 30 outreach attempts <strong className="text-on-surface">and</strong> â‰¥ 14 days deployed before pivot
              triggers activate. Progress: {data.totalOutreach}/30 sends Â· {data.daysDeployed}/14 days (~{sampleProgress}%).
            </p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total outreach" value={data.totalOutreach} sub="email + LinkedIn + log rows" />
        <MetricCard label="Response rate" value={`${data.responseRate}%`} sub={`${data.totalResponses} responses`} gold />
        <MetricCard label="Days deployed" value={data.daysDeployed} sub={`since ${data.deploymentStart}`} />
        <MetricCard label="Callbacks" value={data.metrics.callbacks} sub={`${data.metrics.phone_screens} phone screens`} />
      </section>

      <LinkedInLimitsBanner />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
          <h2 className="text-headline-md font-semibold text-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon name="rocket_launch" className="text-primary" />
            LinkedIn rollout (DEC-7)
          </h2>
          <p className="text-sm text-on-surface-variant mb-4">
            {linkedinDone}/{DEPLOYMENT_STEPS.length} steps marked done in frontmatter Â·{" "}
            <Link href="/workbench/interview" className="text-primary hover:underline">
              interview prep
            </Link>
          </p>
          <ul className="space-y-2">
            {DEPLOYMENT_STEPS.map((step) => (
              <li key={step.key} className="flex items-center gap-3 text-sm">
                <MaterialIcon
                  name={data.linkedin[step.key] ? "check_circle" : "radio_button_unchecked"}
                  className={data.linkedin[step.key] ? "text-success-green" : "text-outline-variant"}
                />
                <span className={data.linkedin[step.key] ? "text-on-surface" : "text-on-surface-variant"}>
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-mono text-on-surface-variant">
            Toggle <code className="text-primary">linkedin.*</code> booleans in market_feedback.md
          </p>
        </div>

        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
          <h2 className="text-headline-md font-semibold text-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon name="track_changes" className="text-metrics-gold" />
            Pivot triggers (DEC-16)
          </h2>
          <ul className="space-y-4">
            {data.pivotTriggers.map((t) => (
              <li key={t.id} className="border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-on-surface">{t.title}</span>
                  <PivotStatusBadge status={t.status} />
                </div>
                <p className="text-sm text-on-surface-variant mb-1">{t.description}</p>
                <p className="text-sm text-primary font-mono">{t.action}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {data.offers.length > 0 && (
        <section className="bg-surface-raised border border-border-subtle rounded-xl p-6">
          <h2 className="text-headline-md font-semibold mb-4">Offers (EC-X.3)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-left font-mono text-label-sm text-on-surface-variant uppercase">
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Base (LPA)</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.offers.map((o, i) => (
                  <tr key={i} className="border-b border-border-subtle">
                    <td className="py-2 pr-4 text-on-surface">{o.company}</td>
                    <td className="py-2 pr-4 text-metrics-gold font-semibold">â‚¹{o.base_lpa}L</td>
                    <td className="py-2 pr-4">{o.status}</td>
                    <td className="py-2 text-on-surface-variant">{o.notes ?? "â€”"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="bg-surface-raised border border-border-subtle rounded-xl p-6">
        <h2 className="text-headline-md font-semibold mb-4">Audience signals (EC-6.4)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(data.audienceSummary).map(([audience, counts]) => (
            <div key={audience} className="border border-border-subtle rounded-lg p-3 text-center">
              <p className="font-mono text-label-sm text-on-surface-variant uppercase mb-2">{audience}</p>
              <p className="text-success-green text-sm">+{counts.positive}</p>
              <p className="text-error text-sm">âˆ’{counts.negative}</p>
            </div>
          ))}
        </div>
      </section>

      {data.outreachLog.length > 0 ? (
        <section className="bg-surface-raised border border-border-subtle rounded-xl p-6 overflow-x-auto">
          <h2 className="text-headline-md font-semibold mb-4">Outreach log</h2>
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant font-mono text-label-sm text-on-surface-variant uppercase text-left">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2 pr-3">Audience</th>
                <th className="py-2 pr-3">Company</th>
                <th className="py-2 pr-3">Touch</th>
                <th className="py-2 pr-3">Response</th>
                <th className="py-2 pr-3">Signal</th>
              </tr>
            </thead>
            <tbody>
              {data.outreachLog.map((row, i) => (
                <tr key={i} className="border-b border-border-subtle">
                  <td className="py-2 pr-3 font-mono text-label-sm">{row.date}</td>
                  <td className="py-2 pr-3">{row.channel}</td>
                  <td className="py-2 pr-3">{row.audience}</td>
                  <td className="py-2 pr-3">{row.company}</td>
                  <td className="py-2 pr-3">{row.touch}</td>
                  <td className="py-2 pr-3">{row.response}</td>
                  <td className="py-2 pr-3">
                    {row.signal !== "neutral" && row.signal !== "â€”" ? (
                      <span className="hook-highlight">{row.signal}</span>
                    ) : (
                      row.signal
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <p className="text-sm text-on-surface-variant font-mono">
          No log rows yet â€” add entries to Â§4 Outreach Log table in market_feedback.md
        </p>
      )}

      <section className="border-t border-outline-variant pt-8">
        <h2 className="text-headline-md font-semibold mb-4">Full artifact</h2>
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8 max-h-[480px] overflow-y-auto">
          <MarkdownRenderer content={data.markdown} highlightHooks />
        </div>
      </section>

      <div className="flex flex-wrap gap-4 no-print">
        <Link
          href="/workbench/outreach"
          className="inline-flex items-center gap-2 rounded-full bg-private-workbench text-black px-5 py-2 font-mono text-label-md hover:opacity-90"
        >
          <MaterialIcon name="mail" className="text-[18px]" />
          Outreach templates
        </Link>
        <Link
          href="/workbench/positioning"
          className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-5 py-2 font-mono text-label-md hover:bg-surface-container-high"
        >
          <MaterialIcon name="layers" className="text-[18px]" />
          Switch narrative variant
        </Link>
      </div>

      <SyncFooter meta={data.meta} />
    </div>
  );
}
