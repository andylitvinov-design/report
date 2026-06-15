# AGENTS.md — My Alchemy Report

## Project boundary

Canonical repo: `andylitvinov-design/report`.
Project/product: dynamic client report system for **My Alchemy / Алхимия Души / Holistic Therapy / homeopathy-oriented reports**.
Primary production target: `https://myalchemy.vercel.app/`.
Possible alternate / previous Vercel alias: `https://holistichealing.vercel.app/`.
Legacy GitHub Pages URL: `https://andylitvinov-design.github.io/report/`.
Framework: Vite + React.
Primary hosting target: Vercel.
Legacy hosting: GitHub Pages via `.github/workflows/pages.yml`.

## Related Alchemy repositories

- `andylitvinov-design/report` — main React/Vite implementation repo for the client report/cabinet and `myalchemy.vercel.app`.
- `andylitvinov-design/alchemy` — concept/MVP notes and static draft materials for the Alchemy project.
- `andylitvinov-design/alchemy-method` — methodology/source logic for DAO / У-Син / Bach / homeopathy-oriented interpretation.
- `andylitvinov-design/alchemy_site` — standalone site-facing Alchemy HTML bundle / cloud-ready shell.

Current rule: use `report` as the main site implementation repo for `myalchemy.vercel.app`, while keeping methodology and historical concept materials in the related Alchemy repos.

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
10. `docs/myalchemy-migration-plan.md` if present
11. relevant product/design docs under `docs/`

If a file is missing, report `not found`.

## Agent Command Registry

### /delivery

When the user invokes `/delivery`, follow the local source-of-truth files in this order:

1. `.claude/commands/delivery.md`
2. `.claude/skills/delivery/SKILL.md`
3. `docs/delivery-loop-program.md`
4. `docs/delivery-loop-technical-details.md`
5. `docs/delivery-loop-source-patterns-and-live-proof.md`
6. this `AGENTS.md`

`/delivery` is sufficient by itself. Do not ask Andrey for extra confirmation to create a branch, create/update a PR, merge if safe/permitted, run deployment fallback, or verify live merely because `/delivery` was invoked.

Act as a release owner, not only a coding assistant.

Do not stop after code changes, PR creation, green checks, merge, or deployment.

Stop only with:

- `STATUS: SUCCESS` — task implemented, verified, PR/merge completed if required, deployed, and verified on live.
- `STATUS: BLOCKED` — real external blocker with exact evidence and required user action.

Before starting, create a project adapter:

- repository: `andylitvinov-design/report`;
- target branch: normally `main`;
- package manager: `npm`;
- framework: Vite + React;
- build command: `npm run build`;
- delivery check command: `npm run delivery:check`;
- CI provider: GitHub Actions;
- deployment provider: Vercel fallback workflow + legacy GitHub Pages;
- primary live URL: `https://myalchemy.vercel.app/`;
- primary build-info URL: `https://myalchemy.vercel.app/build-info.json`;
- alternate URL: `https://holistichealing.vercel.app/`;
- legacy URL: `https://andylitvinov-design.github.io/report/`;
- required deploy secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Before any completion claim, run the Final Result Verification Gate:

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Allowed statuses: `PASS`, `PARTIAL`, `FAIL`, `NOT VERIFIED`.

Only all required items as `PASS` allow `STATUS: SUCCESS`. If any required item is `PARTIAL`, `FAIL`, or `NOT VERIFIED`, repair and rerun the gate. After 2 failed gate repair attempts, report `STATUS: BLOCKED`.

For this repo, production delivery success requires live proof on `https://myalchemy.vercel.app/` and matching `build-info.commitSha`, unless the user explicitly requests another target. Legacy GitHub Pages can be reported as legacy proof only; it cannot satisfy primary Vercel production success by default.

## Absolute deployment escalation rule

Do not ask Andrey to perform local deployment from his terminal.

If direct deploy tooling is unavailable, follow this order instead:

```text
1. Use the GitHub Actions fallback workflow if it exists.
2. If workflow dispatch is available, run it with the correct ref and expected SHA.
3. If workflow dispatch is not available but GitHub write is available, create or update an issue/PR handoff for Codex or another agent.
4. If GitHub write is unavailable, report the exact missing capability and the exact workflow/ref/SHA that another agent must run.
```

Invalid final answer:

```text
I cannot deploy from here; Andrey should deploy manually.
```

Required final answer when blocked:

```text
Deployment not completed.
Exact blocker:
Next non-user action:
GitHub issue/PR/workflow handoff:
```

Source policy:

```text
andylitvinov-design/active-projects-ops/docs/no-user-terminal-deploy-policy.md
```

## Production target rules

- Treat `https://myalchemy.vercel.app/` as the desired primary production URL.
- Treat `https://holistichealing.vercel.app/` as possible alternate/previous Vercel alias, not the primary target unless explicitly changed later.
- Treat `https://andylitvinov-design.github.io/report/` as legacy/reference until migration is fully verified.
- Do not remove GitHub Pages deployment until Vercel production is verified end-to-end.
- Vercel project should be connected to this repo and configured so production deploys from `main` serve `myalchemy.vercel.app`.

## Deploy fallback

This repo has a Vercel production fallback workflow:

```text
.github/workflows/deploy-production.yml
```

Use it when Vercel auto-deploy does not trigger, production remains stale after push/merge, or the user reports that live does not show completed changes.

Do not ask Andrey to perform local deployment. Use workflow fallback, issue/PR handoff, or exact non-user blocker reporting.

Before fallback deploy, always prove:

```text
Repo: andylitvinov-design/report
Platform: Vercel
Target ref: normally main
Expected SHA: known commit SHA
Changes: committed and pushed/merged
Primary production URL: https://myalchemy.vercel.app/
Primary build info URL: https://myalchemy.vercel.app/build-info.json
Alternate URL: https://holistichealing.vercel.app/
Alternate build info URL: https://holistichealing.vercel.app/build-info.json
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
https://myalchemy.vercel.app/build-info.json
```

Alternate check if needed:

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
npm run delivery:check
```

After deploy, verify:

```text
https://myalchemy.vercel.app/
https://myalchemy.vercel.app/build-info.json
```

If relevant, also verify alternate Vercel alias:

```text
https://holistichealing.vercel.app/
https://holistichealing.vercel.app/build-info.json
```

During migration, also verify legacy GitHub Pages:

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
Alternate URL check:
Legacy URL check:
If not deployed, exact non-user blocker and next agent action:
Remaining blockers:
```
