# Edge Cases: AI-Native PM Career Transformation System

> **Derived from:** [architecture.md](./architecture.md)
> **Version:** 1.1
> **Date:** 2026-05-22 (Stage 12 — EC-12.1–EC-12.8)

---

## Severity Legend

| Severity | Meaning |
|---|---|
| 🔴 **Critical** | Blocks pipeline; output is unusable or violates constraints |
| 🟡 **High** | Degrades output quality significantly; requires manual intervention |
| 🟠 **Medium** | Suboptimal output; auto-recoverable with fallback logic |
| 🟢 **Low** | Minor quality dip; acceptable with candidate awareness |

---

## Stage 1: Ingestion

### EC-1.1 — Unstructured or Poorly Formatted Resume PDF
- **Trigger:** Resume PDF uses complex tables, multi-column layouts, embedded images, or non-standard fonts that resist text extraction
- **Severity:** 🔴 Critical
- **Impact:** Downstream experience blocks are incomplete or garbled; competency mapping fails
- **Mitigation:** Fallback to manual transcription by candidate into `inputs/experience.md`. Implement a completeness checklist that flags missing sections before proceeding to Stage 2.

### EC-1.2 — LinkedIn Profile Is Private or Restricted
- **Trigger:** Candidate's LinkedIn profile has visibility restrictions; URL returns limited data
- **Severity:** 🟡 High
- **Impact:** `inputs/linkedin_profile.md` is incomplete; LinkedIn rewrite lacks baseline context
- **Mitigation:** Candidate manually exports LinkedIn data (Settings → Get a copy of your data) or provides screenshot-based transcription.

### EC-1.3 — Missing or Sparse Candidate Inputs
- **Trigger:** Candidate provides only a resume with no additional context — no achievements doc, no target roles, no LinkedIn
- **Severity:** 🟡 High
- **Impact:** Discovery module must compensate; transformation quality degrades without rich inputs
- **Mitigation:** Quality Gate G1 blocks progression. System generates a structured intake questionnaire covering all missing inputs.

### EC-1.4 — Sample Resumes Diverge Significantly in Style
- **Trigger:** The two sample resumes (FAANG template vs. Saksham Arora) have conflicting formatting philosophies
- **Severity:** 🟢 Low
- **Impact:** Tone and formatting benchmarking produces ambiguous signals
- **Mitigation:** Prioritize the 1-page PM sample for startup-focused outputs. Use FAANG template only for ATS structural validation. See [decisions.md](./decisions.md) DEC-3.

---

## Stage 2: Discovery

### EC-2.1 — Candidate Gives Vague or Non-Quantified Responses
- **Trigger:** Candidate responses lack specifics: "I improved the process" without metrics, timelines, or scope
- **Severity:** 🟡 High
- **Impact:** Competency map contains weak signals; resume bullets will lack quantified outcomes (violates G3)
- **Mitigation:** Discovery engine deploys **drill-down prompts**: "Can you estimate the % improvement? How many people were affected? What was the timeline?" Repeat up to 3 times per response before accepting qualitative framing.

### EC-2.2 — Candidate Has Genuine Experience Gaps in Key PM Areas
- **Trigger:** No product ownership, no shipped product stories, no direct user research experience
- **Severity:** 🔴 Critical
- **Impact:** Gap analysis shows critical deficiencies; resume risks looking inauthentic if forced
- **Mitigation:** Do **not** fabricate. Instead: (1) Reframe adjacent experience, (2) Recommend portfolio-building side projects, (3) Suggest micro-case studies the candidate can create, (4) Flag in `analysis/gap_analysis.md` as a known limitation with a remediation plan.

### EC-2.3 — Candidate Over-Claims or Exaggerates Impact
- **Trigger:** Candidate attributes team/org outcomes entirely to themselves; claims metrics they can't substantiate
- **Severity:** 🔴 Critical
- **Impact:** Violates the **Factual Grounding** constraint; resume becomes a liability in interviews
- **Mitigation:** Quality Gate G5 enforces candidate sign-off on every quantified claim. System prompts: "Can you defend this number in an interview? Who else contributed?" If unverifiable, reframe as "contributed to" rather than "drove."

