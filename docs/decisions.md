# Design Decisions: AI-Native PM Career Transformation System

> **Derived from:** [architecture.md](./architecture.md) | [edgecases.md](./edgecases.md)
> **Version:** 1.0
> **Date:** 2026-05-15

---

## Overview

This document records all architectural and design decisions made during the project. Each decision includes the context, options considered, rationale for the chosen approach, trade-offs accepted, and the edge cases that influenced the decision.

### Decision Status Legend

| Status | Meaning |
|---|---|
| ✅ **Accepted** | Decision finalized and in effect |
| 🔄 **Revisitable** | Accepted but may change with new information |
| ⏳ **Pending** | Awaiting candidate input or market validation |

---

## DEC-1 — Pipeline Architecture: Sequential Stages With Feedback Loop

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | The system needs to process raw career data into 14 distinct deliverables. Two architectural approaches were considered. |
| **Options** | (A) **Sequential pipeline** — 5 stages feeding forward with a feedback loop between Optimization → Transformation. (B) **Parallel generation** — All deliverables generated independently from raw inputs. |
| **Decision** | Option A — Sequential pipeline with Optimization → Transformation feedback loop. |
| **Rationale** | Deliverables are interdependent. The resume informs LinkedIn, which informs outreach. Parallel generation risks inconsistent narratives across outputs (see EC-3.3, EC-3.4). The feedback loop allows ATS audit results to refine resume content without restarting the full pipeline. |
| **Trade-off** | Slower end-to-end throughput — each stage blocks on the previous. Acceptable because quality > speed for career-critical documents. |
| **Related Edge Cases** | EC-3.3 (Resume variant divergence), EC-3.4 (LinkedIn-resume mismatch), EC-X.1 (Target role pivot — modular re-execution mitigates sequential overhead) |

---

## DEC-2 — Document Format: Markdown as Primary, PDF as Export

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Deliverables need to be version-controlled, easily editable, and exportable to recruiter-friendly formats. |
| **Options** | (A) **Markdown primary** — Author in MD, export to PDF for submission. (B) **Direct PDF authoring** — Use a resume builder tool. (C) **Google Docs / Word** — Collaborative editing. |
| **Decision** | Option A — Markdown primary with PDF export. |
| **Rationale** | Markdown is Git-friendly, LLM-native (prompts produce MD naturally), diff-able for version tracking, and easily templated. PDF export is a one-time conversion step for final delivery. |
| **Trade-off** | PDF formatting requires a controlled conversion pipeline (see EC-4.4). Some advanced resume layouts (multi-column, sidebars) are harder in MD. |
| **Constraint** | Final PDF must be ATS-safe. No Markdown-only features (mermaid, callouts) in resume content. |
| **Related Edge Cases** | EC-4.4 (PDF export breaks formatting) |

---

## DEC-3 — Sample Resume Priority: 1-Page PM Over FAANG Template

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Two sample resumes exist with different philosophies: `FAANGResumeTemplate.pdf` (structured, enterprise-oriented) and `SakshamArora.pdf` (concise, 1-page, startup-friendly). |
| **Options** | (A) **Blend both** — Attempt to merge formatting from both. (B) **FAANG primary** — Use FAANG structure, startup tone. (C) **1-page PM primary** — Use Saksham Arora format for startup outputs, FAANG for ATS validation only. |
| **Decision** | Option C — 1-page PM template as primary format reference. |
| **Rationale** | Target audience is startups (Series A–Pre-IPO). Startup founders and HMs prefer concise, impact-dense resumes over multi-page enterprise formats. FAANG template's structural discipline is valuable for ATS compliance checks but its verbosity doesn't match startup culture. |
| **Trade-off** | May under-serve candidates who later pivot to enterprise PM roles. Revisitable if target changes. |
| **Related Edge Cases** | EC-1.4 (Divergent sample resumes), EC-X.1 (Target role pivot) |

---

## DEC-4 — Factual Grounding: "Interview Litmus Test" as Universal Gate

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | The system must reframe experience without fabrication. A clear boundary mechanism is needed. |
| **Options** | (A) **Candidate self-attestation** — Candidate signs off on each bullet. (B) **Interview litmus test** — Every bullet must pass: "Can you explain this in detail in a PM interview?" (C) **Dual review** — Both A and B. |
| **Decision** | Option C — Dual review: Interview litmus test applied by system, followed by candidate self-attestation. |
| **Rationale** | The litmus test catches over-reframing before candidate review, reducing cognitive load on the candidate. Candidate attestation is the final legal/ethical safeguard. Together they provide two layers of protection against the most critical constraint violation. |
| **Trade-off** | Adds review time to the Transformation stage. Worth it — a single fabricated claim can torpedo an entire interview. |
| **Related Edge Cases** | EC-2.3 (Candidate over-claims), EC-3.1 (Reframing → fabrication) |

