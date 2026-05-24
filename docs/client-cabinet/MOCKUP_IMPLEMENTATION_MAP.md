# Mockup Implementation Map

Source mockup:

- `docs/client-cabinet/assets/client-cabinet-mockup-source.svg`

Prototype:

- `docs/client-cabinet/prototype/overview.html`

## Screen Mapping

| SVG area | Prototype selector | Notes |
| --- | --- | --- |
| Desktop shell | `.cabinet-shell` | Full app surface with nav and workspace. |
| Left navigation | `.side-nav` | Desktop-only persistent product navigation. |
| Header and status | `.overview-header`, `.status-pill` | Current screen title and client state. |
| Current report panel | `.client-card` | Client identity, report progress, primary focus, report action. |
| Next step panel | `.action-panel` | Immediate client tasks with priority emphasis. |
| Report timeline | `.timeline-panel`, `.timeline-track` | Intake, analysis, report, follow-up sequence. |
| Mobile mockup | responsive CSS under `@media (max-width: 760px)` | Sidebar collapses, panels stack, touch targets stay large. |

## Required Fidelity Points

- Keep deep-green navigation paired with warm paper workspace.
- Keep the main content split: report summary left, action panel right, timeline below.
- Preserve the circular progress treatment from the SVG.
- Preserve the four-step timeline and colored milestones.
- Keep mobile single-column order: header, report, next step, timeline.

## Non-Goals

- Authentication flow.
- Real data integration.
- PDF export.
- Questionnaire form implementation.
- Report-detail route.
