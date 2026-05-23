# Prompt spec: Intel LinkedIn post ideas (Phase 12 / Phase D)

> **Version:** 1.2 | **Used by:** `POST /api/intel/posts`

---

## Audience

Series B startup founders, product leadership, recruiters, hiring managers, talent acquisition, aspiring PMs, PM peers.

## Positioning gap

Candidate is an **early-career Product Manager** (not a BA). Posts should reflect PM ownership (discovery, prioritization, shipping, adoption) without defensive tone.

## Proof / metrics

**Optional.** Use verified stories or numbers only when they strengthen the post. Do not invent metrics. Do not force portfolio mentions every time.

---

## Pillars (user picks exactly one per run)

| ID | Pillar |
|----|--------|
| `pillar-1` | Industry Takes (PM & AI) |
| `pillar-2` | AI-Native PM Craft (How-To) |
| `pillar-3` | Product Ops & Delivery (Impact) |
| `pillar-4` | PM Journey (Not Just a BA) |

Titles and example ideas: `outputs/personal_branding.md` §3.

**No rotation:** Generate only for the pillar requested in the API body.

---

## Output format

```markdown
## Variant N — <short working title>

<Full LinkedIn post — ready to paste. No Hook:/Body:/CTA: labels.>

<!-- meta: pillar-N -->
```

- 2 variants per run (same pillar, different angles).
- No citation link lists; refer to news by name when needed.
- `<!-- meta: pillar-N -->` is workbench-only (not for LinkedIn).

---

## Inputs

1. `inputs/linkedin_style.md` — voice  
2. `outputs/personal_branding.md` §3 — pillar + ideas  
3. Intel feed (ISO week or rolling days) — especially for **pillar-1**  
4. Optional weekly synthesis — themes only for pillar-1  