---

## DEC-5 — ATS Score Target: 90+ With Flexible Acceptance at 85+

| Attribute | Detail |
|---|---|
| **Status** | 🔄 Revisitable |
| **Context** | Problem statement targets ATS score ≥ 90. However, achieving 90 on all platforms simultaneously may require keyword stuffing that hurts readability. |
| **Options** | (A) **Hard 90** — No resume ships below 90 on any platform. (B) **Weighted average 90** — Average across primary platforms ≥ 90, individual scores ≥ 85. (C) **Flexible 85+** — Accept 85+ if 90 requires stuffing, with documented trade-off. |
| **Decision** | Option B — Weighted average approach with 85+ floor on any single platform. |
| **Rationale** | ATS platforms use different scoring algorithms. Optimizing for one (Jobscan) may hurt another (ResumeWorded). A weighted average prevents over-fitting to a single platform while maintaining the spirit of the 90+ target. Jobscan and ResumeWorded are weighted higher as they're most commonly used by recruiters. |
| **Trade-off** | Individual platform scores may dip to 85–87. Acceptable because recruiter readability (human score) matters more than ATS score once past the initial screen. |
| **Revisitable When** | If real-world ATS rejection rates are high despite 85+ scores. |
| **Related Edge Cases** | EC-4.1 (ATS score plateau), EC-4.2 (Contradictory ATS scores) |

---

## DEC-6 — Compensation Positioning: Tiered Range Strategy

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Target jump is ₹20 → ₹35–40 LPA (75–100% increase). This is aggressive for a BA → PM transition without a direct PM title history. |
| **Options** | (A) **Single target** — Position all materials for ₹35–40 LPA. (B) **Tiered ranges** — Primary: ₹30–35 LPA. Stretch: ₹35–40 LPA for AI startups. Floor: ₹25–28 LPA with equity upside for early-stage. (C) **Market-dependent** — Don't specify; let interview performance determine. |
| **Decision** | Option B — Tiered range strategy. |
| **Rationale** | A single ₹35–40 LPA target risks pricing the candidate out of roles where the profile fits well but the company's band is lower. Tiered ranges allow the candidate to adapt positioning per opportunity while maintaining a stretch goal. AI startups command a premium, justifying the higher band. Early-stage startups may offer equity in lieu of cash. |
| **Trade-off** | Candidate must actively manage which range to share per company — adds complexity to job search. Mitigated by including a decision matrix in `outputs/interview_positioning.md`. |
| **Related Edge Cases** | EC-4.3 (Unrealistic comp positioning), EC-X.3 (Below-target offer) |

---

## DEC-7 — LinkedIn Update Strategy: Stealth-First Rollout

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Candidate is currently employed. A sudden, visible LinkedIn overhaul could alert the current employer. |
| **Options** | (A) **Big bang** — Update everything at once. (B) **Stealth rollout** — Gradual updates over 2–3 weeks with notifications disabled. (C) **No LinkedIn update** — Keep current profile; focus only on resume and outreach. |
| **Decision** | Option B — Stealth-first gradual rollout. |
| **Rationale** | LinkedIn is critical for recruiter discoverability (a key success criterion). But alerting the current employer is a career-jeopardizing risk (EC-X.5). Gradual updates strike the balance: each week, update 1–2 sections. Disable "Share profile updates" before starting. Use "Open to Work" in recruiter-only mode. |
| **Implementation Plan** | Week 1: Headline + Skills. Week 2: About section. Week 3: Experience bullets. This sequence front-loads SEO-critical changes (headline/skills) for fastest recruiter visibility improvement. |
| **Trade-off** | Full positioning impact is delayed by ~3 weeks. Acceptable given the risk. |
| **Related Edge Cases** | EC-X.5 (Employer discovers job search) |

---

## DEC-8 — Outreach Personalization: Mandatory Hooks Over Bulk Templates

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Outreach templates need to balance scalability (candidate can send many) with personalization (each message feels custom). |
| **Options** | (A) **Fully templated** — Generic templates with name/company variables. (B) **Mandatory hooks** — Templates include `[PERSONALIZATION_HOOK]` that candidate must fill with company-specific insight. (C) **Fully custom** — Each message written from scratch per company. |
| **Decision** | Option B — Mandatory personalization hooks. |
| **Rationale** | Option A produces generic outreach with low response rates (EC-5.1). Option C doesn't scale. Mandatory hooks ensure each message has a custom element (recent funding, product insight, mutual connection) while the template provides structure. 3 variant openings per template reduce repetition across outreach batches. |
| **Trade-off** | Candidate must research each target company before sending. Adds 5–10 min per outreach message. Worth it for significantly higher response rates. |
| **Related Edge Cases** | EC-5.1 (Generic templates), EC-5.2 (Positioning mismatch) |

