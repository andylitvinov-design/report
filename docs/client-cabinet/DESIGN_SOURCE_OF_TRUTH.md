# Client Cabinet Design Source of Truth

## Main visual source

Primary concrete mockup file:

`docs/client-cabinet/assets/client-cabinet-mockup-source.svg`

This SVG is the source-of-truth layout reference for the first Holistic Therapy Cabinet MVP. Text documentation explains the design, but implementation should be visually checked against this mockup.

## Desktop layout requirements

The desktop screen must preserve these zones:

- left sidebar with product identity and five main menu items;
- active client card in the sidebar;
- top page header with client context and primary action;
- top subsection tabs;
- four metric cards: problem strength, resource, main remedy, bottleneck;
- dynamics chart area;
- support formula / recommendations preview;
- right specialist comment panel.

## Mobile layout requirements

The mobile screen must preserve these zones:

- compact product header;
- client state card;
- stacked metric cards;
- main current-state card;
- specialist comment card;
- primary action button.

## Visual style

- warm ivory background;
- white rounded cards;
- soft borders;
- natural green accents;
- orange progress accent;
- blue resource accent;
- calm, spacious therapeutic feel;
- small charts instead of dense analytics.

## Non-negotiable rule

Right panel on desktop is not a second dashboard. It is the living specialist voice: short comment, next step, one action.

## Verification

Before accepting UI implementation, compare it with:

`docs/client-cabinet/assets/client-cabinet-mockup-source.svg`
