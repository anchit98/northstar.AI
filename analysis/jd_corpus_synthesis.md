---
version: "1.0"
date: "2026-05-18"
status: synthesized
jd_files_expected: 20
jd_files_ingested: 20
corpus_note: "jd-15.md is Proofpoint company/culture overview (not a PM role spec); counted for employer-stage language only."
---

# JD corpus — keyword synthesis & resume alignment map

> **Phase 11** | Corpus: `inputs/job_descriptions/jd-01.md` … `jd-20.md`. Drives updates to `outputs/resume_ats_optimized.md` and `outputs/resume_one_page.md` without fabricating experience (DEC-4, DEC-9). **Layout:** `docs/resume_structure.md` (DEC-23). Jargon density per bullet obeys DEC-10.

## 1. Corpus metadata

| Field | Value |
|---|---|
| JD files ingested | 20 / 20 |
| Source index (H1 titles) | Razorpay (jd-01) · Groww (jd-02) · zenda FinOps (jd-03) · Post-order CX (jd-04) · B2C classifieds / marketplace growth (jd-05) · Booking Traveller Intelligence Platform (jd-06) · Cvent TPM (jd-07) · PhonePe Growth Platforms (jd-08) · Agentic AI / RAG (jd-09) · Indicolabs (jd-10) · Scapia Sr PM (jd-11) · Adobe Advertising Principal PM (jd-12) · CodeRound AI hiring (jd-13) · DigiCert AI-Native DNS & Trust (jd-14) · Proofpoint overview (jd-15) · ALLEN Digital AI PM (jd-16) · Meesho PM I (jd-17) · Ralph Lauren Data Products PM (jd-18) · Pine Labs AI APM (jd-19) · Libra AI PM (jd-20) |
| Dominant company stage | Mix: late-stage / public-adjacent (Adobe, Booking, PhonePe, Razorpay, Groww, Proofpoint, DigiCert) + growth / AI-native startups (Libra, Pine Labs, CodeRound, Indicolabs, Scapia, zenda, Meesho, ALLEN) |
| Dominant seniority | IC PM to Principal PM; several explicitly **technical / platform** PM |

## 2. High-frequency terms & phrases

Counts below are **number of JD files (of 20) containing ≥1 match** for the pattern (case-insensitive), not raw token counts. Patterns combine close variants where noted.

| Term / phrase | Files (of 20) | Map to evidence (resume / experience) |
|---|---|---|
| Roadmap / roadmapping | 14 | WPP Meta 4-phase roadmap; intake + strategic initiatives; NextLeap case studies (`outputs/resume_ats_optimized.md` — WPP bullets, PROJECTS) |
| Stakeholder(s) / stakeholder management | 13 | WPP stakeholder alignment, signoffs, cross-functional leadership; Annalect; Servetel training (`inputs/experience.md`) |
| Cross-functional | 17 | WPP engineering + ops 15+; Meta automation; Annalect |
| Platform / platforms | 15 | Internal tooling + reporting platform narrative; BigQuery client layer; PhonePe/Booking/Cvent corpus language → phrase **platform** in Skills + reporting MVP context |
| API / integration | 16 | Wrike/Jira sync, Outlook/Teams flows, BigQuery + Admin Center; Cvent-style TPM adjacent phrasing in Skills only where not over-claiming |
| Discovery / problem discovery | 10 | WPP product discovery (200+ initiatives); case studies |
| Metrics / KPI / analytics / optimization | ~18 | Quarterly KPIs, adoption, CSAT, FTE, revenue; Annalect Power BI; Servetel forecasting |
| Experiment / A/B / testing | 14 | Skills: Experimentation, A/B Testing; NextLeap PRD case studies |
| AI / ML / LLM (broad) | 14 | LLM BRD/SOW, Annalect LLM in BA workflows; mutual fund RAG + Review Analyzer agent |
| RAG / agentic / generative (explicit) | 6 | jd-09, jd-13, jd-14, jd-16, jd-19, jd-20 (+ jd-01 “generative”); resume has **RAG** in Skills; evidence: mutual fund RAG chatbot (ChromaDB, bge-small-en, Groq, citations, ≤3s) |
| GTM / go-to-market | 3–4 | jd-01 Launch Products; jd-14 GTM; jd-17 GTM planning; resume: GTM Alignment; Servetel GTM execution |
| Data governance / trust / quality | 6–8 | RLS, Admin Center, Ralph Lauren / DigiCert language → keep RLS + permissions explicit |
| B2C / consumer / growth funnel | 8+ | NextLeap Swish, voice PRD, segmentation; Servetel sales; corpus asks for **consumer-scale** — partial (internal B2B heavy) |
| Agile / backlog / user stories | 10+ | Sprint planning, Wrike, Jira, UAT |
| Technical PM / PRD / specs | 12+ | BRD/SOW, PRDs in projects, RTM Annalect |

