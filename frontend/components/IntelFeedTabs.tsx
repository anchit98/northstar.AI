"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { INTEL_FEED_TABS, type IntelFeedTab } from "@/lib/intelFeedTabs";

type IntelFeedTabsProps = {
  activeTab: IntelFeedTab;
};

export function IntelFeedTabs({ activeTab }: IntelFeedTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(tab: IntelFeedTab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-wrap gap-2 no-print" role="tablist" aria-label="Feed category">
      {INTEL_FEED_TABS.map((t) => {
        const active = activeTab === t.id;
        return (
          <Link
            key={t.id}
            href={hrefFor(t.id)}
            role="tab"
            aria-selected={active}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
              active
                ? "bg-private-workbench/15 text-private-workbench border-private-workbench/40"
                : "bg-surface-container text-on-surface-variant border-border-subtle hover:border-outline-variant"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
