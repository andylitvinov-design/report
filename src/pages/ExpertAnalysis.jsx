import React from "react";
import { client } from "../data/mockData.js";
import { readAdvancedAiAnalysisResult } from "../lib/advancedAiAnalysisStorage.js";
import { getAnswerText, hasAnswerContent } from "../lib/firstIntakeAnswers.js";
import { readFirstIntakeResult } from "../lib/firstIntakeStorage.js";
import "../results.css";

const reports = [
  {
    number: "01",
    type: "Самоотчёт",
    date: "04.06.2026",
    status: "Готов",
    summary: "Первичный самоанализ: текущая нагрузка, ресурс, Bach-темы и субъективная картина состояния.",
    accent: "Самоанализ",
  },
  {
    number: "02",
    type: "Диагностика эксперта",
    date: "14.05.2026",
    status: "На проверке",
    summary: "Сопоставление самооценки, повторяющихся тем и уровня ресурса перед финальной рекомендацией.",
    accent: "Эксперт",
  },
  {
    number: "03",
    type: "Повторный срез",
    date: "21.05.2026",
    status: "Черновик",
    summary: "Проверка динамики: что снизилось, что осталось активным и нужна ли корректировка поддержки.",
    accent: "Динамика",
  },
];

const reportDetails = {
  "Самоотчёт": {
    title: "Самоотчёт клиента",
    text:
      "Это слой первичных данных: как клиент сам описывает состояние, нагрузку, ресурс и повторяющиеся темы. Он не является финальным заключением, но задаёт основу для анализа.",
    items: ["Фокус: здоровье / тело", "Ресурс: 4/10", "Главная тема: Olive", "Повторяющиеся мысли: White Chestnut"],
  },
  "Диагностика эксперта": {
    title: "Диагностика эксперта",
    text:
      "Здесь специалист сверяет самоотчёт с повторяющимися темами, динамикой и возможным узким местом. Финальное решение принимается после проверки изменений во времени.",
    items: ["Основной узел: истощение", "Когнитивный слой: внутренний шум", "Bottleneck: ресурс ниже нагрузки", "Статус: требует проверки динамики"],
  },
  "Повторный срез": {
    title: "Повторный срез",
    text:
      "Этот блок нужен для новых отчётов по датам: он показывает, что выросло, что ушло, что осталось актуальным и требует ли поддержка корректировки.",
    items: ["Сила проблемы: 6/10", "Ресурс: 5/10", "Напряжение снизилось", "Проверить сон и восстановление"],
  },
  "Механизм": {
    title: "Механизм состояния",
    text:
      "Картина похожа на систему, где нагрузка продолжает расти, а восстановление откладывается. Поэтому поддержка должна сначала вернуть базовый ресурс, а не усиливать активность.",
    items: ["Нагрузка выше восстановления", "Мысли удерживают напряжение", "Тело просит паузу", "Главная задача: снизить расход"],
  },
  "У-Син": {
    title: "У-Син слой",
    text:
      "В этой версии У-Син используется как дополнительная карта ресурса. Она помогает увидеть, где система теряет опору и какой тип поддержки нужен первым.",
    items: ["Земля: перегруз и удержание", "Металл: необходимость завершения", "Вода: восстановление резерва", "Дерево: не форсировать движение"],
  },
  "Препараты": {
    title: "Препараты / поддержка",
    text:
      "Препараты здесь показаны как направление поддержки, а не как медицинское назначение. Любая формула требует наблюдения и повторной проверки состояния.",
    items: ["Olive — восстановление ресурса", "Elm — нагрузка ответственности", "White Chestnut — внутренний шум", "Срок проверки: 7-10 дней"],
  },
};

const notebookMetricItems = [
  ["Проблема", "problemStrength"],
  ["Ресурс", "resourceLevel"],
  ["Тревога", "anxietyLevel"],
  ["Усталость", "fatigueLevel"],
  ["Влияние", "lifeImpact"],
];

const compactReportTabs = ["Самоотчёт", "Диагностика эксперта", "Механизм", "У-Син", "Препараты"];

const formatScore = (value) => (value === undefined || value === null || value === "" ? "не указано" : `${value}/10`);

const formatAnswer = (value, fallback = "требует уточнения") => getAnswerText(value) || fallback;

const formatResultDate = (value) => {
  if (!value) return "сегодня";

  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "сегодня";
  }
};

const getTopBachCandidates = (result, limit = 4) => {
  const bach = result?.bachResults || { main: [], support: [] };
  return [...(bach.main || []), ...(bach.support || [])].slice(0, limit);
};

