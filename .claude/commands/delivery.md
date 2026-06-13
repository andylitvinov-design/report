# /delivery

`/delivery` is sufficient by itself. The user does not need to add extra delegation phrases.
The command means full safe release-owner delegation:

```
task → acceptance criteria → implementation → result quality gate → local checks
→ PR → PR health → merge if permitted → deploy → live proof → final report
```

## Project Adapter

- Repository: `andylitvinov-design/report`
- Default branch: `main`
- Target branch: `main`
- Package manager: `npm`
- Framework: Vite + React SPA
- Build command: `npm run build`
- Check command: `npm run build` (no lint/typecheck/test scripts available)
- CI: GitHub Actions (`.github/workflows/`)
- Deployment: Vercel (auto-deploy from GitHub)
- Primary live URL: `https://myalchemy.vercel.app/` ← default SUCCESS target
- Alternate URL: `https://holistichealing.vercel.app/`
- Legacy URL: `https://andylitvinov-design.github.io/report/`

SUCCESS requires live proof on `https://myalchemy.vercel.app/` unless another
target is explicitly requested.

## Safety Rules

- Preserve existing holistic therapy report UX and Alchemy methodology data.
- Do not change env vars, secrets, or Vercel/Supabase credentials.
- Do not run database migrations or client data backfills.
- Do not break existing report pages or client-facing routes.

## Protocol

Act as release owner for this project.

1. Extract acceptance criteria from the original task before coding.
2. Implement the minimum required change.
3. Run: `npm run build`
4. Create a PR with task description, acceptance criteria, and check evidence.
5. Monitor CI; fix until all checks pass.
6. Verify PR is mergeable; merge if permitted.
7. Verify Vercel deployment triggered for the final commit.
8. Verify `https://myalchemy.vercel.app/` shows the expected behavior.
9. Return STATUS: SUCCESS or STATUS: BLOCKED.

Input format:

Task:
$ARGUMENTS

## Result Quality Gate

Before any final readiness claim, extract the Original Request Contract:
- explicit requirements; edge cases; UI details; exclusions; required live proof.

Verify every contract item:

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Allowed statuses: `PASS`, `PARTIAL`, `FAIL`, `NOT VERIFIED`.

`PARTIAL`, `FAIL`, or `NOT VERIFIED` block STATUS: SUCCESS.
Do not use completion language ("done", "ready", "fixed") unless all required items are PASS.
Repair and rerun the gate. Stop after 2 failed repair attempts with STATUS: BLOCKED.

## Stop States

### STATUS: SUCCESS

Allowed only when: task implemented, merged, deployed, and verified live.

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

- Never claim SUCCESS from code, PR, CI, merge, or deployment alone.
- Never say "should be live soon" as a final answer.
- Stop after 3 failed fix attempts on the same issue — return STATUS: BLOCKED.
- Never touch env vars, secrets, billing, or auth-sensitive settings without explicit user approval.

```txt
COST CONTROL:
- Stable project context reused:
- Dynamic context separated:
- Diffs preferred over full files:
- Full repo scan avoided:
- Loop attempts used:
- Same-issue retry count:
- Cost/token risk: low / medium / high
```
