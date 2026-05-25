import React from "react";
import { DynamicsChart, ThemeBars } from "../components/Charts.jsx";
import { FormulaList, MetricCard } from "../components/Cards.jsx";
import { overview } from "../data/mockData.js";

export default function Overview() {
  return (
    <>
      <div className="metrics-grid">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="card">
          <div className="section-head">
            <div>
              <h2>Динамика</h2>
              <p>Снижение напряжения и восстановление ресурса по последним срезам.</p>
            </div>
          </div>
          <DynamicsChart points={overview.dynamics} />
        </article>

        <article className="card">
          <h2>Ведущие темы</h2>
          <ThemeBars items={overview.themes} />
        </article>
      </div>

      <article className="card">
        <h2>Формула поддержки</h2>
        <p className="subtitle">Повторная проверка через 7 дней.</p>
        <FormulaList items={overview.formula} />
      </article>
    </>
  );
}
