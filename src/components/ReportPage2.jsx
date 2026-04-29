import React from 'react';
import { ReportFrame, splitRecommendation } from './report-kit';

export function ReportPage2({ brand, data }) {
  const { page, sections, dynamics, leftCards, elements, recommendations, followup } = data;
  const [stateCard, problemCard] = leftCards;

  return (
    <ReportFrame brand={brand} page={page} followup={followup} pageClassName="report-page-two">
      <div className="report-body report-page-two-body">
        <div className="main-column">
          <article className="soft-card summary-card page-two-card">
            <p className="card-title">{stateCard.title}</p>
            <p className="card-text">{stateCard.text}</p>
          </article>

          <article className="soft-card issue-card page-two-card">
            <p className="card-title">{problemCard.title}</p>
            <p className="card-text">{problemCard.text}</p>
            <p className="inline-task">
              <span>{sections.taskLabel}</span> {problemCard.task}
            </p>
          </article>
        </div>

        <aside className="side-column">
          <section className="soft-card side-card page-two-dynamics">
            <p className="card-title">{sections.dynamics}</p>
            <div className="metric-list">
              {dynamics.map((item) => (
                <div className="metric-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="soft-card side-card page-two-elements">
            <p className="card-title">{sections.elements}</p>
            <div className="element-list">
              {elements.map((item) => (
                <div className="element-row" key={item.name}>
                  <div className="element-copy">
                    <strong>{item.name}</strong>
                    <span>{item.status}</span>
                  </div>
                  <div className="element-value">{item.value}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="solution-block page-two-solution">
        <div className="solution-heading">
          <p className="eyebrow">{sections.solution}</p>
        </div>

        <div className="soft-card table-card page-two-table-card">
          <div className="recommendation-table">
            {recommendations.map((item, index) => (
              <div className="recommendation-row" key={`${item.name}-${item.level}-${index}`}>
                <div className="recommendation-name">{splitRecommendation(item)}</div>
                <div className="recommendation-note">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ReportFrame>
  );
}
