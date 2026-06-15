# /delivery Technical Details — My Alchemy Report

This file adapts the universal `/delivery` loop to `andylitvinov-design/report`.

## 1. Commands

Minimum local verification:

```bash
npm ci
npm run build
npm run delivery:check
```

Package scripts used by this protocol:

```json
{
  "delivery:check": "bash scripts/delivery-checks.sh",
  "delivery:status": "bash scripts/delivery-status.sh"
}
```

`delivery:check` should:

1. verify the `/delivery` docs contain the Final Result Verification Gate;
2. validate optional `.delivery/status.json` shape;
3. run configured package scripts when available;
4. always run `npm run build` when present.

`delivery:status` should print:

- git branch/status;
- recent commits;
- PR status and checks when `gh` exists;
- live HEAD when `LIVE_URL` is supplied;
- result verification summary when `.delivery/status.json` exists;
- Spiral Validator-Critic summary when recorded.

## 2. GitHub / PR Flow

Required sequence:

```txt
latest main -> focused branch -> implementation -> checks -> PR -> PR health -> task coverage audit -> merge if safe -> deployment verification -> live proof
```

Rules:

- Do not create unrelated changes.
- Do not bypass failed checks.
- Do not mark a PR merge-ready if the Original Request Contract has `PARTIAL`, `FAIL`, or `NOT VERIFIED` required items.
- If CI fails, read the failure, fix the first meaningful cause, rerun, and stop after 3 failed attempts on the same issue.
- If branch protection or required human review blocks merge, report `STATUS: BLOCKED` with exact evidence.

## 3. Deployment Flow

Primary production target:

```txt
https://myalchemy.vercel.app/
https://myalchemy.vercel.app/build-info.json
```

Fallback workflow:

```txt
.github/workflows/deploy-production.yml
```

Dispatch command when secrets are configured and a merged SHA is known:

```bash
gh workflow run deploy-production.yml \
  --repo andylitvinov-design/report \
  --ref main \
  -f ref=main \
  -f expected_sha=<expected_commit_sha> \
  -f reason="fallback deploy after delivery merge"
```

Required secrets:

```txt
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Never print secret values. Report only secret names.

Known migration caveat: `docs/myalchemy-migration-plan.md` records that the primary Vercel target may still be blocked by missing Vercel project/domain/secrets. If that remains true during a `/delivery` run, final status must be `STATUS: BLOCKED`, not success.

## 4. Live Verification

A production delivery is successful only when:

1. the primary URL responds;
2. `/build-info.json` responds;
3. `build-info.commitSha` equals the expected final merged commit;
4. the requested behavior is visible or testable on the relevant route.

For legacy verification, use:

```txt
https://andylitvinov-design.github.io/report/
https://andylitvinov-design.github.io/report/build-info.json
```

Legacy verification can prove GitHub Pages only. It does not satisfy primary Vercel production success unless the user explicitly set legacy as target.

## 5. Result Verification JSON

Optional run status can be recorded at:

```txt
.delivery/status.json
```

Validate it against:

```txt
.delivery/status.schema.json
```

Minimum semantic rules:

- `result_verification.requirements[*].status` must be one of `PASS`, `PARTIAL`, `FAIL`, `NOT VERIFIED`.
- `merge_readiness` cannot be `Ready` unless all required result verification items are `PASS`.
- `repair_attempts` must be `0`, `1`, or `2`.
- `spiralValidatorCritic.loopNumber` must be `1`, `2`, or `3`.
- `READY_FOR_MERGE` requires all critic requirements to be `PASS`.
- `IMPROVE` or `IMPROVE_MINOR` requires a concrete `nextImprovementPlan`.
- `SAFETY_STOP` requires a concrete `safetyRisks` entry.

## 6. Agent Decision Table

| Situation | Action |
|---|---|
| Local build fails | Fix first meaningful failure, rerun, max 3 attempts per same issue |
| PR has conflicts | Rebase/update branch if safe; otherwise report blocker |
| CI fails | Inspect logs, patch, rerun; do not ignore |
| Required review blocks merge | `STATUS: BLOCKED` with review requirement evidence |
| Vercel secrets missing | `STATUS: BLOCKED`; list secret names only |
| Primary live build-info missing | classify as deploy/config/status-marker failure |
| Live SHA does not match expected SHA | deployment not complete; rerun/fix deploy if possible |
| Feature works locally but not live | not success; fix deploy/runtime or report exact blocker |
| Original request item not verified | not success; repair or report blocked after 2 repair attempts |

## 7. Final Report Checklist

Every final answer for `/delivery` must include:

```txt
STATUS:
Repo:
Target ref:
Expected SHA:
Changed files:
Checks run:
PR:
Merge status:
Deploy workflow result if used:
Production URL:
Build info URL:
Live version check:
Result verification table:
Live proof:
Cost control:
Remaining blockers:
```
