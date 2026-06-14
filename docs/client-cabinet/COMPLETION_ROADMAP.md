# Holistic Therapy Cabinet — complete implementation roadmap

## Purpose

Bring the client cabinet from a visual MVP to a usable product for natural therapy / Bach / homeopathy-style support reports.

Live target:

- `https://my-alchemist.vercel.app`

Main product promise:

```text
self-analysis → automatic slice → expert report → assignment / support formula → recommendations → repeated check → dynamics
```

The cabinet must feel like a living support system, not just a dashboard.

---

# 0. Product decisions already made

## 0.1 Main public URLs

- Main public site: `https://alchemist.vercel.app`
- Client cabinet: `https://my-alchemist.vercel.app`
- Do not treat GitHub Pages as the main product URL anymore.
- `my.alchemist.vercel.app` is not available because Vercel reserves `*.alchemist.vercel.app` for another account.

## 0.2 Main navigation

The left menu must use client-facing labels, not internal method labels.

Final menu:

1. `Профиль / Обзор`
2. `Отчёт эксперта`
3. `Назначение`
4. `Сделать самоанализ`
5. `Рекомендации`

## 0.3 Navigation meaning

### `Профиль / Обзор`

Main client dashboard.

Includes:

- main metrics;
- current state;
- dynamics;
- psychological portrait;
- personality map preview;
- last expert comment;
- next action.

Tabs:

- `Состояние`
- `Динамика`
- `Психологический портрет`
- `Карта личности`

### `Отчёт эксперта`

Expert reports and interpretation by date.

Includes:

- latest report;
- reports by date;
- hidden mechanism;
- bottleneck / main block;
- У-Син if needed;
- expert remedy check.

Tabs:

- `Последний отчёт`
- `Отчёты по датам`
- `Механизм`
- `У-Син`
- `Препараты`

### `Назначение`

Practical current support formula: what is active now.

Important: UI label can be `Назначение`, but internal wording must remain soft:

- `формула поддержки`;
- `текущая поддержка`;
- `направление поддержки`;
- `что отслеживать`;
- `дата пересмотра`.

Tabs:

- `Текущая формула`
- `Bach`
- `Натуротерапия`
- `Практики`
- `Что отслеживать`

### `Сделать самоанализ`

This is not just a dashboard page. It is an entry point into a clean questionnaire flow.

Includes two modes:

1. cabinet overview state;
2. focused questionnaire state.

Steps:

- `Данные`
- `Ситуация`
- `Характер`
- `Контроль`
- `Итог`

### `Рекомендации`

Long-term support map, not the same as `Назначение`.

Includes:

- current recommendations;
- personality map;
- measurement dynamics;
- history of changes;
- next step;
- long-term support themes.

Tabs:

- `Текущие рекомендации`
- `Карта личности`
- `Динамика замеров`
- `История`
- `Следующий шаг`

---

# 1. Coverage of user wishes

This roadmap must preserve these product wishes.

## 1.1 Visual / UX wishes

- The cabinet must look like a real warm holistic client cabinet, not a technical admin panel.
- The visual language should be warm, clean, therapeutic, natural, soft, and premium enough to show clients.
- White cards, warm ivory background, green accents, rounded cards, and calm spacing are preferred.
- The right panel should feel like a living specialist comment, not a generic analytics widget.
- The top dashboard header must not dominate the form screens.
- During questionnaire completion, all distracting side panels must disappear.
- Self-analysis should feel like Google Form / Typeform when the user is answering.
- Mobile must be clean: one column, no overlap, no horizontal scroll.

## 1.2 Product logic wishes

- The cabinet should follow the chain:

```text
самоанализ → автоматический срез → отчёт эксперта → назначение / формула поддержки → рекомендации → повторная проверка → динамика
```

- The user should always know:
  - where they are now;
  - what has changed;
  - what is active now;
  - what to do next;
  - when to check again.

## 1.3 Self-analysis wishes

- The questionnaire must not be reduced to 2 demo points per category.
- Full Bach questionnaire data must be shown:
  - situation: 38 questions;
  - character: 39 questions;
  - control: 38 questions.
