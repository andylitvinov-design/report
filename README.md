# Report Product Workspace

This repository stores the product, design, and implementation materials for the dynamic client report system.

Current implementation target: **PsiTherapy** client report and therapy cabinet at `https://psitherapy.vercel.app/`.

Historical/legacy naming: My Alchemy / Алхимия Души / Holistic Therapy / homeopathy-oriented reports.

## Primary live site target

Desired Vercel production URL:

`https://psitherapy.vercel.app/`

Core auth routes:

- `https://psitherapy.vercel.app/login`
- `https://psitherapy.vercel.app/profile`

Build info / live version check:

`https://psitherapy.vercel.app/build-info.json`

Historical / previous possible Vercel aliases:

- `https://myalchemy.vercel.app/`
- `https://holistichealing.vercel.app/`

Vercel fallback deployment is handled by:

`.github/workflows/deploy-production.yml`

The Vercel project should be connected to this repo and configured to deploy `main` to `psitherapy.vercel.app`.

## Google Auth setup

The first PsiTherapy cabinet layer uses Firebase Auth with Google OAuth.

Required frontend env names:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=
```

Use `.env.example` as the local template. Do not commit real env values.

Required Firebase authorized domains:

```text
psitherapy.vercel.app
localhost
```

Firebase project setup and the Supabase-to-Firebase cutover checklist are in:

```text
docs/psitherapy-firebase-migration.md
```

Keep the old Supabase project active until Firebase production login is verified and the backup noted in the migration doc exists.

## Legacy GitHub Pages site

Legacy/reference GitHub Pages URL:

`https://andylitvinov-design.github.io/report/`

Legacy build info / live version check:

`https://andylitvinov-design.github.io/report/build-info.json`

Legacy GitHub Pages deployment is handled by:

`.github/workflows/pages.yml`

Keep GitHub Pages as a reference during migration. Do not remove it until Vercel production is verified end-to-end.

## Related Alchemy repositories

The project historically appears under several names/places:

- `andylitvinov-design/report` — working React/Vite implementation for the client report and cabinet; current PsiTherapy foundation.
- `andylitvinov-design/alchemy` — concept/MVP notes and static draft materials for the Alchemy project.
- `andylitvinov-design/alchemy-method` — methodology/source logic for DAO / У-Син / Bach / homeopathy-oriented interpretation.
- `andylitvinov-design/alchemy_site` — standalone site-facing Alchemy HTML bundle / cloud-ready shell.

Current rule: use `report` as the main site implementation repo for `psitherapy.vercel.app`, while keeping methodology and historical concept materials in the related Alchemy repos.

## Local run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

`npm run build` automatically generates `public/build-info.json` through `scripts/write-build-info.mjs`, so agents can verify the live deployment version without asking the user.

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

## Deployment and verification docs

- `AGENTS.md` — agent rules for this project.
- `docs/myalchemy-migration-plan.md` — current migration status, verification evidence, and blockers.
- `docs/deploy-fallback.md` — Vercel fallback deploy protocol.
- `docs/deploy-version-check.md` — live version check protocol.
- `vercel.json` — Vercel project config.
- `.github/workflows/deploy-production.yml` — Vercel production fallback workflow.
- `.github/workflows/pages.yml` — legacy GitHub Pages workflow.

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

## Branches

- `main` — stable reference and accepted materials.
- `product/client-cabinet-site` — working branch for the client cabinet / report site concept.

## Restore visual reference locally

```bash
node docs/design-references/reports/restore-reference-image.mjs
```

This will create:

`docs/design-references/reports/report-page-2-reference-small.jpg`
