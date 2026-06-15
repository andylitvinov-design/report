# Universal /delivery Loop — Technical Implementation Program

Status: reusable implementation program  
Command name: `/delivery`  
Internal name: `PRODUCTION_DELIVERY_LOOP`  
Scope: `andylitvinov-design/report` and other user software projects  
Primary goal: eliminate manual release-management checks after an agent coding task  
Final result: `STATUS: SUCCESS` or `STATUS: BLOCKED`

---

## 1. Executive Purpose

`/delivery` is a release-owner workflow for coding agents.

It is not only a prompt. It tells the agent to own the whole path from task to live verification.

`/delivery` is sufficient by itself. The user must not need to add extra wording such as "I explicitly delegate merge", "continue to live", "please deploy", or "please verify live".

The user can write:

```txt
/delivery

Task:
[concrete task]

Target:
Production live site.
```

The agent must continue until one of two final states:

```txt
STATUS: SUCCESS
```

or

```txt
STATUS: BLOCKED
```

The agent must not stop at code changes, PR creation, green CI, merge, deployment, or "should be live soon".

The task is complete only when the requested behavior is verified on the target live environment, or when a real external blocker prevents completion.

---

## 2. Project Adapter: `andylitvinov-design/report`

```txt
PROJECT ADAPTER
- Repository: andylitvinov-design/report
- Default branch: main
- Target branch: main
- Package manager: npm
- Framework/runtime: Vite + React SPA
- Build command: npm run build
- Delivery check command: npm run delivery:check
- Lint command: not configured unless added later
- Typecheck command: not configured unless added later
- Test command: not configured unless added later
- CI provider: GitHub Actions
- Deployment provider: Vercel fallback workflow + legacy GitHub Pages
- Primary live URL: https://myalchemy.vercel.app/
- Primary build info URL: https://myalchemy.vercel.app/build-info.json
- Alternate URL: https://holistichealing.vercel.app/
- Legacy URL: https://andylitvinov-design.github.io/report/
- Required deploy secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
- PR policy: branch from latest main, create PR, verify diff and checks, merge only if safe/permitted
- Merge policy: merge only after build/checks and task coverage audit pass, unless an explicit project rule says otherwise
- Deployment policy: after merge, verify production build-info commit; if Vercel is blocked, report exact blocker and next non-user action
- Docs/rules to read first: AGENTS.md, README.md, package.json, vite.config.js, vercel.json, deploy docs, this delivery protocol
```

---

## 3. Core Delivery Chain

Canonical chain:

```txt
Task
-> Acceptance criteria
-> Project adapter
-> Code implementation
-> Local checks
-> Spiral Validator-Critic Loop
-> PR creation/update
-> PR health check
-> CI/checks until green
-> Task coverage audit
-> Merge until confirmed
-> Deployment verification
-> Live verification
-> Final report
```

Short form:

```txt
idea -> code -> PR -> checks -> merge -> deploy -> live -> proof
```

---

## 4. What /delivery Means

When `/delivery` is invoked, the agent acts as a release owner.

The agent owns:

```txt
understand -> implement -> verify -> PR -> CI -> merge -> deploy -> live check
```

Partial progress is not success.

Not success:

- code changed;
- local build passed;
- PR created;
- PR ready for review;
- CI green;
- merge completed;
- deployment started;
- deployment succeeded;
- site should update soon.

Success:

```txt
The requested behavior is verified on the target live environment, and the final report proves it.
```

Blocked:

```txt
A real permission, access, secret, CI, deployment, review, or environment blocker prevents completion, and the final report identifies the exact blocker and next action.
```

---

## 5. Final Result Verification Gate

Implementation is not completion. Verification against the original request is completion.

Every `/delivery` run must extract an Original Request Contract from the user's task before the final report:

- explicit requirements;
- edge cases;
- UI/API/data invariants relevant to the project adapter;
- explicit exclusions and do-not-touch rules;
- required live/staging/API/sheet/mobile/desktop proof.

Every contract item must be verified requirement by requirement:

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Allowed statuses are `PASS`, `PARTIAL`, `FAIL`, and `NOT VERIFIED`.

The agent must not say `done`, `fixed`, `implemented`, `ready`, `ready to merge`, or `STATUS: SUCCESS` if any required item is `PARTIAL`, `FAIL`, or `NOT VERIFIED`. Use `Implemented but not verified.` or `Cannot verify because ...` instead.

After implementation, the agent must reread the original task and compare it with the diff, local checks, PR state, deployment state, and live proof. If a gap is found, repair and rerun the gate. After 2 failed gate repair attempts, stop with `STATUS: BLOCKED` and report the remaining gap, reason, next file/function to inspect, and any required user action.

---

## 6. Spiral Validator-Critic Loop

The Spiral Validator-Critic Loop is an improvement loop, not a hard blocker.

Run it after implementation and local checks, before merge readiness is claimed:

```txt
implement
-> critic review
-> concrete improvement plan
-> patch next loop
-> critic review again
```

The critic must compare the implementation against the Original Request Contract requirement by requirement and output concrete next actions. The critic may run up to 3 loops.

