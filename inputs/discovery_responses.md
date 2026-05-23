# Discovery Responses

> **Date:** 2026-05-15 (initial) · **Supplement:** 2026-05-18 (portfolio AI products)
> **Status:** ✅ Complete — candidate-validated (G2 passed); supplement adds Mutual Fund RAG + Groww Review Analyzer
> **Source:** Candidate-provided answers, rewritten for clarity and PM signal extraction

> **Superseded narratives (archived in resume v1.2 and earlier):** AI Restaurant Recommendation Engine (Q2, pre-2026-05-18); Client Reporting MVP + RLS BigQuery chatbot (Q7, pre-2026-05-18). Current canonical projects: `inputs/experience.md` §4.

---

## Product Thinking & Strategy

**Q1:** In your WPP or Annalect roles, did you ever have to say "no" to a stakeholder's automation request because it didn't align with the broader business strategy? How did you handle it?

**A1:** Yes — on multiple occasions. I declined requests that did not align with broader business strategy or quarterly priorities by grounding the decision in data: estimated delivery time, FTE effort, projected revenue or cost savings, and how the request mapped to quarterly goal KPIs. This kept prioritization objective, reduced stakeholder friction, and ensured the team focused on high-impact automation work rather than low-value backlog items.

**Target signals extracted:** Prioritization, data-driven decision-making, stakeholder management, strategic alignment

---

**Q2:** For the **Review Analyzer AI Agent (Groww)**, what problem were you solving and how did you decide what the product had to do each week?

**A2:** Groww leadership needed a **single, reliable view of voice of the customer**—what App Store and Play Store users were actually experiencing recently—without manually reading hundreds of reviews every week.

I scoped the product around a **weekly leadership workflow**, not a generic analytics dashboard:

