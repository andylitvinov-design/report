import React from 'react';
import alchemyData from '../../design/alchemy-v1-data.json';
import './alchemy-report.css';
import './alchemy-report-ornate.css';

export const ALCHEMY_PAGE_ORDER = ['1', '2', '3', '4'];

const REMEDY_AXIS = [
  { remedy: 'Mustard', element: 'Вода', score: '2.4', glyph: '☿', code: 'MU' },
  { remedy: 'Scleranthus', element: 'Дерево', score: '2.6', glyph: '♃', code: 'SC' },
  { remedy: 'Aspen', element: 'Огонь', score: '2.8', glyph: '☉', code: 'AS' },
  { remedy: 'Sweet Chestnut', element: 'Земля', score: '2.8', glyph: '♁', code: 'SW' },
  { remedy: 'Cherry Plum', element: 'Металл', score: '3.3', glyph: '☽', code: 'CH' },
];

function displayText(value) {
  if (value && typeof value === 'object') {
    return value.displayText || value.fullText || '';
  }

  return value || '';
}

function DaoSeal() {
  return (
    <div className="alchemy-seal" aria-label="DAO seal">
      <div className="alchemy-seal-ring" aria-hidden="true" />
      <div className="alchemy-seal-triangle" aria-hidden="true" />
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
      <text x="110" y="130" textAnchor="middle">3.3</text>
    </svg>
  );
}

function RitualBottomAccents() {
  return (
    <div className="alchemy-ritual-accents" aria-hidden="true">
      <div className="alchemy-accent alchemy-accent--botanical">✧</div>
      <div className="alchemy-accent alchemy-accent--crystal">◇</div>
      <div className="alchemy-accent alchemy-accent--bottle" />
      <div className="alchemy-accent alchemy-accent--bowl" />
    </div>
  );
}

function PageShell({ pageNumber, title, subtitle, type, children, accent = null }) {
  return (
    <section className={`alchemy-page alchemy-page-${pageNumber} alchemy-page--${type}`} data-page-type={type}>
      <div className="alchemy-page-border" aria-hidden="true" />
      <div className="alchemy-corner-square alchemy-corner-square--top" aria-hidden="true" />
      <div className="alchemy-corner-square alchemy-corner-square--bottom" aria-hidden="true" />
      <header className="alchemy-header">
        <div className="alchemy-header-copy">
          <p className="alchemy-brand">{alchemyData.template.title}</p>
          <p className="alchemy-subtitle">{subtitle}</p>
          <h2>{pageNumber}. {title}</h2>
        </div>
        <DaoSeal />
      </header>
      {accent}
      <div className="alchemy-page-content">{children}</div>
      <RitualBottomAccents />
      <footer className="alchemy-footer">Страница {pageNumber} / 4 · {alchemyData.template.contact}</footer>
    </section>
  );
}

function WhiteInsert({ as: Tag = 'article', className = '', children }) {
  return <Tag className={`alchemy-white-insert ${className}`}>{children}</Tag>;
}

function PageOne({ data }) {
  const text = displayText(data.mainText).replace(/^Смотрю\.\s*/u, '');

  return (
    <PageShell
      pageNumber="1"
      title={data.title}
      subtitle={data.subtitle}
      type="diagnosis"
      accent={<PentagramMark />}
    >
      <div className="alchemy-diagnosis-layout">
        <WhiteInsert className="alchemy-primary-letter">
          <p className="alchemy-live-start">Смотрю.</p>
          <p>{text}</p>
        </WhiteInsert>
        <aside className="alchemy-side-notes" aria-label="Ключевые показатели">
          {data.sideNotes.map((item) => (
            <WhiteInsert as="div" className="alchemy-side-note" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </WhiteInsert>
          ))}
        </aside>
      </div>
    </PageShell>
  );
}

function PageTwo({ data }) {
  const cardsByRemedy = Object.fromEntries(data.cards.map((card) => [card.remedy, card]));

  return (
    <PageShell pageNumber="2" title={data.title} subtitle={data.subtitle} type="remedy-set">
      <section className="alchemy-remedy-map" aria-label="Карта подходящих эссенций">
        <div className="alchemy-remedy-axis" aria-hidden="true" />
        {REMEDY_AXIS.map((axisItem, index) => {
          const card = cardsByRemedy[axisItem.remedy];

          return (
            <div className={`alchemy-map-row alchemy-map-row-${index + 1}`} key={axisItem.remedy}>
              <div className="alchemy-map-glyph" aria-hidden="true">
                <span>{axisItem.glyph}</span>
                <small>{axisItem.code}</small>
              </div>
              <WhiteInsert className="alchemy-map-note">
                <p className="alchemy-remedy-element">{axisItem.element} {axisItem.score}</p>
                <h3>{card.remedy}</h3>
                <p className="alchemy-remedy-marker">{card.marker}</p>
                <p>{displayText(card.text)}</p>
              </WhiteInsert>
            </div>
          );
        })}
      </section>
      <div className="alchemy-map-conclusions">
        <WhiteInsert className="alchemy-wide-insert">
          <h3>Что говорит набор</h3>
          <p>{displayText(data.summary)}</p>
        </WhiteInsert>
        <WhiteInsert className="alchemy-wide-insert alchemy-warm-insert">
          <h3>Что происходит внутри</h3>
          <p>{displayText(data.innerMechanism)}</p>
        </WhiteInsert>
      </div>
    </PageShell>
  );
}

function PageThree({ data }) {
  const flow = [
    ['свет', 'Mustard'],
    ['границы', 'Cherry Plum'],
    ['выбор', 'Scleranthus'],
    ['защита', 'Aspen'],
    ['сохранить себя', 'Sweet Chestnut'],
  ];

  return (
    <PageShell pageNumber="3" title={data.title} subtitle={data.subtitle} type="prescription">
      <section className="alchemy-prescription-chain" aria-label="Формула назначения">
        {flow.map(([quality, remedy], index) => (
          <div className={`alchemy-chain-step alchemy-chain-step-${index + 1}`} key={quality}>
            <span>{index + 1}</span>
            <strong>{quality}</strong>
            <small>{remedy}</small>
          </div>
        ))}
      </section>

      <WhiteInsert className="alchemy-prescription-panel">
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
        <p>{displayText(data.intake)}</p>
        <h4>Курс</h4>
        <p>{displayText(data.course)}</p>
        <h4>Повторная проверка</h4>
        <p>{displayText(data.followUp)}</p>
        <p className="alchemy-closing-line">{displayText(data.closingLine)}</p>
      </WhiteInsert>
    </PageShell>
  );
}

function PageFour({ data }) {
  return (
    <PageShell pageNumber="4" title={data.title} subtitle={data.subtitle} type="messages-future">
      <section className="alchemy-integration-flow" aria-label="Послания препаратов">
        {data.messages.map((item, index) => (
          <WhiteInsert className={`alchemy-message-note alchemy-message-note-${index + 1}`} key={item.remedy}>
            <h3>{item.remedy}</h3>
            <p className="alchemy-transformation">{item.transformation}</p>
            <p>{displayText(item.message)}</p>
          </WhiteInsert>
        ))}
      </section>
      <WhiteInsert className="alchemy-wide-insert alchemy-future-note">
        <h3>Чего ожидать</h3>
        <p>{displayText(data.whatToExpect)}</p>
      </WhiteInsert>
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
