# Workbook Page Standard

Source of truth: GitHub issue #60. This standard is mandatory for all new and existing PsiTherapy workbook/cabinet pages.

## 1. Product Meaning

PsiTherapy is a guided AI-therapy session. The workbook / self-observation journal is only the soft interface form.

Core formula:

```text
AI guide asks/supports -> patient answers -> AI reflects -> next step appears
```

Pages must feel like a guided AI-приём, not like a static journal, dashboard, content library, or medical diagnosis screen.

## 2. Global Page Pattern

Desktop:

- centered adaptive workbook/shell;
- no ultra-wide panoramic stretch;
- one global category nav;
- contextual subnav for the active category.

Mobile:

- login-page-like AI-session landing for overview/decision pages;
- primary CTA visible on the first viewport;
- not a squeezed desktop book.

## 3. Navigation Standard

Do not use a generic `Ещё` catch-all as a top-level category.

Top-level categories:

- Главная
- Профиль
- Самоанализ
- ИИ-анализ
- Отчёты
- Консультации
- Поддержка
- История
- Настройки

Subcategories are contextual and shown separately for the active category. Desktop uses the full category menu plus contextual subnav. Mobile uses a category sheet/dropdown that includes all categories and the active category subnav.

## 4. Page Content Constraints

- One main thought per page.
- Max 3 primary actions/choices visible in a single step/screen.
- Primary CTA visible without scroll on mobile decision/landing screens.
- No dense dashboards on page overview.
- No duplicate top nav + sidebar.
- Move long explanations, charts, and secondary details behind detail views, tabs, disclosures, or below the first decision area.

## 5. Mobile Rules

- No thick mobile book frame.
- No tiny two-page spread.
- No hidden nav.
- No primary CTA below fold.
- No secondary info above primary CTA on decision/landing screens.
- Check 360px, 390px, and 430px widths for any UI PR touching page layout.

## 6. Desktop Rules

- Centered max width.
- Max approximately 1280-1360px content width.
- Top-level nav + contextual subnav.
- No legacy sidebar on workbook pages.
- Two-page workbook layout is allowed only when there is enough width.

## 7. Copy Rules

Use:

- AI-приём
- мягкий AI-сеанс
- AI задаст несколько бережных вопросов
- первая карта состояния
- рабочая карта
- не заменяет медицинскую или психотерапевтическую помощь

Avoid:

- only "journal" / только "журнал";
- диагноз;
- гарантия результата;
- cure or healing promises;
- medical treatment claims.

## 8. Component Contract

Canonical workbook components:

- `WorkbookShell`
- `WorkbookTopNav`
- `WorkbookSubNav`
- `WorkbookMobileCategorySheet`
- `WorkbookBook`
- `WorkbookPage`
- `WorkbookMobileHero`
- `WorkbookChoiceList`
- `WorkbookActionList`
- `WorkbookAssistantInput`
- `WorkbookSafetyNote`
- `WorkbookThemeBadge`

Navigation data must live in `src/data/workbookNavigation.js` with:

- `workbookNavigation` categories;
- contextual `subnav` per category;
- mapping to existing `activePage` / tab routing.

## 9. PR Checklist

Every UI PR must include:

```markdown
## Workbook page standard check
- [ ] Checked docs/workbook-page-standard.md
- [ ] Product meaning is AI-guided session, not journal-only
- [ ] Mobile primary CTA visible when applicable
- [ ] Navigation categories/subcategories correct
- [ ] No duplicate sidebar/top nav
- [ ] Max 3 primary actions/choices
- [ ] Desktop max-width respected
- [ ] Mobile 360/390/430 checked
```
