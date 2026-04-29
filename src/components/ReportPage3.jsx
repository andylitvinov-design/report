import React from 'react';
import { ReportFrame } from './report-kit';

export function ReportPage3({ brand, data }) {
  const { page, sections, stage, overviewCards, phaseScale, markers, actions, supportPanel, followup } =
    data;

  return (
    <ReportFrame brand={brand} page={page} followup={followup} pageClassName="report-page-stage">
      <div className="report-body report-body-stage">
        <div className="main-column">
          <article className="soft-card stage-hero-card">
            <p className="card-title">{sections.currentStage}</p>
            <p className="stage-name">{stage.name}</p>
            <p className="stage-summary">{stage.summary}</p>
          </article>

          {overviewCards.map((card) => (
            <article className="soft-card" key={card.title}>
              <p className="card-title">{card.title}</p>
              <p className="card-text">{card.text}</p>
            </article>
          ))}

          <section className="soft-card action-card">
            <p className="card-title">{sections.actions}</p>
            <div className="action-list">
              {actions.map((item, index) => (
                <div className="action-item" key={`${item.title}-${index}`}>
                  <div className="action-index">0{index + 1}</div>
                  <div className="action-copy">
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="side-column">
          <section className="soft-card side-card">
            <p className="card-title">{sections.phaseScale}</p>
            <div className="phase-scale">
              {phaseScale.map((phase) => (
                <div className={`phase-pill ${phase.active ? 'active' : ''}`} key={phase.name}>
                  <strong>{phase.name}</strong>
                  <span>{phase.state}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="soft-card side-card">
            <p className="card-title">{sections.markers}</p>
            <div className="marker-list">
              {markers.map((marker) => (
                <div className="marker-item" key={marker}>
                  {marker}
                </div>
              ))}
            </div>
          </section>

          <section className="soft-card side-card">
            <p className="card-title">{supportPanel.title}</p>
            <div className="support-list">
              {supportPanel.items.map((item) => (
                <div className="support-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <p className="support-note">{supportPanel.note}</p>
          </section>
        </aside>
      </div>
    </ReportFrame>
  );
}
