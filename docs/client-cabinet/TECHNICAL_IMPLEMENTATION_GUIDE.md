# Holistic Therapy Cabinet — technical implementation guide

This document complements `docs/client-cabinet/COMPLETION_ROADMAP.md`.

It answers the practical questions:

- where to look;
- what files matter;
- what to change first;
- how to verify;
- how to deploy;
- what not to break.

---

# 1. Source of truth

## Repository

```text
andylitvinov-design/report
```

## Main production target

```text
https://my-alchemist.vercel.app
```

## Main local project path

Use the real local worktree that contains the current product code.

Expected paths used in this project:

```text
/Users/andriilitvinov/projects/MYPROJECTS/report-client-cabinet
/Users/andriilitvinov/projects/MYPROJECTS/report-client-cabinet-main
```

If one worktree is dirty with unrelated Next/auth work, create a clean sibling worktree for the task.

Example:

```bash
git worktree add ../report-client-cabinet-self-analysis main
cd ../report-client-cabinet-self-analysis
```

## Live URL rule

Do not use GitHub Pages as the main product URL anymore.

Use:

```text
https://my-alchemist.vercel.app
```

Main public site:

```text
https://alchemist.vercel.app
```

Unavailable target:

```text
https://my.alchemist.vercel.app
```

Reason: Vercel reserved `*.alchemist.vercel.app` for another account.

---

# 2. Current app stack

## Framework

- React
- Vite
- CSS modules are not used yet; styling is in `src/styles.css`.
- Data is currently mock/local JS data.
- No production backend is wired yet.
- Supabase/Auth are future phases, not first step.

## Build commands

```bash
npm install
npm run build
npm run dev
npm run preview
```

## Production deploy

```bash
vercel --prod
```

After deploy:

```bash
curl -I https://my-alchemist.vercel.app
```

Expected:

```text
HTTP/2 200
```

---

# 3. File map — where to look

## Main entry

```text
src/main.jsx
src/App.jsx
```

### `src/App.jsx`

Controls:

- active page;
- active tab per page;
- page-to-component mapping;
- focus mode trigger for self-analysis.

Look here when changing:

- left navigation behavior;
- page tabs;
- which component opens for which menu item;
- self-analysis focused mode condition.

Expected page model:

```text
overview → Профиль / Обзор
expert → Отчёт эксперта
recommendations → Назначение
self → Сделать самоанализ
history → Рекомендации
```

## Layout

```text
src/components/Layout.jsx
```

Controls:

- sidebar;
- topbar;
- mobile navigation;
- tabs;
- workspace;
- right specialist panel;
- focus mode hiding logic.

Look here when changing:

- left menu labels;
- top header behavior;
- hiding sidebar/right panel in form mode;
- CTA labels;
- right specialist comment panel.

## Data

```text
src/data/mockData.js
```

Contains:

- client mock profile;
- navigation labels;
- overview metrics;
- specialist comments;
- full Bach questionnaire;
- expert blocks;
- recommendations;
- history.

Important counts:

```text
situation questions: 38
character questions: 39
control questions: 38
```

Do not replace the full questionnaire with sample data again.

## Bach scoring

```text
src/lib/bachScoring.js
```

Currently contains scoring helpers.

Next required upgrade:

- calculate per-remedy score from answers;
- group results dynamically:
  - Основные кандидаты;
  - Дополнительная поддержка;
  - Требует проверки;
- explain why each remedy appears.

## Pages

```text
src/pages/Overview.jsx
src/pages/SelfAnalysis.jsx
src/pages/ExpertAnalysis.jsx
src/pages/Recommendations.jsx
src/pages/DynamicsHistory.jsx
```

Current mapping should be treated as MVP mapping, not final domain naming:

```text
Overview.jsx → Профиль / Обзор
ExpertAnalysis.jsx → Отчёт эксперта
Recommendations.jsx → Назначение
SelfAnalysis.jsx → Сделать самоанализ
DynamicsHistory.jsx → Рекомендации / dynamics / long-term map
```

