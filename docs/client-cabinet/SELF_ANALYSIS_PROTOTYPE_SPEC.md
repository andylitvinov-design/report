# Self-analysis Prototype Spec

## Purpose

The Self-analysis page is the client-facing place where a client records the current state and completes one questionnaire layer at a time.

## Page role

Main question:

`What does the client feel and mark by themselves right now?`

## Layout rule

Use the same cabinet structure as the Overview prototype:

- left menu = main cabinet sections;
- top tabs = Self-analysis subsections;
- center = current self-analysis form;
- right panel = short specialist hint, not analytics.

## Top tabs

1. Current data / Текущие данные
2. Situation / Анкета ситуации
3. Character / Анкета характера
4. Control / Контрольный лист
5. Result / Итог

## Current data

Fields:

- date, auto-filled in UI prototype;
- work focus dropdown;
- problem strength 0-10;
- short text description.

Work focus options:

- Health / body
- Emotions / anxiety
- Relationships
- Money / work
- Self-esteem / confidence
- Energy / fatigue
- Choice / decision

## Questionnaire cards

Each question is a card with:

- question number;
- question text;
- related remedy / theme;
- 1-5 score selector;
- optional comment field.

The prototype should show sample questions, not the full production questionnaire yet.

## Result panel

Show automatic result groups:

- Main candidates;
- Additional support;
- Needs verification.

Safe wording:

`This is a preliminary slice based on client answers. Final recommendations are formed after expert analysis.`

## Right specialist panel

Keep short:

- one helpful instruction;
- one next step;
- one CTA.

Example:

`Answer from your current state, not from how you usually are. If unsure, mark what was strongest during the last 1-3 days.`
