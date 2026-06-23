# /delivery — Design Quality Gate

Status: required quality gate for UI delivery tasks.

Use this document whenever `/delivery` changes or verifies UI, mobile layout, desktop layout, hero screens, navigation, cards, dashboards, forms, profile/cabinet pages, landing pages, screenshots, visual polish, or user-facing copy.

## Core rule

For UI tasks, build/check/live proof is not enough.

Before reporting `STATUS: SUCCESS`, `/delivery` must prove that the delivered screen matches the user's visual request and feels like a finished product, not merely a technically working set of components.

## Required UI polish skill pass

For UI tasks, run a `UI POLISH / FEEL-BETTER PASS`.

External skill:

```txt
jakubkrehel/make-interfaces-feel-better
```

Install/use when supported by the local agent environment:

```bash
npx skills add jakubkrehel/make-interfaces-feel-better
```

Reference:

```txt
https://jakub.kr/skills/make-interfaces-feel-better
```

Shared fallback protocol:

```txt
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-ui-polish-skill.md
```

If the external skill is installed, apply it to the changed screen before final success.

If it is not installed or cannot be verified, do not block delivery only for that reason. Instead run the fallback UI polish checklist and report that fallback was used.

## Trigger conditions

Run this gate when the task mentions or affects any of:

- UI;
- UX;
- mobile;
- desktop;
- screenshot;
- layout;
- first screen;
- full screen;
- hero;
- landing;
- profile/cabinet;
- navigation;
- tabs/chips/buttons;
- cards;
- forms;
- visual polish;
- text density;
- “красивее”, “мягче”, “понятнее”, “легче”, “как на скрине”.

## Screenshot / request contract check

Extract exact visual requirements from the user's request.

Examples:

- “первый экран на всю страницу”;
- “не видно следующий блок снизу”;
- “меньше текста”;
- “не перегружать верх”;
- “меню не дублировать”;
- “мягче и красивее”;
- “как на скрине”.

Treat each explicit visual requirement as an acceptance criterion.

Do not mark success if the implemented screen visibly violates the requested visual structure.

## Mobile first-screen gate

For a mobile viewport around iPhone size, approximately `390x844`:

- first screen must feel intentional and complete;
- if user asked for a full-screen first view, the next major section should not accidentally peek from the bottom;
- header, nav, hero, and main CTA must form one coherent composition;
- primary CTA must be visible and visually dominant;
- duplicated tab rows/chip rows are not allowed unless explicitly required;
- controls must not feel cramped;
- no horizontal overflow;
- browser/safe-area constraints must be considered;
- large titles must not crush the screen;
- secondary actions must be visually quieter than the main path.

## Visual hierarchy gate

Check:

- one clear primary action;
- title, subtitle, CTA, and secondary options have clear hierarchy;
- cards have consistent spacing and rhythm;
- text density is appropriate for mobile;
- labels and chips do not compete with hero content;
- screen feels calm, trustworthy, and finished;
- no raw/debug-looking UI remains.

## Required final report section

For UI tasks, final `/delivery` report must include:

```md
## DESIGN QUALITY GATE
| Check | Status | Evidence | Fix if failed |
|---|---|---|---|
| Original visual request matched | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| Mobile first screen complete | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| No accidental next-section cut | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| Primary CTA clear | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| No duplicated/cluttered nav | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| Visual hierarchy calm | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| Text density acceptable | PASS / PARTIAL / FAIL / NOT VERIFIED | | |
| Desktop not regressed | PASS / PARTIAL / FAIL / NOT VERIFIED | | |

## UI POLISH / FEEL-BETTER PASS
| Check | Status | Evidence | Fix if failed |
|---|---|---|---|
| External skill available or fallback used | PASS / PARTIAL / NOT VERIFIED | | |
| Visual hierarchy improved | PASS / PARTIAL / FAIL | | |
| Spacing and rhythm improved | PASS / PARTIAL / FAIL | | |
| Text density reduced | PASS / PARTIAL / FAIL | | |
| Mobile feel improved | PASS / PARTIAL / FAIL | | |
| Perceived quality improved | PASS / PARTIAL / FAIL | | |
| No raw/debug-looking UI remains | PASS / PARTIAL / FAIL | | |
```

## Failure rule

If any required design item is `FAIL` or `NOT VERIFIED`, do not report `STATUS: SUCCESS`.

Instead:

1. run another improvement loop;
2. patch the visual issue;
3. rerun screenshots/checks;
4. only then report success.

If auth/live limitations prevent visual proof, report `PARTIAL_AUTH_LIMITATION` or `READY_WITH_NOTES` with exact missing proof. Do not silently claim success.

## Spiral critic integration

The Spiral Validator-Critic Loop must output `IMPROVE` or `IMPROVE_MINOR` for UI tasks when:

- first screen is not full/complete when requested;
- top navigation is cluttered;
- next section is accidentally visible;
- CTA hierarchy is weak;
- mobile layout feels cramped;
- design looks technically functional but visually unfinished;
- visual proof is missing.

## Evidence expectations

Preferred evidence:

- mobile screenshot or Playwright screenshot;
- desktop screenshot if desktop could regress;
- route checked;
- viewport size;
- exact comparison with original visual request.

If screenshot tooling is unavailable, state the exact blocker and provide code-level or manual proof notes, but do not overclaim visual verification.
