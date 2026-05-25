import React, { useMemo } from "react";
import { DynamicsChart } from "../components/Charts.jsx";
import { overview } from "../data/mockData.js";
import { listAnalysisRunsForUser } from "../lib/clientRepository.js";

export default function DynamicsHistory({ user }) {
  const analysisRuns = useMemo(() => listAnalysisRunsForUser(user), [user]);

  return (
    <>
      <article className="card">
        <h2>Динамика / История</h2>
        <p>История срезов показывает, как меняются сила проблемы и общий ресурс. Данные фильтруются по текущему пользователю.</p>
        <DynamicsChart points={overview.dynamics} />
      </article>

      <div className="history-list">
        {analysisRuns.length === 0 ? (
          <article className="card history-item">
            <div>
              <span>Нет сохранённых анализов</span>
              <h3>Пройдите первый самоанализ</h3>
            </div>
          </article>
        ) : (
          analysisRuns.map((item) => (
            <article className="card history-item" key={item.id}>
              <div>
                <span>{item.createdAt}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
              <div className="history-values">
                {item.problem !== null ? <strong className="orange">{item.problem}/10</strong> : null}
                {item.resource !== null ? <strong className="blue">{item.resource}/10</strong> : null}
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