Later, rename files only if it does not create large noisy diffs.

## Cards and charts

```text
src/components/Cards.jsx
src/components/Charts.jsx
```

Look here for:

- metric cards;
- question cards;
- formula chips;
- chart rendering.

## Styling

```text
src/styles.css
```

Controls all current styling.

Important classes:

```text
.app-shell
.app-shell.focus-mode
.sidebar
.main-shell
.topbar
.mobile-nav
.tabs
.workspace
.specialist-panel
.card
.question-list
.question-card
.score-grid
.result-panel
.compact-result
```

Focus mode styles must ensure:

- sidebar hidden;
- right panel hidden;
- mobile nav hidden;
- centered form width;
- no horizontal scroll;
- mobile one-column layout.

---

# 4. Product architecture to implement

## Final user flow

```text
Профиль / Обзор
  ↓
Сделать самоанализ
  ↓
Focused questionnaire
  ↓
Итог / automatic Bach slice
  ↓
Отчёт эксперта
  ↓
Назначение / формула поддержки
  ↓
Рекомендации
  ↓
Повторная проверка / динамика
```

## Do not mix these concepts

### `Сделать самоанализ`

User answers questions.

### `Отчёт эксперта`

Specialist interprets the self-analysis and dynamics.

### `Назначение`

What is active now: current support formula.

### `Рекомендации`

Long-term map: personality, dynamics, future direction.

---

# 5. Implementation plan by files

## Sprint 1 — Stabilization and deployment

### Files to inspect

```text
package.json
vite.config.js
src/App.jsx
src/components/Layout.jsx
src/data/mockData.js
```

### Tasks

1. Pull latest `main`.
2. Run build.
3. Deploy to Vercel.
4. Verify live menu.
5. Close/supersede stale PR #9 if already duplicated by `main`.

### Commands

```bash
git checkout main
git pull origin main
npm install
npm run build
vercel --prod
curl -I https://my-alchemist.vercel.app
```

### Manual QA

Open:

```text
https://my-alchemist.vercel.app
```

Verify left menu:

```text
Профиль / Обзор
Отчёт эксперта
Назначение
Сделать самоанализ
Рекомендации
```

---

## Sprint 2 — Self-analysis overview + focused form

### Files to edit

```text
src/App.jsx
src/pages/SelfAnalysis.jsx
src/components/Layout.jsx
src/styles.css
src/data/mockData.js
```

### Required product behavior

When user clicks `Сделать самоанализ`, show an overview screen first.

Do not show all 115 questionnaire items immediately.

### Overview screen must show

- status;
- last self-analysis date;
- current problem strength;
- focus;
- last result preview;
- draft state;
- buttons:
  - `Начать самоанализ`;
  - `Продолжить черновик`;
  - `Пройти повторную анкету`;
  - `Обновить только силу проблемы`;
  - `Добавить комментарий к состоянию`.

### Focused form mode must hide

- sidebar;
- right specialist panel;
- mobile nav;
- large dashboard topbar;
- unrelated metrics.

### Focused form mode must show

- compact progress header;
- current step title;
- centered form column;
- back / next / save / exit buttons.

### Step logic

Use internal state in `SelfAnalysis.jsx` first:

```text
mode = overview | form
activeStep = data | situation | character | control | result
```

Do not introduce routing yet unless necessary.

### QA

- Open `Сделать самоанализ`.
- It shows overview, not the full questionnaire.
- Click `Начать самоанализ`.
- Sidebar and right panel disappear.
- Step navigation works.
- Question counts:
  - situation: 38;
  - character: 39;
  - control: 38.

---

## Sprint 3 — Dynamic Bach scoring

### Files to edit

```text
src/lib/bachScoring.js
src/pages/SelfAnalysis.jsx
src/components/Cards.jsx
```

### Required function

Implement a function like:

```js
calculateRemedyResults({ questions, scores })
```

It should return:

```js
{
  main: [],
  support: [],
  verify: [],
  totalsByRemedy: {}
}
```