---

## DEC-9 — Canonical Bullet Set: Single Source of Truth Across All Materials

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Three outputs contain experience bullets: ATS resume, one-page resume, and LinkedIn. These could diverge during separate optimization passes. |
| **Options** | (A) **Independent optimization** — Each output optimized separately for its channel. (B) **Canonical set** — One master bullet set; outputs adapt tone/length but not claims. (C) **Resume-primary** — Resume bullets are canonical; LinkedIn derived. |
| **Decision** | Option B — Canonical bullet set stored in `analysis/competency_map.md`. |
| **Rationale** | Recruiters cross-reference resume and LinkedIn. Founders may see both the one-page resume and the LinkedIn profile. Any claim mismatch (different metrics, different scope) erodes trust (EC-3.3, EC-3.4). A canonical set ensures consistency. Each channel adapts: ATS expands with keywords, one-page condenses, LinkedIn shifts to first-person. |
| **Trade-off** | Constrains per-channel optimization. LinkedIn may benefit from more narrative freedom than the canonical set allows. Acceptable — consistency > individual channel perfection. |
| **Related Edge Cases** | EC-3.3 (Resume variant divergence), EC-3.4 (LinkedIn-resume mismatch) |

---

## DEC-10 — PM Jargon Control: Density Cap of 2 Terms Per Bullet

| Attribute | Detail |
|---|---|
| **Status** | 🔄 Revisitable |
| **Context** | PM keyword injection is necessary for ATS and recruiter signals. Over-injection makes bullets sound inauthentic to experienced PMs/HMs. |
| **Options** | (A) **No cap** — Maximize PM terminology. (B) **2-term cap** — Max 2 PM-specific terms per bullet. (C) **Alternating density** — Vary jargon levels across bullets. |
| **Decision** | Option B — 2-term cap per bullet, combined with Option C's variation across the full resume. |
| **Rationale** | A bullet like "Drove GTM alignment through experimentation-led product discovery with KPI ownership and funnel optimization" is counterproductive. It reads as compensatory. A cap of 2 PM terms + 1 quantified outcome per bullet maintains credibility while still signaling PM competency. Variation across the resume prevents pattern detection. |
| **Revisitable When** | If ATS scores suffer from insufficient keyword density at this cap level. |
| **Related Edge Cases** | EC-3.2 (PM jargon overload), EC-4.1 (ATS score plateau) |

---

## DEC-11 — Version Control: outputs/ as Single Source of Truth

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Multiple pipeline iterations will produce multiple versions of each deliverable. Candidate needs clarity on which version is "current." |
| **Options** | (A) **Date-stamped filenames** — `resume_v1_20260515.md`. (B) **Archive directory** — Current in `outputs/`, previous in `outputs/archive/v{N}/`. (C) **Git only** — Rely on git history for versioning. |
| **Decision** | Option B — Archive directory approach. |
| **Rationale** | Not all candidates are git-literate. Date-stamped filenames clutter the directory and risk confusion. Archive directory keeps `outputs/` clean (always the current version) while preserving history for rollback. Each deliverable includes a version header: `Version: X.Y | Date: YYYY-MM-DD`. |
| **Trade-off** | Manual archival step required before each major update. Acceptable — the overhead is trivial. |
| **Related Edge Cases** | EC-X.4 (Version confusion) |

---

## DEC-12 — Discovery Depth: 5+ High-Signal Responses Per Category

| Attribute | Detail |
|---|---|
| **Status** | ⏳ Pending |
| **Context** | Quality Gate G2 requires sufficient discovery depth. The threshold needs to balance thoroughness with candidate fatigue. |
| **Options** | (A) **3 responses per category** — Faster but shallower. (B) **5 responses per category** — Deeper, more PM signals extracted. (C) **Adaptive** — Start with 3; extend to 5+ only for categories where signals are weak. |
| **Decision** | Option C — Adaptive depth, with a floor of 3 and target of 5 for weak categories. |
| **Rationale** | Candidate may have strong signals in some categories (e.g., analytical strengths) and weak in others (e.g., product intuition). A flat 5-per-category wastes time on already-strong areas. Adaptive depth focuses discovery effort where it's most needed. |
| **Trade-off** | Requires the discovery engine to assess signal quality in real-time. Adds complexity but reduces candidate fatigue. |
| **Pending On** | Candidate feedback on discovery experience — if they find it too long even at 3/category, reduce further. |
| **Related Edge Cases** | EC-2.1 (Vague responses — triggers deeper drill-down), EC-2.5 (Refused questions — reduces available depth) |

---

