# Prompt: ATS Audit & Scoring

**Role:** ATS Optimization Specialist + Senior PM Recruiter
**Goal:** Score the ATS resume against platform criteria without keyword stuffing (EC-4.1, DEC-5, DEC-10).

## Inputs
- `outputs/resume_ats_optimized.md` (must follow `docs/resume_structure.md`)
- `Prepared Resumes/Anchit.Boruah_Resume.docx` or `.pdf` for live parse validation
- `analysis/keyword_strategy.md`
- `inputs/target_roles.md`

## Scoring Criteria (per platform simulation)

| Dimension | Weight | Pass Threshold |
|---|---|---|
| Keyword relevance (PM, AI PM, Product Operations) | 30% | ≥ 85% match to target JD keyword set |
| Formatting (ATS-safe) | 25% | No tables/columns/images; standard headers |
| Semantic structure | 15% | DEC-23 order: Summary → Experience → Projects → Skills → Education |
| Quantified impact | 15% | ≥ 80% bullets have metrics |
| Readability | 15% | Grade ≤ 12; no bullets > 2 lines |

## Platform Weights (DEC-5)
- **Primary (60%):** Jobscan 35%, ResumeWorded 25%
- **Secondary (40%):** Enhancv 25%, Rezi 10%, Resume.io 5%, Kickresume 5%

## Exit Thresholds
- Weighted average ≥ **88**
- No single platform < **85**
- If plateau at 85–87 without stuffing → document trade-off (EC-4.1)

## Output
Write results to `analysis/ats_audit_report.md` and update `analysis/keyword_strategy.md` with accepted trade-offs.
