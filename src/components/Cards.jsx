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