## DEC-13 — Target Audience Calibration: Indian Startup Ecosystem

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Outputs could be calibrated for global PM market or specifically for Indian startup ecosystem. |
| **Options** | (A) **Global** — Generic PM positioning; works everywhere. (B) **India-first** — Calibrated for Indian startups, founders, recruiters; INR compensation. (C) **Dual** — India-primary with global variant templates. |
| **Decision** | Option B — India-first, with the door open for Option C later. |
| **Rationale** | The compensation targets (₹20 → ₹35–40 LPA), company types (Series A–Pre-IPO Indian startups), and networking channels (Indian LinkedIn ecosystem, AngelList India) are all India-specific. Global calibration would dilute the positioning. If the candidate later targets international roles, a separate variant can be produced without re-running the full pipeline (modular architecture supports this). |
| **Trade-off** | Resume/outreach tone may not resonate with US/EU recruiters without adaptation. Acceptable for the current scope. |
| **Related Edge Cases** | EC-X.1 (Target role pivot — supports future international expansion), EC-X.2 (Market conditions — India-specific hiring cycles) |

---

## DEC-14 — Phase 6 (Deployment & Iteration) as a First-Class System Phase

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | The pipeline originally ended at Phase 5 (outreach generation). However, the problem statement's success criteria — recruiter response rates, interview callbacks, compensation negotiation outcomes — are **only measurable after deployment**. Treating the deliverable bundle as the endpoint risks shipping materials with no market validation loop. |
| **Options** | (A) **Out-of-scope** — System ships artifacts; deployment is the candidate's responsibility alone. (B) **First-class phase** — Phase 6 is part of the architecture, with structured market-feedback capture and explicit iteration loops back to Phases 3–4. (C) **Light monitoring** — Track outcomes informally but no structured iteration support. |
| **Decision** | Option B — Phase 6 included as a first-class phase with named iteration loops (A, B, C in architecture §8.X). |
| **Rationale** | Without market feedback driving iteration, the system ships "blind." Real-world response data is the only validation that positioning actually works. Formalizing Phase 6 ensures (1) market feedback is captured systematically, (2) pivot triggers are predefined (see DEC-16) rather than ad-hoc, (3) the candidate gets structured support during the highest-stakes part of the journey, and (4) the modular architecture (DEC-1) actually gets exercised via re-entry to Phases 3 or 4 when needed. |
| **Trade-off** | Project timeline extends from "deliver in ~3 weeks" to "deliver + iterate over 4–12 weeks." Acceptable — the deliverables are means, not ends. The signed offer is the actual deliverable. |
| **Related Edge Cases** | EC-X.1 (target role pivot), EC-X.2 (market shifts), EC-X.3 (below-target offer), EC-X.5 (employer discovers job search), EC-6.1–EC-6.5 (Phase 6 specific) |

---

## DEC-15 — Market Feedback as Structured Artifact (`analysis/market_feedback.md`)

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Phase 6 (DEC-14) generates significant real-world signal: which outreach got responses, which recruiters engaged, what feedback they gave, what compensation offers came in. This data is most useful when structured and aggregated rather than scattered across emails and memory. |
| **Options** | (A) **Structured Markdown artifact** — Capture in `analysis/market_feedback.md` alongside existing analysis files. (B) **External tracker** — Spreadsheet or CRM tool. (C) **Informal** — Rely on candidate memory and ad-hoc notes. |
| **Decision** | Option A — Structured Markdown artifact with a defined schema (audience type, contact, date, response, feedback summary, signal classification). |
| **Rationale** | Consistency with the rest of the workspace (DEC-2 — Markdown primary). Allows the system to ingest market feedback verbatim and trigger re-execution of Phases 3–4 with concrete evidence (e.g., "8 of 10 recruiters said too junior → re-tune seniority signals"). Spreadsheets are harder to version-control and don't integrate with the Markdown-native pipeline. Aggregated structure makes sample size visible, mitigating premature pivots (EC-6.1). |
| **Trade-off** | Manual data entry by candidate after each interaction. Mitigated by a template structure and a one-line-per-touch logging discipline. |
| **Related Edge Cases** | EC-6.1 (insufficient sample size — file makes count visible), EC-6.4 (contradictory feedback — segmentation by audience type makes pattern detection possible) |

---

## DEC-16 — Quantitative Pivot Triggers Over Qualitative Judgment

