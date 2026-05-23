# NorthStar AI (frontend)

Private local UI for the Resume pipeline — resume viewers, workbench (outreach, interview, positioning, JD alignment, version history, market feedback).

## Run locally

```bash
cd frontend
npm install
cp .env.example .env   # set GROQ_API_KEY for intel Generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Workbench is at `/workbench` (no passcode).

Content is read at **build time** from `../outputs/` and `../analysis/` (DEC-19). After editing markdown, restart `npm run dev` or run `npm run build`.

**Resume structure (DEC-23):** Both `/resume/ats` and `/resume/one-page` follow `docs/resume_structure.md`. Final DOCX/PDF: `Prepared Resumes/`.

## Deployment

**Not part of the pipeline** (DEC-22, Phase 10 discarded). Deploy manually if you choose — e.g. Vercel, Docker, or LAN-only. See `docs/architecture.md` and `content_contract.md` before exposing any URL.

## Intel module (Phase 12)

From repo root:

```bash
npm run intel:fetch      # daily RSS → outputs/intel/feed/
npm run intel:archive    # optional: move files >90d to _archive/
```

In the app: `/workbench/intel` — **per-source filter** (checkboxes by feed/person name). On-demand Groq:

- `/workbench/intel/weekly` — weekly synthesis
- `/workbench/intel/posts` — LinkedIn drafts (requires `inputs/linkedin_style.md` ready)

Requires in `frontend/.env`:

```env
GROQ_API_KEY=...          # weekly + posts only
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct  # optional
```

See [outputs/intel/README.md](../outputs/intel/README.md) and [docs/phase12_intel_content_engine.md](../docs/phase12_intel_content_engine.md).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build (static pages) |
| `npm run start` | Serve production build |
