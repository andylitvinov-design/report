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

## 2. Open Design / anchor breakdown

Anchor inspected from `design/alchemy_anchor_design_reference.png`:

- source PNG: 1392 x 4557 px;
- page stack: four centered portrait pages, each visually A4, with about 24 px vertical gap between page surfaces;
- page surface: about 780 px wide in the anchor raster; the rendered implementation keeps canonical 210 mm x 297 mm A4 and uses print rules for exact four-page output;
- frame: outer dark hairline plus inset gold/dark double frame, about 5-7 mm from page edge, square corners;
- header: left title block, thin divider, DAO circular seal at upper-right overlapping a dark brown square;
- background: warm ochre parchment with a pale top-center glow, deeper amber lower area, low-contrast grid/scratch texture;
- white inserts: almost-white panels with 1 px warm brown border, 7 px radius, and a soft brown down/right shadow;
- lower accents: dark square lower-left, corner bracket lower-right, small glyph line near footer; botanical/crystal/bottle/bowl marks stay subtle and low.

Required JSX/CSS composition:

- Page 1: large living-letter insert left; three compact metric inserts right; faint DAO/pentagram diagram behind the side column.
- Page 2: two-column remedy card grid; first four remedies in 2 x 2, Cherry Plum full-width, then two full-width conclusion inserts.
- Page 3: horizontal five-step prescription chain, then one large prescription insert with two warm nested blocks.
- Page 4: two-column message card grid; Cherry Plum full-width, then `Чего ожидать`, then final formula band.

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

Layout: anchor card rhythm, not a new dashboard: four remedy inserts in a two-column grid, fifth remedy full-width, then two full-width interpretation inserts.

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

Layout: two-column message-card rhythm, fifth message full-width, future panel, and final formula band.

## 8. Forbidden patterns

Do not use:

- generic parchment card templates;
- dashboard grids;
- analytics cards;
- unrelated layouts that differ from the anchor;
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
