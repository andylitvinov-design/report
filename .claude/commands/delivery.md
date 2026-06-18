# /delivery

`/delivery` is sufficient by itself.

The user must not need to add extra wording such as "I explicitly delegate merge", "continue to live", "please deploy", or "please verify live".

When the user invokes `/delivery`, that invocation means full safe delivery delegation for this repository:

```txt
implement -> checks -> PR -> PR health -> merge if safe/permitted -> deploy -> live verification
```

## Local Source of Truth

Follow all source-of-truth docs in order:

1. `.claude/commands/delivery.md`
2. `.claude/skills/delivery/SKILL.md`
3. `docs/delivery-loop-program.md` — full protocol, stop states, final report format
4. `docs/delivery-loop-technical-details.md` — scripts, commands, CI/CD checks, agent decision table
5. `docs/delivery-loop-source-patterns-and-live-proof.md` — embedded loop patterns and live proof contract
6. `AGENTS.md` — project adapter and command registry

These docs are the local source of truth. Do not browse or fetch external loop repos. If a local doc is missing, first run the Local Checkout Recovery Gate below. If the file is still missing after that gate, report `needs verification` and do not invent replacement rules.

## Local Checkout Recovery Gate

This repo's canonical GitHub repository is `andylitvinov-design/report`. Local folder names are not authoritative. A local checkout may be named `report`, `reports`, or something else.

Before stopping because delivery docs are missing, verify the checkout:

```bash
git rev-parse --show-toplevel
git remote -v
git branch --show-current
git fetch origin main
```

Then apply these rules:

1. If the remote is not `andylitvinov-design/report`, stop with `STATUS: BLOCKED` and report the actual remote/path. Do not copy delivery rules into an unrelated repo.
2. If the remote is `andylitvinov-design/report` and the current branch is stale, update from `origin/main` or create a clean worktree from `origin/main` before running `/delivery`.
3. If the local folder is `/Users/andriilitvinov/projects/MYPROJECTS/reports` but the remote is `andylitvinov-design/report`, treat it as the correct repo with a non-canonical local folder name.
4. If `origin/main` contains the delivery docs but the current checkout does not, sync the checkout from `origin/main` and continue. Do not stop as if the project is unconfigured.
5. Only report missing shared docs after confirming they are absent from the current checkout and from `origin/main` of `andylitvinov-design/report`.

Required shared docs for this repo:

```txt
docs/delivery-loop-program.md
docs/delivery-loop-technical-details.md
docs/delivery-loop-source-patterns-and-live-proof.md
```

Task-specific docs such as `docs/first-intake-analysis-dialog-plan.md` should be read when relevant, but absence of a task-specific doc is not a reason to disable `/delivery` globally.

Act as release owner for this project.

Input format:

```txt
Task:
$ARGUMENTS
```

Project adapter for this repo:

- Repository: `andylitvinov-design/report`
- Default branch: `main`
- Target branch: `main`
- Package manager: `npm`
- Framework: Vite + React SPA
- Build: `npm run build`
- Check: `npm run delivery:check` or `npm run build` when only product code changed
- CI: GitHub Actions
- Deployment: Vercel fallback workflow + legacy GitHub Pages workflow
- Primary live URL: `https://myalchemy.vercel.app/`
- Primary build info URL: `https://myalchemy.vercel.app/build-info.json`
- Alternate Vercel URL: `https://holistichealing.vercel.app/`
- Legacy URL: `https://andylitvinov-design.github.io/report/`

SUCCESS requires live proof on the primary live URL unless the user explicitly requests legacy or preview verification instead. If the primary Vercel project or secrets are still missing, stop with `STATUS: BLOCKED` and cite the exact blocker from `docs/myalchemy-migration-plan.md` or the current workflow/log evidence.

## Final Result Verification Gate

Implementation is not completion. Verification against the original request is completion.

Before saying `STATUS: SUCCESS`, `done`, `fixed`, `implemented`, `ready`, or `ready to merge`, extract the Original Request Contract from the user's task:

- explicit requirements;
- edge cases;
- small UI/API/data details;
- explicit exclusions and do-not-touch rules;
- required live/staging/mobile/desktop proof.

Verify every contract item:

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Allowed statuses: `PASS`, `PARTIAL`, `FAIL`, `NOT VERIFIED`.

Do not use completion language if any required item is `PARTIAL`, `FAIL`, or `NOT VERIFIED`. Say `Implemented but not verified.` or `Cannot verify because ...` instead.

