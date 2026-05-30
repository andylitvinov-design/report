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

## Client Cabinet Design Source

Client cabinet source materials:

- `docs/client-cabinet/assets/client-cabinet-mockup-source.svg` — canonical SVG mockup for the Overview screen.
- `docs/client-cabinet/DESIGN_SOURCE_OF_TRUTH.md` — visual and layout source of truth.
- `docs/client-cabinet/MOCKUP_IMPLEMENTATION_MAP.md` — mapping from mockup regions to prototype selectors.
- `docs/client-cabinet/VISUAL_QA_CHECKLIST.md` — visual QA checklist for desktop and mobile review.
- `docs/client-cabinet/prototype/overview.html` — static Overview prototype following the SVG mockup.

## Client Cabinet App

The real cabinet is implemented as a minimal Next 16 + TypeScript app:

- `/` — entry page with the Google cabinet login button.
- `/login` — protected-route login target with `Войти через Google`.
- `/cabinet` — current state, graph, latest report summary.
- `/cabinet/self-analysis` — current data and new/repeat questionnaire action.
- `/cabinet/expert-analysis` — expert text/visual interpretation and repeat warning.
- `/cabinet/recommendations` — current recommendations.
- `/cabinet/history` — user-scoped past analyses and reports.

Required environment variables are listed in `.env.example`. Do not commit real values.
Setup details are documented in `docs/client-cabinet/environment.md`.

Supabase schema reference:

- `supabase/schema.sql`

Local development falls back to a dev-only cookie-backed store when Supabase is not configured. Authenticated production clients use Supabase through the server-side repository layer as the source of truth.

Validation:

```bash
npm test
npm run typecheck
npm run build
```

## Branches

- `main` — stable reference and accepted materials.
- `product/client-cabinet-site` — working branch for the client cabinet / report site concept.

## Restore visual reference locally

```bash
node docs/design-references/reports/restore-reference-image.mjs
```

This will create:

`docs/design-references/reports/report-page-2-reference-small.jpg`
