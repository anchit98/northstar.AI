"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type IntelFeedNavProps = {
  dates: string[];
  selectedDate: string;
};

export function IntelFeedNav({ dates, selectedDate }: IntelFeedNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(date: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  if (dates.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant font-mono">
        No feed files yet. Run <code className="text-primary">npm run intel:fetch</code> from repo root.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <label htmlFor="intel-feed-date" className="font-mono text-label-sm text-on-surface-variant uppercase">
        Feed date
      </label>
      <select
        id="intel-feed-date"
        value={selectedDate}
        onChange={(e) => {
          window.location.href = hrefFor(e.target.value);
        }}
        className="bg-surface-container border border-border-subtle rounded-lg px-3 py-2 text-sm text-on-surface font-mono min-w-[10rem]"
      >
        {dates.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      {dates[0] === selectedDate && (
        <span className="px-2 py-0.5 rounded bg-success-green/10 text-success-green font-mono text-label-sm border border-success-green/20">
          Latest
        </span>
      )}
      <Link href="/workbench/intel" className="text-primary font-mono text-label-sm hover:underline ml-auto">
        Intel hub →
      </Link>
    </div>
  );
}
