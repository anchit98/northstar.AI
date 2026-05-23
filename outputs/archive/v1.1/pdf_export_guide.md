# PDF Export Guide (EC-4.4)

> **Version:** 1.0 | **Date:** 2026-05-16
> **Purpose:** ATS-safe PDF export without formatting regression

---

## Pre-Export Checklist

- [ ] Source file: `resume_ats_optimized.md` (Job applications) or `resume_one_page.md` (founders/HMs)
- [ ] Remove markdown link syntax if pasting into Word — use plain `email@domain.com`
- [ ] No tables, columns, text boxes, headers/footers with graphics
- [ ] Font: Arial or Calibri, **10–11pt** body, **12–14pt** name
- [ ] Margins: 0.5–0.75 inch all sides
- [ ] Single column layout only

---

## Recommended Export Paths

### Option A — Google Docs (Recommended)
1. Paste plain text from the `.md` file (or use a Markdown → Docs converter)
2. Apply heading styles: Name = Title, `EXPERIENCE` = Heading 2
3. File → Download → **PDF Document (.pdf)**
4. Re-upload to Jobscan; confirm score ≥ 85

### Option B — Microsoft Word
1. Paste content; set styles for section headers
2. Save As → PDF
3. Avoid Word resume templates with columns

### Option C — VS Code / Markdown PDF extension
1. Use "Markdown PDF" extension with **simple CSS** (no multi-column)
2. Verify PDF text is selectable (not image-only)

---

## Post-Export Validation

1. Open PDF → Select All → Copy → paste into Notepad — text should be **readable in order**
2. Upload to Jobscan against a PM JD — compare score to `analysis/ats_audit_report.md`
3. If score drops > 5 points → re-export without special characters (₹ may parse as `?` on some ATS — acceptable if rest parses)

---

## File Naming

`Anchit_Boruah_PM_Resume_ATS_2026-05.pdf`
`Anchit_Boruah_PM_Resume_OnePage_2026-05.pdf`
