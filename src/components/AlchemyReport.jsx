import React from 'react';
import alchemyData from '../../design/alchemy-v1-data.json';
import './alchemy-report.css';

export const ALCHEMY_PAGE_ORDER = ['1', '2', '3', '4'];

function DaoSeal() {
  return (
    <div className="alchemy-seal" aria-hidden="true">
      <div className="alchemy-seal-triangle" />
      <span>DAO</span>
    </div>
  );
}

function PentagramMark() {
  return (
    <svg className="alchemy-pentagram" viewBox="0 0 220 220" aria-hidden="true">
      <circle cx="110" cy="110" r="96" />
      <circle cx="110" cy="110" r="58" />
      <path d="M110 19 L134 88 L207 88 L148 130 L170 200 L110 157 L50 200 L72 130 L13 88 L86 88 Z" />
      <circle cx="110" cy="110" r="31" />
      <text x="110" y="104" textAnchor="middle">DAO</text>
      <text x="110" y="130" textAnchor="middle">3.4</text>
    </svg>
  );
}

function PageShell({ pageNumber, title, subtitle, children, accent = null }) {
  return (
    <section className="alchemy-page">
      <div className="alchemy-page-border" />
      <header className="alchemy-header">
        <div>
          <p className="alchemy-brand">{alchemyData.template.title}</p>
          <p className="alchemy-subtitle">{subtitle}</p>
          <h2>{pageNumber}. {title}</h2>
        </div>
        <DaoSeal />
      </header>
      {accent}
      <div className="alchemy-page-content">{children}</div>
      <footer className="alchemy-footer">Страница {pageNumber} / 4 · {alchemyData.template.contact}</footer>
    </section>
  );
}

function WhiteNote({ className = '', children }) {
  return <article className={`alchemy-white-note ${className}`}>{children}</article>;
}

function PageOne({ data }) {
  return (
    <PageShell pageNumber="1" title={data.title} subtitle={data.subtitle} accent={<PentagramMark />}>
      <div className="alchemy-diagnosis-layout">
        <WhiteNote className="alchemy-main-letter">
          <p className="alchemy-live-start">Смотрю.</p>
          <p>{data.mainText.replace(/^Смотрю\.\s*/u, '')}</p>
        </WhiteNote>
        <aside className="alchemy-side-notes">
          {data.sideNotes.map((item) => (
            <div className="alchemy-side-note" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </aside>
      </div>
    </PageShell>
  );
}

function PageTwo({ data }) {
  return (
    <PageShell pageNumber="2" title={data.title} subtitle={data.subtitle}>
      <div className="alchemy-decode-grid">
        {data.cards.map((card) => (
          <WhiteNote className="alchemy-remedy-decode" key={card.remedy}>
            <div className="alchemy-remedy-medallion">{card.remedy.slice(0, 2)}</div>
            <p className="alchemy-remedy-element">{card.element}</p>
            <h3>{card.remedy}</h3>
            <p className="alchemy-remedy-marker">{card.marker}</p>
            <p>{card.text}</p>
          </WhiteNote>
        ))}
      </div>
      <WhiteNote className="alchemy-wide-note">
        <h3>Что говорит набор</h3>
        <p>{data.summary}</p>
      </WhiteNote>
      <WhiteNote className="alchemy-wide-note alchemy-inner-mechanism">
        <h3>Что происходит внутри</h3>
        <p>{data.innerMechanism}</p>
      </WhiteNote>
    </PageShell>
  );
}

function PageThree({ data }) {
  const flow = [
    ['надежда', 'Gorse'],
    ['границы', 'Centaury'],
    ['смелость', 'Mimulus'],
    ['ритм', 'Impatiens'],
  ];

  return (
    <PageShell pageNumber="3" title={data.title} subtitle={data.subtitle}>
      <section className="alchemy-flow">
        {flow.map(([quality, remedy], index) => (
          <React.Fragment key={quality}>
            <div className={`alchemy-flow-pill alchemy-flow-${index + 1}`}>
              <strong>{quality}</strong>
              <span>{remedy}</span>
            </div>
            {index < flow.length - 1 ? <div className="alchemy-flow-arrow">→</div> : null}
          </React.Fragment>
        ))}
      </section>

      <WhiteNote className="alchemy-prescription-note">
        <h3>Формула назначения</h3>
        <p className="alchemy-formula-line">{data.formula.remedies}</p>
        <p className="alchemy-formula-line muted">{data.formula.qualities}</p>

        <div className="alchemy-prescription-columns">
          <div>
            <h4>#1. В первую очередь</h4>
            {data.primary.map((item) => <p key={item.remedy}>{item.remedy} — {item.marker}</p>)}
          </div>
          <div>
            <h4>#2. Дополнительно</h4>
            {data.additional.map((item) => <p key={item.remedy}>{item.remedy} — {item.marker}</p>)}
          </div>
        </div>

        <h4>Принимать</h4>
        <p>{data.intake}</p>
        <h4>Курс</h4>
        <p>{data.course}</p>
        <h4>Повторная проверка</h4>
        <p>{data.followUp}</p>
        <p className="alchemy-closing-line">{data.closingLine}</p>
      </WhiteNote>
    </PageShell>
  );
}

function PageFour({ data }) {
  return (
    <PageShell pageNumber="4" title={data.title} subtitle={data.subtitle}>
      <div className="alchemy-message-grid">
        {data.messages.map((item) => (
          <WhiteNote className="alchemy-message-card" key={item.remedy}>
            <h3>{item.remedy}</h3>
            <p className="alchemy-transformation">{item.transformation}</p>
            <p>{item.message}</p>
          </WhiteNote>
        ))}
      </div>
      <WhiteNote className="alchemy-wide-note alchemy-future-note">
        <h3>Чего ожидать</h3>
        <p>{data.whatToExpect}</p>
      </WhiteNote>
      <div className="alchemy-final-formula">{data.finalFormula}</div>
    </PageShell>
  );
}

function renderAlchemyPage(pageId) {
  const page = alchemyData.pages[pageId];
  if (!page) return null;

  if (pageId === '1') return <PageOne data={page} />;
  if (pageId === '2') return <PageTwo data={page} />;
  if (pageId === '3') return <PageThree data={page} />;
  return <PageFour data={page} />;
}

export function AlchemyReport({ pageId = 'all' }) {
  if (pageId === 'all') {
    return (
      <div className="page-stack alchemy-page-stack">
        {ALCHEMY_PAGE_ORDER.map((id) => <div key={id}>{renderAlchemyPage(id)}</div>)}
      </div>
    );
  }

  return renderAlchemyPage(pageId);
}
