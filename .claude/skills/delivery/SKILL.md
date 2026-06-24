# Skill: /delivery — LOW_CONFIRMATION_DELIVERY_LOOP

`/delivery` is sufficient by itself.

The command is full safe delivery delegation for this repository:

```txt
implement -> checks -> PR -> PR health -> merge when green/permitted -> deploy -> live verification
```

Do not ask the user for extra confirmation merely to:

- create a branch or worktree;
- edit intended files;
- run safe checks/builds/tests;
- create or update a PR;
- inspect PR health and CI;
- merge when green and permitted;
- trigger the repo deployment fallback;
- verify live behavior.

Ask or stop only for real blockers:

- missing permission;
- failed checks that cannot be fixed safely;
- required human review or branch protection;
- missing deployment secret/access;
- auth boundary with no safe public/local/code proof;
- requested change touches secrets, billing, auth provider settings, production data, or destructive operations.

## Source of truth

Read local files first:

1. `.claude/commands/delivery.md`
2. `AGENTS.md`
3. `docs/delivery-loop-program.md`
4. `docs/delivery-loop-technical-details.md`
5. `docs/delivery-loop-source-patterns-and-live-proof.md`
6. `docs/delivery-design-quality-gate.md`
7. `docs/delivery-auth-boundary-standard.md`

Global docs in `andylitvinov-design/reiki-yggdrasil` are shared stable context. Do not repeatedly fetch external URLs during one delivery run unless local context is missing and the run truly needs the latest shared protocol.

## Project adapter

- Repository: `andylitvinov-design/report`
- Default branch: `main`
- Package manager: `npm`
- Framework: Vite + React
- Build: `npm run build`
- Delivery check: `npm run delivery:check`
- Primary live URL: `https://psitherapy.vercel.app/`
- Primary build info URL: `https://psitherapy.vercel.app/build-info.json`
- Alternate URL: `https://holistichealing.vercel.app/`
- Legacy URL: `https://andylitvinov-design.github.io/report/`

## Completion rule

Implementation is not completion.

Before final success, verify the Original Request Contract requirement by requirement. Use:

```txt
PASS
PARTIAL
FAIL
NOT VERIFIED
```

`STATUS: SUCCESS` requires all required items to pass or documented allowed auth limitation.

For UI tasks, final report must include:

```txt
DESIGN QUALITY GATE
UI POLISH / FEEL-BETTER PASS
```

## Final statuses

```txt
STATUS: SUCCESS
STATUS: SUCCESS_WITH_AUTH_LIMITATION
STATUS: BLOCKED
```

Do not stop at code, PR, CI, merge, deploy, or “should be live soon”.

Do not print secret values. Report secret names only.
