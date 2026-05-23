---
version: "1.0"
date: "2026-05-17"
status: active
deployment_start: "2026-05-17"
active_narrative_variant: A
comp_floor_lpa: 25
comp_primary_lpa: 30
comp_stretch_lpa: 40
linkedin:
  week1_headline_skills: false
  week2_about: false
  week3_experience: false
  open_to_work_recruiter_only: false
  share_updates_disabled: true
  stealth_audit_done: false
metrics:
  email_outreach_sent: 0
  email_responses: 0
  linkedin_requests_sent: 0
  linkedin_accepted: 0
  linkedin_replies: 0
  callbacks: 0
  phone_screens: 0
  onsite_rounds: 0
  final_rounds: 0
iterations:
  phase4_positioning: 0
  phase3_seniority: 0
  comp_tier: 0
feedback_signals:
  too_junior: []
  over_reaching: []
  positive_fit: []
offers: []
pivot_override: null
last_updated: "2026-05-17"
---

# Market Feedback — Phase 6 Deployment Log

> **Version:** 1.0 | **Date:** 2026-05-17
> **Purpose:** Structured in-market signal capture (DEC-15). Drives pivot decisions per DEC-16 with EC-6.1 minimum sample guards.
> **Status:** `active` — update `metrics` in frontmatter weekly; add one row per outreach touch below.

---

## 1. Deployment Checklist (DEC-7 · EC-X.5 · EC-6.5)

Complete in order. Toggle booleans in YAML `linkedin:` block when done.

| Step | Action | EC / DEC | Done |
|---|---|---|---|
| 1 | **Stealth audit** — verify with a test connection what is visible before any change (EC-6.5) | EC-6.5 | ☐ |
| 2 | Disable **"Share profile updates"** on LinkedIn | DEC-7 | ☐ |
| 3 | **Week 1:** Apply headline + skills from `outputs/linkedin_rewrite.md` | DEC-7 | ☐ |
| 4 | **Week 2:** Apply About section | DEC-7 | ☐ |
| 5 | **Week 3:** Apply Experience bullets | DEC-7 | ☐ |
| 6 | Enable **Open to Work** — recruiters only (not public) | EC-X.5 | ☐ |
| 7 | Begin outbound using `outputs/outreach/` — respect EC-5.4 volume caps | EC-5.4 | ☐ |

**Volume limits (EC-5.4):** Max 20–30 LinkedIn connection requests/day · 50–100/week · always personalize.

**Cadence (EC-5.3):** Max 3 touches per contact unless they engage · Day 1 → Day 5–7 value-add → Day 10–14 gentle close.

---

## 2. Aggregated Metrics (update frontmatter `metrics:`)

| Metric | Current | Target / note |
|---|---|---|
| Email outreach sent | 0 | Track in `metrics.email_outreach_sent` |
| Email responses | 0 | |
| LinkedIn requests sent | 0 | Cap 20–30/day |
| LinkedIn accepted | 0 | |
| LinkedIn replies | 0 | |
| Callbacks / screens | 0 | `metrics.callbacks`, `phone_screens` |
| Response rate | 0% | Auto-computed in NorthStar AI when ≥ 1 send |
| Days deployed | 0 | From `deployment_start` |

**Minimum before pivot evaluation (EC-6.1):** ≥ 30 total outreach attempts **and** ≥ 14 days deployed.

---

## 3. Pivot Triggers (DEC-16)

| Trigger | Threshold | Re-enter | Iteration cap (EC-6.2) |
|---|---|---|---|
| Low response rate | < 5% over ≥ 50 attempts (after EC-6.1 minimum) | Phase 4 — keyword / positioning | Max 3× → `iterations.phase4_positioning` |
| "Too junior" feedback | ≥ 3 distinct sources | Phase 3 — seniority signaling | Max 3× → `iterations.phase3_seniority` |
| Offers below floor | > 20% below ₹25L floor band | Re-tune DEC-6 tiers | Max 3× → `iterations.comp_tier` |
| Target role pivot | Candidate decision (EC-X.1) | Phase 3 from new target | — |
| Market / hype shift | EC-X.2 | Swap variant A/B/C only | No full pipeline |
| Contradictory audiences | EC-6.4 | Switch variant per primary comp tier | See `positioning_strategy.md` |

**Override:** Set `pivot_override: "<reason>"` in frontmatter if pivoting before thresholds (document why).

---

## 4. Outreach Log (one row per touch — DEC-15)

Add rows as you send. NorthStar AI parses this table for the dashboard.

| Date | Channel | Audience | Company | Contact | Touch | Response | Signal | Notes |
|---|---|---|---|---|---|---|---|---|
| _example_ | LinkedIn | Founder | Acme AI | — | 1 | pending | neutral | Variant A · `[PERSONALIZATION_HOOK]` filled |

**Audience values:** `Recruiter` · `HM` · `Founder` · `Referral` · `Talent`

**Response values:** `pending` · `no_reply` · `positive` · `negative` · `callback`

**Signal values:** `too_junior` · `over_reaching` · `strong_fit` · `neutral` · `role_mismatch`

When `Signal` = `too_junior`, also add source to frontmatter `feedback_signals.too_junior` array.

---

## 5. Offers & Negotiation (EC-X.3 · DEC-6)

Log offers in frontmatter `offers:` array:

```yaml
offers:
  - company: "Example Startup"
    date: "2026-05-17"
    base_lpa: 28
    equity: "0.1%"
    status: negotiating
    notes: "Below floor — use comp playbook §3"
```

Playbook: `outputs/interview_positioning.md` §3 · Floor ₹25–28L · Primary ₹30–35L · Stretch ₹35–40L

---

## 6. Audience Signal Summary (EC-6.4)

Update weekly from log patterns:

| Audience | Positive | Negative | Dominant signal |
|---|---|---|---|
| Recruiter | 0 | 0 | — |
| HM | 0 | 0 | — |
| Founder | 0 | 0 | — |
| Referral | 0 | 0 | — |

**Rule:** If recruiters say "too junior" but founders say "strong fit" → lean **Variant A** toward founder-led / AI startups (DEC-6 stretch tier), not wholesale seniority inflation.

---

## 7. Iteration & Archive Notes

| Date | Action | Phase re-entered | Outcome |
|---|---|---|---|
| 2026-05-17 | Phase 6 artifact initialized | — | Ready for deployment |

After each pipeline re-run, archive prior `outputs/` to `outputs/archive/v{N}/` and note version here.

---

## 8. Terminal States

- **Success:** Signed offer within target band → set `status: offer_signed` in frontmatter
- **Pivot:** Deliberate role/market change → set `status: pivot` + document in §7
- **Pause:** Mid-pipeline offer elsewhere (EC-6.3) → set `status: paused`
