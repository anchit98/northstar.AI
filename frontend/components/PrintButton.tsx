"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 font-mono text-label-md text-on-surface hover:bg-surface-container-high no-print"
    >
      <MaterialIcon name="print" className="text-[18px]" />
      Print
    </button>
  );
}
