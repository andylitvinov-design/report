import React from "react";

export function MetricCard({ label, value, tone }) {
  return (
    <article className="card metric-card">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </article>
  );
}

export function FormulaList({ items }) {
  return (
    <div className="formula-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function RemedyResultList({ items }) {
  if (!items.length) {
    return <p className="empty-result">Пока недостаточно отмеченных ответов для этой группы.</p>;
  }

  return (
    <div className="remedy-result-list">
      {items.map((item) => (
        <article className="remedy-result" key={item.remedy}>
          <div>
            <strong>{item.remedy}</strong>
            <span>{item.theme}</span>
          </div>
          <b>{item.total}</b>
          <p>{item.explanation}</p>
          <small>{item.confirmation}</small>
        </article>
      ))}
    </div>
  );
}

export function MiniDynamicsIndicator({ point, fallbackLabel }) {
  const hasValue = typeof point?.value === "number";
  const style = hasValue ? { "--value": `${Math.max(0, Math.min(100, point.value))}%` } : undefined;

  return (
    <div className={hasValue ? "mini-dynamics-indicator" : "mini-dynamics-indicator empty"} style={style}>
      <span className="mini-dynamics-ring" aria-hidden="true">
        <b>{hasValue ? point.value : "—"}</b>
      </span>
      <small>{point?.date || fallbackLabel}</small>
    </div>
  );
}

export function AnalysisMenuCard({ activeId, group, onSelectAnalysis, onStartAnalysis }) {
  return (
    <section className="context-menu-group" aria-labelledby={`analysis-group-${group.group}`}>
      <h3 id={`analysis-group-${group.group}`}>{group.group}</h3>
      <div className="context-analysis-list">
        {group.items.map((item) => {
          const isActive = item.id === activeId;
          const isEmpty = item.status === "empty";
          const hasSecondPoint = Boolean(item.last);

          return (
            <button
              className={[
                "context-analysis-item",
                isActive ? "active" : "",
                isEmpty ? "not-completed" : "",
              ].filter(Boolean).join(" ")}
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              type="button"
            >
              <span className="context-analysis-title">{item.title}</span>
              <span className="context-analysis-status">
                {isEmpty ? "не пройден" : hasSecondPoint ? "динамика" : "первый результат"}
              </span>
              <span className="context-analysis-dynamics">
                <MiniDynamicsIndicator point={item.first} fallbackLabel={isEmpty ? "не пройден" : "первая дата"} />
                <MiniDynamicsIndicator point={item.last} fallbackLabel={hasSecondPoint ? "последняя дата" : "пройти тест"} />
              </span>
              {isEmpty || !hasSecondPoint ? (
                <span
                  className="context-analysis-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    onStartAnalysis(item.id);
                  }}
                  role="button"
                  tabIndex={-1}
                >
                  {isEmpty ? "пройти анализ" : "пройти тест"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function AnalysisResultPanel({
  analysis,
  onSelectAnalysis,
  onSpecialistRequest,
  onStartAnalysis,
}) {
  if (!analysis) {
    return null;
  }

  const hasResult = analysis.status !== "empty";

  if (!hasResult) {
    return (
      <article className="card analysis-result-panel empty-analysis-panel">
        <p className="card-kicker">Анализ ещё не пройден</p>
        <h2>{analysis.title}</h2>
        <p>{analysis.benefit || analysis.summary}</p>
        <div className="analysis-result-actions">
          <button className="primary-btn" onClick={() => onStartAnalysis(analysis.id)} type="button">
            Пройти анализ
          </button>
          <button className="secondary-btn" onClick={() => onSelectAnalysis("general-state")} type="button">
            Сначала посмотреть общее состояние
          </button>
        </div>
      </article>
    );
  }

  const direction = analysis.first && analysis.last
    ? `${analysis.first.value} → ${analysis.last.value}`
    : "нужен повторный результат";

  return (
    <article className="card analysis-result-panel">
      <header className="analysis-result-head">
        <div>
          <p className="card-kicker">Выбранный анализ</p>
          <h2>{analysis.title}</h2>
          <p>{analysis.summary}</p>
        </div>
        <div className="analysis-result-score">
          <span>Текущий результат</span>
          <strong>{analysis.last?.value ?? analysis.first?.value ?? "—"}</strong>
        </div>
      </header>

      <section className="analysis-result-summary" aria-label="Краткое резюме">
        <div>
          <span>Краткое резюме</span>
          <p>{analysis.currentResult}</p>
        </div>
        <div>
          <span>Динамика</span>
          <strong>{direction}</strong>
          <p>
            {analysis.first?.date || "первая дата не задана"} · {analysis.last?.date || "пройти повторный тест"}
          </p>
        </div>
      </section>

      <section className="analysis-zones" aria-label="Основные зоны и шкалы">
        <h3>Основные зоны / шкалы</h3>
        <div className="analysis-zone-grid">
          {analysis.zones.map((zone) => (
            <div key={zone.label}>
              <span>{zone.label}</span>
              <strong>{zone.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="analysis-recommendations" aria-label="Рекомендации">
        <h3>Рекомендации</h3>
        <ul>
          {analysis.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="analysis-cta-grid" aria-label="Следующие действия">
        <button className="analysis-cta-card primary" onClick={onSpecialistRequest} type="button">
          <span>Пройти консультацию у специалиста</span>
          <small>Проверить выводы и выбрать следующий шаг</small>
        </button>
        <button className="analysis-cta-card" onClick={() => onStartAnalysis(analysis.id)} type="button">
          <span>Пройти повторный тест</span>
          <small>Добавить вторую точку динамики</small>
        </button>
        <button className="analysis-cta-card" onClick={() => onSelectAnalysis("advanced-3")} type="button">
          <span>Получить расширенный анализ</span>
          <small>Уточнить шкалы и рабочую карту</small>
        </button>
      </section>
    </article>
  );
}

export function QuestionCard({ index, question, score, onScoreChange, comment, onCommentChange }) {
  return (
    <article className="card question-card">
      <div className="question-head">
        <span className="question-number">{index + 1}</span>
        <div>
          <strong>{question.remedy}</strong>
          <span>{question.theme}</span>
        </div>
      </div>
      <h3>{question.text}</h3>
      <div className="score-grid" role="group" aria-label={`Оценка вопроса ${index + 1}`}>
        {[0, 1, 2, 3, 4, 5].map((value) => (
          <button
            className={score === value ? "score active" : "score"}
            key={value}
            onClick={() => onScoreChange(question.id, value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Комментарий / образ / телесное ощущение</span>
        <input
          onChange={(event) => onCommentChange(question.id, event.target.value)}
          placeholder="Короткая заметка"
          value={comment}
        />
      </label>
    </article>
  );
}
