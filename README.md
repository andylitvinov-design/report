# Алхимия Души report template

Динамический HTML/React-шаблон клиентского отчёта `Алхимия Души`.

## Что есть

- `design/sample-data.json` — входные данные для страниц 2–4
- `design/restore.mjs` — восстановление локального мини-референса из base64
- `src/components/ReportPage2.jsx` — страница 2
- `src/components/ReportPage3.jsx` — страница 3
- `src/components/ReportPage4.jsx` — страница 4
- `src/components/report-kit.jsx` — общий shell и общие элементы
- `src/styles.css` — экранные и print-стили

## Запуск

```bash
npm install
npm run dev
```

Preview routes:

- [http://localhost:5173/report-preview/2](http://localhost:5173/report-preview/2)
- [http://localhost:5173/report-preview/3](http://localhost:5173/report-preview/3)
- [http://localhost:5173/report-preview/4](http://localhost:5173/report-preview/4)
- [http://localhost:5173/report-preview/all](http://localhost:5173/report-preview/all)

## Печать / PDF

На preview-страницах есть кнопка `Печать / PDF`. Для A4 добавлены отдельные print-правила. Маршрут `/report-preview/all` подходит для печати сразу всего собранного блока страниц.

## Важный дизайн-блокер

Финальный утверждённый PNG-референс должен лежать по пути:

- `design/report-page-2-reference.png`

Сейчас в репозитории его нет. Есть только вспомогательный мини-референс:

- `design/ref-small.b64`
- `design/restore.mjs`

После загрузки финального PNG шаблон можно дотюнить под него точнее без смены структуры.
