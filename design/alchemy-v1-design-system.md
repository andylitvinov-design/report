# alchemy-v1 Anchor Design System

## 0. Single visual canon

`design/alchemy_anchor_design_reference.png` is the only visual source of truth for `alchemy-v1`.

This file is the confirmed anchor. Every implementation change must reproduce its composition, rhythm, frame language, and page feeling. Do not invent a new design when the report text changes.

If the file is missing, copy the confirmed local artifact:

```text
/mnt/data/alchemy_anchor_design_reference.png
```

to:

```text
design/alchemy_anchor_design_reference.png
```

Do not use a generated substitute, generic parchment/card/dashboard style, or the current live `alchemy-v1` as reference when it differs from the anchor.

`design/reference_alchemy_report_anchor_v1.png` may remain for history, but it is not the named canon for new work.

## 1. Content vs. design

`design/alchemy-v1-data.json` is content only.

It may define report text, diagnostic values, remedies, prescription logic, messages, and follow-up content. It must not define a new layout direction. CSS/JSX must reproduce the anchor composition regardless of text changes.

When the real report text is too long for the visual composition, preserve both layers:

```json
{
  "fullText": "Complete client-facing text...",
  "displayText": "Shorter text rendered in the graphic page..."
}
```

The graphic layout renders `displayText`. `fullText` remains the complete source text.

## 2. Required anchor composition

The JSX and CSS must reproduce the anchor:

- 4 vertical A4 pages;
- header `Алхимия Души`;
- thin ornate frames;
- DAO seal at the top right;
- warm parchment background;
- white text inserts with soft brown shadow;
- decorative gold dividers, stars, ritual marks, and small alchemical accents;
- botanical / crystal / bottle / bowl accents near the bottom;
- page 1: living letter plus Wu Xing / DAO scheme on the side;
- page 2: vertical list of remedies, not a dashboard grid;
- page 3: prescription formula plus practical block;
- page 4: note, remedy messages, and `Чего ожидать`.

## 3. Page background

- Warm ochre parchment: pale honey near the upper center, deeper amber near the lower page.
- Dense but low-contrast texture: fine grid, scratches, and subtle paper grain.
- Parchment remains visible around white inserts. A page must not become a full white document.
- Decorative layer stays quiet: corner blocks, star lines, faint alchemical marks, and bottom ritual accents.

## 4. Frame system

- Outer A4 rectangular frame with square corners.
- Multiple thin strokes rather than one thick border.
- Inner ornate frame inset from the page edge.
- Asymmetric corner brackets and dark brown square blocks top-right and bottom-left.
- Content stays inside the frame; footer is inside the page, not outside it.

## 5. Header system

- Title upper-left, large serif display: `Алхимия Души`.
- Subtitle directly under the title.
- DAO seal top-right, circular, with thin rings and inner triangular/diamond mark.
- Page title below the brand block with a thin horizontal divider.

## 6. White text inserts

Allowed insert types:

- primary letter panel;
- remedy note;
- small side metric;
- prescription panel;
- message card;
- future / expectation panel.

Rules:

- warm brown 1 px border;
- light inner highlight;
- soft right/down shadow;
- no modern dashboard elevation;
- no equal analytic card grid except page 4 message rhythm where the anchor uses message cards;
- inserts must feel placed into an illustrated page, not as a web dashboard.

## 7. Page contract

### Page 1 — Diagnosis

Required content:

- `Я 3.2`;
- `Здоровье 3.3`;
- `первичная устойчивость`;
- main theme: `не рывок, а закрепление опоры`;
- bottleneck: `Вода + Дерево`.

Layout: living letter left; side Wu Xing / DAO scheme and compact metric inserts right.

### Page 2 — Remedy Set / О чём говорит набор

Required content:

- Вода 2.4 — Mustard — дефицит света;
- Дерево 2.6 — Scleranthus — колебание;
- Огонь 2.8 — Aspen — тревожность;
- Земля 2.8 — Sweet Chestnut — опыт предела;
- Металл 3.3 — Cherry Plum — контроль;
- краткий вывод.

Layout: vertical remedy list with ritual axis/glyphs. No 2 × 2 dashboard.

### Page 3 — Prescription

Required content:

- Mustard;
- Cherry Plum;
- Scleranthus;
- Aspen;
- Sweet Chestnut;
- `#1 В первую очередь`;
- `#2 Дополнительно`;
- принимать;
- курс;
- повторная проверка.

Layout: prescription formula and practical block.

### Page 4 — Messages + Future

Required content:

- Примечание;
- 5 посланий препаратов;
- `Чего ожидать`;
- final formula: `не рывок, а закрепление опоры`.

Layout: message cards plus future panel; it may use card rhythm, but must stay anchored in the ornate parchment style.

## 8. Forbidden patterns

Do not use:

- generic parchment card templates;
- dashboard grids;
- analytics cards;
- unrelated 2 × 2 layouts;
- dark app-dashboard styling;
- flat white document pages;
- landscape compositions;
- contact-sheet layouts;
- new decorative systems unrelated to the anchor.

## 9. Implementation responsibility

`src/components/AlchemyReport.jsx` owns the semantic four-page contract and chooses the correct page type.

`src/components/alchemy-report-ornate.css` owns visual fidelity to the anchor.

`src/components/alchemy-report.css` may contain fallback/base styles, but it must not override the ornate anchor composition.

Print/PDF for `/report-preview/alchemy-v1/all` must produce exactly four A4 portrait pages.
