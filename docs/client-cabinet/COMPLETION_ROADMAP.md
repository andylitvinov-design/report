# Holistic Therapy Cabinet — detailed completion roadmap

## Current product goal

Bring the client cabinet from a visual MVP to a usable client product.

Live target:

- `https://my-alchemist.vercel.app`

Core product flow:

```text
self-analysis → automatic slice → expert report → assignment / support formula → recommendations → repeated check → dynamics
```

The cabinet must feel like a living support system, not only a dashboard.

---

## Current known state

Already implemented or partially implemented:

- React / Vite MVP.
- Vercel public target exists.
- Client-facing left navigation was introduced:
  - Profile / Overview;
  - Expert Report;
  - Assignment;
  - Make Self-analysis;
  - Recommendations.
- Full Bach questionnaire data is present in `mockData.js`:
  - Situation: 38 questions;
  - Character: 39 questions;
  - Control: 38 questions.
- A first focused mode for self-analysis exists, but it still needs a cleaner UX flow.

Main risk now:

- The live site may not yet reflect the latest `main` commits.
- The self-analysis form is still too close to a dashboard screen.
- Result grouping is still partly static / demo-like.
- Data is not persisted yet.

---

# Phase 0 — Stabilize live deployment

## Goal

Make sure the current code and live site are synchronized before adding new features.

## Tasks

1. Pull latest `main` locally.
2. Run build.
3. Deploy latest `main` to Vercel production.
4. Open `https://my-alchemist.vercel.app` and verify that the live UI matches the current product navigation.
5. Close or supersede outdated PRs that duplicate changes already committed directly to `main`, especially PR #9 if it is no longer needed.
6. Run desktop and mobile visual QA.

## Acceptance criteria

- `npm run build` passes.
- `https://my-alchemist.vercel.app` returns HTTP 200.
- Live site shows the new client-facing menu:
  - `Профиль / Обзор`
  - `Отчёт эксперта`
  - `Назначение`
  - `Сделать самоанализ`
  - `Рекомендации`
- No stale GitHub Pages-only version is treated as the main product link.
- There is one clear source of truth: `main` → Vercel production.

---

# Phase 1 — Self-analysis UX flow

## Goal

Turn Self-analysis from a dashboard block into a clean questionnaire flow.

## Product decision

`Сделать самоанализ` must have two states:

1. **Cabinet overview state** — user sees status and can choose what to do.
2. **Focused questionnaire state** — user completes the form without distractions.

## 1. Cabinet overview state

When the user clicks `Сделать самоанализ`, do not show the full long questionnaire immediately.

Show a start screen with:

- last self-analysis date;
- status:
  - not started;
  - draft;
  - completed;
  - needs repeat check;
- current problem strength;
- focus of work;
- short summary of previous result;
- buttons:
  - `Начать самоанализ`;
  - `Продолжить черновик`;
  - `Пройти повторную анкету`;
  - `Обновить только силу проблемы`;
  - `Добавить комментарий к состоянию`.

Cabinet overview may keep:

- left sidebar;
- top cabinet header;
- right specialist comment panel.

## 2. Focused questionnaire state

After the user clicks `Начать самоанализ`, switch into form mode.

Hide:

- left sidebar;
- right specialist panel;
- mobile navigation;
- large dashboard header;
- unrelated analytics blocks.

Show only:

- compact progress header;
- step title;
- centered form column;
- back / next / save / exit buttons.

## Questionnaire steps

1. `Данные`
   - date;
   - focus of work;
   - problem strength 0–10;
   - short situation description.

2. `Ситуация`
   - all 38 situation questions;
   - question score 0–5 or 1–5;
   - optional comment.

3. `Характер`
   - all 39 character questions;
   - clarify that this is about stable patterns, not only today.

4. `Контроль`
   - all 38 control items;
   - instruction: choose or score the 5–7 most accurate points;
   - show selected count.

5. `Итог`
   - main candidates;
   - additional support;
   - needs verification;
   - preliminary score;
   - next step.

## UX requirements

- The form should feel like Google Form / Typeform, not like a dashboard.
- Use one main column, about 720–860 px wide on desktop.
- On mobile: one column, large buttons, no horizontal scroll.
- Step controls must be sticky or easy to reach.
- Save progress must be visible.

## Acceptance criteria

