# Skill: /delivery — PRODUCTION_DELIVERY_LOOP

`/delivery` is sufficient by itself.

The user must not need to add extra wording such as "I explicitly delegate merge" or "continue to live".

When the user invokes `/delivery`, that invocation means full safe delivery delegation for this repository:

```txt
implement -> checks -> PR -> PR health -> merge if safe/permitted -> deploy -> live verification
```

## Local Source of Truth

Read and follow these files in order:

1. `.claude/commands/delivery.md`
2. `docs/delivery-loop-program.md`
3. `docs/delivery-loop-technical-details.md`
4. `docs/delivery-loop-source-patterns-and-live-proof.md`
5. `AGENTS.md`

Do not browse or fetch external loop repos. If a local doc is missing, run the Local Checkout Recovery Gate before reporting `needs verification`.

## Local Checkout Recovery Gate

The canonical repo is `andylitvinov-design/report`. Local folder names are not authoritative. A checkout named `/Users/andriilitvinov/projects/MYPROJECTS/reports` can still be valid if its remote points to `andylitvinov-design/report`.

Before stopping for missing delivery docs:

1. Check the current repo root, remote, branch, and `origin/main`.
2. If the remote is not `andylitvinov-design/report`, stop with `STATUS: BLOCKED` and report the actual remote/path.
3. If the remote is `andylitvinov-design/report`, fetch `origin/main` and update the local checkout or create a clean worktree from `origin/main`.
4. If `origin/main` contains the shared delivery docs, sync them locally and continue. Do not classify the repo as unconfigured.
5. Only report missing shared docs after confirming they are absent both locally and on `origin/main`.

Required shared docs:

```txt
docs/delivery-loop-program.md
docs/delivery-loop-technical-details.md
docs/delivery-loop-source-patterns-and-live-proof.md
```

Task-specific docs such as `docs/first-intake-analysis-dialog-plan.md` are relevant only to their task. Their absence must not disable `/delivery` globally.

Project adapter: see `AGENTS.md` → Agent Command Registry → `/delivery`.

Default live target: `https://myalchemy.vercel.app/`.
SUCCESS requires live proof on this URL unless another target is explicitly requested. `https://holistichealing.vercel.app/` is an alternate/previous alias, and `https://andylitvinov-design.github.io/report/` is legacy/reference.

## Execution Order

Run the embedded loops in this order:

1. Local Source-of-Truth Read
2. Local Checkout Recovery Gate if any source file is missing
3. Project Adapter Extraction
4. Acceptance Criteria Extraction
5. Task Coverage Audit — initial
6. Implementation
7. Build Until Green
8. Local Checks Until Clean
9. Spiral Validator-Critic Loop
10. Ship PR Until Green
11. CI Failure Watcher if CI fails
12. PR Babysitter
13. Task Coverage Audit — pre-merge
14. Merge Until Confirmed
15. Deploy Verification Loop
16. Fix Deploy if deployment/live fails
17. Live Verification Loop
18. Task Coverage Audit — live
19. Final Evidence Report

## Stop States

### STATUS: SUCCESS

Allowed only when the task is implemented, merged if required, deployed to the target environment, and the requested behavior is verified live.

Must include completed live proof block:

```txt
LIVE PROOF:
- Live URL:
- Checked route/page:
- Final deployed commit:
- Expected live behavior:
- Actual live behavior:
- Evidence:
```

### STATUS: BLOCKED

Allowed only when a real external blocker prevents completion.

Must include:

```txt
- Where the loop stopped:
- What is complete:
- What is not complete:
- Exact blocker:
- Evidence:
- Required user action:
- Next prompt to run after unblocking:
```

## Rules

- Act as release owner, not only a coding assistant.
- Extract acceptance criteria from the original task before coding.
- Create a project adapter at the start of every run.
- Run: code → local checks → PR → PR health → task coverage audit → merge if permitted → deployment verification → live verification.
- Never claim SUCCESS from code, PR, CI, merge, or deployment alone.
- Never say "should be live soon" as a final answer.
- If evidence is missing, status is BLOCKED, not SUCCESS.
- Never disable tests, bypass branch protection, or hide failed checks.
- Never print secret values — report secret names only.

## Final Result Verification Gate

Implementation is not completion. Verification against the original request is completion.

Before any completion claim or `STATUS: SUCCESS`:

1. Reread the original user task.
2. Extract the Original Request Contract:
   - explicit requirements;
   - edge cases;
   - small UI details;
   - exclusions and do-not-touch rules;
   - required live/staging/mobile/desktop proof.
3. Compare the contract with the final diff and live proof.
4. Verify every requirement in this table:

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Allowed statuses: `PASS`, `PARTIAL`, `FAIL`, `NOT VERIFIED`.

Only `PASS` allows completion. If any required item is `PARTIAL`, `FAIL`, or `NOT VERIFIED`, do not say `done`, `fixed`, `implemented`, `ready`, or `ready to merge`. Say `Implemented but not verified.` or `Cannot verify because ...`.

If the gate fails, repair and rerun it. Stop after 2 failed gate repair attempts and report what still fails, why it was not fixed, the next file/function to inspect, and any required user action.

## Built-In Delegation

The `/delivery` command itself is the user's delegation to proceed through the full safe release path:

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

- Use the stable source-of-truth docs as cached/stable context. Place them first. Do not duplicate the full protocol in dynamic prompts each loop step.
- Put current task / logs / diffs / PR status after the stable protocol context.
- Prefer diffs over full files. Read only relevant files first. Do not scan the full repository unless necessary.
- Stop after **3 failed fix attempts** on the same issue — return `STATUS: BLOCKED` with the 3 attempts described.
- Never touch env vars, secrets, billing, production database, or auth-sensitive settings without explicit user approval. Stop and describe the required action.
- Use cheapest capable model/tooling for routine status checks, file listing, PR body edits, and repetitive summaries.
- Use stronger reasoning only for architecture gate, hard debugging, security-sensitive review, or final delivery-risk review.
- Final report must include:

```txt
COST CONTROL:
- Stable project context reused:
- Dynamic context separated:
- Diffs preferred over full files:
- Full repo scan avoided:
- Loop attempts used:
- Same-issue retry count:
- Expensive reasoning used for:
- Cost/token risk: low / medium / high
- What was avoided to save cost:
```