### EC-2.4 — Discovery Reveals Career Gaps or Short Tenures
- **Trigger:** Employment gaps > 6 months, or multiple roles under 1 year
- **Severity:** 🟠 Medium
- **Impact:** Recruiters may flag as a red flag; ATS may penalize
- **Mitigation:** For gaps: Frame as intentional skill-building or transition periods. For short tenures: Group under a narrative arc. Never hide — always explain proactively.

### EC-2.5 — Candidate Refuses to Answer Certain Discovery Questions
- **Trigger:** NDA constraints, personal boundaries, or discomfort with specific questions
- **Severity:** 🟠 Medium
- **Impact:** Competency map has blind spots in those dimensions
- **Mitigation:** Mark the dimension as "Not Assessed" in `analysis/competency_map.md`. Attempt to infer from adjacent signals. Do not pressure.

---

## Stage 3: Transformation

### EC-3.1 — Reframing Crosses Into Fabrication Territory
- **Trigger:** The transformation engine produces bullets that materially misrepresent the candidate's actual role
- **Severity:** 🔴 Critical
- **Impact:** Violates core constraint; candidate fails interview verification
- **Mitigation:** Every transformed bullet must pass a **"Can you explain this in an interview?"** litmus test. Candidate reviews all bullets before finalization. System includes the original bullet alongside the reframed version for comparison.

### EC-3.2 — PM Jargon Overload Makes Resume Sound Inauthentic
- **Trigger:** Over-indexing on PM terminology produces bullets that sound like buzzword soup
- **Severity:** 🟡 High
- **Impact:** Experienced PMs / HMs see through the positioning; credibility drops
- **Mitigation:** Apply a **jargon density cap**: max 2 PM-specific terms per bullet. Balance with plain, outcome-focused language. Vary vocabulary across bullets.

### EC-3.3 — ATS Resume and One-Page Resume Diverge in Claims
- **Trigger:** Different optimization targets cause the two resume variants to tell inconsistent stories
- **Severity:** 🟡 High
- **Impact:** Recruiter who sees both versions loses trust; candidate appears inconsistent
- **Mitigation:** Both resumes must share a **canonical bullet set**. The ATS version may expand with keywords; the one-page version may condense — but core claims, metrics, and narrative arc must be identical.

### EC-3.4 — LinkedIn Rewrite Conflicts With Resume Narrative
- **Trigger:** LinkedIn tone (conversational, first-person) inadvertently reframes experience differently from resume
- **Severity:** 🟠 Medium
- **Impact:** Recruiters cross-referencing find mismatched narratives
- **Mitigation:** LinkedIn content must be derived **from** the resume canonical set, adapted for tone only. A consistency audit step compares key claims across resume and LinkedIn before finalization.

### EC-3.5 — No Quantifiable Metrics Available for Key Roles
- **Trigger:** Candidate's early career roles have no trackable business metrics
- **Severity:** 🟠 Medium
- **Impact:** Resume bullet formula cannot be fully applied
- **Mitigation:** Use **qualitative impact framing**: "Streamlined X, enabling Y" without fabricated numbers. Apply scope indicators instead: team size, stakeholder count, project duration, system complexity.

---

## Stage 4: Optimization

### EC-4.1 — ATS Score Plateaus Below 90 Despite Optimization
- **Trigger:** Resume passes 85 but can't break 90 without keyword stuffing or structural compromises
- **Severity:** 🟡 High
- **Impact:** Quality Gate G4 blocks; over-optimization risks readability
- **Mitigation:** Accept 85+ if keyword stuffing is the only path to 90. Document the trade-off in `analysis/keyword_strategy.md`. Focus on **keyword relevance** over density. Test against multiple ATS platforms — a 90 average across platforms is acceptable even if one platform scores 87.