- The form should not be lost inside a dashboard layout.
- The user should first see a start / overview screen.
- Only after clicking `Начать самоанализ` should they enter the focused form.
- Focused form mode should hide:
  - left menu;
  - right specialist panel;
  - mobile navigation;
  - large dashboard topbar;
  - unrelated analytics.

## 1.4 Scoring wishes

- Result must be calculated from current answers, not hardcoded.
- Bach output must be grouped into:
  - `Основные кандидаты`;
  - `Дополнительная поддержка`;
  - `Требует проверки`.
- The system should explain why a remedy appeared.
- The result is a preliminary slice, not a medical conclusion.

## 1.5 Report wishes

- Expert reports can have submenus by date.
- Repeated checks must show dynamics:
  - what grew;
  - what decreased;
  - what is still active;
  - what requires a new check.
- Reports should include mechanism and bottleneck, not just a list of remedies.

## 1.6 Development process wishes

- Use GitHub as source of truth.
- Use small PRs, not one huge rewrite.
- Always run `npm run build` before PR completion.
- Use clean sibling worktrees when the main local worktree is dirty.
- Keep Vercel production deployment clear.
- Report final output with:
  - changed files;
  - PR link;
  - build result;
  - live URL;
  - manual QA steps.

---

# 2. Current known state

Already implemented or partially implemented:

- React / Vite MVP exists.
- Vercel public target exists.
- Client-facing left navigation was introduced or partially introduced.
- Full Bach questionnaire data exists in `mockData.js`:
  - Situation: 38 questions;
  - Character: 39 questions;
  - Control: 38 questions.
- A first focused mode for self-analysis exists, but the UX is not complete.
- The current result still needs dynamic grouping and explanation.
- Data is not persisted yet.

Main risks:

- Live site may not reflect latest `main`.
- Old PR #9 may be stale and may duplicate direct `main` commits.
- Self-analysis currently may still open too much form content too early.
- The form flow does not yet have a true start screen + step controller.
- Result grouping may still be static.
- No localStorage / database yet.

---

# Phase 0 — Stabilize live deployment

## Goal

Make sure current code and live site are synchronized before adding new product features.

## Tasks

1. Pull latest `main` locally.
2. Run `npm install` if needed.
3. Run `npm run build`.
4. Deploy latest `main` to Vercel production.
5. Open `https://my-alchemist.vercel.app` and verify that live UI matches current `main`.
6. Close or supersede outdated PRs that duplicate changes already committed directly to `main`, especially PR #9 if no longer needed.
7. Run desktop visual QA.
8. Run mobile visual QA.
9. Verify that the app is not relying on stale GitHub Pages deployment.

## Acceptance criteria

- `npm run build` passes.
- `https://my-alchemist.vercel.app` returns HTTP 200.
- Live site shows:
  - `Профиль / Обзор`;
  - `Отчёт эксперта`;
  - `Назначение`;
  - `Сделать самоанализ`;
  - `Рекомендации`.
- Live site uses latest Vercel production deployment.
- There is one clear source of truth:

```text
main → Vercel production → https://my-alchemist.vercel.app
```

---

# Phase 1 — Self-analysis UX flow

## Goal

Turn `Сделать самоанализ` from a dashboard section into a real form experience.

## Product decision

`Сделать самоанализ` has two states:

1. **Cabinet overview state** — client sees status and actions.
2. **Focused questionnaire state** — client answers the form without distractions.

## 1. Cabinet overview state

When the client opens `Сделать самоанализ`, do not show all questions immediately.

Show:

- last self-analysis date;
- current status:
  - not started;
  - draft;
  - completed;
  - needs repeat check;
- current problem strength;
- focus of work;
- last result preview;
- last saved draft state;
- buttons:
  - `Начать самоанализ`;
  - `Продолжить черновик`;
  - `Пройти повторную анкету`;
  - `Обновить только силу проблемы`;
  - `Добавить комментарий к состоянию`.

This state may keep:

- left sidebar;
- compact cabinet header;
- right specialist comment panel.

## 2. Focused questionnaire state

After clicking `Начать самоанализ`, switch into a clean form flow.

