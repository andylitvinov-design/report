import React from "react";
import { FormulaList } from "../components/Cards.jsx";
import { overview, recommendations } from "../data/mockData.js";

export default function Recommendations() {
  return (
    <>
      <article className="card">
        <h2>Рекомендации</h2>
        <p>
          MVP показывает короткий план поддержки: формула Bach, практические шаги и срок повторной проверки.
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
        <h2>Ритм наблюдения</h2>
        <p>Повторный самоанализ через 7 дней, затем экспертная проверка динамики и коррекция формулы.</p>
      </article>
    </>
  );
}
