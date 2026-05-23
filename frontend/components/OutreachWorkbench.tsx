"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { CadenceTimeline } from "@/components/CadenceTimeline";
import { LinkedInLimitsBanner } from "@/components/LinkedInLimitsBanner";
import { COMPANY_TYPES, type OutreachTab } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TABS: { id: OutreachTab; label: string }[] = [
  { id: "founders", label: "Founders" },
  { id: "recruiters", label: "Recruiters" },
  { id: "hms", label: "HMs" },
  { id: "linkedin", label: "LinkedIn" },
];

const PITCH_HINTS: Record<string, string> = {
  "early-stage": "Lead with MVP speed: 1-day client reporting MVP + builder mindset.",
  "ai-startup": "Lead with AI fluency: RLS BigQuery chatbot, LLM intake pipeline, AI Restaurant Engine.",
  plg: "Lead with adoption metrics: 80% adoption, 100% retention, 0% churn, 85–90% CSAT.",
  "series-bc": "Lead with scale: 200+ discovery cycles, 50% cycle-time reduction, cross-functional ops.",
  "founder-led": "Lead with direct ROI: ₹1.5 Cr+ Meta automation, scrappy shipping, ownership.",
};

type OutreachWorkbenchProps = {
  contents: Record<OutreachTab, string>;
};

export function OutreachWorkbench({ contents }: OutreachWorkbenchProps) {
  const [tab, setTab] = useState<OutreachTab>("founders");
  const [companyType, setCompanyType] = useState<string>("ai-startup");
  const content = contents[tab];
  const activeCompany = COMPANY_TYPES.find((c) => c.id === companyType);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Outreach templates</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          High-conversion messaging frameworks by company stage. Highlight{" "}
          <mark className="hook-highlight">[PERSONALIZATION_HOOK]</mark> slots before sending (DEC-8).
        </p>
      </div>

      <div className="flex border-b border-outline-variant overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-6 py-3 font-mono text-label-md whitespace-nowrap transition-colors",
              tab === t.id
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {COMPANY_TYPES.map((ct) => (
          <button
            key={ct.id}
            type="button"
            onClick={() => setCompanyType(ct.id)}
            className={cn(
              "px-4 py-1.5 rounded-full border font-mono text-label-sm flex items-center gap-2 transition-colors",
              companyType === ct.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border-subtle bg-surface-raised text-on-surface hover:border-primary"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                companyType === ct.id ? "bg-primary" : "bg-primary-container"
              )}
            />
            {ct.label}
          </button>
        ))}
      </div>

      {activeCompany && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-metrics-gold bg-metrics-gold/5">
          <span className="font-mono text-label-sm text-metrics-gold uppercase tracking-wider">
            Narrative Variant {activeCompany.variant}
          </span>
          <span className="text-body-md text-on-surface-variant">{PITCH_HINTS[companyType]}</span>
        </div>
      )}

      {tab === "linkedin" && <LinkedInLimitsBanner />}
      {(tab === "hms" || tab === "founders" || tab === "recruiters") && <CadenceTimeline />}

      <div className="flex justify-end no-print">
        <CopyButton text={content} label="Copy all" variant="workbench" />
      </div>

      <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8">
        <MarkdownRenderer content={content} highlightHooks />
      </div>
    </div>
  );
}