### Required scoring model

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

```text
+2 if remedy appears in 2 sections
+4 if remedy appears in 3 sections
+1 for each score 4
+2 for each score 5
+1.5 if remedy appears in control checklist
```

### Output groups

```text
Основные кандидаты
Дополнительная поддержка
Требует проверки
```

### Each result item should show

- remedy;
- theme;
- total score;
- contributing sections;
- short explanation.

### QA

- Change answers.
- Result changes.
- No hardcoded Olive / Elm / White Chestnut grouping remains.

---

## Sprint 4 — localStorage persistence

### Files to create / edit

```text
src/lib/storage.js
src/pages/SelfAnalysis.jsx
src/data/mockData.js
```

### Store keys

Use namespaced keys:

```text
alchemy.client.profile
alchemy.assessment.activeDraft
alchemy.assessments.history
alchemy.settings.demoMode
```

### Save

- current step;
- mode;
- focus;
- problem strength;
- description;
- scores;
- comments;
- result;
- completed date.

### Features

- continue draft;
- save snapshot;
- create new assessment;
- reset demo data.

### QA

- Fill answers.
- Refresh page.
- Answers remain.
- Save assessment.
- History receives snapshot.

---

## Sprint 5 — Profile / Overview improvements

### Files to edit

```text
src/pages/Overview.jsx
src/components/Charts.jsx
src/components/Cards.jsx
src/data/mockData.js
src/styles.css
```

### Required blocks

- current state;
- main metrics;
- dynamics;
- psychological portrait preview;
- personality map preview;
- last expert comment;
- one next action.

### Avoid

- too much topbar weight;
- duplicate content from Recommendations;
- generic empty cards.

---

## Sprint 6 — Expert reports by date

### Files to edit / create

```text
src/pages/ExpertAnalysis.jsx
src/data/mockData.js
src/components/Cards.jsx
```

Later optional:

```text
src/data/expertReports.js
```

### Data structure

Use something like:

```js
export const expertReports = [
  {
    id: 'report-2026-05-14',
    date: '2026-05-14',
    title: 'Первичный экспертный отчёт',
    summary: '',
    currentState: '',
    mechanism: '',
    bottleneck: '',
    bachCandidates: [],
    usin: null,
    supportDirection: '',
    nextCheck: ''
  }
]
```

### Report must include

- current state;
- hidden mechanism;
- bottleneck / main block;
- support direction;
- what to check next.

### Follow-up report must include

- what decreased;
- what increased;
- what disappeared;
- what remains active;
- whether the formula still fits.

---

## Sprint 7 — Assignment / support formula

### Files to edit

```text
src/pages/Recommendations.jsx
src/data/mockData.js
src/components/Cards.jsx
```

Current MVP may map `Recommendations.jsx` to `Назначение`.

### Required blocks

- current support formula;
- Bach remedies;
- naturopathy placeholders;
- practices;
- what to track;
- review date;
- specialist note.

### Wording

Use:

```text
формула поддержки
направление поддержки
текущая поддержка
что отслеживать
повторная проверка
```

Avoid medical prescription language.

---

## Sprint 8 — Recommendations / personality map / dynamics

### Files to edit

```text
src/pages/DynamicsHistory.jsx
src/data/mockData.js
src/components/Charts.jsx
src/components/Cards.jsx
```

Current MVP may map `DynamicsHistory.jsx` to `Рекомендации`.

### Required blocks

- current long-term recommendations;
- personality map;
- measurement dynamics;
- history;
- next step.

### Personality map MVP

Show:

- core pattern;
- stress pattern;
- resource pattern;
- boundaries / relationship pattern;
- decision / action pattern.

---

## Sprint 9 — Specialist right panel

### Files to edit

```text
src/components/Layout.jsx
src/data/mockData.js
```

### Panel formula

Each right panel should contain:

1. one specialist comment;
2. one focus / caution;
3. one next action;
4. one CTA.

### Good style example