- User opens Self-analysis and sees a clean start screen, not 115 questions immediately.
- User clicks `Начать самоанализ` and enters a focused form.
- Sidebar and right panel disappear in focused form mode.
- User can move between steps.
- Full question counts are preserved:
  - situation: 38;
  - character: 39;
  - control: 38.

---

# Phase 2 — Dynamic Bach scoring and result grouping

## Goal

Replace static demo result groups with a real result calculated from current answers.

## Current problem

The UI may show fixed remedy groups such as Olive / Elm / White Chestnut even when answers change.

## Required logic

Calculate a score per remedy based on:

- situation answer scores;
- character answer scores;
- control answer scores;
- control section higher weight;
- cross-section bonus when the same remedy appears in multiple sections;
- peak bonus for high scores;
- control presence bonus.

Recommended formula:

```text
remedyTotal =
  situationScore * 1
  + characterScore * 1
  + controlScore * 1.5
  + crossSectionBonus
  + peakBonus
  + controlPresenceBonus
```

Bonuses:

- +2 if remedy appears in 2 sections;
- +4 if remedy appears in 3 sections;
- +1 for each score 4;
- +2 for each score 5;
- +1.5 if remedy appears in control checklist.

## Output groups

1. `Основные кандидаты`
   - strongest 1–3 remedies.

2. `Дополнительная поддержка`
   - next 2–4 relevant remedies.

3. `Требует проверки`
   - borderline remedies or remedies with narrow evidence.

## Result explanation

Do not show only remedy names.

Show:

- remedy name;
- theme;
- why it appeared;
- which sections contributed;
- whether it needs expert confirmation.

Example:

```text
Olive — истощение / восстановление ресурса
Высокие баллы в ситуации и контроле. Главная тема: ресурс ниже нагрузки.
```

## Safety wording

Use:

- `кандидат для проверки`;
- `предварительный срез`;
- `направление поддержки`;
- `требует экспертной проверки`.

Avoid:

- diagnosis;
- treatment;
- guaranteed result;
- cure;
- medical prescription.

## Acceptance criteria

- Changing answers changes the result.
- Results are not hardcoded.
- Each result includes a short explanation.
- Safe wording is preserved.

---

# Phase 3 — Save and resume assessments

## Goal

Make the questionnaire usable in real life by saving progress.

## First implementation

Use `localStorage` first. Do not add Supabase until the UX and scoring are stable.

## Save

Save:

- client profile mock;
- active assessment draft;
- answers;
- comments;
- current step;
- strength score;
- focus;
- generated result;
- completed assessment history.

## Features

- continue incomplete assessment;
- create new assessment;
- save completed assessment as a dated snapshot;
- reset demo data;
- export current result as JSON or simple text later.

## Acceptance criteria

- Refreshing the page does not erase answers.
- User can continue a draft.
- User can complete and save a snapshot.
- History can show at least several completed assessments.

---

# Phase 4 — Profile / Overview

## Goal

Make the first screen useful as the client's main status page.

## Required blocks

`Профиль / Обзор` should include:

- main metrics;
- current state;
- dynamics graph;
- psychological portrait preview;
- personality map preview;
- last expert comment;
- next recommended action.

## Tabs

- `Состояние`
- `Динамика`
- `Психологический портрет`
- `Карта личности`

## Acceptance criteria

- The page answers: “Where am I now?”
- It does not duplicate every other section.
- It gives one obvious next action.

---

# Phase 5 — Expert report section

## Goal

Create a real expert-report area, not only generic analysis cards.

## Report structure

Each report should contain:

1. date and title;
2. short summary;
3. current state;
4. hidden mechanism;
5. bottleneck / main block;
6. Bach candidates;
7. optional homeopathy / naturopathy block;
8. optional У-Син block;
9. support direction;
10. what to check next;
11. review date.

## Report archive

Add report list by dates:

```text
14.05.2026 — Primary expert report
21.05.2026 — Follow-up check
```

## Acceptance criteria

- User can open the latest expert report.
- User can switch between report dates.
- Report is clearly separated from self-analysis.
- No medical claims or diagnosis wording.

---

# Phase 6 — Assignment / support formula

## Goal

Make `Назначение` the practical “what to do now” section.

## Important naming

`Назначение` is acceptable as a UI label, but the content should use softer language:

- `формула поддержки`;
- `текущая поддержка`;
- `направление поддержки`;
- `что отслеживать`.

## Required blocks

