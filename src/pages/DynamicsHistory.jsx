import React from "react";
import { DynamicsChart } from "../components/Charts.jsx";
import { history, overview } from "../data/mockData.js";

export default function DynamicsHistory() {
  return (
    <>
      <article className="card">
        <h2>Динамика / История</h2>
        <p>История срезов показывает, как меняются сила проблемы и общий ресурс.</p>
        <DynamicsChart points={overview.dynamics} />
      </article>

      <div className="history-list">
        {history.map((item) => (
          <article className="card history-item" key={item.date}>
            <div>
              <span>{item.date}</span>
              <h3>{item.event}</h3>
            </div>
            <div className="history-values">
              <strong className="orange">{item.problem}/10</strong>
              <strong className="blue">{item.resource}/10</strong>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
