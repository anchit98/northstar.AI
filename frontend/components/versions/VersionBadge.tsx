import { cn } from "@/lib/utils";

type VersionBadgeProps = {
  isCurrent: boolean;
  versionLabel: string;
  date?: string;
  className?: string;
};

export function VersionBadge({ isCurrent, versionLabel, date, className }: VersionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full font-mono text-label-sm border",
        isCurrent
          ? "bg-success-green/10 text-success-green border-success-green/30"
          : "bg-surface-container text-on-surface-variant border-outline-variant",
        className
      )}
      title={date ? `Archived ${date}` : undefined}
    >
      {isCurrent && (
        <span className="w-1.5 h-1.5 rounded-full bg-success-green shrink-0" aria-hidden />
      )}
      {isCurrent ? "Current" : "Archived"}
      <span className="text-on-surface-variant">·</span>
      <span className={isCurrent ? "text-success-green" : "text-on-surface"}>{versionLabel}</span>
      {date && date !== "—" && (
        <>
          <span className="text-on-surface-variant">·</span>
          <span className="text-on-surface-variant font-normal">{date}</span>
        </>
      )}
    </span>
  );
}
