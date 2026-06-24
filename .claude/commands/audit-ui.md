# /audit-ui

`/audit-ui` is sufficient by itself.

Mode: UI/UX design audit and concept selection. Not implementation by default.

Read shared protocol:

```txt
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/global-command-protocols.md
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-ui-mode.md
```

Project:

```txt
https://2mentalica.vercel.app / https://psitherapy.vercel.app -> andylitvinov-design/report
```

Required chain:

```txt
screenshot/link/route -> diagnose current UI -> find issues -> generate 5-7 improvement ideas -> choose top 3 concepts -> create sketch/mockup directions -> compare concepts -> choose recommended concept -> create/update issue -> return short report + /delivery prompt
```

Use `jakubkrehel/make-interfaces-feel-better` when installed. If unavailable, use fallback UI polish checklist.

Final chat output must include:

- 3 best concepts;
- recommended concept;
- why it was selected;
- sketch/mockup notes or attachments;
- GitHub issue link;
- `/delivery` prompt.

The user may choose Concept 1, 2, or 3. Do not implement code unless the user explicitly continues to `/delivery`.
