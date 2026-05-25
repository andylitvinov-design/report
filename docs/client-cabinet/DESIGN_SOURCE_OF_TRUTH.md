# Client Cabinet Design Source Of Truth

Canonical visual source:

- `docs/client-cabinet/assets/client-cabinet-mockup-source.svg`

The SVG is the source for the first Overview prototype. The prototype should preserve the same structure, proportions, and visual language unless this document is updated.

## Product Surface

The Overview screen is a calm client workspace for **Alchemy Cabinet / Holistic Therapy**. It should feel like an operational cabinet, not a marketing landing page.

Primary jobs:

- show the current client report state;
- surface the next required client action;
- keep report timeline and session context visible;
- work as both desktop and mobile-first experience.

## Layout Contract

Desktop:

- dark left navigation, fixed-width visual weight;
- warm paper workspace background;
- top heading area with status pill;
- main report summary panel on the left;
- next-step panel on the right;
- full-width timeline below.

Mobile:

- single-column Overview;
- current report summary first;
- next action second;
- timeline and report action below;
- no dense desktop sidebar.

## Visual Tokens

- Background: warm parchment, `#efe7d7`.
- Surface: paper white, `#fffdf8`.
- Primary ink: `#24312d`.
- Muted text: `#7b877d`.
- Navigation: deep green, `#263a34`.
- Main accent: muted gold, `#b88a55`.
- Supporting accents: sage `#60796b`, rose `#c98b7c`, gold `#d8b56a`.
- Radius: 12-28px depending on surface size.
- Typography: Georgia for report/client headings, system sans for product UI labels.

## Implementation Rules

- The Overview prototype must start on the working surface, not a hero page.
- Do not add generic SaaS card grids beyond the panels shown in the source SVG.
- Use restrained motion only for entry, hover, and focus states.
- Keep labels short and operational.
- Mobile must preserve the report-first information order.
