# Canonical Resume Structure (Final Draft)

> **Version:** 1.0 | **Date:** 2026-05-22  
> **Authority:** `Prepared Resumes/Anchit.Boruah_Resume.docx` / `.pdf` (candidate final draft)  
> **Markdown mirrors:** `outputs/resume_one_page.md`, `outputs/resume_ats_optimized.md` (v1.7+)  
> **Decision:** [DEC-23](./decisions.md#dec-23--prepared-resume-as-canonical-structure-v17)

All resume edits, JD-alignment passes, and agent-assisted rewrites **must follow this structure** unless the candidate explicitly changes the prepared DOCX.

---

## 1. Section order (required)

| # | Section | H2 in Markdown |
|---|---------|----------------|
| 1 | Name + title line + contact | `#` name; subtitle; contact line |
| 2 | Professional summary | `## PROFESSIONAL SUMMARY` |
| 3 | Work experience | `## WORK EXPERIENCE` |
| 4 | Projects | `## PROJECTS` |
| 5 | Skills | `## SKILLS` |
| 6 | Education | `## EDUCATION` |

**Do not** use: Experience-last layouts, standalone Achievements/Certifications blocks, or Projects-before-Experience (legacy v1.6 and earlier).

---

## 2. Header & contact

```
# ANCHIT BORUAH
**Product Manager | AI & Automation | 0-to-1 Products**
Bengaluru, India | +91-... | email | LinkedIn | GitHub | Portfolio
```

- **Portfolio URL:** `https://anchit-boruah-online-portfolio.vercel.app/`
- No separate “6+ years” tagline line unless added back to prepared DOCX.
- Use markdown links in repo; plain text in Word/PDF export.

---

## 3. Professional summary

- **3–4 sentences**, first person implied (no “I” required).
- Must include: **Product Manager**, **0-to-1**, discovery → delivery → KPI ownership, **~INR 10 Cr+** impact, **88% CSAT / 90% retention** (or current prepared metrics).
- Tone: startup PM, execution + intuition.

---

## 4. Work experience

- **Order:** WPP Media → Annalect → Servetel (reverse chronological).
- **Bullets:** `-` prefixed; quantified metrics; currency **~INR** in prepared draft.
- **WPP title:** Senior Business Analyst (Product Operations) — keep until formal PM title on payroll.
- **Verbs (prepared draft):** e.g. Supervised (WPP discovery), Spearheaded (pipeline), Directed (Jira migration).

---

## 5. Projects (fixed order)

| Order | Project |
|------|---------|
| 1 | Groww Review Analyzer AI Agent |
| 2 | RAG Chatbot, Mutual Fund Factual Response |
| 3 | Swish Delivery Trust & Reliability Research |
| 4 | Meta Campaign Activation (at WPP Media) |

- **One-page:** 2 bullets per project (except Meta: 3 bullets).
- **ATS variant:** dense paragraph(s) per project under bold title line; same claims, no extra projects unless added to prepared DOCX.
- **Tech stack:** on title line after portfolio link.
- **Links:** `[Portfolio](https://anchit-boruah-online-portfolio.vercel.app/)` in markdown; avoid raw `|Link|` in exports.

**Not in final draft (do not re-add without candidate approval):** NextLeap-only case studies (ChatGPT voice PRD, growth segmentation), Client Reporting MVP, separate Achievements/Certifications section.

---

## 6. Skills (four groups only)

1. **Product Management** — comma-separated list  
2. **Product Analytics & Growth**  
3. **AI & Automation**  
4. **Data & Build**

ATS variant may add **synonym keywords** in Skills only (e.g. Product Manager, BRD, SOW, ChromaDB) — not new experience claims.

---

## 7. Education

- Single line: university, degree, dates (*Jul 2016 – Jul 2020*).

---

## 8. ATS vs one-page variant

| Aspect | `resume_one_page.md` | `resume_ats_optimized.md` |
|--------|----------------------|---------------------------|
| Structure | Identical §1–6 | Identical §1–6 |
| Projects | Bullets | Compact paragraphs |
| Skills | Prepared lists | Prepared + light ATS aliases |
| Export | Founders/HMs + optional | Job portals; prefer **DOCX** from prepared folder |

Both files stay **claim-consistent** with `Prepared Resumes/` (DEC-9, DEC-4).

---

## 9. Versioning & archive (DEC-11)

- Bump version header when structure or metrics change: `> Version: X.Y | Date: YYYY-MM-DD | …`
- Archive prior `outputs/resume_*.md` to `outputs/archive/v{X}/` before material edits.
- Copy final DOCX/PDF into `Prepared Resumes/`; optional copy to `frontend/public/` for download buttons.

---

## 10. PDF / DOCX export

See `outputs/pdf_export_guide.md`. Source of truth for wording: **`Prepared Resumes/Anchit.Boruah_Resume.docx`**.