- current support formula;
- Bach remedies;
- homeopathy / naturopathy placeholders if needed;
- short practice recommendations;
- tracking markers;
- review date;
- specialist note.

## Tabs

- `Текущая формула`
- `Bach`
- `Натуротерапия`
- `Практики`
- `Что отслеживать`

## Acceptance criteria

- User immediately sees what is current now.
- This section is not a duplicate of Recommendations.
- The next check date is visible.

---

# Phase 7 — Recommendations and personality map

## Goal

Make Recommendations a long-term support and development map.

## Difference from Assignment

Assignment = immediate current support.

Recommendations = wider map, dynamics, personality pattern, long-term direction.

## Required blocks

- current recommendations;
- personality map;
- measurement dynamics;
- history of changes;
- next step;
- long-term support themes.

## Tabs

- `Текущие рекомендации`
- `Карта личности`
- `Динамика замеров`
- `История`
- `Следующий шаг`

## Acceptance criteria

- Recommendations does not duplicate Assignment.
- It explains long-term patterns.
- It is linked to assessment history.

---

# Phase 8 — Supabase data layer

## Goal

Prepare a real backend structure after local MVP is stable.

## Tables

Create SQL schema for:

- `clients`;
- `assessments`;
- `questionnaire_answers`;
- `remedy_results`;
- `expert_reports`;
- `assignments`;
- `recommendations`;
- `specialist_comments`.

## Requirements

- Keep app working without Supabase in demo mode.
- Document environment variables.
- Do not write production client data until auth rules are defined.

## Acceptance criteria

- Schema file exists.
- Demo mode still works.
- Future Supabase integration is clear.

---

# Phase 9 — Auth and roles

## Goal

Turn the demo into a real private client cabinet.

## Roles

1. Client
   - fills questionnaires;
   - sees own reports;
   - sees assignments and recommendations.

2. Specialist / Admin
   - sees clients;
   - writes expert reports;
   - updates assignments;
   - adds comments.

## Tasks

- choose auth provider;
- add login;
- connect client data to authenticated user;
- remove hardcoded personal/private demo data from public files;
- prepare admin/specialist view later.

## Acceptance criteria

- Client can log in.
- Client sees only own cabinet.
- No real private data is stored in public mock files.

---

# Phase 10 — QA and release checklist

## Goal

Make every deploy repeatable and safe.

## Release checklist

Before every production deploy:

- `npm run build` passes;
- Vercel deployment succeeds;
- live site returns HTTP 200;
- desktop QA completed;
- mobile QA completed;
- no horizontal scroll on mobile;
- questionnaire counts are correct:
  - 38 / 39 / 38;
- scoring changes when answers change;
- no forbidden medical wording;
- no real private data in public files;
- main flow works:
  - overview;
  - self-analysis;
  - result;
  - expert report;
  - assignment;
  - recommendations.

## Forbidden wording

Avoid:

- `лечение`;
- `диагноз`;
- `гарантированный результат`;
- `исцеление`;
- `медицинское назначение`;
- `отменить препараты`.

Use:

- `самоанализ`;
- `предварительный срез`;
- `кандидаты для проверки`;
- `формула поддержки`;
- `направление поддержки`;
- `экспертная проверка`;
- `повторная проверка`.

---

# Recommended implementation order

## Sprint 1 — Stabilization and Self-analysis

1. Deploy current `main` to Vercel.
2. Close/supersede outdated PR #9.
3. Implement self-analysis cabinet overview state.
4. Implement clean focused questionnaire flow.
5. Verify full questionnaire counts.

## Sprint 2 — Scoring and persistence

1. Dynamic Bach scoring by remedy.
2. Dynamic result grouping.
3. Result explanations.
4. localStorage save/resume.
5. Assessment history snapshots.

## Sprint 3 — Product sections

1. Profile / Overview improvements.
2. Expert Report by date.
3. Assignment / support formula.
4. Recommendations / personality map / dynamics.

## Sprint 4 — Backend readiness

1. Supabase schema.
2. Demo mode vs backend mode.
3. Auth decision.
4. Client and specialist roles.

## Sprint 5 — Release hardening

1. QA checklist.
2. Safety wording scan.
3. Mobile QA.
4. Vercel release process.
5. Prepare beta demo.

---

# Next immediate task

The next concrete implementation task should be:

```text
Implement Self-analysis overview + focused questionnaire flow + dynamic Bach result grouping.
```

This should be one PR, not a full product rewrite.