function EmptyFirstConsultation({ onStartSelfAnalysis }) {
  return (
    <section className="results-modal-shell" aria-label="Нет доступных отчётов">
      <div className="results-blurred-page" aria-hidden="true">
        <ReportsMenu activeTab="Меню отчётов" onSelectReport={() => {}} />
        <article className="card lab-report-card">
          <div className="section-head">
            <div>
              <span className="card-kicker">Результаты появятся после первого шага</span>
              <h2>История отчётов пока пустая</h2>
            </div>
            <span className="lab-badge">ожидает самоанализ</span>
          </div>
          <p>
            После первой консультации здесь появятся самоотчёт, диагностика эксперта,
            повторные срезы и история изменений по датам.
          </p>
        </article>
      </div>

      <div className="results-modal-backdrop">
        <article className="card results-intake-modal" role="dialog" aria-modal="true" aria-labelledby="first-intake-modal-title">
          <span className="card-kicker">Новый клиент</span>
          <h2 id="first-intake-modal-title">Сначала пройдите первую консультацию бесплатно (самоанализ)</h2>
          <p>
            Сейчас отчётов ещё нет. Чтобы открыть раздел «Результаты», нужно пройти первый короткий самоанализ:
            система соберёт текущую ситуацию, уровень ресурса и основные темы для первичного отчёта.
          </p>
          <div className="modal-step-list">
            <span>1. Ответьте на вопросы первого приёма</span>
            <span>2. Получите первичный самоотчёт</span>
            <span>3. После этого здесь появится список отчётов</span>
          </div>
          <button className="primary-btn" onClick={onStartSelfAnalysis} type="button">
            Пройти первый приём (Анализ)
          </button>
        </article>
      </div>
    </section>
  );
}

function ResultsSummaryCard({ firstIntakeResult }) {
  const baseline = firstIntakeResult?.symptomBaseline || {};

  if (!firstIntakeResult) {
    return (
      <div className="results-summary-card">
        <span className="card-kicker">Текущий summary</span>
        <h2>Тетрадь результатов пока пустая.</h2>
        <p>Первый приём создаст базовую точку сравнения: силу проблемы, ресурс, тревогу, усталость и влияние на жизнь.</p>
      </div>
    );
  }

  return (
    <div className="results-summary-card">
      <span className="card-kicker">Текущий summary</span>
      <h2>Первичная карта сохранена.</h2>
      <p>
        Это baseline для будущей динамики: предварительная карта состояния, Bach-группировка и направление поддержки.
        Материал требует проверки специалистом и не заменяет медицинскую помощь.
      </p>
      <div className="results-baseline-marker">
        <strong>Baseline</strong>
        <span>{formatResultDate(firstIntakeResult.completedAt || baseline.updatedAt)}</span>
      </div>
    </div>
  );
}

function ResultsDynamicSnapshot({ firstIntakeResult }) {
  const baseline = firstIntakeResult?.symptomBaseline || {};

  return (
    <section className="results-dynamic-strip" aria-label="Будущая динамика">
      <div>
        <span>Стартовая точка</span>
        <strong>{firstIntakeResult ? formatScore(baseline.problemStrength) : "ожидает первого приёма"}</strong>
      </div>
      <div>
        <span>Следующий срез</span>
        <strong>готовится</strong>
      </div>
      <div>
        <span>Что сравним</span>
        <strong>ресурс, тревогу, усталость</strong>
      </div>
    </section>
  );
}

function ResultsReportPreview({ firstIntakeResult, onSelectReport }) {
  const baseline = firstIntakeResult?.symptomBaseline || {};
  const candidates = getTopBachCandidates(firstIntakeResult, 3);

  return (
    <section className="results-report-preview" aria-label="Предпросмотр отчёта">
      <div className="section-head">
        <div>
          <span className="card-kicker">Report preview</span>
          <h3>Что уже собрано</h3>
        </div>
        {firstIntakeResult ? <span className="lab-badge">предварительная карта</span> : <span className="lab-badge">пока пусто</span>}
      </div>

      {firstIntakeResult ? (
        <>
          <p>
            Фокус: {formatAnswer(baseline.mainConcern)}. Триггер: {formatAnswer(baseline.trigger)}.
            Облегчает: {formatAnswer(baseline.relief)}.
          </p>
          <div className="results-preview-remedies">
            {candidates.length > 0 ? (
              candidates.map((item) => (
                <span key={item.remedy}>{item.remedy}</span>
              ))
            ) : (
              <span>Bach-группировка требует уточнения</span>
            )}
          </div>
          <button className="secondary-btn" onClick={() => onSelectReport("Самоотчёт")} type="button">
            Открыть самоотчёт
          </button>
        </>
      ) : (
        <p>После первого приёма здесь появится краткий предпросмотр самоотчёта и направлений поддержки.</p>
      )}
    </section>
  );
}

