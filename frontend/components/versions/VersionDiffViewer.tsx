"use client";

import { useMemo } from "react";
import { diffLines, type Change } from "diff";
import type { DiffLayout } from "@/lib/versionTypes";
import { cn } from "@/lib/utils";

type VersionDiffViewerProps = {
  leftLabel: string;
  rightLabel: string;
  leftText: string;
  rightText: string;
  layout: DiffLayout;
};

type DiffRow = {
  left?: string;
  right?: string;
  type: "same" | "add" | "remove" | "change";
};

function buildRows(changes: Change[]): DiffRow[] {
  const rows: DiffRow[] = [];
  for (const part of changes) {
    const lines = part.value.replace(/\n$/, "").split("\n");
    if (part.added) {
      for (const line of lines) {
        if (line === "" && lines.length === 1) continue;
        rows.push({ right: line, type: "add" });
      }
    } else if (part.removed) {
      for (const line of lines) {
        if (line === "" && lines.length === 1) continue;
        rows.push({ left: line, type: "remove" });
      }
    } else {
      for (const line of lines) {
        if (line === "" && lines.length === 1) continue;
        rows.push({ left: line, right: line, type: "same" });
      }
    }
  }
  return rows;
}

function alignSideBySide(changes: Change[]): DiffRow[] {
  const rows: DiffRow[] = [];
  let i = 0;
  while (i < changes.length) {
    const part = changes[i];
    const next = changes[i + 1];
    if (part.removed && next?.added) {
      const leftLines = part.value.replace(/\n$/, "").split("\n");
      const rightLines = next.value.replace(/\n$/, "").split("\n");
      const max = Math.max(leftLines.length, rightLines.length);
      for (let j = 0; j < max; j++) {
        const l = leftLines[j];
        const r = rightLines[j];
        if (l !== undefined && r !== undefined && l === r) {
          rows.push({ left: l, right: r, type: "same" });
        } else {
          rows.push({
            left: l,
            right: r,
            type: l !== undefined && r !== undefined ? "change" : l !== undefined ? "remove" : "add",
          });
        }
      }
      i += 2;
    } else {
      rows.push(...buildRows([part]));
      i += 1;
    }
  }
  return rows;
}

function rowClass(type: DiffRow["type"], side: "left" | "right") {
  if (type === "same") return "bg-transparent text-on-surface-variant";
  if (type === "add") return side === "right" ? "bg-success-green/15 text-success-green" : "bg-surface-container/50";
  if (type === "remove") return side === "left" ? "bg-red-500/15 text-red-300" : "bg-surface-container/50";
  return side === "left" ? "bg-red-500/10 text-red-200" : "bg-success-green/10 text-success-green";
}

export function VersionDiffViewer({
  leftLabel,
  rightLabel,
  leftText,
  rightText,
  layout,
}: VersionDiffViewerProps) {
  const rows = useMemo(() => {
    const changes = diffLines(leftText, rightText);
    return layout === "split" ? alignSideBySide(changes) : buildRows(changes);
  }, [leftText, rightText, layout]);

  if (layout === "unified") {
    return (
      <div className="border border-outline-variant rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-outline-variant bg-surface-container font-mono text-label-sm flex justify-between">
          <span>{leftLabel}</span>
          <span className="text-on-surface-variant">→</span>
          <span>{rightLabel}</span>
        </div>
        <pre className="text-xs font-mono overflow-x-auto max-h-[32rem] overflow-y-auto p-2">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className={cn(
                "px-2 py-0.5 whitespace-pre-wrap break-words",
                row.type === "add" && "bg-success-green/15 text-success-green",
                row.type === "remove" && "bg-red-500/15 text-red-300 line-through"
              )}
            >
              {row.type === "remove" && "- "}
              {row.type === "add" && "+ "}
              {row.left ?? row.right ?? ""}
            </div>
          ))}
        </pre>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-outline-variant bg-surface-container font-mono text-label-sm">
        <span className="px-3 sm:px-4 py-2 sm:border-r border-outline-variant truncate">{leftLabel}</span>
        <span className="px-3 sm:px-4 py-2 truncate border-t sm:border-t-0 border-outline-variant">{rightLabel}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 text-xs font-mono max-h-[32rem] overflow-y-auto">
        <pre className="sm:border-r border-outline-variant overflow-x-auto border-b sm:border-b-0 border-outline-variant">
          {rows.map((row, idx) => (
            <div
              key={`l-${idx}`}
              className={cn(
                "px-2 py-0.5 min-h-[1.25rem] whitespace-pre-wrap break-words",
                rowClass(row.type, "left")
              )}
            >
              {row.left ?? ""}
            </div>
          ))}
        </pre>
        <pre className="overflow-x-auto">
          {rows.map((row, idx) => (
            <div
              key={`r-${idx}`}
              className={cn("px-2 py-0.5 min-h-[1.25rem] whitespace-pre-wrap break-words", rowClass(row.type, "right"))}
            >
              {row.right ?? ""}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
