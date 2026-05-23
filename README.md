# NorthStar AI

AI-powered professional growth OS — career intelligence, PM/AI intel feed, LinkedIn drafts, and a private workbench. Built as a Next.js monorepo with markdown as the source of truth.

**Repository:** [github.com/anchit98/northstar.AI](https://github.com/anchit98/northstar.AI)

## Quick start (local)

```powershell
# Repo root — RSS fetch + scripts
npm install
npm run intel:fetch

# Frontend
cd frontend
copy .env.example .env   # set WORKBENCH_PASSCODE and GROQ_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Workbench routes require your passcode.

## Deploy (GitHub + Vercel)

See **[docs/deployment.md](docs/deployment.md)** for the full setup: push to GitHub, enable Actions, import `frontend/` on Vercel, env vars, and smoke tests.

## Layout

| Path | Purpose |
|------|---------|
| `frontend/` | NorthStar AI Next.js app (UI + `/api/*`) |
| `outputs/` | Resumes, outreach, intel feeds, weekly/posts |
| `inputs/` | Discovery, LinkedIn style, JD corpus |
| `scripts/intel/` | Daily RSS ingest (no LLM) |
| `docs/` | Architecture, deployment, phase plans |

## License

Private use — see repo owner.
