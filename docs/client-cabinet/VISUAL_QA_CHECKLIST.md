# Visual QA Checklist

Use this checklist when reviewing the Overview prototype against `assets/client-cabinet-mockup-source.svg`.

## Desktop

- [ ] Dark green left navigation is present and visually dominant enough to anchor the workspace.
- [ ] Warm parchment page background and paper panels match the SVG mood.
- [ ] Header shows `Client overview`, supporting context, and an `Active` status pill.
- [ ] Main report summary panel appears left of the next-step panel.
- [ ] Report summary includes client name, report type, circular progress, primary focus, and report action.
- [ ] Next-step panel includes the check-in task and remedy review task.
- [ ] Timeline panel spans below the two upper panels and shows four colored milestones.
- [ ] Panel radii, borders, shadows, and spacing stay restrained and consistent.

## Mobile

- [ ] Sidebar is removed or collapsed so the Overview starts with client context.
- [ ] Content order is header, report summary, next step, timeline.
- [ ] No text overlaps or clips at 375px width.
- [ ] Primary action remains visible without horizontal scrolling.
- [ ] Timeline remains legible as a compact horizontal sequence.

## Interaction

- [ ] Buttons and nav items have visible hover/focus states.
- [ ] Entry motion is subtle and does not shift layout after load.
- [ ] Reduced-motion users do not receive layout-affecting animation.

## Source Control

- [ ] `DESIGN_SOURCE_OF_TRUTH.md` still names the current SVG source.
- [ ] `MOCKUP_IMPLEMENTATION_MAP.md` still maps the SVG areas to current prototype selectors.
- [ ] README links to SVG, source of truth, implementation map, and this checklist.
