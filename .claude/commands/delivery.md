# /delivery

`/delivery` is full safe delivery delegation for Report/PsiTherapy: implement, check, PR, merge when green/permitted, deploy, and verify live behavior.

The user must not need extra wording such as “I explicitly delegate merge”, “continue to live”, “please deploy”, “please verify live”, or “do not ask for extra confirmations”.

## Source of truth

Read local stable files first:

1. `.claude/commands/delivery.md`
2. `.claude/skills/delivery/SKILL.md`
3. `AGENTS.md` - Report/PsiTherapy local adapter
4. `docs/delivery-loop-program.md`
5. `docs/delivery-loop-technical-details.md`
6. `docs/delivery-loop-source-patterns-and-live-proof.md`
7. `docs/delivery-design-quality-gate.md`
8. `docs/delivery-auth-boundary-standard.md`

Shared global docs in `andylitvinov-design/reiki-yggdrasil` are stable shared context. Do not repeatedly fetch external GitHub URLs during one delivery run unless local files are missing and the latest shared protocol is required.

If a local file is missing, run the local checkout recovery gate first. Do not ask the user for confirmation just because a stable protocol file needs to be read or synced.

## Project adapter

- Repository: `andylitvinov-design/report`
- Valid local folder name: `reports` when git remote points to `andylitvinov-design/report`
- Default branch: `main`
- Package manager: `npm`
- Framework: Vite + React
- Build: `npm run build`
- Delivery check: `npm run delivery:check`
- CI: GitHub Actions
- Deployment: Vercel fallback workflow plus legacy GitHub Pages
- Primary live URL: `https://psitherapy.vercel.app/`
- Primary build-info URL: `https://psitherapy.vercel.app/build-info.json`
- Alternate URL: `https://holistichealing.vercel.app/`
- Legacy URL: `https://andylitvinov-design.github.io/report/`

## Low-confirmation behavior

Do not ask the user for confirmation before safe delivery actions:

- inspect repo files/docs;
- create a branch or worktree from `origin/main`;
- edit intended files;
- run safe checks/build/tests;
- create or update PR;
- inspect PR health and CI;
- fix failed checks when safe;
- merge when green and permitted;
- trigger deployment fallback when needed;
- verify live behavior.

Ask or stop only for real blockers:

- missing permission;
- branch protection or required human review;
- failed checks that cannot be fixed safely;
- missing deploy secret/access;
- auth boundary with no safe proof path;
- requested change touches secrets, billing, auth provider settings, production data, destructive operations, or unrelated risky scope.

## Required behavior

Follow the shared `/delivery` chain and this repo's deployment fallback rules. For UI tasks, include:

```txt
DESIGN QUALITY GATE
UI POLISH / FEEL-BETTER PASS
```

Final Result Verification Gate: compare the completed diff, checks, deploy state, and live proof against the original request before reporting success.

Extract the Original Request Contract and verify every item as `PASS`, `PARTIAL`, `FAIL`, or `NOT VERIFIED`.

Run the Spiral Validator-Critic Loop before merge readiness is claimed.

Do not touch secrets, env values, auth/OAuth/security settings, billing, or production data unless explicitly requested.

Final status must be exactly one of:

```txt
STATUS: SUCCESS
STATUS: SUCCESS_WITH_AUTH_LIMITATION
STATUS: BLOCKED
```
