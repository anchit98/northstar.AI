# Prompt: JD corpus analysis → `analysis/jd_corpus_synthesis.md`

**Use when:** `inputs/job_descriptions/` contains ≥1 JD file (target: 20).

## Inputs

- All `inputs/job_descriptions/*.md` (exclude `README.md`)
- `inputs/experience.md`, `inputs/achievements.md`
- `analysis/competency_map.md`, `analysis/keyword_strategy.md`
- Current `outputs/resume_ats_optimized.md` (for diff planning only)

## Task

1. **Extract** recurring nouns, phrases, tools, and responsibilities across the corpus (frequency table).
2. **Cluster** into capability themes (AI PM, growth, platform, B2B SaaS, etc.).
3. **Map** each high-frequency **must-have** to an existing proof point in experience/achievements/resume — or flag as **gap** (no fabrication).
4. **Recommend** concrete edits: which resume sections to tweak, which synonyms to add, which bullets to reorder — respecting DEC-10 (≤2 PM jargon terms per bullet) and DEC-9 (canonical truth).
5. **Output** structured markdown matching the sections in `analysis/jd_corpus_synthesis.md`; update frontmatter `jd_files_ingested`, `status: synthesized`.

## Constraints

- Do not invent companies, metrics, or titles not present in inputs.
- If a JD requires a credential or stack you do not have, list under Gaps with honest mitigation only.
