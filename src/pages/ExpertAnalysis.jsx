import React from "react";
import { expertBlocks } from "../data/mockData.js";

export default function ExpertAnalysis() {
  return (
    <>
      <article className="card">
        <h2>Экспертная картина</h2>
        <p>
          Анализ соединяет самооценку клиента, повторяющиеся Bach-темы и текущий уровень ресурса.
          Это рабочая версия интерпретации перед финальной рекомендацией.
        </p>
      </article>

      <div className="analysis-grid">
        {expertBlocks.map((block) => (
          <article className="card analysis-card" key={block.title}>
            <span>{block.title}</span>
            <h2>{block.remedy}</h2>
            <p>{block.text}</p>
          </article>
        ))}
      </div>

      <article className="card">
        <h2>Проверочные вопросы</h2>
        <div className="check-list">
          <p>Сон и восстановление стали лучше за последние 7 дней?</p>
          <p>Есть ли снижение внутреннего шума после письменной фиксации мыслей?</p>
          <p>Какая нагрузка может быть снята без потери результата?</p>
        </div>
      </article>
    </>
  );
}
