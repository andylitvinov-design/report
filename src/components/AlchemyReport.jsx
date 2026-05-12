import React from 'react';
import alchemyData from '../../design/alchemy-v1-data.json';
import './alchemy-report.css';
import './alchemy-report-ornate.css';

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
    <section className={`alchemy-page alchemy-page-${pageNumber}`}>
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

const REMEDY_AXIS = [
  { element: 'Вода', score: '2.4', remedy: 'Mustard', quality: 'дефицит света', symbol: '☿' },
  { element: 'Дерево', score: '2.6', remedy: 'Scleranthus', quality: 'колебание', symbol: '♃' },
  { element: 'Огонь', score: '2.8', remedy: 'Aspen', quality: 'тревожность', symbol: '☉' },
  { element: 'Земля', score: '2.8', remedy: 'Sweet Chestnut', quality: 'опыт предела', symbol: '♁' },
  { element: 'Металл', score: '3.3', remedy: 'Cherry Plum', quality: 'контроль', symbol: '☽' },
];

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
  const cardsByRemedy = Object.fromEntries(data.cards.map((card) => [card.remedy, card]));

  return (
    <PageShell pageNumber="2" title={data.title} subtitle={data.subtitle}>
      <section className="alchemy-remedy-map" aria-label="У-Син карта назначения">
        <div className="alchemy-map-orbit" aria-hidden="true">
          <span className="alchemy-map-sun">☉</span>
          <span className="alchemy-map-moon">☽</span>
          <span className="alchemy-map-triangle">△</span>
        </div>
        <div className="alchemy-map-axis" aria-hidden="true" />
        {REMEDY_AXIS.map((item, index) => {
          const card = cardsByRemedy[item.remedy];

          return (
            <div className={`alchemy-map-row alchemy-map-row-${index + 1}`} key={item.remedy}>
              <div className="alchemy-map-glyph" aria-hidden="true">{item.symbol}</div>
              <WhiteNote className="alchemy-map-note">
                <p className="alchemy-remedy-element">{item.element} {item.score}</p>
                <h3>{item.remedy}</h3>
                <p className="alchemy-remedy-marker">{item.quality}</p>
                <p>{card.text}</p>
              </WhiteNote>
            </div>
          );
        })}
      </section>
      <WhiteNote className="alchemy-bottom-conclusion">
        <h3>Вывод карты</h3>
        <p>Главная нехватка — Вода и Дерево: жизненность + спокойное направление.</p>
      </WhiteNote>
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
    <PageShell pageNumber="3" title={data.title} subtitle={data.subtitle}>
      <section className="alchemy-ritual-chain" aria-label="Формула назначения">
        {flow.map(([quality, remedy], index) => (
          <div className={`alchemy-ritual-step alchemy-flow-${index + 1}`} key={quality}>
            <span className="alchemy-ritual-number">{index + 1}</span>
            <strong>{remedy}</strong>
            <span>{quality}</span>
          </div>
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
      <WhiteNote className="alchemy-note-block">
        <h3>Примечание</h3>
        <p>Поддержка здесь не про ускорение и не про рывок. Она ведёт к тому, чтобы закрепить опору, не расплескать ресурс и дать внутренней крепости стать спокойнее.</p>
      </WhiteNote>

      <div className="alchemy-message-ribbon">
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