### EC-4.2 — Different ATS Platforms Give Contradictory Scores
- **Trigger:** Enhancv scores 95, ResumeWorded scores 78, Jobscan scores 88 for the same resume
- **Severity:** 🟠 Medium
- **Impact:** Unclear whether resume is optimized; creates analysis paralysis
- **Mitigation:** Use a **weighted average** approach: prioritize Jobscan and ResumeWorded (most widely used). Target ≥ 88 on primary platforms, ≥ 85 on secondary.

### EC-4.3 — Compensation Positioning Feels Unrealistic for Profile Depth
- **Trigger:** The ₹20 → ₹35–40 LPA jump requires seniority signals the experience can't authentically support
- **Severity:** 🟡 High
- **Impact:** Candidate gets screened out for being "too junior" or gets offer-shocked at lower bands
- **Mitigation:** Define a **compensation range strategy**: (1) Lead with ₹30–35 LPA as primary target, (2) ₹35–40 LPA as stretch for AI-focused startups, (3) Include a compensation negotiation playbook in `outputs/interview_positioning.md`.

### EC-4.4 — Resume Formatting Breaks on PDF Export
- **Trigger:** Markdown → PDF conversion introduces layout issues
- **Severity:** 🟠 Medium
- **Impact:** ATS parsing fails; recruiter readability drops
- **Mitigation:** Use a tested MD → PDF pipeline. Test PDF output against ATS parsers **after** conversion. Keep "PDF-safe" formatting constraints.

---

## Stage 5: Outreach

### EC-5.1 — Outreach Templates Sound Generic Despite Personalization
- **Trigger:** Generated cold emails / LinkedIn messages read like templates despite variable insertion
- **Severity:** 🟡 High
- **Impact:** Low response rates; candidate's outreach blends into recruiter noise
- **Mitigation:** Each template must include a **[PERSONALIZATION_HOOK]** placeholder for company-specific insight. System generates 3 variant openings per template. Avoid "I came across your profile" patterns.

### EC-5.2 — Positioning Variant Mismatch With Target Company
- **Trigger:** Candidate uses "early-stage scrappy" messaging for a Series C company
- **Severity:** 🟠 Medium
- **Impact:** Tone mismatch signals poor research; reduces response probability
- **Mitigation:** Include a **company classification guide** in the outreach module. Each template variant is labeled with its target stage. Add a pre-send checklist.

### EC-5.3 — Follow-Up Cadence Becomes Spammy
- **Trigger:** Candidate sends too many follow-ups too quickly
- **Severity:** 🟠 Medium
- **Impact:** Candidate gets flagged/blocked; reputation damage
- **Mitigation:** Prescribe a **3-touch cadence**: (1) Initial outreach, (2) Value-add follow-up after 5–7 days, (3) Final gentle close after 10–14 days. Never more than 3 touches unless recipient engages.

### EC-5.4 — Outreach Volume Triggers LinkedIn Restrictions
- **Trigger:** Candidate sends > 100 connection requests/week
- **Severity:** 🟡 High
- **Impact:** LinkedIn account restricted; networking ability compromised
- **Mitigation:** Max 20–30 connection requests/day, max 50/week. Prioritize quality over volume. Recommend LinkedIn Premium for higher limits. Spread outreach across email + LinkedIn.

---

## Stage 6: Deployment & Iteration