Allowed critic requirement statuses:

- `PASS`
- `IMPROVE`
- `PARTIAL`
- `FAIL`
- `NOT VERIFIED`

Allowed critic verdicts:

- `READY_FOR_MERGE` — all critic requirements are `PASS`.
- `READY_WITH_NOTES` — merge may proceed with documented, non-blocking notes or externally limited gaps.
- `IMPROVE` — another improvement loop is required.
- `IMPROVE_MINOR` — a small improvement loop is required.
- `SAFETY_STOP` — continuing is unsafe or externally blocked.
- `NEEDS_HUMAN_DECISION` — owner/product judgment is required.

Use `SAFETY_STOP` only for dangerous or externally impossible cases such as data-loss risk, auth/security risk, missing permission, missing secret/env, destructive action, or a product semantics risk that cannot be proven safely.

Missing polish, weak evidence, or partial UI/API quality should normally become `IMPROVE`, `IMPROVE_MINOR`, or `READY_WITH_NOTES` with a concrete `nextAction`, not `BLOCKED`.

Record machine-readable critic output in optional top-level `.delivery/status.json` field `spiralValidatorCritic`. Do not put it inside `result_verification`, because `result_verification` is the final request-verification gate and remains backward-compatible.

Merge readiness is separate from final `STATUS: SUCCESS`: a `READY_FOR_MERGE` or `READY_WITH_NOTES` critic verdict can allow merge/PR progress, but final `SUCCESS` still requires deployment and live proof.

---

## 7. Required Files in This Project

This project should contain:

```txt
AGENTS.md
.claude/commands/delivery.md
.claude/skills/delivery/SKILL.md
docs/delivery-loop-program.md
docs/delivery-loop-technical-details.md
docs/delivery-loop-source-patterns-and-live-proof.md
.delivery/status.schema.json
scripts/delivery-checks.sh
scripts/delivery-status.sh
.github/pull_request_template.md
```

---

## 8. Branch / PR Policy

1. Start from latest `main`.
2. Use a focused branch name such as `codex/<task-slug>`.
3. Keep the diff minimal and related to the task.
4. Prefer updating an existing PR for the same task over creating duplicates.
5. PR body must include summary, checks, result verification, deployment/live proof status, and blockers.
6. Never mark PR ready if the task coverage audit fails.
7. Never merge if required checks fail or the PR has unresolved review blockers.

---

## 9. Checks

Minimum checks for this repo:

```bash
npm ci
npm run build
npm run delivery:check
```

`npm run delivery:check` validates delivery docs, optional `.delivery/status.json`, then runs available package scripts (`lint`, `typecheck`, `check`, `build`) if configured.

If `npm ci` cannot run because package-lock is out of sync, fix the lockfile or stop with a precise blocker.

---

## 10. Deployment Verification

Primary Vercel target:

```txt
https://myalchemy.vercel.app/
https://myalchemy.vercel.app/build-info.json
```

Alternate Vercel target:

```txt
https://holistichealing.vercel.app/
https://holistichealing.vercel.app/build-info.json
```

Legacy GitHub Pages target:

```txt
https://andylitvinov-design.github.io/report/
https://andylitvinov-design.github.io/report/build-info.json
```

Production delivery success requires the live `build-info.commitSha` to match the expected merged commit SHA.

If the primary Vercel target is unavailable because the project/domain/secrets are not configured, do not pretend success. Stop with `STATUS: BLOCKED`, cite the exact missing secret/domain/project, and give the next non-user action or exact owner action.

---

## 11. Stop States

### STATUS: SUCCESS

Allowed only when:

- original request contract is fully verified;
- code or docs changes are committed;
- PR is merged if required;
- deployment has completed;
- requested behavior is verified on the requested live target;
- final answer includes evidence.

Required final blocks:

```txt
STATUS: SUCCESS

RESULT VERIFICATION:
| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

LIVE PROOF:
- Live URL:
- Checked route/page:
- Final deployed commit:
- Expected live behavior:
- Actual live behavior:
- Evidence:

COST CONTROL:
- Stable project context reused:
- Dynamic context separated:
- Diffs preferred over full files:
- Full repo scan avoided:
- Loop attempts used:
- Same-issue retry count:
- Expensive reasoning used for:
- Cost/token risk:
- What was avoided to save cost:
```

### STATUS: BLOCKED

Allowed only when a real external blocker prevents completion.

Required final blocks:

```txt
STATUS: BLOCKED

- Where the loop stopped:
- What is complete:
- What is not complete:
- Exact blocker:
- Evidence:
- Required user action:
- Next prompt to run after unblocking:

RESULT VERIFICATION:
| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

COST CONTROL:
...
```

---

## 12. Cost-Control Rules

- Stable docs first, dynamic task evidence second.
- Prefer diffs, targeted file reads, and exact logs.
- Do not scan the whole repository unless the task requires it.
- Stop after 3 failed attempts on the same issue.
- Never reveal or print secret values.
- Do not touch env vars, secrets, billing, production database, or auth-sensitive settings without explicit approval.
