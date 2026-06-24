# /audit-fin

`/audit-fin` is diagnostic numeric/calculation mode for Report/PsiTherapy. It creates or updates an implementation-ready GitHub issue and returns a short `/delivery` prompt.

## Source of truth

Read in order:

1. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-agent-settings.md`
2. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-command-protocols.md`
3. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-project-adapters.md`
4. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-agent-skills.md`
5. `AGENTS.md` - Report/PsiTherapy local adapter
6. `docs/audit-fin-deep-technical-implementation.md`
7. `.claude/commands/delivery.md`

## Project adapter

- Repository: `andylitvinov-design/report`
- Known local folder: `/Users/andriilitvinov/projects/MYPROJECTS/reports`
- Primary production URL: `https://psitherapy.vercel.app/`
- Build-info URL: `https://psitherapy.vercel.app/build-info.json`
- Issue tracker: `https://github.com/andylitvinov-design/report/issues`

## Required behavior

Follow the shared `/audit-fin` trace:

```txt
visible value
-> component
-> state/selection
-> data source
-> parsing
-> formula/helper
-> aggregation
-> hydration/cache
-> formatting
-> rendering
-> tests
```

Find the first divergence layer before proposing a fix. Do not implement during `/audit-fin` unless the user explicitly switches to `/delivery`.
