# Deploy Fallback

This project uses Vercel as the desired primary production target and GitHub Pages as legacy/reference hosting.

## Production targets

Primary production URL:

```text
https://psitherapy.vercel.app/
```

Primary build-info URL:

```text
https://psitherapy.vercel.app/build-info.json
```

Possible alternate / previous Vercel alias:

```text
https://holistichealing.vercel.app/
```

Alternate build-info URL:

```text
https://holistichealing.vercel.app/build-info.json
```

Legacy GitHub Pages URL:

```text
https://andylitvinov-design.github.io/report/
```

Legacy build-info URL:

```text
https://andylitvinov-design.github.io/report/build-info.json
```

## Related Alchemy repositories

```text
andylitvinov-design/report         main React/Vite implementation for psitherapy.vercel.app
andylitvinov-design/alchemy        concept/MVP notes and static draft materials
andylitvinov-design/alchemy-method methodology/source logic
andylitvinov-design/alchemy_site   standalone site-facing HTML bundle / cloud-ready shell
```

Use `report` as the main site implementation repo for `psitherapy.vercel.app`.

## Workflow

Vercel fallback workflow:

```text
.github/workflows/deploy-production.yml
```

Legacy GitHub Pages workflow:

```text
.github/workflows/pages.yml
```

## When to use fallback deploy

Use fallback deploy when:

```text
1. The intended commit is already committed and pushed.
2. The intended production ref is known, normally main.
3. Vercel production is stale after push/merge.
4. Vercel auto-deploy did not start, failed, or deployed the wrong commit.
5. The user says live does not show the completed changes.
6. build-info.json shows an old commitSha.
```

## When not to use fallback deploy

Do not use fallback deploy when:

```text
1. Changes are uncommitted.
2. Changes are only local and not pushed.
3. The target ref/commit is unknown.
4. npm run build fails.
5. Production already serves the expected commit.
6. There is a risk of deploying an old ref over a newer production build.
```

## Required GitHub Secrets for Vercel fallback

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

These secrets must exist in GitHub repository settings. Do not commit secrets to the repository and do not paste them into chat.

## Standard fallback command

```bash
gh workflow run deploy-production.yml \
  --ref main \
  -f ref=main \
  -f expected_sha=<expected_commit_sha> \
  -f reason="fallback deploy after stale production"
```

Then watch the run:

```bash
gh run list --workflow deploy-production.yml --limit 5
gh run watch <run-id>
```

## Agent protocol

Before fallback deploy:

```text
1. Identify repo.
2. Identify target ref, normally main.
3. Identify expected commit SHA.
4. Confirm changes are committed and pushed.
5. Check primary production URL and build-info URL.
6. Compare live build-info commitSha with expected SHA.
7. If primary production is stale, trigger deploy-production.yml.
```

After fallback deploy:

```text
1. Re-check https://psitherapy.vercel.app/.
2. Re-check https://psitherapy.vercel.app/build-info.json.
3. Compare live commitSha with expected SHA.
4. If relevant, check alternate Vercel alias https://holistichealing.vercel.app/.
5. During migration, also check legacy GitHub Pages URL/build-info.
6. Report workflow result and live verification.
```

## Hard rules

```text
commit / push / merge first
fallback deploy second
production verification third
```

Never ask the user to run `vercel --prod` locally until this fallback workflow has been attempted and diagnosed.

Never ask the user to check the current live version manually when build-info URL is available.

Never run fallback deploy until the target commit is committed, pushed and identified.

Never claim production is updated without checking production after deploy.

## Minimal final report

```text
Repo:
Platform:
Target ref:
Expected SHA:
Workflow:
Run status:
Production URL:
Build-info URL:
Live commit/build:
Alternate URL:
Legacy URL:
Remaining issue:
```

## Source standard

Cross-project standard lives in:

```text
andylitvinov-design/active-projects-ops
```

Relevant docs:

```text
docs/github-actions-vercel-deploy-fallback-plan.md
docs/deploy-fallback-agent-autodeploy-protocol.md
docs/deploy-fallback-branch-propagation-policy.md
docs/deploy-version-check-protocol.md
```