| Attribute | Detail |
|---|---|
| **Status** | 🔄 Revisitable |
| **Context** | Phase 6 may need to trigger an iteration loop back to Phase 3 (positioning) or Phase 4 (keyword strategy / compensation). The trigger could be qualitative ("when it feels stuck") or quantitative (specific thresholds based on market data). |
| **Options** | (A) **Qualitative** — Candidate decides when to pivot. (B) **Quantitative** — Predefined numerical thresholds. (C) **Hybrid** — Quantitative triggers as defaults, candidate override permitted. |
| **Decision** | Option C — Quantitative defaults with a candidate-initiated override valve. |
| **Rationale** | Predefined thresholds prevent two opposite failure modes: iterating too quickly on small samples (EC-6.1) and failing to iterate when changes are clearly needed (loss aversion, sunk-cost bias). Candidate override preserves human judgment for edge cases the rules don't anticipate. |
| **Trigger Thresholds** | • Response rate < 5% over ≥ 50 outreach attempts → re-enter Phase 4 (re-tune keyword strategy)<br>• Recurring "too junior" feedback (≥ 3 distinct sources) → re-enter Phase 3 (seniority signaling)<br>• Compensation offers consistently > 20% below floor band → re-tune DEC-6 tiered ranges<br>• Target role pivot (EC-X.1) → re-enter Phase 3<br>• Market shift (EC-X.2) → swap narrative variant in `analysis/positioning_strategy.md` without re-running upstream phases |
| **Trade-off** | Hard thresholds may not fit every candidate's situation perfectly. The override valve handles this; thresholds can also be adjusted in this DEC if real-world data shows them mis-calibrated. |
| **Revisitable When** | After first 50 outreach attempts have produced response-rate data; calibrate thresholds against actual market behavior. |
| **Related Edge Cases** | EC-6.1 (insufficient sample size), EC-6.2 (iteration fatigue), EC-X.1 (target pivot), EC-X.2 (market shift) |

---

## DEC-17 — Frontend Hosting: Subdomain of Existing Portfolio

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | The NorthStar AI frontend (Phases 7–9) needs a hosting strategy. Originally scoped for public discoverability via a portfolio subdomain; **superseded for deployment scope by DEC-22** (private local use — candidate owns any public hosting). |
| **Options** | (A) **Subdomain** — `careeros.anchitboruah.com`, separate Vercel project, linked from portfolio. (B) **Integrated route** — `anchitboruah.com/career-os` inside the existing portfolio repo. (C) **Separate domain** — `careeros.com` or similar standalone. (D) **No public hosting** — local-only / private repo Pages. |
| **Decision** | Option A — Subdomain on the candidate's existing root domain. |
| **Rationale** | Subdomain isolates sensitive workbench content from the portfolio's public surface area, keeps deploys independent (a frontend bug never breaks the portfolio), and reuses existing DNS + Vercel account. Integrated route (B) couples the two projects' deploys, raises the risk of leaking sensitive content via misconfigured public routes, and makes the workbench harder to selectively share. Separate domain (C) wastes brand equity. Local-only (D) defeats the purpose of a shareable workbench. |
| **Trade-off** | Two Vercel projects to maintain. Mitigated by lightweight CI/CD; the frontend rebuilds automatically on git push to `outputs/`. |
| **Related Edge Cases** | EC-7.1 (privacy leak), EC-7.4 (portfolio integration breaks UX), EC-X.5 (employer discovery) |

---

## DEC-18 — Two-Layer Access Model: Public Showcase + Private Workbench

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | The NorthStar AI frontend renders content with very different sensitivity profiles. Resume variants and project case studies are intended for recruiters and founders. Outreach templates, interview weakness reframings, compensation negotiation playbooks, and market feedback are private — exposing them publicly would tip off the current employer (EC-X.5), give recruiters negotiation leverage, and allow scraping of the outreach copy itself. |
| **Options** | (A) **All public** — Single layer, everything visible. (B) **All private** — Single layer behind auth; recruiters need passcode to view resume. (C) **Two-layer split** — Public showcase (resume, projects, branding) + private workbench (outreach, interview, comp, feedback, version diffs) behind a passcode/email-link gate. |
| **Decision** | Option C — Two-layer split, with a hard boundary enforced at the routing/middleware level. |
| **Rationale** | Option A trades privacy for convenience and hard-fails EC-X.5. Option B blocks the primary use case (recruiters self-serving the resume) and creates friction. Option C preserves the recruiter UX (zero-friction resume access) while protecting the high-sensitivity content. The boundary must be enforced at routing, not just hidden in the UI — DEC-20 makes that mechanical. If the app is self-hosted, the candidate runs a manual privacy spot-check (DEC-22). |
| **Trade-off** | Two distinct content contracts and route trees to maintain. Acceptable — the cost of a privacy leak (EC-X.5 → critical) far exceeds the maintenance cost. |
| **Related Edge Cases** | EC-X.5 (employer discovery), EC-7.1 (privacy leak), EC-7.5 (auth bypass) |

---

