# /audit

`/audit` is diagnostic mode for Report/PsiTherapy. It creates or updates an implementation-ready GitHub issue and returns a short `/delivery` prompt.

## Source of truth

Read in order:

1. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-agent-settings.md`
2. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-command-protocols.md`
3. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-project-adapters.md`
4. `https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-agent-skills.md`
5. `AGENTS.md` - Report/PsiTherapy local adapter
6. `docs/audit-deep-technical-issue-writing.md`
7. `docs/audit-ui-polish-skill.md`
8. `.claude/commands/delivery.md`

## Project adapter

- Repository: `andylitvinov-design/report`
- Known local folder: `/Users/andriilitvinov/projects/MYPROJECTS/reports`
- Primary production URL: `https://psitherapy.vercel.app/`
- Alternate URL: `https://holistichealing.vercel.app/`
- Legacy URL: `https://andylitvinov-design.github.io/report/`
- Issue tracker: `https://github.com/andylitvinov-design/report/issues`

If `andylitvinov-design/reports` returns Not Found, use `andylitvinov-design/report`.

## Required behavior

Follow the shared `/audit` chain:

```txt
understand target
-> resolve project repo
-> inspect project rules
-> inspect relevant code deeply
-> trace route/component/state/data/style/test chain
-> evaluate UX/UI/product/technical layers
-> map symptoms to code-level findings
-> create/update GitHub issue
-> return short /delivery prompt
```

For auth-gated cabinet screens, use auth-safe evidence. Never request credentials, cookies, tokens, or secrets.
