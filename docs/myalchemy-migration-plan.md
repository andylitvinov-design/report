# My Alchemy Migration Plan

## Scope

Canonical repo: `andylitvinov-design/report`.

Primary production target:

```text
https://myalchemy.vercel.app/
```

Primary build-info target:

```text
https://myalchemy.vercel.app/build-info.json
```

Legacy/reference URL:

```text
https://andylitvinov-design.github.io/report/
```

Legacy build-info URL:

```text
https://andylitvinov-design.github.io/report/build-info.json
```

Possible alternate Vercel alias:

```text
https://holistichealing.vercel.app/
```

## Current Verification Snapshot

Snapshot time: `2026-05-31 00:21 Europe/Madrid`.

Target ref:

```text
main
```

Current `origin/main` SHA:

```text
a06bf2c8ea2ee30631807eff138cfc9f963b373f
```

GitHub Pages legacy deployment is current for that SHA:

```json
{
  "commitSha": "a06bf2c8ea2ee30631807eff138cfc9f963b373f",
  "commitRef": "main",
  "platform": "GitHub Pages or local"
}
```

## Vercel Status

Authenticated Vercel CLI context:

```text
user: andylitvinov-1440
team/context: super10
```

Direct project checks:

```text
npx vercel project inspect reports
Found Project super10/reports
ID: prj_gAULkzGFwndd5YYWufWyqYNwdKQ5
Framework Preset: Vite
Root Directory: .
Latest Production URL: https://reports-super10.vercel.app

npx vercel project inspect myalchemy
Error: There is no project for "myalchemy"

npx vercel project inspect report
Error: There is no project for "report"
```

The existing `reports` Vercel project is not enough to complete the migration:

- it serves `reports-super10.vercel.app`, not `myalchemy.vercel.app`;
- its production deployment is behind Vercel authentication and does not expose public `build-info.json`;
- `npx vercel git connect https://github.com/andylitvinov-design/report` returned Vercel API `400 Bad Request`.

Local GitHub access is not the blocker: `gh repo view andylitvinov-design/report --json viewerPermission` returns `ADMIN`, and the repo is public. The remaining Git connection blocker is on the Vercel side, most likely Git provider integration access/installation for `andylitvinov-design/report`.

Direct domain/deployment checks:

```text
npx vercel domains inspect myalchemy.vercel.app
Error: You don't have access to the domain myalchemy.vercel.app under super10.

npx vercel inspect https://myalchemy.vercel.app/
Error: Can't find the deployment "myalchemy.vercel.app" under the context "super10"
```

`https://myalchemy.vercel.app/` currently returns:

```text
HTTP 404
server: Vercel
x-vercel-error: DEPLOYMENT_NOT_FOUND
```

`https://myalchemy.vercel.app/build-info.json` currently returns:

```text
HTTP 404
server: Vercel
x-vercel-error: DEPLOYMENT_NOT_FOUND
```

This means the primary Vercel URL is not serving the `report` app yet. It does not satisfy the migration acceptance criteria because `build-info.json` is unavailable and no live Vercel `commitSha` can be compared with `origin/main`.

`https://holistichealing.vercel.app/` and `/build-info.json` currently return:

```text
HTTP 404
server: Vercel
x-vercel-error: NOT_FOUND
```

## GitHub Secrets Status

Required repository secrets for `.github/workflows/deploy-production.yml`:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Current `gh secret list --repo andylitvinov-design/report` result:

```text
No repository secrets returned.
```

Confirmed through both:

```text
gh secret list --repo andylitvinov-design/report --json name,updatedAt
gh api repos/andylitvinov-design/report/actions/secrets
```

Do not run the production fallback workflow until these secrets exist. The workflow uses those secrets for `vercel pull`, `vercel build`, and `vercel deploy --prod`.

## Workflow Status

Workflow:

```text
.github/workflows/deploy-production.yml
```

Current GitHub API status:

```text
id: 286133044
name: Deploy Production Fallback
state: active
```

Current run history:

```text
No runs found for deploy-production.yml.
```

Required dispatch after secrets are present:

```bash
gh workflow run deploy-production.yml \
  --repo andylitvinov-design/report \
  --ref main \
  -f ref=main \
  -f expected_sha=a06bf2c8ea2ee30631807eff138cfc9f963b373f \
  -f reason="migration deploy to myalchemy"
```

Then verify:

```text
https://myalchemy.vercel.app/
https://myalchemy.vercel.app/build-info.json
```

The migration is complete only when `build-info.commitSha` equals:

```text
a06bf2c8ea2ee30631807eff138cfc9f963b373f
```

## Remaining Blockers

1. Vercel has an accessible `reports` project, but no accessible `myalchemy` project.
2. The accessible `reports` project is not connected to `andylitvinov-design/report`; `vercel git connect` returns Vercel API `400 Bad Request`.
3. The required production domain `myalchemy.vercel.app` is not serving a deployment and is not accessible in the current Vercel context.
4. Required GitHub repository secrets are missing: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
5. Production fallback workflow has not been run because the required secrets are missing.
6. Production `build-info.json` is unavailable, so Vercel live SHA comparison is impossible.

## Mandala / Public Service Requirements

The current `origin/main` tree does not contain these prompt-listed implementation files:

```text
src/pages/ProfilePage.jsx
src/lib/profileMaterialsClient.js
src/lib/profileMediaClient.js
src/profileCabinet.css
src/profileMandalaWorkspace.css
supabase/migrations/
```

No fetched remote branch in this repo contains `ProfilePage.jsx`, `profileMaterialsClient`, `profileMediaClient`, or `profileMandalaWorkspace`.

Therefore the following requirements remain blocked in `andylitvinov-design/report` until the correct source branch/repo containing the profile and mandala workspace is provided or merged here:

- publish saved mandalas to services;
- service placeholder/preview, title, status, description, edit description, save, copy link, slug;
- Russian-only service UI texts;
- public service page routing such as `/services/:id` or `/service/:id`;
- authenticated profile scenario checks;
- unauthenticated public-link check;
- DOM check proving private `storage://profile-cabinet-media/...` refs are not exposed.

Do not implement those requirements by rewriting unrelated report pages. They need the actual profile/materials code path.

## Acceptance Criteria

Migration can be marked complete only after all of these are true:

1. Required Vercel secrets exist in GitHub.
2. `.github/workflows/deploy-production.yml` succeeds for `ref=main` and the expected SHA.
3. `https://myalchemy.vercel.app/` responds with the app.
4. `https://myalchemy.vercel.app/build-info.json` responds.
5. `build-info.commitSha` equals the expected `main` SHA.
6. Legacy GitHub Pages remains available or is explicitly deprecated after Vercel is stable.