## DEC-19 — Build-Time Markdown Sourcing for Frontend Content

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | The NorthStar AI frontend renders resume, outreach, and analysis content that lives as markdown in `outputs/` and `analysis/`. The frontend needs a sourcing model that prevents drift between the markdown source and what the UI shows. |
| **Options** | (A) **Build-time read** — Next.js Static Site Generation (SSG) reads markdown at build; Vercel auto-rebuilds on git push. (B) **Runtime read** — Server reads filesystem on each request; no rebuild needed but introduces filesystem coupling on serverless. (C) **Headless CMS** — Move content to Contentful/Sanity. (D) **Database** — Postgres or similar with admin UI. |
| **Decision** | Option A — Build-time SSG with `gray-matter` and `next-mdx-remote`. |
| **Rationale** | Markdown-as-source-of-truth is already established (DEC-2). Build-time read makes the frontend a pure projection of the repo state — the UI cannot lie about what's in `outputs/`. Vercel's automatic deploy on git push keeps drift to seconds. Runtime read (B) risks serverless filesystem inconsistencies. CMS (C) and DB (D) duplicate the source of truth and create migration overhead. |
| **Trade-off** | Each content edit triggers a full rebuild (~30–60s on Vercel). Acceptable for a candidate-driven workflow with low edit frequency. |
| **Related Edge Cases** | EC-7.2 (stale data), EC-7.3 (PDF render regression vs MD source) |

---

## DEC-20 — Workbench Auth: Shared Passcode in v1, Email-Link Upgrade Path

| Attribute | Detail |
|---|---|
| **Status** | 🔄 Revisitable |
| **Context** | DEC-18 establishes a private workbench layer requiring authentication. The auth mechanism must be enforceable at the route boundary and lightweight for local/private use. |
| **Options** | (A) **Shared passcode** — Vercel env var checked in `middleware.ts`; candidate shares passcode case-by-case. (B) **Email-link (NextAuth)** — Magic link sent to allowlisted emails. (C) **Full account system** — Username/password with database. (D) **No auth, "security through obscurity"** — Random URL slug. |
| **Decision** | Option A for v1, with a documented upgrade path to Option B. |
| **Rationale** | Option A ships in hours and meets the MVP threat model for local/dev and optional self-hosting: prevent casual discovery and gate `/workbench/*`. Option B is better long-term if the app is shared broadly. Option D fails on shareability (URL once leaked is permanent). Option C is overkill for a single-user workbench. |
| **Trade-off** | Shared passcodes leak if self-hosted. Mitigation: rotate the env var if exposed; upgrade to Option B if sharing beyond trusted contacts. |
| **Revisitable When** | Workbench access volume grows (≥ 10 distinct sharers), or any indication of passcode leakage. |
| **Related Edge Cases** | EC-7.5 (auth bypass / brittleness), EC-X.5 (employer discovery) |

---

## DEC-21 — JD Corpus as First-Class Resume Input (Phase 11)

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Static keyword strategy (Phase 4) can drift from **live** PM job postings. Candidates often want resumes tuned to a **distribution** of JDs they actually target, and later to **one-off** JDs as new roles appear. |
| **Options** | (A) **Ad-hoc** — Manually tweak resume per application. (B) **Corpus + synthesis artifact** — Store JDs under `inputs/job_descriptions/`, maintain `analysis/jd_corpus_synthesis.md`, regenerate resumes from evidence map. (C) **Fully automated scoring** — External ATS API on every JD. |
| **Decision** | Option B for v1 — corpus in repo + synthesis markdown + manual/automated resume revision with mandatory candidate attestation (DEC-4). Option C revisitable. **Versioning:** each material resume refresh archives prior `outputs/resume_*.md` under DEC-11. |
| **Rationale** | Keeps Markdown-native consistency (DEC-2), makes sample size and keyword provenance auditable, and supports the user’s “20 JDs then optimize” workflow without locking into a proprietary tool. |
| **Trade-off** | Manual file drops or paste-via-workbench until a full “JD → diff → commit” bot exists. |
| **Related Edge Cases** | EC-11.1 (keyword stuffing), EC-3.3 (variant divergence), EC-6.1 (single-JD overreaction) |

---

## DEC-22 — Phase 10 Discarded: Private Local NorthStar AI Only

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Phase 10 scoped production deploy, portfolio CTA integration, formal G9 privacy audit, DNS/subdomain, and analytics. The candidate confirmed NorthStar AI is **for private use only** and will handle deployment, portfolio linking, and production hardening **manually** outside the repo. |
| **Options** | (A) **Execute Phase 10** as documented. (B) **Discard Phase 10** — keep Phases 7–9; treat hosting as candidate-owned. (C) **Defer** Phase 10 indefinitely. |
| **Decision** | Option B — **Phase 10 discarded**; **G9 discarded**. Pipeline complete for frontend at Phase 9. |
| **Rationale** | Avoids duplicate work and doc drift for a deploy track the candidate will not use. Phases 7–9 already deliver resume/workbench/version UI via `npm run dev`. Middleware + `content_contract.md` remain if the app is ever exposed. |
| **Trade-off** | No automated production privacy gate or portfolio integration in-repo. Candidate assumes responsibility when/if they deploy. |
| **Related Edge Cases** | EC-7.1, EC-7.4 (portfolio CTA — N/A unless candidate chooses), EC-7.5 |