```text
Сейчас главное — не добавлять нагрузку. По срезу видно: напряжение снизилось, но ресурс ещё держится нестабильно. Лучший следующий шаг — короткая повторная проверка через 7–10 дней.
```

### Important

Focused questionnaire mode must hide this panel.

---

## Sprint 10 — Supabase readiness

### Files to create

```text
docs/client-cabinet/SUPABASE_SCHEMA.sql
docs/client-cabinet/SUPABASE_SETUP.md
```

### Tables

```sql
clients
assessments
questionnaire_answers
remedy_results
expert_reports
assignments
recommendations
specialist_comments
```

### Rule

Do not wire production writes before auth and RLS are defined.

The app must keep working in demo mode without Supabase.

---

## Sprint 11 — Auth and roles

### Future files / areas

```text
src/lib/auth.js
src/lib/supabaseClient.js
src/pages/Login.jsx
src/pages/AdminClients.jsx
```

### Roles

```text
client
specialist/admin
```

### Requirement

No real private data in public mock files.

---

# 6. Safety and wording rules

## Forbidden wording

Avoid:

```text
лечение
диагноз
гарантированный результат
исцеление
медицинское назначение
отменить препараты
```

## Preferred wording

Use:

```text
самоанализ
предварительный срез
кандидаты для проверки
формула поддержки
направление поддержки
экспертная проверка
повторная проверка
не заменяет медицинскую помощь
```

## Required disclaimer

Use in appropriate places:

```text
Материалы кабинета носят поддерживающий и информационный характер. Они не заменяют медицинскую диагностику, лечение или консультацию врача. При серьёзных симптомах важно держать связь с медицинским специалистом.
```

---

# 7. QA checklist

Before every PR completion:

```bash
npm run build
```

Check forbidden wording:

```bash
rg -n "лечение|диагноз|гарант|исцел|медицинское назначение|отменить" src docs
```

Check questionnaire counts in code or console.

Expected:

```text
situation: 38
character: 39
control: 38
```

Manual QA:

- desktop layout;
- mobile layout;
- no horizontal scroll;
- no overlapping cards;
- self-analysis overview does not show 115 questions immediately;
- focused form hides sidebar and right panel;
- result changes when answers change;
- Vercel live URL works.

---

# 8. PR / delivery protocol

Every implementation task must finish with:

- clean branch;
- one coherent feature;
- build result;
- PR link;
- changed files;
- manual QA steps;
- deploy note.

## Branch naming

```text
product/self-analysis-flow
product/dynamic-bach-scoring
product/local-storage-assessments
product/expert-report-dates
product/assignment-support-formula
product/recommendations-personality-map
product/supabase-schema
```

## PR body template

```md
## What changed

-

## Files changed

-

## Build

- [ ] npm run build passed

## Manual QA

- [ ] Desktop layout checked
- [ ] Mobile layout checked
- [ ] No horizontal scroll
- [ ] Safe wording checked

## Product acceptance

- [ ] Matches roadmap
- [ ] Does not mix Assignment and Recommendations
- [ ] Does not show questionnaire too early
- [ ] Dynamic result changes with answers

## Deploy note

Live target: https://my-alchemist.vercel.app
```

---

# 9. Next immediate task

Implement one PR only:

```text
Self-analysis overview + focused questionnaire flow + dynamic Bach result grouping
```

## Required files for next task

Look at:

```text
src/App.jsx
src/components/Layout.jsx
src/pages/SelfAnalysis.jsx
src/components/Cards.jsx
src/lib/bachScoring.js
src/data/mockData.js
src/styles.css
```

## Acceptance criteria for next PR

- `Сделать самоанализ` opens overview state first.
- User can click `Начать самоанализ`.
- Focused form opens without sidebar/right panel/topbar clutter.
- Step navigation works.
- Full questionnaire counts remain 38 / 39 / 38.
- Result groups are calculated dynamically.
- Result changes when answers change.
- `npm run build` passes.
- Mobile has no horizontal scroll.
- Safe wording scan passes.
