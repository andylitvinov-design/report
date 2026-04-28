# Report template reference

This repository stores the design reference and implementation brief for the dynamic report page template.

Main target: build a dynamic HTML/React A4 report page for **Алхимия Души**.

Files:
- `docs/design-references/reports/report-page-2-brief.md` — design brief.
- `docs/design-references/reports/sample-report-data.json` — example data schema.
- `docs/design-references/reports/report-page-2-reference-small.base64.txt` — compressed JPG visual reference encoded as base64.
- `docs/design-references/reports/restore-reference-image.mjs` — script to restore the JPG reference.
- `docs/design-references/reports/codex-prompt.md` — ready prompt for Codex.

To restore the visual reference locally:
```bash
node docs/design-references/reports/restore-reference-image.mjs
```

This will create:
`docs/design-references/reports/report-page-2-reference-small.jpg`
