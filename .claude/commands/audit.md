# /audit

`/audit` is sufficient by itself.

This repository uses the shared RY audit protocol as source of truth:

```txt
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/ry-agent-audit-modes.md
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-loop.md
docs/audit-deep-technical-issue-writing.md
docs/audit-ui-polish-skill.md
```

Optional external UI polish skill:

```bash
npx skills add jakubkrehel/make-interfaces-feel-better
```

Source:

```txt
https://jakub.kr/skills/make-interfaces-feel-better
```

If the skill is installed, load and apply it during `/audit`. If it is not installed or cannot be verified, do not block the audit; run the local UI polish checklist from the shared addendum.

Repository mapping:

```txt
Live URL: https://2mentalica.vercel.app
GitHub repo: andylitvinov-design/report
Local folder may be: /Users/andriilitvinov/projects/MYPROJECTS/reports
```

If `andylitvinov-design/reports` returns Not Found, use `andylitvinov-design/report`.

`/audit` is diagnostic mode, not implementation mode.

Do not edit app code by default. Create or update a GitHub issue with the full technical audit when GitHub Issues are available, then return only a short `/delivery` prompt pointing to that issue.

Required chain:

```txt
understand target -> inspect project rules -> inspect relevant code deeply -> trace route/component/state/data/style/test chain -> evaluate UX/UI/product/technical layers -> run UI polish pass -> map symptoms to code-level findings -> create/update GitHub issue -> return short /delivery prompt with issue link
```

Before creating the issue, run the code-trace chain from `docs/audit-deep-technical-issue-writing.md`:

```txt
route/page -> layout shell -> visible component -> child component -> state/store -> data/API/persistence -> formatting/rendering -> styles/responsive rules -> tests/checks
```

The issue must include: technical code trace, inspected files, confirmed vs suspected findings, implementation map, do-not-touch rules, verification plan, and a ready-to-run `/delivery` prompt.

Use evidence labels: `CODE VERIFIED`, `RUNTIME VERIFIED`, `LIKELY`, `NOT VERIFIED`.

Handoff prompt rule:

The copy-pasteable prompt for the implementation agent must start with `/delivery` as the first non-empty line.

Do not start the prompt block with `/audit -> /delivery handoff`, `/audit → /delivery handoff`, `/audit handoff`, or any other slash-prefixed audit label. If a label is useful, put it outside the prompt block as plain text only.

If GitHub Issues are unavailable, output the full issue body in chat and use:

```txt
STATUS: AUDIT_COMPLETE_ISSUE_NOT_CREATED
```

If the issue is behind Google/Supabase/private auth, use auth-safe evidence and do not request credentials, cookies, tokens, or secrets.
