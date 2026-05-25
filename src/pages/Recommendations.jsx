import React from "react";
import { FormulaList } from "../components/Cards.jsx";
import { overview, recommendations } from "../data/mockData.js";

export default function Recommendations() {
  return (
    <>
      <article className="card">
        <h2>Текущая формула поддержки</h2>
        <p>
          Раздел назначения показывает активную формулу поддержки, практические шаги и срок повторной проверки.
        </p>
        <FormulaList items={overview.formula} />
      </article>

      <div className="recommendation-list">
        {recommendations.map((item) => (
          <article className="card recommendation-card" key={item.title}>
            <div>
              <h2>{item.title}</h2>
              <span>{item.label}</span>
            </div>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <article className="card soft-card">
        <h2>Что отслеживать</h2>
        <p>Повторный самоанализ через 7 дней, затем экспертная проверка динамики и корректировка формулы.</p>
      </article>
    </>
  );
}