function ResultsNotebookPanel({ firstIntakeResult, onSelectReport }) {
  const baseline = firstIntakeResult?.symptomBaseline || {};
  const candidates = getTopBachCandidates(firstIntakeResult);

  return (
    <article className="results-notebook-panel" aria-label="Тетрадь результатов">
      <div className="results-notebook-surface">
        <header className="results-notebook-hero">
          <span className="card-kicker">Тетрадь результатов</span>
          <h2>{firstIntakeResult ? "Baseline для будущей динамики" : "Место для первой рабочей карты"}</h2>
          <p>
            {firstIntakeResult
              ? "Здесь собрана первая измеримая точка: как клиент описал состояние, где ресурс, что усиливает напряжение и какие Bach-темы требуют проверки."
              : "Первый приём создаст базовую точку сравнения и аккуратно откроет историю результатов в кабинете."}
          </p>
        </header>

        <ResultsSummaryCard firstIntakeResult={firstIntakeResult} />

        <section className="results-notebook-grid" aria-label="Baseline-метрики">
          {notebookMetricItems.map(([label, key]) => (
            <div className="results-notebook-metric" key={key}>
              <span>{label}</span>
              <strong>{formatScore(baseline[key])}</strong>
            </div>
          ))}
          <div className="results-notebook-metric text-metric">
            <span>Что усиливает</span>
            <strong>{formatAnswer(baseline.trigger, "появится после первого приёма")}</strong>
          </div>
          <div className="results-notebook-metric text-metric">
            <span>Что облегчает</span>
            <strong>{formatAnswer(baseline.relief, "появится после первого приёма")}</strong>
          </div>
        </section>

        <section className="results-bach-preview" aria-label="Bach preview">
          <div className="section-head">
            <div>
              <span className="card-kicker">Bach preview</span>
              <h3>Направление поддержки</h3>
            </div>
            <span className="lab-badge">требует проверки специалистом</span>
          </div>
          {candidates.length > 0 ? (
            <div className="results-bach-list">
              {candidates.map((item) => (
                <div className="results-bach-item" key={item.remedy}>
                  <strong>{item.remedy}</strong>
                  <span>{item.theme}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Bach preview появится после первого приёма. Он показывает гипотезы, а не медицинские диагнозы.</p>
          )}
        </section>

        <ResultsReportPreview firstIntakeResult={firstIntakeResult} onSelectReport={onSelectReport} />
        <ResultsDynamicSnapshot firstIntakeResult={firstIntakeResult} />
      </div>
    </article>
  );
}

function ResultsActionMenu({ firstIntakeResult, onSelectReport, onStartSelfAnalysis }) {
  if (!firstIntakeResult) {
    return (
      <section className="results-action-card" aria-label="Действия">
        <span className="card-kicker">Следующий шаг</span>
        <h3>Создать первую точку сравнения</h3>
        <p>Короткий самоанализ сохранит baseline и откроет раздел результатов.</p>
        <button className="primary-btn full" onClick={onStartSelfAnalysis} type="button">
          Пройти первый приём (Анализ)
        </button>
      </section>
    );
  }

  return (
    <section className="results-action-card" aria-label="Действия">
      <span className="card-kicker">Действия</span>
      <h3>Работать с текущей картой</h3>
      <div className="results-action-list">
        <button className="primary-btn full" onClick={() => onSelectReport("Самоотчёт")} type="button">
          Открыть самоотчёт
        </button>
        <button className="secondary-btn full" onClick={() => onSelectReport("Диагностика эксперта")} type="button">
          Диагностика эксперта
        </button>
        <button className="secondary-btn full" disabled type="button">
          Повторный ИИ-приём · готовится
        </button>
      </div>
    </section>
  );
}

function ResultsHistoryPreview({ advancedAiResult, firstIntakeResult }) {
  return (
    <section className="results-action-card" aria-label="История результатов">
      <span className="card-kicker">История</span>
      <h3>Срезы по датам</h3>
      <div className="results-history-list">
        <div>
          <strong>{firstIntakeResult ? "Первый приём" : "Первый приём ожидается"}</strong>
          <span>{firstIntakeResult ? formatResultDate(firstIntakeResult.completedAt) : "создаст baseline"}</span>
        </div>
        <div className="planned">
          <strong>{advancedAiResult ? "Расширенный ИИ-анализ" : "Повторный срез"}</strong>
          <span>{advancedAiResult ? formatResultDate(advancedAiResult.completedAt) : "следующий этап после #38"}</span>
        </div>
      </div>
    </section>
  );
}

function ResultsCompactMenu({ advancedAiResult, firstIntakeResult, onSelectReport }) {
  const tabs = advancedAiResult ? ["Расширенный ИИ-анализ", ...compactReportTabs] : compactReportTabs;

  return (
    <section className="results-compact-menu" aria-label="Меню отчёта">
      <span className="card-kicker">Меню отчёта</span>
      {tabs.map((tab) => (
        <button key={tab} onClick={() => onSelectReport(tab)} type="button">
          <span>{tab}</span>
          <small>
            {tab === "Расширенный ИИ-анализ" || (tab === "Самоотчёт" && firstIntakeResult) ? "готов" : "открыть раздел"}
          </small>
        </button>
      ))}
    </section>
  );
}

function ResultsInteractivePanel({ advancedAiResult, firstIntakeResult, onSelectReport, onStartSelfAnalysis }) {
  return (
    <aside className="results-interactive-panel" aria-label="Интерактивная панель результатов">
      <ResultsActionMenu
        firstIntakeResult={firstIntakeResult}
        onSelectReport={onSelectReport}
        onStartSelfAnalysis={onStartSelfAnalysis}
      />
      <ResultsCompactMenu
        advancedAiResult={advancedAiResult}
        firstIntakeResult={firstIntakeResult}
        onSelectReport={onSelectReport}
      />
      <ResultsHistoryPreview advancedAiResult={advancedAiResult} firstIntakeResult={firstIntakeResult} />
      <section className="results-chat-placeholder" aria-label="Будущий чат">
        <span className="card-kicker">Future chat</span>
        <h3>Повторный ИИ-приём</h3>
        <p>Здесь появится короткий диалог для динамики: что изменилось, что усилилось, что ушло и что требует проверки.</p>
      </section>
    </aside>
  );
}

function ReportsMenu({ activeTab, onSelectReport, hasAdvancedAiResult = false, hasFirstIntakeResult = false }) {
  const availableReports = hasFirstIntakeResult
    ? [
        {
          number: "00",
          type: "Самоотчёт",
          date: "сегодня",
          status: "Готов",
          summary: "Первый приём: baseline, Bach-группировка и терапевтический запрос.",
          accent: "Первый приём",
        },
        ...(hasAdvancedAiResult
          ? [{
              number: "A1",
              type: "Расширенный ИИ-анализ",
              date: "сегодня",
              status: "Готов",
              summary: "Последний завершённый углублённый тест с ключевыми показателями и рабочим направлением.",
              accent: "ИИ-анализ",
            }]
          : []),
        ...reports.slice(1),
      ]
    : hasAdvancedAiResult
      ? [
          {
            number: "A1",
            type: "Расширенный ИИ-анализ",
            date: "сегодня",
            status: "Готов",
            summary: "Последний завершённый углублённый тест с ключевыми показателями и рабочим направлением.",
            accent: "ИИ-анализ",
          },
          ...reports,
        ]
      : reports;

  return (
    <article className="card results-menu-card">
      <div className="section-head">
        <div>
          <span className="card-kicker">Меню отчётов</span>
          <h2>История результатов</h2>
        </div>
        <span className="lab-badge">структура отчёта</span>
      </div>
      <div className="report-list">
        {availableReports.map((report) => (
          <button
            className={report.type === activeTab ? "report-row active" : "report-row"}
            key={`${report.number}-${report.date}`}
            onClick={() => onSelectReport(report.type)}
            type="button"
          >
            <span className="report-number">№ {report.number}</span>
            <span className="report-main">
              <strong>{report.type}</strong>
              <small>{report.summary}</small>
            </span>
            <span className="report-meta">
              <b>{report.date}</b>
              <small>{report.status}</small>
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}

function AdvancedAiResultBlock({ result }) {
  if (!result) return null;

  const completedDate = result.completedAt
    ? new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(result.completedAt))
    : "дата не указана";

  return (
    <article className="card lab-report-card advanced-ai-report-card">
      <div className="section-head">
        <div>
          <span className="card-kicker">Расширенный ИИ-анализ</span>
          <h2>{result.programTitle || "Последний завершённый анализ"}</h2>
        </div>
        <span className="lab-badge">{completedDate}</span>
      </div>
      <p>
        {result.hypothesis || "Итоговая рабочая гипотеза требует проверки специалистом."}
      </p>
      <div className="lab-result-grid">
        {(result.keyMetrics || []).slice(0, 4).map(([label, value]) => (
          <div className="lab-result-item" key={label}>
            <span>{label}</span>
            <strong>{value ?? "не указано"}{typeof value === "number" ? "/10" : ""}</strong>
          </div>
        ))}
        <div className="lab-result-item wide-result-item">
          <span>Направление для специалиста</span>
          <strong>{result.hypothesis || "Сверить ответы и собрать рабочую карту на консультации."}</strong>
        </div>
      </div>
      <div className="intake-report-section">
        <h3>Ключевые наблюдения</h3>
        <div className="lab-result-grid">
          {(result.sections || []).slice(0, 4).map(([label, value]) => (
            <div className="lab-result-item" key={label}>
              <span>{label}</span>
              <strong>{value ?? "требует уточнения"}</strong>
            </div>
          ))}
        </div>
      </div>
      <p className="safety-note">
        Это предварительное понимание и рабочая карта, не медицинское заключение и не медицинское назначение.
      </p>
    </article>
  );
}

function FirstIntakeResultBlock({ result }) {
  if (!result) return null;

  const baseline = result.symptomBaseline || {};
  const bach = result.bachResults || { main: [], support: [] };
  const request = result.therapyRequest || {};
  const baselineItems = [
    ["Проблема", baseline.problemStrength],
    ["Ресурс", baseline.resourceLevel],
    ["Тревога", baseline.anxietyLevel],
    ["Усталость", baseline.fatigueLevel],
    ["Влияние на жизнь", baseline.lifeImpact],
  ];
  const candidates = [...(bach.main || []), ...(bach.support || [])].slice(0, 5);

  return (
    <article className="card lab-report-card first-intake-result-card">
      <div className="section-head">
        <div>
          <span className="card-kicker">Результаты (Отчёт)</span>
          <h2>Первый приём: рабочая карта</h2>
        </div>
        <span className="lab-badge">требует проверки специалистом</span>
      </div>
      <p>
        Это предварительное понимание: базовая точка состояния, эмоциональная группировка Bach и
        запрос на дальнейшую работу. Материал не заменяет медицинскую помощь.
      </p>

      <div className="lab-result-grid">
        {baselineItems.map(([label, value]) => (
          <div className="lab-result-item" key={label}>
            <span>{label}</span>
            <strong>{value ?? "не указано"}/10</strong>
          </div>
        ))}
        <div className="lab-result-item">
          <span>Главный триггер</span>
          <strong>{getAnswerText(baseline.trigger) || "требует уточнения"}</strong>
        </div>
        <div className="lab-result-item">
          <span>Главная опора</span>
          <strong>{getAnswerText(baseline.relief) || "требует уточнения"}</strong>
        </div>
        {hasAnswerContent(baseline.freeComment) ? (
          <div className="lab-result-item wide-result-item">
            <span>Комментарий клиента</span>
            <strong>{getAnswerText(baseline.freeComment)}</strong>
          </div>
        ) : null}
      </div>

      <div className="intake-report-section">
        <h3>Bach: предварительная группировка</h3>
        <div className="remedy-candidate-list">
          {candidates.length > 0 ? (
            candidates.map((item) => (
              <div className="remedy-candidate" key={item.remedy}>
                <strong>{item.remedy}</strong>
                <span>{item.theme}</span>
                <p>{item.explanation} Кандидат для проверки со специалистом.</p>
              </div>
            ))
          ) : (
            <p>Ответов Bach пока недостаточно для устойчивой группировки.</p>
          )}
        </div>
      </div>

      <div className="intake-report-section">
        <h3>Терапевтический запрос</h3>
        <p>{getAnswerText(request.formulatedRequest) || "Запрос требует уточнения со специалистом."}</p>
        <div className="lab-result-grid">
          <div className="lab-result-item">
            <span>Что хочется изменить</span>
            <strong>{getAnswerText(request.desiredChange) || "не указано"}</strong>
          </div>
          <div className="lab-result-item">
            <span>Результат на 1-3 сессии</span>
            <strong>{getAnswerText(request.desiredResult1to3Sessions) || "не указано"}</strong>
          </div>
          <div className="lab-result-item">
            <span>Что отслеживать</span>
            <strong>Силу проблемы, ресурс, тревогу, усталость и влияние на жизнь.</strong>
          </div>
          <div className="lab-result-item">
            <span>Подходящая поддержка</span>
            <strong>{getAnswerText(request.preferredSupport) || "не указано"}</strong>
          </div>
        </div>
      </div>

      <div className="next-step-actions">
        <button className="primary-btn" type="button">Запросить отчёт специалиста</button>
        <button className="secondary-btn" type="button">Записаться на консультацию</button>
        <button className="secondary-btn" type="button">Пройти повторный срез через 7-10 дней</button>
      </div>
    </article>
  );
}

function ReportOverview({ advancedAiResult, onSelectReport, firstIntakeResult, onStartSelfAnalysis }) {
  return (
    <section className="results-notebook-shell">
      <div className="results-notebook-main">
        <ResultsNotebookPanel
          firstIntakeResult={firstIntakeResult}
          onSelectReport={onSelectReport}
        />
        <AdvancedAiResultBlock result={advancedAiResult} />
      </div>
      <ResultsInteractivePanel
        advancedAiResult={advancedAiResult}
        firstIntakeResult={firstIntakeResult}
        onSelectReport={onSelectReport}
        onStartSelfAnalysis={onStartSelfAnalysis}
      />
    </section>
  );
}

function ReportDetail({ activeTab, advancedAiResult, firstIntakeResult, onSelectReport }) {
  const detail = reportDetails[activeTab] || reportDetails["Диагностика эксперта"];

  if (activeTab === "Расширенный ИИ-анализ" && advancedAiResult) {
    return (
      <>
        <ReportsMenu
          activeTab={activeTab}
          hasAdvancedAiResult
          hasFirstIntakeResult={Boolean(firstIntakeResult)}
          onSelectReport={onSelectReport}
        />
        <AdvancedAiResultBlock result={advancedAiResult} />
      </>
    );
  }

  if (activeTab === "Самоотчёт" && firstIntakeResult) {
    return (
      <>
        <ReportsMenu
          activeTab={activeTab}
          hasAdvancedAiResult={Boolean(advancedAiResult)}
          hasFirstIntakeResult
          onSelectReport={onSelectReport}
        />
        <FirstIntakeResultBlock result={firstIntakeResult} />
      </>
    );
  }

  return (
    <>
      <ReportsMenu
        activeTab={activeTab}
        hasAdvancedAiResult={Boolean(advancedAiResult)}
        hasFirstIntakeResult={Boolean(firstIntakeResult)}
        onSelectReport={onSelectReport}
      />
      <article className="card lab-report-card">
        <div className="section-head">
          <div>
            <span className="card-kicker">Раздел отчёта</span>
            <h2>{detail.title}</h2>
          </div>
          <span className="lab-badge">{activeTab}</span>
        </div>
        <p>{detail.text}</p>
        <div className="lab-result-grid">
          {detail.items.map((item) => (
            <div className="lab-result-item" key={item}>
              <span>Показатель</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

export default function ExpertAnalysis({
  activeTab = "Меню отчётов",
  advancedAiResult = null,
  clientOverride = null,
  firstIntakeResult = null,
  onSelectReport,
  onStartSelfAnalysis,
}) {
  const cabinetClient = clientOverride || client;
  const savedFirstIntakeResult = firstIntakeResult || readFirstIntakeResult();
  const savedAdvancedAiResult = advancedAiResult || readAdvancedAiAnalysisResult();

  if (!cabinetClient.hasCompletedFirstConsultation && !savedFirstIntakeResult) {
    return <EmptyFirstConsultation onStartSelfAnalysis={onStartSelfAnalysis} />;
  }

  if (activeTab === "Меню отчётов") {
    return (
      <ReportOverview
        activeTab={activeTab}
        advancedAiResult={savedAdvancedAiResult}
        firstIntakeResult={savedFirstIntakeResult}
        onSelectReport={onSelectReport}
        onStartSelfAnalysis={onStartSelfAnalysis}
      />
    );
  }

  return (
    <ReportDetail
      activeTab={activeTab}
      advancedAiResult={savedAdvancedAiResult}
      firstIntakeResult={savedFirstIntakeResult}
      onSelectReport={onSelectReport}
    />
  );
}