> Edge cases specific to Phase 6 — the live, in-market deployment phase introduced by [DEC-14](./decisions.md#dec-14--phase-6-deployment--iteration-as-a-first-class-system-phase). These are distinct from Cross-Cutting cases below in that they emerge only after deliverables are deployed to the real market.

### EC-6.1 — Insufficient Market Signal for Pivot Decision
- **Trigger:** Candidate has sent < 30 outreach messages or has been deployed for < 2 weeks but is already considering a pivot based on early non-responses
- **Severity:** 🟠 Medium
- **Impact:** Pivoting on small samples wastes iteration cycles; risks compounding the wrong correction; ignores normal response-rate variance
- **Mitigation:** Enforce **minimum sample sizes** before any pivot loop is triggered — ≥ 30 outreach attempts **and** ≥ 2 weeks of market exposure. Make sample size visible in `analysis/market_feedback.md` (DEC-15). Apply the quantitative pivot triggers in DEC-16 strictly.

### EC-6.2 — Iteration Fatigue / Endless Tweaking
- **Trigger:** Candidate gets stuck in continuous iteration cycles (revising resume, retuning LinkedIn, regenerating outreach) without committing to sustained outbound effort
- **Severity:** 🟡 High
- **Impact:** Materials are never deployed at scale; success criteria can't be validated; candidate emotional exhaustion; missed market windows
- **Mitigation:** Cap iteration to **2–3 cycles per pivot reason**. After max iterations, accept current materials and shift focus to outreach volume. Time-box each iteration loop to a maximum of 1 week. Track iteration count in `analysis/market_feedback.md` so the cap is enforceable.

### EC-6.3 — Offer Arrives Mid-Pipeline (Before Phase 5 Complete)
- **Trigger:** Candidate receives a job offer from an unrelated source while still in Phase 3 or 4 (e.g., prior application, referral that pre-dated the system)
- **Severity:** 🟢 Low (it's a good problem) — but needs structured handling
- **Impact:** Pipeline may need to halt; candidate must decide whether to continue, pause, or partially-deploy
- **Mitigation:** Document a **"pause and evaluate" decision point**. The modular architecture (DEC-1) supports graceful exit — partial outputs (e.g., `outputs/interview_positioning.md` for the active offer's interview round) can be used immediately. If candidate accepts, archive the pipeline state to `outputs/archive/` for future reactivation.

### EC-6.4 — Contradictory Market Feedback Across Audience Types
- **Trigger:** 5 recruiters say "too junior for PM," 5 founders say "great execution fit." Mixed positive/negative across audience types.
- **Severity:** 🟡 High
- **Impact:** Pivoting in either direction risks alienating one audience; risk of paralysis
- **Mitigation:** Segment feedback by audience type (recruiter / HM / founder / referral contact) in `analysis/market_feedback.md` (DEC-15). When signals diverge by audience, lean into the audience that aligns with the **candidate's primary target compensation tier** (DEC-6). Recruiters typically gate-keep for established companies; founders gate-keep for early-stage AI startups. The positioning variants in `analysis/positioning_strategy.md` were designed exactly for this — switch variant rather than overhauling the canonical bullet set.

### EC-6.5 — Stealth Rollout Fails Despite Precautions
- **Trigger:** Despite disabling "Share profile updates," LinkedIn surfaces profile changes to the candidate's connections (algorithm change, new feature, or notification setting overridden)
- **Severity:** 🟠 Medium (escalates to 🔴 Critical if current employer is in the candidate's connection list)
- **Impact:** EC-X.5 risk materializes; current employer may notice job search activity
- **Mitigation:** **Pre-rollout audit** — use a test connection account to verify what changes are externally visible before each LinkedIn update. If updates surface despite settings, slow rollout to one element per 5–7 days. Use plausible-deniability framing: each individual change should look innocuous in isolation (skills tweak, headline polish, photo refresh). Never combine multiple sensitive updates in a single day.

---

## Stage 11: JD corpus & resume alignment (Phase 11)

> Introduced by [DEC-21](./decisions.md#dec-21--jd-corpus-as-first-class-resume-input-phase-11). Complements Phase 4 keyword work with **live posting** language.

### EC-11.1 — Keyword Stuffing / Overfitting to the Corpus or a Single JD
- **Trigger:** Resume reads like a tag cloud of JD terms; bullets exceed DEC-10 jargon cap; a single outlier JD steers wording that does not match most targets
- **Severity:** 🟡 High
- **Impact:** Human reviewers reject for incoherence; interview litmus (DEC-4) fails when challenged on depth
- **Mitigation:** Require **≥10 JDs** (target 20) before broad synthesis (architecture G10). For one-off JDs, label the pass as **narrow** in `jd_corpus_synthesis.md` §6. Map every high-frequency term to an **evidence anchor** in `inputs/experience.md` or achievements. Cap new phrases per bullet; prefer natural language over raw JD paste.

---

## Stage 12: Intel & Content Engine (Phase 12)

> Introduced by [DEC-24](./decisions.md#dec-24--intel-module-in-repo-with-rss-only-ingestion-phase-12)–[DEC-26](./decisions.md#dec-26--linkedin-post-ideas-style-samples--pillars-no-auto-post-phase-12). Detailed plan: [phase12_intel_content_engine.md](./phase12_intel_content_engine.md). **Daily ingest has no LLM** (DEC-25); weekly and post drafts are **on-demand only**.

### EC-12.1 — RSS Feed Dead, Moved, or Returns Empty
- **Trigger:** A curated source in `outputs/intel/sources.md` stops publishing, URL changes, or returns HTTP errors / empty items for several consecutive fetch runs
- **Severity:** 🟠 Medium
- **Impact:** Daily `feed/YYYY-MM-DD.md` under-represents a category; candidate may miss a trusted voice; `sources_healthy` / `sources_dead` counts mislead if not updated
- **Mitigation:** Fetch script logs per-source status in daily frontmatter; `/workbench/intel/sources` shows health badge. Candidate periodically reviews sources.md; disable or replace dead feeds. Do not backfill with scraped HTML in v1.

### EC-12.2 — LLM Weekly or Post Cites Non-Existent or Wrong URL
- **Trigger:** On-demand Groq output in `weekly/` or `posts/` references an article link not present in the included `feed/*.md` files, or misattributes a claim to the wrong source
- **Severity:** 🟡 High
- **Impact:** Credibility loss if candidate shares summary or post without checking; violates DEC-4 litmus if challenged in public writing
- **Mitigation:** `prompts/intel_weekly.md` requires feed-grounded claims; weekly API warns on URLs ∉ feed set. Posts: refer to news by name; no required link lists (DEC-26 voice-first). Candidate must review before publishing (G5-lite). Never auto-publish.

### EC-12.3 — LinkedIn Draft Off-Brand, Generic, or Overclaims
- **Trigger:** Generated post sounds like generic “AI thought leadership,” invents metrics, or conflicts with canonical resume/branding claims
- **Severity:** 🟡 High
- **Impact:** Weakens positioning; EC-2.3 / EC-3.1 risk if post contradicts resume or LinkedIn profile
- **Mitigation:** Prompt binds to `outputs/personal_branding.md` pillars and DEC-9 (no new facts). Prefer feed hooks + verified `inputs/` only. Regenerate with different pillar. Candidate edits before copy-paste to LinkedIn.

### EC-12.4 — `linkedin_style.md` Empty or Stale
- **Trigger:** Candidate has not pasted sample posts into `inputs/linkedin_style.md`, or samples are years old and no longer match desired voice
- **Severity:** 🟠 Medium
- **Impact:** Post generator falls back to pillar tone only (DEC-26); mimicry quality drops
- **Mitigation:** Template in `linkedin_style.md` with instructions; workbench note on posts page when file is empty. Candidate adds 3–5 representative posts before relying on generator for high-stakes weeks.

### EC-12.5 — `outputs/intel/feed/` Grows Without Bound
- **Trigger:** Daily cron runs for months; hundreds of markdown files accumulate; repo clone and workbench date lists slow down
- **Severity:** 🟢 Low
- **Impact:** Operational friction; git noise on every daily commit
- **Mitigation:** Archive policy: move `feed/`, `weekly/`, `posts/` older than 90 days to `outputs/intel/_archive/` (manual or script). Optional: cron opens PR instead of direct push to main. Document in `outputs/intel/README.md`.

### EC-12.6 — Groq API Failure, Rate Limit, or Missing Key
- **Trigger:** `GROQ_API_KEY` unset in `frontend/.env`, key rotated, rate limit hit, or network error during `POST /api/intel/weekly` or `POST /api/intel/posts`
- **Severity:** 🟠 Medium
- **Impact:** Generate button fails; no partial file written; user confusion if error message is unclear
- **Mitigation:** API routes fail closed — do not write `weekly/` or `posts/` on error. Return clear JSON error to UI. Daily feed unaffected (no Groq on cron). Retry manually.

### EC-12.7 — Duplicate Items Across Sources Same Day
- **Trigger:** Same article URL appears in multiple RSS feeds (syndication, cross-posts) or same title from aggregators
- **Severity:** 🟢 Low
- **Impact:** Noisy daily feed; inflated `item_count` in frontmatter
- **Mitigation:** Dedup by canonical URL within each `feed/YYYY-MM-DD.md`. Optional: normalize URLs (strip UTM params) in `fetch.ts`.

### EC-12.8 — Accidental LLM in Daily Cron
- **Trigger:** Future contributor adds summarization step to `intel-daily.yml` or `fetch.ts`, violating DEC-25
- **Severity:** 🔴 Critical (process violation)
- **Impact:** Daily “as-is” guarantee broken; trust in feed erodes
- **Mitigation:** Code review checklist; no `groq` / `openai` imports in `scripts/intel/fetch.ts`. Workflow file comment header: “RSS only — no LLM.” Phase A exit criteria explicitly tests absence of LLM calls.

---

## Stage 7: Frontend (NorthStar AI)

> Edge cases specific to Phases 7–9 — the NorthStar AI web app ([DEC-17](./decisions.md#dec-17--frontend-hosting-subdomain-of-existing-portfolio)–[DEC-20](./decisions.md#dec-20--workbench-auth-shared-passcode-in-v1-email-link-upgrade-path)). **Phase 10 (production deploy) is discarded** ([DEC-22](./decisions.md#dec-22--phase-10-discarded-private-local-career-os-only)); default use is **local/private**. EC-7.4 applies only if the candidate self-hosts or links from a portfolio.

### EC-7.1 — Privacy Leak via Frontend (Sensitive Content Exposed Publicly)
- **Trigger:** A workbench-only artifact (outreach template, comp negotiation playbook, interview weakness reframing, market feedback) becomes accessible without auth — via misconfigured route, leaked passcode, search-engine indexing of cached content, or a developer accidentally importing a private MD file into a public route component
- **Severity:** 🔴 Critical (escalates EC-X.5 — current employer or hiring manager finds material that compromises positioning)
- **Impact:** Job search exposed; comp negotiation leverage lost; outreach copy can be scraped or pre-empted
- **Mitigation:** **Three layers** — (1) Routing boundary + `middleware.ts` passcode on `/workbench/*`; (2) `content_contract.md` per-route allowlist; (3) If self-hosting: candidate runs an incognito spot-check on public routes. `noindex, nofollow` on workbench routes (already in middleware). **Local-only use (DEC-22)** minimizes exposure.

### EC-7.2 — UI Drift From Markdown Source
- **Trigger:** Frontend caches stale content; markdown updated in `outputs/` but UI still shows old version (build skipped, ISR cache, manual deploy missed)
- **Severity:** 🟡 High
- **Impact:** Recruiter clicks the link expecting v1.2 resume, sees v1.0 — credibility hit; metrics or claims may be out of date or inconsistent with a PDF the candidate sent separately
- **Mitigation:** Build-time SSG only (DEC-19). Sync footer on every view (EC-7.2). After editing `outputs/`, restart dev server or rebuild locally.

### EC-7.3 — PDF Export Regresses From Markdown View
- **Trigger:** The HTML view renders correctly but the generated PDF (Playwright or Phase 4 export) loses formatting, drops the ₹ symbol, breaks ATS parsability, or paginates poorly
- **Severity:** 🟠 Medium (extension of EC-4.4)
- **Impact:** Downloaded PDF is what recruiters actually screen; if it doesn't match the on-screen experience, the candidate is shipping a worse asset than they think
- **Mitigation:** PDF generation runs in CI on every build with the exact same source markdown as the HTML view. Phase 8 exit criteria includes a re-parse check: generated PDF text extraction must match the rendered HTML text within tolerance. Use `outputs/pdf_export_guide.md` checks as a CI test fixture.

### EC-7.4 — Portfolio Integration Breaks Existing UX
- **Trigger:** Adding a `NorthStar AI →` CTA on the public portfolio breaks an existing animation, navigation flow, or page layout — or NorthStar AI visual style clashes with the portfolio
- **Severity:** 🟠 Medium (only if candidate links portfolio — **N/A for default local-only use**, DEC-22)
- **Impact:** Portfolio UX degraded; first impressions suffer
- **Mitigation:** **Out of pipeline scope.** If integrating manually: use a single discreet link; keep deploys independent (DEC-17 subdomain model optional).

### EC-7.5 — Auth Bypass or Brittleness
- **Trigger:** The shared-passcode middleware (DEC-20) fails open due to a deploy misconfiguration (missing env var, middleware excluded from a route, `matcher` pattern too narrow), or the passcode leaks via screenshot/Slack/forwarded email
- **Severity:** 🟡 High (escalates to 🔴 Critical if leaked passcode reaches the current employer)
- **Impact:** Workbench content accessible to unauthorized parties; full EC-X.5 / EC-7.1 chain triggers
- **Mitigation:** Fail-closed middleware; set `WORKBENCH_PASSCODE` in `.env` for local/self-host. Spot-check: no passcode / wrong passcode must deny `/workbench/*`. Rotate passcode if leaked.

---

## Cross-Cutting Edge Cases

### EC-X.1 — Candidate Changes Target Roles Mid-Pipeline
- **Trigger:** After Discovery, candidate decides to target Product Operations or Growth roles instead of core PM
- **Severity:** 🟡 High
- **Impact:** Keyword strategy, positioning, and outreach templates all need rework
- **Mitigation:** Architecture supports this via modular pipeline — only Stages 3–5 need re-execution. Stage 1–2 outputs remain valid. Budget for one pivot without full pipeline restart.

### EC-X.2 — Market Conditions Shift (Hiring Freeze, AI Hype Cycle)
- **Trigger:** Startup hiring freezes, or "AI PM" becomes an oversaturated keyword
- **Severity:** 🟠 Medium
- **Impact:** Positioning strategy becomes stale; outreach response rates drop
- **Mitigation:** Positioning strategy should include **2–3 narrative variants** that can be swapped without full pipeline re-run. Monitor keyword trends quarterly.

### EC-X.3 — Candidate Gets an Offer Below Target Range
- **Trigger:** Interview converts but offer comes in at ₹25–28 LPA instead of ₹35–40 LPA
- **Severity:** 🟠 Medium
- **Impact:** Candidate needs negotiation support not originally scoped
- **Mitigation:** `outputs/interview_positioning.md` should include a **compensation negotiation section**: anchoring strategies, counter-offer templates, equity valuation frameworks, and "walk-away" thresholds.

### EC-X.4 — Multiple Pipeline Iterations Cause Version Confusion
- **Trigger:** After 3+ rounds of feedback, multiple versions of resume/LinkedIn exist
- **Severity:** 🟢 Low
- **Impact:** Candidate submits outdated version; inconsistency between submitted materials
- **Mitigation:** All deliverables in `outputs/` are the **single source of truth**. Previous versions archived in `outputs/archive/v{N}/`. Every deliverable includes a version header with date.

### EC-X.5 — Candidate's Current Employer Discovers Job Search
- **Trigger:** Updated LinkedIn profile or public resume signals active job search to current employer
- **Severity:** 🔴 Critical
- **Impact:** Employment jeopardized before new role secured
- **Mitigation:** LinkedIn rewrite includes a **stealth mode checklist**: (1) Update gradually over 2–3 weeks, (2) Turn off "Share profile updates," (3) Use "Open to Work" in private mode (visible to recruiters only), (4) Never mention "looking for new roles" in public posts. Resume shared only via direct channels.

---

## Summary Matrix

| ID | Edge Case | Severity | Stage |
|---|---|---|---|
| EC-1.1 | Unstructured resume PDF | 🔴 Critical | Ingestion |
| EC-1.2 | Private LinkedIn profile | 🟡 High | Ingestion |
| EC-1.3 | Missing candidate inputs | 🟡 High | Ingestion |
| EC-1.4 | Divergent sample resumes | 🟢 Low | Ingestion |
| EC-2.1 | Vague candidate responses | 🟡 High | Discovery |
| EC-2.2 | Genuine PM experience gaps | 🔴 Critical | Discovery |
| EC-2.3 | Candidate over-claims | 🔴 Critical | Discovery |
| EC-2.4 | Career gaps / short tenures | 🟠 Medium | Discovery |
| EC-2.5 | Refused discovery questions | 🟠 Medium | Discovery |
| EC-3.1 | Reframing → fabrication | 🔴 Critical | Transformation |
| EC-3.2 | PM jargon overload | 🟡 High | Transformation |
| EC-3.3 | Resume variant divergence | 🟡 High | Transformation |
| EC-3.4 | LinkedIn-resume mismatch | 🟠 Medium | Transformation |
| EC-3.5 | No quantifiable metrics | 🟠 Medium | Transformation |
| EC-4.1 | ATS score plateau < 90 | 🟡 High | Optimization |
| EC-4.2 | Contradictory ATS scores | 🟠 Medium | Optimization |
| EC-4.3 | Unrealistic comp positioning | 🟡 High | Optimization |
| EC-4.4 | PDF export breaks formatting | 🟠 Medium | Optimization |
| EC-5.1 | Generic outreach templates | 🟡 High | Outreach |
| EC-5.2 | Positioning-company mismatch | 🟠 Medium | Outreach |
| EC-5.3 | Spammy follow-up cadence | 🟠 Medium | Outreach |
| EC-5.4 | LinkedIn rate limiting | 🟡 High | Outreach |
| EC-6.1 | Insufficient market signal for pivot | 🟠 Medium | Deployment |
| EC-6.2 | Iteration fatigue / endless tweaking | 🟡 High | Deployment |
| EC-6.3 | Offer arrives mid-pipeline | 🟢 Low | Deployment |
| EC-6.4 | Contradictory feedback across audiences | 🟡 High | Deployment |
| EC-6.5 | Stealth rollout fails | 🟠 Medium | Deployment |
| EC-11.1 | JD keyword stuffing / overfitting | 🟡 High | JD alignment |
| EC-7.1 | Privacy leak via frontend | 🔴 Critical | Frontend |
| EC-7.2 | UI drift from MD source | 🟡 High | Frontend |
| EC-7.3 | PDF export regression vs MD view | 🟠 Medium | Frontend |
| EC-7.4 | Portfolio integration breaks UX | 🟠 Medium | Frontend |
| EC-7.5 | Auth bypass / brittleness | 🟡 High | Frontend |
| EC-X.1 | Target role pivot mid-pipeline | 🟡 High | Cross-cutting |
| EC-X.2 | Market condition shifts | 🟠 Medium | Cross-cutting |
| EC-X.3 | Below-target offer | 🟠 Medium | Cross-cutting |
| EC-X.4 | Version confusion | 🟢 Low | Cross-cutting |
| EC-X.5 | Employer discovers job search | 🔴 Critical | Cross-cutting |

---

*Review alongside [architecture.md](./architecture.md) and [decisions.md](./decisions.md). Edge cases inform design decisions and quality gate criteria.*