Hide:

- left sidebar;
- right specialist panel;
- mobile navigation;
- large dashboard header;
- unrelated metrics;
- analytics blocks.

Show only:

- compact progress header;
- current step title;
- centered form column;
- back / next / save / exit buttons.

## Step structure

### Step 1 — `Данные`

Fields:

- date;
- focus of work;
- problem strength 0–10;
- short description of situation.

### Step 2 — `Ситуация`

Question:

```text
Как я себя чувствую в данной ситуации?
```

Requirements:

- show all 38 situation questions;
- score each question 0–5 or 1–5;
- optional comment per question;
- keep cards compact.

### Step 3 — `Характер`

Question:

```text
Какие устойчивые моменты особенно мешают мне?
```

Requirements:

- show all 39 character questions;
- clarify that this section is about patterns, not only today;
- optional comment per question.

### Step 4 — `Контроль`

Question:

```text
Что сейчас больше всего напрягает или мучает меня?
```

Requirements:

- show all 38 control items;
- instruction: choose or score the 5–7 most accurate points;
- show selected count;
- do not force the user to select everything.

### Step 5 — `Итог`

Show:

- main candidates;
- additional support;
- needs verification;
- preliminary Bach score;
- short explanation;
- next actions:
  - `Сохранить самоанализ`;
  - `Запросить экспертный отчёт`;
  - `Вернуться в кабинет`.

## UX requirements

- The form should feel like Google Form / Typeform.
- One main column, about 720–860 px wide on desktop.
- On mobile: one column, large buttons, no horizontal scroll.
- Step controls should be sticky or easy to reach.
- Save progress must be visible.
- The top form header should be compact and useful, not a huge decorative panel.

## Acceptance criteria

- Opening `Сделать самоанализ` shows a clean overview screen, not 115 questions immediately.
- Clicking `Начать самоанализ` enters focused form mode.
- Sidebar and right panel disappear in focused form mode.
- User can move between steps.
- Full question counts are preserved:
  - situation: 38;
  - character: 39;
  - control: 38.
- Mobile view has no overlap and no horizontal scroll.

---

# Phase 2 — Dynamic Bach scoring and result grouping

## Goal

Replace static demo result groups with a real result calculated from current answers.

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

- `+2` if remedy appears in 2 sections;
- `+4` if remedy appears in 3 sections;
- `+1` for each score 4;
- `+2` for each score 5;
- `+1.5` if remedy appears in control checklist.

## Output groups

### `Основные кандидаты`

Strongest 1–3 remedies.

### `Дополнительная поддержка`

Next 2–4 relevant remedies.

### `Требует проверки`

Borderline remedies or remedies with narrow evidence.

## Result explanation

Do not show only remedy names.

For each result show:

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

Use `localStorage` first.

Do not connect Supabase until:

- UX is stable;
- scoring is stable;
- assessment snapshots are clear.

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
- later export current result as JSON or text.

## Acceptance criteria

- Refreshing the page does not erase answers.
- User can continue a draft.
- User can complete and save a snapshot.
- History can show several completed assessments.

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

## Metrics

Show at least:

- current problem strength;
- resource level;
- main Bach candidate;
- main block / bottleneck;
- last check date;
- next check date.

## Dynamics

Show:

- problem trend;
- resource trend;
- change since last slice;
- one simple explanation.

## Psychological portrait

Show preview only at first:

- main repeating pattern;
- resource style;
- stress response;
- support need.

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

## Repeated check logic

For follow-up reports, always show:

- what decreased;
- what increased;
- what disappeared;
- what remains active;
- what became newly visible;
- whether the current support formula still fits.

## Acceptance criteria

- User can open the latest expert report.
- User can switch between report dates.
- Report is clearly separated from self-analysis.
- Report includes mechanism and bottleneck.
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

## Formula card

Show:

- main focus;
- support formula;
- why now;
- how long to observe;
- what to track;
- when to review.

## Acceptance criteria

- User immediately sees what is current now.
- This section is not a duplicate of Recommendations.
- The next check date is visible.
- Wording remains supportive, not medical-prescriptive.

---

# Phase 7 — Recommendations and personality map

