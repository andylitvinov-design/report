# PsiTherapy / Report — `/audit-ui` Visual Artifact Hard Gate

Status: local adapter for `andylitvinov-design/report`.

This file strengthens the shared `/audit-ui` docs from `andylitvinov-design/reiki-yggdrasil` for PsiTherapy / Report audits.

## Source of truth

For `/audit-ui`, agents must follow the shared docs:

- `andylitvinov-design/reiki-yggdrasil/docs/audit-ui-mode.md`
- `andylitvinov-design/reiki-yggdrasil/docs/audit-ui-expert-frameworks.md`
- `andylitvinov-design/reiki-yggdrasil/docs/audit-ui-decision-rubric.md`
- `andylitvinov-design/reiki-yggdrasil/docs/audit-ui-completeness-gate.md`
- `andylitvinov-design/reiki-yggdrasil/docs/audit-ui-visual-artifact-contract.md`

## Hard local rule

A valid PsiTherapy `/audit-ui` must include **3 separate standalone visual artifacts**:

1. Concept A image/artifact
2. Concept B image/artifact
3. Concept C image/artifact

A combined comparison board, collage, poster, or infographic is allowed only as an optional overview. It must never replace the three standalone concept visuals.

## Required visual artifact table

Before finalizing any `/audit-ui`, fill this table in chat and in the GitHub issue:

| Concept | Visual artifact | Status |
|---|---|---|
| A | standalone image/artifact path or `VISUAL_ARTIFACT_UNAVAILABLE` | PASS/FAIL |
| B | standalone image/artifact path or `VISUAL_ARTIFACT_UNAVAILABLE` | PASS/FAIL |
| C | standalone image/artifact path or `VISUAL_ARTIFACT_UNAVAILABLE` | PASS/FAIL |

If any row is not `PASS`, the audit status must be:

```txt
STATUS: AUDIT_UI_INCOMPLETE
```

Do not create/update the final GitHub issue as complete until all three concept visuals are represented separately or all missing visual capabilities are explicitly marked as `VISUAL_ARTIFACT_UNAVAILABLE`.

## Invalid outputs

These do not satisfy `/audit-ui`:

- one image containing Concept A/B/C together as the only visual artifact;
- a single audit-board poster used as replacement for three concept images;
- text wireframes without `VISUAL_ARTIFACT_UNAVAILABLE`;
- a GitHub issue with only the recommended concept and no A/B/C visual references.

## Valid outputs

Valid ChatGPT output with image generation:

```txt
Visual concepts:
A: standalone Concept A image attached
B: standalone Concept B image attached
C: standalone Concept C image attached
Optional overview: combined comparison board attached
```

Valid Codex/Claude Code output without image generation:

```txt
Visual concepts:
A: docs/audit-ui-concept-a.svg
B: docs/audit-ui-concept-b.svg
C: docs/audit-ui-concept-c.svg
```

Valid blocked output:

```txt
Visual concepts:
A: VISUAL_ARTIFACT_UNAVAILABLE — reason
B: VISUAL_ARTIFACT_UNAVAILABLE — reason
C: VISUAL_ARTIFACT_UNAVAILABLE — reason
```

Then provide structured wireframes for all three concepts.

## Simulation checklist

Before final response, ask:

1. Is Concept A represented as its own standalone visual? If no, incomplete.
2. Is Concept B represented as its own standalone visual? If no, incomplete.
3. Is Concept C represented as its own standalone visual? If no, incomplete.
4. Is there only one combined board? If yes, incomplete.
5. Does the issue contain per-concept references? If no, incomplete.
6. Does the chat response contain per-concept references? If no, incomplete.

Only after all required checks pass can `/audit-ui` return `STATUS: AUDIT_UI_CONCEPTS_READY`.