# /delivery Managed Agent Upgrade Plan

Status: documented plan (not yet implemented)
Repository: `andylitvinov-design/report`

---

## Purpose

Local `/delivery` depends on local Claude Code, local repo state, and local CLI tools.
Managed Agent deployment provides persistent sessions, vault-stored credentials, and
no local Mac dependency.

---

## Proposed Managed Agents

### 1. `delivery-on-demand`

Start message:

```txt
Follow .claude/commands/delivery.md and AGENTS.md for andylitvinov-design/report.
Run the /delivery protocol for the provided task.
Finish only with STATUS: SUCCESS or STATUS: BLOCKED.
SUCCESS requires live proof on https://psitherapy.vercel.app/.
```

### 2. `delivery-watchdog`

Suggested schedule: every 1–2 hours during active development.

Start message:

```txt
Check open delivery PRs and recent Vercel deployments for andylitvinov-design/report.
Fix if safe or return STATUS: BLOCKED with evidence and required user action.
```

### 3. `production-health-check`

Suggested schedule: morning and evening.

Start message:

```txt
Check production health:
- https://psitherapy.vercel.app/ — primary live URL
- https://holistichealing.vercel.app/ — alternate
Verify HTTP 200 and page renders. Do not mutate data. Report STATUS: SUCCESS or STATUS: BLOCKED.
```

---

## Required Environment Variables

Names only. Never commit values.

```txt
GITHUB_TOKEN       — GitHub API access
VERCEL_TOKEN       — Vercel API access
VERCEL_ORG_ID      — Vercel org (andylitvinov-design)
VERCEL_PROJECT_ID  — Vercel project ID for report/psitherapy
LIVE_URL           — https://psitherapy.vercel.app/
```

---

## Implementation Status

- [ ] Managed agent environment provisioned.
- [ ] Credentials set in agent vault.
- [ ] `delivery-on-demand` agent created and tested.
- [ ] `delivery-watchdog` scheduled.
- [ ] `production-health-check` scheduled.
