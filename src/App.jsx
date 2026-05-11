import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import reportData from '../design/sample-data.json';
import { AlchemyReport, ALCHEMY_PAGE_ORDER } from './components/AlchemyReport';
import { ReportPage2 } from './components/ReportPage2';
import { ReportPage3 } from './components/ReportPage3';
import { ReportPage4 } from './components/ReportPage4';

const PAGE_ORDER = ['2', '3', '4'];

function renderPage(pageId, report) {
  const pageData = report.pages[pageId];

  if (!pageData) {
    return null;
  }

  if (pageId === '2') {
    return <ReportPage2 brand={report.brand} data={pageData} />;
  }

  if (pageId === '3') {
    return <ReportPage3 brand={report.brand} data={pageData} />;
  }

  return <ReportPage4 brand={report.brand} data={pageData} />;
}

function PreviewToolbar({ allPages = false, currentPageId = '2', template = 'legacy' }) {
  const isAlchemy = template === 'alchemy';
  const pages = isAlchemy ? ALCHEMY_PAGE_ORDER : PAGE_ORDER;
  const basePath = isAlchemy ? '/report-preview/alchemy-v1' : '/report-preview';
  const title = isAlchemy ? 'Алхимия Души · alchemy-v1' : reportData.preview.title;
  const label = isAlchemy ? 'Канонический шаблон отчёта' : reportData.preview.label;

  return (
    <div className="preview-toolbar print-hidden">
      <div className="toolbar-copy">
        <p className="toolbar-label">{label}</p>
        <h1>{title}</h1>
      </div>

      <div className="toolbar-actions">
        <nav className="preview-nav" aria-label="Навигация по страницам отчёта">
          {pages.map((pageId) => (
            <NavLink
              key={pageId}
              className={({ isActive }) =>
                `preview-nav-link${isActive && !allPages ? ' active' : ''}`
              }
              to={`${basePath}/${pageId}`}
            >
              Стр. {pageId}
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) =>
              `preview-nav-link${isActive && allPages ? ' active' : ''}`
            }
            to={`${basePath}/all`}
          >
            Все
          </NavLink>
        </nav>

        <button type="button" className="print-button" onClick={() => window.print()}>
          Печать / PDF
        </button>
      </div>
    </div>
  );
}

export default function App({ mode = 'single', template = 'legacy' }) {
  const params = useParams();

  if (template === 'alchemy') {
    const currentPageId = ALCHEMY_PAGE_ORDER.includes(params.pageId) ? params.pageId : '1';
    const pageId = mode === 'all' ? 'all' : currentPageId;

    return (
      <main className="preview-shell">
        <PreviewToolbar
          template="alchemy"
          allPages={mode === 'all'}
          currentPageId={currentPageId}
        />
        <AlchemyReport pageId={pageId} />
      </main>
    );
  }

  const currentPageId = PAGE_ORDER.includes(params.pageId) ? params.pageId : '2';

  return (
    <main className="preview-shell">
      <PreviewToolbar allPages={mode === 'all'} currentPageId={currentPageId} />

      {mode === 'all' ? (
        <div className="page-stack">
          {PAGE_ORDER.map((pageId) => (
            <div key={pageId}>{renderPage(pageId, reportData)}</div>
          ))}
        </div>
      ) : (
        renderPage(currentPageId, reportData)
      )}
    </main>
  );
}
