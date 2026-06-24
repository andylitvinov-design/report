# /delivery

`/delivery` is full safe delivery delegation for Report/PsiTherapy: implement, check, PR, merge when green/permitted, deploy, and verify live behavior.

## Source of truth

Read in order:

1. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-agent-settings.md`
2. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-command-protocols.md`
3. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-project-adapters.md`
4. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-agent-skills.md`
5. `AGENTS.md` - Report/PsiTherapy local adapter
6. `.claude/skills/delivery/SKILL.md`
7. `docs/delivery-loop-program.md`
8. `docs/delivery-loop-technical-details.md`
9. `docs/delivery-loop-source-patterns-and-live-proof.md`
10. `docs/delivery-design-quality-gate.md`
11. `docs/delivery-auth-boundary-standard.md`

## Project adapter

- Repository: `andylitvinov-design/report`
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

## Required behavior

Follow the shared `/delivery` chain and this repo's deployment fallback rules. For UI tasks, include `DESIGN QUALITY GATE` and `UI POLISH / FEEL-BETTER PASS` in the final report.

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
