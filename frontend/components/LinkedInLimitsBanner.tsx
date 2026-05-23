import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function LinkedInLimitsBanner() {
  return (
    <div
      role="alert"
      className="flex gap-4 items-start bg-error-container/10 border border-error/30 rounded-xl p-4 md:p-5"
    >
      <MaterialIcon name="warning" className="text-metrics-gold shrink-0 mt-0.5" />
      <div>
        <p className="font-mono text-label-md text-metrics-gold uppercase tracking-wider mb-1">
          LinkedIn volume limits (EC-5.4)
        </p>
        <p className="text-body-md text-on-surface-variant">
          Max <strong className="text-on-surface">20–30 connection requests/day</strong> and{" "}
          <strong className="text-on-surface">50–100/week</strong>. Prioritize quality over volume.
          Always include a personalized note. Spread outreach across email and LinkedIn.
        </p>
      </div>
    </div>
  );
}
