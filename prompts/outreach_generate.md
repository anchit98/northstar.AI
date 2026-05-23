# Prompt: Outreach Generation Engine

**Role:** Senior Career Strategist & Copywriter
**Goal:** Generate personalized, high-conversion outreach assets for targeted job search (EC-5.1, DEC-8).

## Inputs
- `analysis/positioning_strategy.md` (Company types & variants)
- `analysis/competency_map.md` (Canonical bullet set)
- `inputs/target_roles.md`

## Instructions
Generate outreach templates tailored to specific audiences: Founders, Recruiters, Hiring Managers, and Referral Contacts.

### Constraints & Rules (DEC-8, EC-5.1)
1. **Mandatory Personalization:** Every template MUST begin with a `[PERSONALIZATION_HOOK]` placeholder.
2. **Variant Openings:** Provide 3 distinct opening variants per template type (e.g., Recent News, Product Insight, Mutual Connection) to avoid pattern detection.
3. **Tone Calibration:** 
   - *Founders:* Bold, value-first, builder-executor who ships.
   - *Recruiters:* Professional, concise, metric-dense.
   - *Hiring Managers:* Direct, outcome-focused, problem-solving.
4. **No Generic Fluff:** Avoid "I came across your profile" or "I hope this email finds you well." Get straight to the value.
5. **Canonical Claims Only:** Use only validated metrics from `inputs/discovery_responses.md` and resumes (e.g., ₹1.5 Cr+ revenue impact, 80% adoption, mutual fund RAG 200+ users / ≤3s, Groww Review Analyzer agentic VoC). Do not cite superseded Client Reporting MVP or Restaurant Engine unless explicitly marked historical.

## Output Schema
Generate the following files:
- `outputs/outreach/founder_outreach.md`
- `outputs/outreach/recruiter_outreach.md`
- `outputs/outreach/cold_emails.md` (for HMs and Talent Teams, plus Cadence & Classification guides)
- `outputs/outreach/linkedin_messages.md` (for Networking, Referrals, plus Volume limits)