## Goal

Make `Рекомендации` a long-term support and development map.

## Difference from Assignment

```text
Назначение = current active support.
Рекомендации = wider map, dynamics, personality pattern, long-term direction.
```

## Required blocks

- current recommendations;
- personality map;
- measurement dynamics;
- history of changes;
- next step;
- long-term support themes.

## Personality map

Initial MVP can use a placeholder map with:

- core pattern;
- stress pattern;
- resource pattern;
- relationship / boundary pattern;
- decision / action pattern.

## Acceptance criteria

- Recommendations does not duplicate Assignment.
- It explains long-term patterns.
- It is linked to assessment history.

---

# Phase 8 — Specialist comments and living support

## Goal

Make the right panel useful and emotionally alive.

## Requirements

Right panel should contain:

- one short specialist comment;
- one warning / focus;
- one next action;
- one CTA.

Avoid:

- long generic text;
- repeated dashboard metrics;
- too many buttons.

Examples:

```text
Сейчас главное — не добавлять нагрузку. По срезу видно: напряжение снизилось, но ресурс ещё держится нестабильно. Лучший следующий шаг — короткая повторная проверка через 7–10 дней.
```

## Acceptance criteria

- Every cabinet section has a relevant right-panel comment.
- Focused questionnaire mode hides the right panel.
- Comment feels like human support, not a generic tooltip.

---

# Phase 9 — Supabase data layer

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
- Do not mix demo mock data with real private data.

## Acceptance criteria

- Schema file exists.
- Demo mode still works.
- Future Supabase integration is clear.

---

# Phase 10 — Auth and roles

## Goal

Turn the demo into a real private client cabinet.

## Roles

### Client

Can:

- fill questionnaires;
- continue drafts;
- see own reports;
- see current assignment;
- see recommendations and dynamics.

### Specialist / Admin

Can:

- see clients;
- review self-analysis;
- write expert reports;
- update assignment;
- add specialist comments.

## Tasks

- choose auth provider;
- add login;
- connect client data to authenticated user;
- remove hardcoded private demo data from public files;
- prepare specialist/admin view later.

## Acceptance criteria

- Client can log in.
- Client sees only their own cabinet.
- No real private data is stored in public mock files.

---

# Phase 11 — QA and release checklist

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
  - profile overview;
  - self-analysis overview;
  - focused questionnaire;
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
- `повторная проверка`;
- `не заменяет медицинскую помощь`.

## Required disclaimer

Use in appropriate places:

```text
Материалы кабинета носят поддерживающий и информационный характер. Они не заменяют медицинскую диагностику, лечение или консультацию врача. При серьёзных симптомах важно держать связь с медицинским специалистом.
```

---

# Phase 12 — Development workflow / delivery loop

## Goal

Avoid broken or half-finished changes.

## Required workflow for Codex / Claude Code

For each implementation task:

1. Work in a clean branch or clean sibling worktree.
2. Pull latest `main`.
3. Make one coherent product change.
4. Run `npm run build`.
5. Run wording scan for forbidden medical claims.
6. Check desktop and mobile layout.
7. Push branch.
8. Open PR.
9. Include:
   - what changed;
   - files changed;
   - build result;
   - live/deploy note;
   - manual QA steps.
10. Do not merge until PR is mergeable and matches the task.

## Acceptance criteria

- No giant mixed PRs.
- No stale branch against old base.
- No unresolved PR like #9 blocking the roadmap.
- Every PR has clear acceptance criteria.

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

## Sprint 3 — Client product sections

1. Profile / Overview improvements.
2. Expert Report by date.
3. Assignment / support formula.
4. Recommendations / personality map / dynamics.
5. Right specialist comments.

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

## Suggested PR title

```text
Implement self-analysis overview and dynamic focused flow
```

## Suggested PR acceptance criteria

- `Сделать самоанализ` first opens overview state.
- User can start form mode from overview.
- Sidebar and right panel are hidden in form mode.
- Step navigation works.
- Full questionnaire counts are visible.
- Result groups are calculated dynamically.
- `npm run build` passes.
- Mobile view has no horizontal scroll.
