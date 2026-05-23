# Report Product Workspace

This repository stores the product, design, and implementation materials for the dynamic client report system.

Main target: build a dynamic HTML/React A4 report page and client cabinet for **Алхимия Души / Holistic Therapy**.

## Repository role

`report` is the working repository for the report product layer:

- report UI and visual references;
- HTML / React implementation briefs;
- Bach / DAO / У-Син report page templates;
- client cabinet structure;
- questionnaire flows;
- PDF export requirements;
- product prompts for Codex and implementation agents.

Methodology and agent standards remain in source-of-truth repositories:

- `andylitvinov-design/ai-projects-brain` — system instructions, report quality standards, auditor rules;
- `andylitvinov-design/alchemy-method` — DAO / У-Син / Bach / method logic;
- `andylitvinov-design/report` — product implementation, UX, UI, templates, site/cabinet materials.

## Current materials

Existing reference package:

- `docs/design-references/reports/report-page-2-brief.md` — design brief.
- `docs/design-references/reports/sample-report-data.json` — example data schema.
- `docs/design-references/reports/report-page-2-reference-small.base64.txt` — compressed JPG visual reference encoded as base64.
- `docs/design-references/reports/restore-reference-image.mjs` — script to restore the JPG reference.
- `docs/design-references/reports/codex-prompt.md` — ready prompt for Codex.

Product docs added for this project:

- `docs/product/product-vision.md`
- `docs/product/client-cabinet-structure.md`
- `docs/product/report-repository-map.md`
- `docs/product/site-branch-plan.md`

## Branches

- `main` — stable reference and accepted materials.
- `product/client-cabinet-site` — working branch for the client cabinet / report site concept.

## Restore visual reference locally

```bash
node docs/design-references/reports/restore-reference-image.mjs
```

This will create:

`docs/design-references/reports/report-page-2-reference-small.jpg`
