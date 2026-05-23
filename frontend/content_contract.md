# NorthStar AI Content Contract

> **Version:** 1.3 | **Date:** 2026-05-22
> **Purpose:** Prevent accidental leakage of sensitive markdown data to public routes (EC-7.1).
> **Scope:** NorthStar AI is **private / local by default** (DEC-22). This contract still applies if you self-host.

This document explicitly maps which UI routes are permitted to read which markdown artifacts.

## Public Layer `(public)/`
These routes are accessible without authentication. They MUST NOT read any markdown files outside this list.

| Route | Permitted Markdown Sources | Purpose |
|---|---|---|
| `/resume/ats` | `outputs/resume_ats_optimized.md` | ATS variant (DEC-23 structure; dense project paragraphs) |
| `/resume/one-page` | `outputs/resume_one_page.md` | Bullet variant (same structure as `Prepared Resumes/`) |
| `/projects` | `outputs/personal_branding.md` (Featured section) | Public case study gallery |
| `/branding` | `outputs/personal_branding.md` | Personal branding showcase |

## Private Workbench Layer `(workbench)/`
These routes are protected by `middleware.ts` (passcode auth). They have access to sensitive positioning, outreach, and feedback data.

| Route | Permitted Markdown Sources | Purpose |
|---|---|---|
| `/workbench/outreach` | `outputs/outreach/*.md` | Outreach templates & cadence |
| `/workbench/interview` | `outputs/interview_positioning.md` | STAR stories & comp playbook |
| `/workbench/positioning` | `analysis/positioning_strategy.md` | Narrative variants & company matrix |
| `/workbench/versions` | `outputs/archive/v*/*.md` | Version history & diff viewer |
| `/workbench/jd-alignment` | `analysis/jd_corpus_synthesis.md` (read-only list of `inputs/job_descriptions/*.md`) | Phase 11 JD corpus & keyword alignment |
| `/workbench/intel` | `outputs/intel/feed/*.md` (latest frontmatter only) | Phase 12 intel hub — stats & navigation |
| `/workbench/intel/feed` | `outputs/intel/feed/YYYY-MM-DD.md` | Daily RSS reader — **per-source filter** (`?sources=id1,id2` from registry names) |
| `/workbench/intel/sources` | `outputs/intel/sources.md` + latest feed frontmatter `source_results` | Curated feeds & fetch health |
| `/workbench/intel/weekly` | `outputs/intel/weekly/YYYY-Www.md` (Phase C) | **Generate this week's summary** → `POST /api/intel/weekly` (Groq on click; ISO week or rolling 7 feed days) |
| `/workbench/intel/posts` | `inputs/linkedin_style.md`, `outputs/personal_branding.md` §3, `outputs/intel/posts/YYYY-MM-DD.md`, optional `outputs/intel/weekly/YYYY-Www.md` | **Generate new ideas** → `POST /api/intel/posts` (Groq; ISO week or rolling 7 feed days; optional weekly context) |

## Enforcement
- `lib/content.ts` should be used carefully. Do not pass dynamic user input directly to the file reader.
- The `middleware.ts` ensures that even if a workbench route is accessed, it will 401/redirect without the correct passcode.
