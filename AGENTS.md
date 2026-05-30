# AGENTS.md — Holistic Healing Report

## Project boundary

Canonical repo: `andylitvinov-design/report`.
Project/product: dynamic client report system for **Алхимия Души / Holistic Therapy / homeopathy-oriented reports**.
Primary production target: `https://holistichealing.vercel.app/`.
Legacy GitHub Pages URL: `https://andylitvinov-design.github.io/report/`.
Framework: Vite + React.
Primary hosting target: Vercel.
Legacy hosting: GitHub Pages via `.github/workflows/pages.yml`.

## Context-first rules

Before changing this repo, read:

1. `AGENTS.md`
2. `README.md`
3. `package.json`
4. `vite.config.js`
5. `vercel.json`
6. `.github/workflows/deploy-production.yml`
7. `.github/workflows/pages.yml`
8. `docs/deploy-fallback.md`
9. `docs/deploy-version-check.md`
10. relevant product/design docs under `docs/`

If a file is missing, report `not found`.

## Production target rules

- Treat `https://holistichealing.vercel.app/` as the desired primary production URL.
- Treat `https://andylitvinov-design.github.io/report/` as legacy/reference until migration is fully verified.
- Do not remove GitHub Pages deployment until Vercel production is verified end-to-end.
- Vercel project should be connected to this repo and configured so production deploys from `main` serve `holistichealing.vercel.app`.

## Deploy fallback

This repo has a Vercel production fallback workflow:

```text
.github/workflows/deploy-production.yml
```

Use it when Vercel auto-deploy does not trigger, production remains stale after push/merge, or the user reports that live does not show completed changes.

Do not ask Andrey to run a local terminal deploy until this fallback path has been attempted and diagnosed.

Before fallback deploy, always prove:

```text
Repo: andylitvinov-design/report
Platform: Vercel
Target ref: normally main
Expected SHA: known commit SHA
Changes: committed and pushed/merged
Production URL: https://holistichealing.vercel.app/
Build info URL: https://holistichealing.vercel.app/build-info.json
Legacy URL: https://andylitvinov-design.github.io/report/
Legacy build info URL: https://andylitvinov-design.github.io/report/build-info.json
```

Default command:

```bash
gh workflow run deploy-production.yml \
  --ref main \
  -f ref=main \
  -f expected_sha=<expected_commit_sha> \
  -f reason="fallback deploy after stale production"
```

Hard order:

```text
commit / push / merge first
fallback deploy second
production verification third
```

Never deploy uncommitted or unpushed changes. Never deploy an unknown ref. Never claim production is updated without checking production after deploy.

## Live version self-check

Agents must check the current live deployment version themselves.

Primary check:

```text
https://holistichealing.vercel.app/build-info.json
```

Legacy check:

```text
https://andylitvinov-design.github.io/report/build-info.json
```

The build info file is generated before build by:

```text
scripts/write-build-info.mjs
```

Agents must compare live `commitSha` with the expected commit SHA. Do not ask Andrey to check the current live version manually.

If Vercel build-info is unavailable, report the HTTP status/body excerpt and classify the issue as deploy/config/status-marker failure. Do not fall back to asking the user to check manually.

## Verification

Run:

```bash
npm ci
npm run build
```

After deploy, verify:

```text
https://holistichealing.vercel.app/
https://holistichealing.vercel.app/build-info.json
```

During migration, also verify:

```text
https://andylitvinov-design.github.io/report/
https://andylitvinov-design.github.io/report/build-info.json
```

## Report format

After work, report:

```text
Repo:
Target ref:
Expected SHA:
Changed files:
Checks run:
Deploy workflow result if used:
Production URL:
Build info URL:
Live version check:
Legacy URL check:
Remaining blockers:
```
