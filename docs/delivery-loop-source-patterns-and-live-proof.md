# /delivery Source Patterns and Live Proof Contract

This document describes the embedded loops that `/delivery` combines for `andylitvinov-design/report`.

## 1. Combined Source Patterns

`/delivery` combines these operating patterns:

1. **Build Until Green** — run build/checks, fix the first meaningful failure, repeat.
2. **Ship PR Until Green** — create/update PR, inspect PR health, fix conflicts and failed checks.
3. **CI Failure Watcher** — read CI failure logs, identify root cause, patch, and rerun.
4. **PR Babysitter** — keep base branch, mergeability, checks, and task coverage healthy.
5. **Spiral Validator-Critic Loop** — critique the implementation against the Original Request Contract and patch gaps.
6. **Task Coverage Audit** — compare original task to final diff and live result.
7. **Deploy Verification Loop** — confirm deployment provider used the expected final commit.
8. **Live Verification Loop** — verify the requested behavior on the target live URL.
9. **Final Evidence Report** — report only evidence-based success or an exact blocker.

## 2. Build Until Green

Loop:

```txt
run checks -> read first meaningful failure -> patch -> rerun
```

Default checks:

```bash
npm ci
npm run build
npm run delivery:check
```

Stop after 3 failed attempts on the same issue.

## 3. Ship PR Until Green

Loop:

```txt
create/update PR -> inspect mergeability/checks -> patch conflicts or failures -> recheck
```

Required PR evidence:

- PR URL;
- base branch;
- head branch;
- changed files;
- checks status;
- mergeability;
- result verification table.

## 4. Spiral Validator-Critic Loop

Loop:

```txt
implementation -> critic review -> improvement plan -> patch -> critic review
```

The critic must inspect the implementation against the Original Request Contract, not just code style.

Allowed verdicts:

```txt
READY_FOR_MERGE
READY_WITH_NOTES
IMPROVE
IMPROVE_MINOR
SAFETY_STOP
NEEDS_HUMAN_DECISION
```

`SAFETY_STOP` is only for real safety/external blockers.

## 5. Task Coverage Audit

Before final status, extract the Original Request Contract:

```txt
- explicit requirements
- edge cases
- UI/API/data invariants
- exclusions and do-not-touch rules
- live/staging/mobile/desktop proof requirements
```

Then verify each item:

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Only all `PASS` permits success.

## 6. Deploy Verification Loop

Primary production:

```txt
https://myalchemy.vercel.app/
https://myalchemy.vercel.app/build-info.json
```

Required proof:

```txt
- expected commit SHA
- deployment mechanism used
- deployment status
- build-info response
- live commit equals expected SHA
```

If Vercel secrets/project/domain are missing, report:

```txt
STATUS: BLOCKED
Exact blocker: missing Vercel project/domain/secrets for primary production deploy
Evidence: [workflow or migration doc/log]
Next action: configure required Vercel project/domain/secrets or use the documented fallback handoff
```

## 7. Live Verification Contract

SUCCESS requires this block:

```txt
LIVE PROOF:
- Live URL:
- Checked route/page:
- Final deployed commit:
- Expected live behavior:
- Actual live behavior:
- Evidence:
```

For UI changes, evidence should include at least one of:

- browser/screenshot verification;
- DOM/text check;
- route smoke test;
- build-info SHA check plus route response.

For pure docs/protocol changes, live proof can be `not applicable` only if the user did not request deployment. Then final status must avoid claiming production behavior changed.

## 8. Live Proof Examples

Good:

```txt
LIVE PROOF:
- Live URL: https://myalchemy.vercel.app/self-analysis
- Checked route/page: /self-analysis desktop and mobile viewport
- Final deployed commit: abc123
- Expected live behavior: overview state shown first, no 115-question wall
- Actual live behavior: overview cards render first; focused questionnaire hides sidebar and heavy panels
- Evidence: build-info.commitSha=abc123; Playwright text/selector checks passed
```

Blocked:

```txt
STATUS: BLOCKED
- Where the loop stopped: Deploy Verification Loop
- What is complete: branch, PR, checks, merge
- What is not complete: primary Vercel deployment/live proof
- Exact blocker: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID missing
- Evidence: deploy-production.yml requires those secrets; workflow cannot run successfully without them
- Required user action: add the missing Vercel secrets or grant deploy integration access
- Next prompt to run after unblocking: /delivery verify latest main on myalchemy.vercel.app and run fallback deploy if stale
```

## 9. Anti-Patterns

Do not write:

- "should be live soon";
- "deployment probably succeeded";
- "PR is ready" when task coverage is not verified;
- "done" when live proof is missing;
- "ask Andrey to deploy locally".

Use:

- `STATUS: SUCCESS` with proof;
- `STATUS: BLOCKED` with exact blocker;
- `Implemented but not verified` when implementation exists but proof is incomplete.