**Tools / stack (recurring, optional ATS tokens):** SQL, BigQuery, Power BI, Jira, experimentation culture, cloud/API context (DigiCert, Cvent, Adobe). Candidate evidence concentrates on **BigQuery, SQL, Power BI, Jira, Wrike, Cursor, LLM tooling** — do not add AWS/GCP certs or DNS/PKI ownership without source proof.

## 3. Capability clusters (JD language → your proof)

| Cluster | JD wording (examples) | Your anchor (no new facts) |
|---|---|---|
| AI / GenAI | Agentic AI, RAG, LLM products, AI-native workflows, Pine Labs “forward deployed” | WPP: LLM-generated BRD/SOW; Annalect: LLM in BA workflows; Projects: mutual fund RAG chatbot, Groww Review Analyzer agent, prompt engineering |
| Metrics / growth | KPI ownership, funnel, retention, cohorts, experimentation | WPP adoption/retention/churn/CSAT; quarterly KPI prioritization; NextLeap segmentation & voice PRD |
| Stakeholder / exec | Alignment, communication, leadership without authority | 90%+ stakeholder alignment; 100% approval signoffs; training & change management |
| Technical / data | Platform, API integrations, SQL, governance, TPM-style specs | Wrike/Jira/Teams automation; mutual fund RAG data pipeline; SQL/Power BI in Skills; RTM Annalect |
| B2B / SaaS / internal product | Internal tools, operational scalability, enterprise stakeholders | Choreograph internal automation at scale; “internal product ownership” already present |
| Consumer / marketplace | CRM, SEO, post-order CX, classifieds growth | Partial: NextLeap cases (funnel, retention); Servetel GTM — not same as marketplace PM at scale |

## 4. Gaps (JD asks for X; you have partial / none)

| Gap | Severity | Mitigation (honest framing / learning plan / portfolio) |
|---|---|---|
| DNS / PKI / certificate lifecycle (DigiCert-style) | High for that niche | Do not claim. Interview: map to **trust, governance, permissions** via RLS/Admin Center story. |
| Mobile consumer PM at PhonePe/Meesho scale | Medium | Emphasize **metrics, experimentation, funnel** from NextLeap + **operational** scale at WPP; avoid implying consumer app shipping at telco/Meesho scale. |
| Finance ops: reconciliation, disputes, gateway SLAs (zenda) | Medium | Servetel + forecasting shows analytical ops; do not claim payments reconciliation ownership. Use **SLA-oriented** language only where Swish/support cases support it. |
| Advertising / bid systems (Adobe) | High for ad-tech | Map to **platform + API + cross-functional** generically; no ad-server claims. |
| “Proofpoint-style” enterprise security PM | N/A for jd-15 | jd-15 is culture doc — ignore for keyword alignment. |

## 5. Resume edit checklist (ATS + one-page)

- [x] Skills / keyword block: add corpus-backed tokens with DEC-10 cap (platform thinking, voice of customer, optional RAG-adjacent phrasing where already true)
- [x] Experience bullets: insert **must-have** themes only where already true (governed data access ↔ retrieval patterns; customer-centric discovery)
- [x] One-page: mirror Skills tightening + one BigQuery line refinement
- [ ] Re-run ATS audit checklist (`outputs/pdf_export_guide.md`) before next PDF export

## 6. Rolling single-JD log (optional)

| Date | Source | Key new terms | Resume version |
|---|---|---|---|
| 2026-05-18 | Full corpus jd-01…jd-20 | Platform, RAG/agentic cluster, TPM/API, experimentation density | 1.2 |
| 2026-05-18 | Project swap | Mutual fund RAG chatbot replaces Client Reporting MVP | 1.3 |
| 2026-05-18 | Project swap | Review Analyzer AI agent replaces Restaurant Engine | 1.4 |
