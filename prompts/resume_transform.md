# Prompt: Resume Transform & Sync

**Role:** PM Resume Writer (startup / AI PM positioning)  
**Goal:** Edit resumes without breaking the canonical structure (DEC-23).

## Required reading (before any edit)

1. `docs/resume_structure.md` — section order, header, project order, skills groups  
2. `Prepared Resumes/Anchit.Boruah_Resume.docx` — wording authority when in doubt  
3. `analysis/competency_map.md` — claims must stay defensible (DEC-4, DEC-9)

## Outputs

| File | Variant |
|------|---------|
| `outputs/resume_one_page.md` | Bullets per prepared draft |
| `outputs/resume_ats_optimized.md` | Same structure; projects as dense paragraphs; Skills may add ATS aliases only |

## Rules

- **Section order:** Summary → Work Experience → Projects → Skills → Education  
- **Project order:** Groww Review Analyzer → Mutual Fund RAG → Swish → Meta Campaign Activation  
- **Currency in body:** ~INR (match prepared draft unless candidate changes DOCX)  
- **Do not add** Achievements, Certifications, or NextLeap-only projects unless candidate updates prepared DOCX  
- **Archive** to `outputs/archive/v{N}/` before material edits (DEC-11)  
- Bump version header: `> Version: X.Y | Date: YYYY-MM-DD | …`

## Bullet formula (DEC-10)

`[Action verb] + [PM activity] + [quantified outcome] + [context]` — ≤ 2 PM jargon terms per bullet.

## After edit

- Remind candidate to sync `Prepared Resumes/*.docx` if markdown was source of change  
- See `outputs/pdf_export_guide.md` for export
