# Intel & Content Engine (Phase 12)

> **DEC-24–26** · Plan: [docs/phase12_intel_content_engine.md](../../docs/phase12_intel_content_engine.md)

## What lives here

| Path | LLM? | Description |
|------|------|-------------|
| `sources.md` | No | Curated RSS registry (PM/AI, India tech, forums, X via Nitter) |
| `feed/YYYY-MM-DD.md` | No | Daily raw items (title, link, RSS summary as-is) |
| `weekly/YYYY-Www.md` | On-demand only | Weekly synthesis (workbench button) |
| `posts/YYYY-MM-DD.md` | On-demand only | LinkedIn post drafts (workbench button) |
| `_archive/` | — | Optional: files older than 90 days |

## Fetch daily feed (no LLM)

```bash
npm install
npm run intel:fetch
```

Optional date (IST calendar day):

```bash
npm run intel:fetch -- --date=2026-05-22
```

GitHub Actions runs the same on schedule (~07:00 IST). **No Groq** in this path (DEC-25).

**Dedup:** Each run skips items already seen in the last 14 days of feed files — same link, same source + title, or same source + summary body (for long repeats, e.g. X/Twitter). The manifest may include `skipped_duplicate: N`.

## On-demand Groq (workbench)

| Route | API | Feed input |
|-------|-----|------------|
| `/workbench/intel/weekly` | `POST /api/intel/weekly` | ISO week or rolling 7 feed days |
| `/workbench/intel/posts` | `POST /api/intel/posts` | Same modes + `linkedin_style.md` + optional weekly excerpt |

## LinkedIn generation model (Phase D)

Default in `frontend/.env`:

```env
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

128k-class context on Groq — fits full style samples + 7 days of feed. Falls back to `llama-3.3-70b-versatile` if the request is still too large.

## LinkedIn voice samples (Phase B)

Before using **Generate new ideas** (Phase D), paste 3–5 published posts into:

[`inputs/linkedin_style.md`](../../inputs/linkedin_style.md)

Replace each `_Paste post here._` block with full post text. Set frontmatter `status: ready` when done. Generation uses this file first, then pillars in `outputs/personal_branding.md` §3.

## Content filter (workbench)

Dropdown on feed, sources, and intel sub-pages (like LinkedIn pillar picker):

- **All content** · **PM & AI intel** · **Tech news** · **India — AI, tech & product** · **PM thought leaders** · **AI labs** · **Builders** · **Forums & community**

URL param: `?filter=india` (replaces old `tab` / checkbox `sources`).

**LinkedIn:** No public RSS — profile URLs in `sources.md` are for manual reading only.

## Archive old files (EC-12.5)

```bash
npm run intel:archive              # move feed/weekly/posts older than 90 days → _archive/
npm run intel:archive -- --dry-run # preview only
npm run intel:archive -- --days=60
```

## G11 attestation (quality gate)

Before treating Phase 12 as “done” for your job search workflow, confirm:

| Check | How |
|-------|-----|
| Source health | Latest fetch: ≥10 sources with items; review **FAIL** on `/workbench/intel/sources` and set `enabled: false` in `sources.md` |
| Daily ingest | `feed/YYYY-MM-DD.md` exists for today (cron or `npm run intel:fetch`) |
| Weekly | One successful **Generate this week's summary** → `weekly/YYYY-Www.md` |
| Posts | One successful **Generate 2 drafts** per pillar you use → `posts/YYYY-MM-DD.md` |
| LLM boundary | `intel-daily.yml` / `fetch.ts` have no Groq imports |
| Authenticity | You edit every weekly/post before sharing (G5-lite; DEC-4) |

## Workbench

Local NorthStar AI → `/workbench/intel`. Set `GROQ_API_KEY` in `frontend/.env` for Generate buttons.

| Route | Phase |
|-------|--------|
| `/workbench/intel/posts` | B — style checklist; D — generate drafts |
| `/workbench/intel/weekly` | C — weekly synthesis (`POST /api/intel/weekly`) |
