# Sample job descriptions (JD corpus)

**Phase 11** — Paste or save **20 current-day Product Manager** job descriptions here for corpus-level keyword analysis and resume alignment.

## How to add JDs

1. **One file per JD (recommended):** `jd-01.md` … `jd-20.md` (plain text or markdown; paste full JD).
2. **Or** a single bundle: `corpus.md` with each JD separated by `---` and a `## Source` / company line.

## Naming

- Use `jd-NN.md` where `NN` is zero-padded (`jd-01`, not `jd-1`) so files sort correctly in the workbench UI.
- Optional: first line `# Company — Role` for quick scanning.

## After files exist

1. Open **Workbench → JD alignment** (`/workbench/jd-alignment`) to verify the corpus is detected.
2. Run corpus analysis (AI-assisted using `prompts/jd_corpus_analysis.md`) → fill `analysis/jd_corpus_synthesis.md`.
3. Re-run **Phase 3–4** on resumes using the synthesis (canonical bullets unchanged except where JD terms map to **verified** experience — DEC-4, DEC-9).
4. Archive prior resumes to `outputs/archive/v{N}/` per DEC-11.

## Future: paste a single JD

Use **Workbench → JD alignment → Paste new JD** to append a file via the API (requires workbench cookie). Each new JD can trigger a **targeted** keyword pass (narrower than full corpus) — document outcome in `jd_corpus_synthesis.md` § Rolling JD log.
