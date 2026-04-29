import React from 'react';
import { ReportFrame, splitRecommendation } from './report-kit';

function RemedyVisual({ item }) {
  if (item.image) {
    return <img className="remedy-image" src={item.image} alt={splitRecommendation(item)} />;
  }

  const initials = item.name
    .split(/\s+/)
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="remedy-placeholder" aria-hidden="true">
      <div className="remedy-placeholder-circle">{initials}</div>
    </div>
  );
}

export function ReportPage4({ brand, data }) {
  const { page, sections, intro, remedies, followup } = data;

  return (
    <ReportFrame brand={brand} page={page} followup={followup} pageClassName="report-page-remedies">
      <section className="soft-card intro-card">
        <p className="card-title">{sections.intro}</p>
        <p className="card-text">{intro}</p>
      </section>

      <section className="remedy-grid">
        {remedies.map((item, index) => (
          <article
            className={`soft-card remedy-card${index === remedies.length - 1 ? ' remedy-card-wide' : ''}`}
            key={`${item.name}-${item.level}`}
          >
            <div className="remedy-card-top">
              <RemedyVisual item={item} />
              <div className="remedy-head">
                <p className="remedy-title">{splitRecommendation(item)}</p>
                <p className="remedy-kind">{item.kind}</p>
                <p className="remedy-usage">{item.usage}</p>
              </div>
            </div>

            <p className="remedy-description">{item.description}</p>

            <div className="remedy-benefits">
              <p className="card-title">{sections.effect}</p>
              <ul className="benefit-list">
                {item.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </ReportFrame>
  );
}