1. **Ingest** reviews from the **last 7 days** (App Store + Play Store).
2. **Merge** with a **rolling 3-month corpus** already stored from prior runs (so trends and recurring themes are visible, not just last week's noise).
3. **Synthesize** into **real problems and concrete action items**—not sentiment scores alone.
4. **Deliver** in formats leadership already uses: a **Google Doc** summary and an **email-ready** version (no manual copy-paste assembly before send).
5. **Surface** the same insights on a **Google Stitch** frontend (Groww design-system inspiration) as the single interface to check "what users are feeling lately."

The architecture is **productizable beyond Groww**—the same agent pattern can plug into other apps by swapping review sources and branding.

**Target signals extracted:** Voice of customer (VoC), product discovery, leadership workflows, agentic product design, B2C fintech context

---

**Q3:** Have you ever identified an internal user pain point before they explicitly asked for a solution? What did you do?

**A3:** Yes — at WPP Media, I identified systemic friction in the internal automation request intake process before it was formally escalated. Requests sat in queue for long periods, delaying first-contact TAT. BRD/SOW preparation, project tracking, and leadership approvals were all manual and disconnected.

I orchestrated an end-to-end pipeline fix:

- **Auto-scheduling:** Discovery meetings are automatically booked within the next 3 working days by checking calendar availability.
- **One-click documentation:** BRD and SOW are generated from request-form inputs and explained via an LLM backend with a single click.
- **Auto-sync to delivery tools:** Requests are automatically created/updated in Wrike and Jira.
- **Approval automation:** When approvals are due, draft emails are auto-generated in Outlook and Microsoft Teams; project status updates propagate across systems.

**Target signals extracted:** Proactive problem identification, product ops, workflow automation, LLM integration, cross-functional orchestration

---

## Impact & Metrics

**Q4:** Beyond efficiency and cost savings, did any of your automation projects directly impact revenue, user retention, or customer satisfaction? Can you estimate the impact?

**A4:** Most of my projects target internal efficiency, but each delivery is tied to measurable business impact through our time, FTE, and cost-savings calculator — so revenue impact is quantified at go-live. These initiatives modernize traditional workflows; adoption is initially a challenge but succeeds through training and clear value propositions.

**Personal delivery metrics (self-reported):**


| Metric                | Value      |
| --------------------- | ---------- |
| Adoption success rate | **80%**    |
| Retention             | **100%**   |
| Churn                 | **0%**     |
| Customer satisfaction | **85–90%** |


Retention stays at 100% because delivered value is strong and modification requests are handled with fast TAT. Satisfaction is slightly below perfect because some users still prefer legacy manual workflows.

**Target signals extracted:** Adoption, retention, churn, CSAT, revenue linkage, change management

---

**Q5:** How did you measure the "adoption" or "success" of the internal tools you delivered at WPP? What specific metrics did you track?

**A5:** I tracked adoption and product success using a structured metrics stack:

- **Reach:** Impacted team size and count of active users
- **Engagement:** Usage rate per user and average time spent in the tool
- **Outcome:** Task completion rates

These metrics were reviewed to validate whether tools were actually used in daily workflows — not just deployed.

**Target signals extracted:** Product analytics, adoption metrics, usage monitoring, KPI ownership

---

## Leadership & Startup Fit

**Q6:** Describe a time you had to make a significant project decision with incomplete data or high ambiguity. What was the outcome?

**A6:** **Context:** We were asked to fully automate **Meta campaign activation** for the internal India implementation team. Manual entry errors had caused major financial losses in the past; leadership required zero manual touchpoints in the setup flow.

**Ambiguity:** The team lacked deep domain knowledge of media briefing, planning, implementation, and reporting. Discovery clarified the end-to-end flow, but campaign setup involved many small permutations and edge cases — too many to map and implement within the original deadline.

**Decision:** I proposed a **phased delivery approach** — ship Phases 1 and 2 within the deadline to demonstrate maximum early impact, then use Phases 3 and 4 to navigate remaining ambiguity with cross-functional teams.

**Outcome:**


| Metric                | Result                            |
| --------------------- | --------------------------------- |
| Delivery model        | 4 phases, cross-functional buy-in |
| FTE savings           | **35%**                           |
| Setup errors          | **0**                             |
| Adoption              | **100%**                          |
| Customer satisfaction | **86%**                           |
| Department savings    | **~₹1.5 Cr+**                     |


**Target signals extracted:** Ambiguity handling, phased roadmap, cross-functional leadership, high-stakes automation, revenue impact

---

**Q7:** Tell me about a production AI product you shipped outside your day job—how did you validate the idea and what does the system do end-to-end?

**A7:** I built the **Mutual Fund Factual Response RAG Chatbot** to solve a clear gap: people needed a **common, reliable, facts-only** interface for mutual fund information—in **plain human language**—instead of scattered pages and inconsistent summaries.

**Problem:** Users wanted trustworthy fund facts quickly, with sources they could verify.

**Solution (scheduled + on-demand):**

- **Weekday 9:45 AM pipeline:** Scrape/ingest from configured mutual fund URLs → extract → parse → chunk → embed with **bge-small-en** → store in **ChromaDB**.
- **On user query:** Vector search over relevant embeddings → context + user question → **Groq LLM** → **two-line answer** with **citation links** to the specific fund pages referenced.
- **Latency target:** Full flow completes in **≤3 seconds**.
- **Stack:** Backend on **Render**, frontend on **Vercel**; UI built with **Google Stitch** (Groww design-system inspiration).

**Traction:** The tool has been **used, reviewed, and trusted by 200+ people** (candidate-reported).

**Target signals extracted:** RAG, production AI, scheduled data pipelines, embeddings/vector DB, full-stack shipment, consumer fintech-adjacent domain, speed/latency as product requirement

---

## Portfolio AI Products — Technical & Agentic Detail (Supplement 2026-05-18)

**Q8:** Walk through the **Review Analyzer** agent architecture—what runs automatically vs. what leadership does?

**A8:**

| Layer | What happens |
| ----- | ------------ |
| **Trigger** | Weekly job fires; an **AI agent** runs the full workflow (no manual steps in the happy path). |
| **Data** | Pull **last 1 week** of App Store + Play Store reviews; combine with **last 3 months** of reviews already ingested. |
| **Intelligence** | Agent synthesizes **real user problems** and **action items** (not generic summaries). |
| **Delivery** | Outputs leadership-ready **Google Doc** + **email** body via **MCP server** integrations (**Google Docs** + **Gmail**). |
| **UI** | **Google Stitch** frontend reflects the same themes—single place to see recent user experience. |
| **Scope** | Built for **Groww** first; designed so other products can plug in different app IDs and branding. |

**Why MCP:** Leadership already lives in Docs and email—meeting them there reduces friction vs. forcing a new tool-only workflow.

**Target signals extracted:** Agentic AI, MCP, VoC automation, executive reporting, extensible platform thinking

---

**Q10:** Walk through your **Swish** research—what did you investigate and what did you ship?

**A10:** Swish markets **fresh food at your door in 10 minutes**. I used the product personally and read **App Store + Play Store** reviews; the same four problems kept surfacing: **(1)** orders taking **more than 10 minutes**, **(2)** **surge/unavailability** at peak, **(3)** **no rider assigned** even after food is ready, and **(4)** **low-quality support** making recovery worse. When the brand is built on speed, every miss is a **breach of trust**—and trust is hardest to rebuild at scale.

I broke it down the way a PM would: user personas, the exact moments trust breaks, and what the gap costs at current scale (and what it could amplify to). I shipped a full **6-part series on LinkedIn** (all complete), including:

1. **Problem & Opportunity Brief** — failure-mode analysis, personas, trust moments, scale cost/opportunity  
2. **Product roadmap** — phased fixes for SLA, ops transparency, and service recovery  
3. **PRDs and wireframes** — spec and UX artifacts (Whimsical, RICE, user + competitor research)

**Target signals extracted:** B2C/quick commerce, VoC/review mining, problem structuring, PRD/roadmap, prototyping, trust/SLA thinking, ops-adjacent delivery assignment

---

**Q9:** What trade-offs did you make on the **Mutual Fund RAG** product (accuracy vs. speed vs. scope)?

**A9:**

- **Facts-only:** Deliberately constrained answers to ingested fund data—no open-ended financial advice—to keep trust high and hallucination risk low.
- **Two-line answers:** Optimized for scanability on mobile; citations carry the depth.
- **bge-small-en + ChromaDB:** Chosen for a balance of embedding quality and operational simplicity on a personal/side-project budget.
- **Daily ingestion cadence (weekdays 9:45 AM):** Fresh enough for fund facts without over-engineering real-time scrapes on day one.

**Target signals extracted:** Product constraints, trust/safety framing, pragmatic technical choices

---

## Summary — High-Value PM Signals for Downstream Use


| Category                 | Key evidence                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| **Prioritization**       | RICE (historical); data-backed "no" decisions; VoC scoping for Review Analyzer                  |
| **Product ops**          | End-to-end intake pipeline automation (scheduling, docs, Wrike/Jira, approvals)                 |
| **Metrics ownership**    | Adoption (80%), retention (100%), churn (0%), CSAT (85–90%), usage analytics                    |
| **Ambiguity & shipping** | 4-phase Meta automation (₹1.5 Cr+ impact)                                                       |
| **AI-native / RAG**      | Mutual fund RAG chatbot (ChromaDB, Groq, ≤3s, 200+ users); scheduled ingestion pipeline         |
| **Agentic / VoC**        | Groww Review Analyzer—weekly App/Play reviews → leadership Doc/email via MCP; Google Stitch UI  |


> **Validated:** Core WPP/Annalect metrics confirmed 2026-05-15. Portfolio AI product details added 2026-05-18 from candidate narrative—align with `outputs/resume_*.md` v1.4 and `inputs/experience.md`. Fed into competency map, interview positioning, and outreach (DEC-9).
