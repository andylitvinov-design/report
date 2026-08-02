# SAFE.md — Psitherapy / My Alchemy Report

Last reviewed: 2026-08-02

This is the compact repo-level safety map for `/safe`. Store environment-variable names only; never add values, tokens, cookies, private health details, client reports, provider payloads, or user data.

## Project boundary

- Canonical repository: `andylitvinov-design/report`
- Primary production target: `https://psitherapy.vercel.app/`
- Alternate/previous Vercel alias: `https://holistichealing.vercel.app/`
- Legacy reference: `https://andylitvinov-design.github.io/report/`
- Hosting: Vercel, Vite + React, output `dist`
- Production branch: `main`
- Primary build-info proof: `https://psitherapy.vercel.app/build-info.json`
- Project memory: `ai-projects-brain/projects/psitherapy/PROJECT.md`

Use this repository for the Psitherapy/My Alchemy client report and public consultation experience. Do not confuse related methodology/content repositories with the canonical production implementation.

## Main surfaces

| Surface | Path / endpoint | Access | Main risk |
| --- | --- | --- | --- |
| Public landing/report shell | `/` | public | unsafe health claims, broken CTA, raw internal data, white screen |
| Login | `/login` | public auth entry | account enumeration, raw auth errors, broken redirect |
| Profile/cabinet | `/profile` | authenticated | client report/profile exposure, wrong-role access, stale session |
| Demo | `/demo` | public | accidental disclosure of real client content or provider state |
| Intake/consultation forms | repository-defined forms/routes | public | spam, duplicate submit, sensitive-data overcollection |
| Build-info marker | `/build-info.json` | public | source/deploy mismatch or excessive metadata |
| Vercel fallback workflow | `.github/workflows/deploy-production.yml` | repository workflow | wrong ref/SHA deploy, secret exposure, stale production |
| Legacy GitHub Pages deploy | `.github/workflows/pages.yml` | legacy/reference | mistaken production proof or stale content |

## Data and content boundaries

Potentially sensitive data includes:

- email, account, and session identifiers;
- intake answers, personal concerns, and client report content;
- generated therapeutic or homeopathy-oriented interpretations;
- provider/auth diagnostics and deployment metadata;
- analytics and form submissions.

Public pages must not present automated interpretations as diagnosis, emergency guidance, guaranteed treatment, or a substitute for qualified medical or mental-health care. Keep wording educational, clearly bounded, and truthful. Never invent credentials, outcomes, testimonials, or guarantees.

## Environment-variable names

Known or expected names must be discovered from repository/workflow files and documented by name only, including:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- Firebase/Supabase public and server variables when used by the selected auth implementation
- form, analytics, anti-bot, email, or provider variables when present

Server-only credentials must never appear in browser bundles, logs, screenshots, generated reports, build info, or public errors.

## Required `/safe` routing

1. Production/source concern → `AGENTS.md`, `vercel.json`, deploy workflows, `scripts/write-build-info.mjs`, expected SHA, primary alias, alternate and legacy targets.
2. Auth/cabinet concern → login/profile routes, current auth provider/client, role/session checks, direct API/data access, logout/expired-session states.
3. Intake/form concern → exact form component/handler, validation, data minimization, duplicate-submit guard, anti-bot/rate control, safe errors, retention notes.
4. Health/content concern → exact visible copy and source logic; verify non-diagnostic boundaries and no unsupported claims.
5. Frontend regression → exact route/component/style plus loading, empty, error, unauthorized, mobile, and desktop states.
6. Provider migration concern → current selected provider, fallback behavior, migration docs, env-name-only readiness, rollback path.

## Security and reliability checks

For the selected route verify:

- canonical repo, `main`, Vercel project, primary alias, and matching `build-info.commitSha` before production claims;
- alternate and GitHub Pages URLs are clearly labeled and cannot satisfy primary production proof by default;
- logged-out users cannot access profile/client report data through direct routes or direct API/storage calls;
- auth errors are neutral and do not reveal whether an account exists;
- expired/reused links, refresh, logout, back/forward, and wrong-role states fail safely;
- forms validate on the server where a server endpoint exists, collect only needed data, resist duplicate submission, and have an abuse-control plan;
- public/demo content contains no real client data, private report payload, raw provider error, stack trace, internal ID, or secret;
- generated health/homeopathy/therapy content stays educational and avoids diagnosis, guaranteed outcomes, crisis substitution, or dangerous delay-of-care framing;
- API/data reads return explicit fields rather than whole records;
- build-info exposes only safe source/version metadata;
- deploy workflows validate ref and expected SHA and do not print secrets;
- fallback deployment is not run before code is committed/pushed/merged to the intended source;
- rollback and last-known-good production evidence are identified before production changes.

## Frontend UX smoke checks

```text
- Open `/`, `/login`, `/profile`, and `/demo` directly on desktop and mobile.
- Hard refresh and use back/forward on public and protected routes.
- Check logged-out profile access, invalid login, expired session, logout, and safe redirect states.
- Submit each public intake/contact form empty, invalid, and once valid only in a safe test context.
- Double-click submit and retry after a simulated failure; confirm one submission only.
- Check loading, empty, success, validation, server-error, unauthorized, forbidden, and not-found states.
- Confirm no raw auth/provider/database error, private client text, internal identifier, or debug JSON is visible.
- Confirm health/therapy copy remains bounded, non-diagnostic, and free of unsupported promises.
- Verify mobile navigation, text wrapping, cards, forms, buttons, modals, and report sections do not overflow.
```

## Headers and browser baseline

`vercel.json` currently defines SPA rewrites but does not document a complete security-header baseline. Before adding headers, verify current live responses and compatibility for:

- staged `Content-Security-Policy`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- frame protection / CSP `frame-ancestors`;
- CORS on any API/provider route;
- HSTS on the canonical production origin.

Do not add a restrictive CSP blindly if current auth/provider integrations require specific origins.

## Dependency and supply-chain checks

- Package manager: npm.
- Lockfile: verify on the working branch.
- Narrow checks: `npm test`, `npm run build`, `npm run delivery:check`.
- Dependency audit: `npm audit --audit-level=high` when dependencies can be installed safely.
- Secret scan: use repository/CI secret scanning or an existing safe script when available.
- Deploy workflows and scripts must not echo secrets or deploy an unknown ref.

## Observability, rollback, and backup

- Logs: Vercel deployment/function logs and GitHub Actions workflow logs.
- Health/version proof: primary page plus `/build-info.json` matched to expected commit.
- Rollback: revert the focused commit or restore a verified prior Vercel production deployment.
- Legacy GitHub Pages remains fallback/reference only until primary production is verified.
- Account/profile/report data backup, retention, export, and deletion status: `needs verification`.
- Incident owner: Andrey.

## Safe verification commands

```bash
npm ci
npm test
npm run build
npm run delivery:check
npm audit --audit-level=high
git diff --check
```

Run only the narrowest applicable subset for documentation-only changes. Live/browser/auth/provider checks require safe network access and test credentials; unavailable checks must remain `NOT RUN` or `NEEDS_VERIFICATION`.

## Known risks / needs verification

- current auth provider and server-side role/data boundary;
- anti-bot/rate-limit and idempotency controls for all public forms;
- live response headers and CSP-compatible origin list;
- privacy, retention, export, and deletion behavior for client/intake/report data;
- canonical Vercel source SHA and current build-info parity;
- alternate/legacy aliases serving only intended content;
- authenticated cabinet/profile and direct-data-access smoke.

## Last `/safe` result

- Date: 2026-08-02
- Routes selected: project boundary, public content/forms, auth/cabinet, health-copy safety, Vercel deploy proof, frontend UX, headers, rollback/observability.
- Confirmed finding: the canonical production repository had detailed agent/deploy rules but no repo-level `SAFE.md`.
- Fix applied: documentation-only safety map added on a focused branch.
- Checks run: `AGENTS.md`, `package.json`, `vercel.json`, shared safety template, and production/deploy contract review.
- Checks not run: dependency install/tests/build, live headers/routes, browser/mobile smoke, authenticated provider flows, form submissions.
- Live verified in this run: no.
- Next action: run documentation/project checks, then perform primary Vercel build-info, public-route, form, and logged-out profile smoke before merge or any production claim.