---

## DEC-23 — Prepared Resume as Canonical Structure (v1.7+)

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Candidate finalized `Prepared Resumes/Anchit.Boruah_Resume.docx` / `.pdf` with a distinct structure: Professional Summary first, Experience before Projects, four project blocks in fixed order, INR metrics, no separate Achievements/Certifications. Earlier pipeline docs still referenced Saksham-style “projects first” and optional summary blocks. |
| **Options** | (A) **Prepared DOCX is source of truth** — markdown mirrors; agents follow `docs/resume_structure.md`. (B) Keep dual layouts (one-page vs ATS section order). (C) Revert to Saksham section order. |
| **Decision** | Option A — **Prepared Resumes folder + `docs/resume_structure.md`** govern all future resume edits. |
| **Rationale** | Single structure reduces drift between DOCX, PDF, NorthStar AI viewers, and JD-alignment loops. v1.7 synced `outputs/resume_*.md` to prepared draft; future changes start in DOCX or both markdown files together. |
| **Trade-off** | ATS keyword density may be lower than pre-v1.7 ATS variant (no NextLeap project blocks); gains consistency and candidate-owned final wording. |
| **Related** | DEC-3 (Saksham tone only — not section order), DEC-9, DEC-11, `Prepared Resumes/README.md` |

---

## DEC-24 — Intel Module In-Repo with RSS-Only Ingestion (Phase 12)

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Candidate wants daily PM/AI updates from reliable sources and weekly/LinkedIn outputs for visibility — without a separate standalone repo. Phase 12 adds an intel module to NorthStar AI. |
| **Options** | (A) **In-repo module** — `outputs/intel/`, workbench routes, `scripts/intel/fetch.ts`, GitHub Actions cron. (B) **Standalone repo** — separate agent like Groww Review Analyzer. (C) **Third-party reader only** — Feedly/Inoreader, no NorthStar AI integration. |
| **Decision** | Option A — intel lives in this repo; artifacts are markdown (DEC-2); workbench renders under `/workbench/intel/*` (DEC-18). |
| **Rationale** | Single private surface (DEC-22); reuses passcode auth, content contract, and build-time MD reads (DEC-19). RSS avoids scraping ToS issues and keeps daily ingest deterministic. |
| **Trade-off** | Repo grows with daily `feed/` files; requires cron or manual `intel:fetch` to stay current. |
| **Related Edge Cases** | EC-12.1, EC-12.5, EC-12.7 |
| **Plan** | [phase12_intel_content_engine.md](./phase12_intel_content_engine.md) |

---

## DEC-25 — On-Demand LLM Only; Daily Feed Is Raw RSS (Phase 12)

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | Candidate does **not** want LLMs involved in daily auto news/article updates — content should be pulled **as-is** from feeds. LLM may be used only when the candidate explicitly triggers weekly synthesis or LinkedIn post generation. |
| **Options** | (A) **No LLM on daily path** — cron runs `fetch.ts` only; weekly/posts via workbench API on click. (B) **LLM on all paths** — daily digest + cron synthesis (rejected by candidate). (C) **LLM weekly cron, manual posts** — partial automation (rejected). |
| **Decision** | Option A — **zero LLM** in `.github/workflows/intel-daily.yml` and `scripts/intel/fetch.ts`. Groq invoked only from `POST /api/intel/weekly` and `POST /api/intel/posts` when user clicks generate in workbench. |
| **Rationale** | Eliminates hallucination and paraphrase risk on the baseline reading experience; candidate reads original RSS summaries and links. LLM cost and quality are under candidate control. |
| **Trade-off** | Daily feed is longer/noisier than a curated digest; weekly value depends on candidate clicking generate. |
| **Related Edge Cases** | EC-12.2, EC-12.6 |
| **Related** | DEC-4 (attestation on LLM outputs before sharing), DEC-22 (`GROQ_API_KEY` in `frontend/.env` only) |

---

## DEC-26 — LinkedIn Post Ideas: Style Samples + Pillars; No Auto-Post (Phase 12)