After implementation, reread the original task and compare it with the diff, local checks, PR state, deployment state, and live proof. If a gap is found, repair and rerun the gate. After 2 failed gate repair attempts, stop with `STATUS: BLOCKED` and report the remaining gap, why it was not fixed, the next file/function to inspect, and any required user action.

Required final status:

- `STATUS: SUCCESS` — task implemented, PR merged or direct-to-main confirmed, deployed, and verified live.
- `STATUS: BLOCKED` — exact external blocker, evidence, and required user action.

Do not stop after code, PR, checks, merge, or deploy.

## Built-In Delegation

The `/delivery` command itself is the user's delegation to proceed through the full safe release path.

That includes:

- create branch/worktree from `origin/main`;
- implement minimal safe patch;
- run relevant tests/checks;
- commit and push branch;
- create or update PR;
- check PR health and CI;
- fix until green and task-complete;
- merge if safe and permitted;
- verify deployment;
- verify live behavior on the primary live URL.

Do not ask the user to additionally confirm merge/deploy/live verification merely because `/delivery` was invoked.

## PR checkpoint policy

For `/delivery`, an opened pull request is an intermediate checkpoint, not the normal finish line.

Default behavior after PR creation:

1. inspect PR health and CI;
2. run or confirm project-required checks;
3. run the Spiral Validator-Critic Loop until the verdict is `READY_FOR_MERGE` or `READY_WITH_NOTES`;
4. merge when the PR is healthy and merge is permitted;
5. continue to deploy and live verification when the project adapter requires it.

Review-only mode is used only when the user explicitly asks for review-only, PR-only, draft-only, or no-deploy work.

If merge cannot proceed, return `STATUS: BLOCKED` with the exact reason and next action.

Ask or stop with `STATUS: BLOCKED` only when there is a real external blocker: missing permission, required human review, failed checks that cannot be fixed safely, project-specific safety risk, missing secret/env, deployment access missing, or unsafe/destructive action required.

## Spiral Validator-Critic Loop

The Spiral Validator-Critic Loop is an improvement loop, not a hard blocker.

Run it after implementation and local checks, before merge readiness is claimed:

```txt
implement -> critic review -> concrete improvement plan -> patch next loop -> critic review again
```

The critic must validate the Original Request Contract requirement by requirement and output concrete next actions. It may run up to 3 loops.

Allowed critic verdicts:

- `READY_FOR_MERGE` — all critic requirements are `PASS`.
- `READY_WITH_NOTES` — merge may proceed with documented, non-blocking notes or externally limited gaps.
- `IMPROVE` — another improvement loop is required.
- `IMPROVE_MINOR` — a small improvement loop is required.
- `SAFETY_STOP` — continuing is unsafe or externally blocked.
- `NEEDS_HUMAN_DECISION` — owner/product judgment is required.

Use `SAFETY_STOP` only for dangerous or externally impossible cases. Missing polish, weak evidence, or partial UI/API quality should normally become `IMPROVE`, `IMPROVE_MINOR`, or `READY_WITH_NOTES` with a concrete next action.

Record machine-readable critic output in optional top-level `.delivery/status.json` field `spiralValidatorCritic`. Do not put it inside `result_verification`.

## Cost-Control Rules

- Treat the stable docs above as cached/stable context. Do not duplicate the full protocol in dynamic prompts.
- Put current task, logs, diffs, and PR status after the stable protocol context.
- Prefer diffs over full files. Do not scan the full repository unless necessary.
- Stop after 3 failed fix attempts on the same issue — return `STATUS: BLOCKED`.
- Never touch env vars, secrets, billing, production database, or auth-sensitive settings without explicit user approval.
- Use cheapest capable model/tooling for routine status checks; use stronger reasoning only for architecture, hard debug, or final delivery-risk review.
- Final report must include a COST CONTROL section.

SUCCESS requires a completed live proof block:

```txt
LIVE PROOF:
- Live URL:
- Checked route/page:
- Final deployed commit:
- Expected live behavior:
- Actual live behavior:
- Evidence:
```

SUCCESS also requires a completed result verification block:

```txt
RESULT VERIFICATION:
| Requirement | Status | Evidence | Verification method |
|---|---|---|---|
```

BLOCKED requires:

```txt
- Where the loop stopped:
- What is complete:
- What is not complete:
- Exact blocker:
- Evidence:
- Required user action:
- Next prompt to run after unblocking:
```
