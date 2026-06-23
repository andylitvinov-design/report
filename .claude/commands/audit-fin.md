# /audit-fin

`/audit-fin` is sufficient by itself.

This repository uses the shared RY numeric audit protocol as source of truth:

```txt
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/ry-agent-audit-modes.md
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-fin-loop.md
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-fin-failed-repair.md
```

Repository mapping:

```txt
Live URL: https://2mentalica.vercel.app
GitHub repo: andylitvinov-design/report
Local folder may be: /Users/andriilitvinov/projects/MYPROJECTS/reports
```

If `andylitvinov-design/reports` returns Not Found, use `andylitvinov-design/report`.

`/audit-fin` is diagnostic mode, not implementation mode.

Do not edit app code by default. Create or update a GitHub issue with the full numeric audit when GitHub Issues are available, then return only a short `/delivery` prompt pointing to that issue.

Required chain:

```txt
understand numeric target -> extract numeric contract -> inspect visible numbers -> inspect code and data flow deeply -> run source-layer matrix before hypotheses -> compare expected vs actual -> list problems -> generate focused hypotheses only from failing/unverified layers -> evaluate hypotheses against evidence -> choose most likely root cause -> compare solution options -> create/update GitHub issue -> return short /delivery prompt with issue link
```

Handoff prompt rule:

The copy-pasteable prompt for the implementation agent must start with `/delivery` as the first non-empty line.

Do not start the prompt block with `/audit-fin -> /delivery handoff`, `/audit-fin → /delivery handoff`, `/audit -> /delivery handoff`, or any other slash-prefixed audit label. If a label is useful, put it outside the prompt block as plain text only.

Before hypotheses, always run the source-layer matrix:

1. Visual/displayed value.
2. Raw data availability.
3. Input parsing and normalization.
4. State and selection.
5. Formula and business logic.
6. Calculation helper/code.
7. Persistence and hydration.
8. Formatting and rounding.
9. Rendering and component binding.
10. Chart/gauge/indicator.
11. Async/loading/race.
12. Auth/environment.
13. Test fixture and proof.

If prior fixes failed, run failed-repair analysis:

```txt
why previous fix failed -> data sufficiency gate -> first divergence point -> do-not-repeat list -> proof fixture
```

Do not generate a huge unfocused hypothesis list. Generate focused hypotheses only from failing or unverified source layers.

If GitHub Issues are unavailable, output the full issue body in chat and use:

```txt
STATUS: AUDIT_FIN_COMPLETE_ISSUE_NOT_CREATED
```

If the issue is behind Google/Supabase/private auth, use auth-safe evidence and do not request credentials, cookies, tokens, or secrets.