| Attribute | Detail |
|---|---|
| **Status** | ✅ Accepted |
| **Context** | On-demand LinkedIn drafts should increase credibility as an AI-native PM while matching the candidate's voice. Posting cadence should not be enforced by automation. |
| **Options** | (A) **Style file + branding pillars** — `inputs/linkedin_style.md` (3–5 sample posts) + `outputs/personal_branding.md` pillars; mimic when generating. (B) **Pillars only** — no sample posts. (C) **Auto-post via LinkedIn API** — out of scope. (D) **Fixed alternate-day cron** for drafts — rejected (manual generate only). |
| **Decision** | Option A — post prompt uses **both** files; if `linkedin_style.md` is empty, fall back to `personal_branding.md` tone (EC-12.4). No LinkedIn API publish; no enforced Mon/Wed/Fri/Sun cadence — UI may show soft reminders only. |
| **Rationale** | Sample posts improve voice fidelity; pillars keep positioning consistent with the rest of NorthStar AI. Manual copy preserves DEC-7 stealth and avoids API/ToS complexity. |
| **Trade-off** | Candidate must paste sample posts into `linkedin_style.md` for best results; must review every draft before publishing (G5-lite). |
| **Related Edge Cases** | EC-12.3, EC-12.4, EC-5.4 (volume limits if posting manually) |

---

## Decision Log Summary

| ID | Decision | Status | Key Trade-off |
|---|---|---|---|
| DEC-1 | Sequential pipeline with feedback loop | ✅ Accepted | Speed vs. consistency |
| DEC-2 | Markdown primary, PDF export | ✅ Accepted | Editability vs. formatting control |
| DEC-3 | 1-page PM template as primary | ✅ Accepted | Startup focus vs. enterprise coverage |
| DEC-4 | Interview litmus test + candidate attestation | ✅ Accepted | Review time vs. authenticity assurance |
| DEC-5 | Weighted average ATS ≥ 90, floor 85 | 🔄 Revisitable | Score perfection vs. readability |
| DEC-6 | Tiered compensation ranges | ✅ Accepted | Simplicity vs. adaptability |
| DEC-7 | Stealth-first LinkedIn rollout | ✅ Accepted | Speed of impact vs. employer risk |
| DEC-8 | Mandatory personalization hooks | ✅ Accepted | Scalability vs. quality |
| DEC-9 | Canonical bullet set | ✅ Accepted | Channel optimization vs. consistency |
| DEC-10 | PM jargon: 2-term cap per bullet | 🔄 Revisitable | Keyword density vs. authenticity |
| DEC-11 | Archive directory for versioning | ✅ Accepted | Simplicity vs. git reliance |
| DEC-12 | Adaptive discovery depth (3–5+) | ⏳ Pending | Thoroughness vs. candidate fatigue |
| DEC-13 | India-first target audience | ✅ Accepted | Specificity vs. global reach |
| DEC-14 | Phase 6 as first-class system phase | ✅ Accepted | Timeline extension vs. market validation |
| DEC-15 | Market feedback as structured `.md` artifact | ✅ Accepted | Manual entry overhead vs. structured signal |
| DEC-16 | Quantitative pivot triggers (with override) | 🔄 Revisitable | Rule rigidity vs. ad-hoc judgment |
| DEC-17 | Frontend on subdomain of existing portfolio | ✅ Accepted (deploy optional per DEC-22) | Two Vercel projects vs. clean isolation |
| DEC-18 | Two-layer access (public showcase + private workbench) | ✅ Accepted | Maintenance overhead vs. privacy enforcement |
| DEC-19 | Build-time MD sourcing (Next.js SSG) | ✅ Accepted | Rebuild latency vs. drift prevention |
| DEC-20 | Shared passcode auth (v1), email-link upgrade path | 🔄 Revisitable | Speed-to-ship vs. per-user auditability |
| DEC-21 | JD corpus + synthesis as first-class resume input (Phase 11) | ✅ Accepted | Manual corpus upkeep vs. live JD fit |
| DEC-22 | Phase 10 discarded; private local NorthStar AI | ✅ Accepted | No in-repo production gate vs. candidate manual deploy |
| DEC-23 | Prepared resume canonical structure (v1.7+) | ✅ Accepted | Consistency vs. legacy ATS-only sections |
| DEC-24 | Intel module in-repo; RSS-only ingestion (Phase 12) | ✅ Accepted | Repo size vs. unified workbench |
| DEC-25 | On-demand LLM only; daily feed raw RSS (Phase 12) | ✅ Accepted | Noise vs. trust; manual synthesis |
| DEC-26 | LinkedIn drafts: style + pillars; no auto-post (Phase 12) | ✅ Accepted | Voice quality vs. setup effort |

---

*This document is a living record. New decisions will be appended as the project progresses. Revisitable decisions will be re-evaluated at each phase gate.*
