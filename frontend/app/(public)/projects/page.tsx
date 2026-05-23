"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PROJECTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "AI Product", "Ops", "NextLeap"] as const;

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>("All");

  const filtered =
    filter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase().split(" ")[0])));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Projects Gallery</h1>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-xl">
            High-impact initiatives from resume and personal branding — cross-linked to portfolio case studies.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 rounded-full border font-mono text-label-md transition-colors",
                filter === f
                  ? "border-primary bg-primary-container text-on-primary-container"
                  : "border-outline-variant text-on-surface hover:bg-surface-variant"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8 flex flex-col gap-4 hover:border-outline-variant transition-colors relative overflow-hidden group"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-10 group-hover:opacity-20" />
            <div className="flex justify-between items-start relative">
              <h2 className="text-headline-md font-semibold text-on-surface pr-4">{p.title}</h2>
              <a
                href={p.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-outline hover:text-primary transition-colors"
                aria-label="View on portfolio"
              >
                <MaterialIcon name="arrow_outward" />
              </a>
            </div>
            <p className="text-body-md text-on-surface-variant relative">{p.description}</p>
            <div className="relative">
              <p className="text-metric-display font-extrabold text-metrics-gold leading-none">{p.metric}</p>
              <p className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mt-2 flex items-center gap-2">
                <MaterialIcon name="trending_up" className="text-success-green text-[16px]" />
                {p.metricLabel}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap pt-4 border-t border-border-subtle relative">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-border-subtle font-mono text-label-sm text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="font-mono text-label-sm text-on-surface-variant border-t border-outline-variant pt-6">
        Synced from <code className="text-primary">outputs/personal_branding.md</code> Featured section v1.1
      </p>
    </div>
  );
}
