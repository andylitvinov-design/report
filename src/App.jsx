import React, { useState } from "react";
import Layout from "./components/Layout.jsx";
import { clientProgress, selfAnalysis } from "./data/mockData.js";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import Overview from "./pages/Overview.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";

const pageTabs = {
  overview: ["Состояние", "Динамика", "Психологический портрет", "Карта личности"],
  expert: ["Меню отчётов", "Самоотчёт", "Диагностика эксперта", "Механизм", "У-Син", "Препараты"],
  recommendations: ["Текущая формула", "Bach", "Натуротерапия", "Практики", "Что отслеживать"],
  self: [],
  history: ["Текущие рекомендации", "Карта личности", "Динамика замеров", "История", "Следующий шаг"],
};

function LockedReportState({
  bookingNoticeVisible,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <section className="locked-empty-state" aria-labelledby="locked-report-title">
      <article className="card locked-empty-card">
        <p className="eyebrow">Результаты (Отчёт)</p>
        <h2 id="locked-report-title">Результаты появятся после первого анализа</h2>
        <p>
          Сейчас отчётов ещё нет. Чтобы открыть этот раздел, сначала пройдите первый короткий
          самоанализ или закажите встречу со специалистом.
        </p>
        <div className="locked-empty-actions">
          <button className="primary-btn" onClick={onStartSelfAnalysis} type="button">
            Пройти первый анализ
          </button>
          <button className="secondary-btn" onClick={onSpecialistRequest} type="button">
            Заказать встречу
          </button>
        </div>
        {bookingNoticeVisible && (
          <p className="placeholder-notice" role="status">
            Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}
      </article>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [selfAnalysisMode, setSelfAnalysisMode] = useState("overview");
  const [bookingNoticeVisible, setBookingNoticeVisible] = useState(false);
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    self: selfAnalysis.tabs[0],
    history: pageTabs.history[0],
  });
  const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";
  const hasCompletedResults =
    demoMode ||
    clientProgress.assessments.some((item) => item.status === "completed") ||
    clientProgress.reports.some((item) => item.status === "completed") ||
    clientProgress.results.some((item) => item.status === "completed");

  const handleNavigation = (page, tab) => {
    if (!hasCompletedResults && page === "expert") {
      setActivePage("expert");
      setBookingNoticeVisible(false);
      return;
    }
    if (!hasCompletedResults && ["recommendations", "history"].includes(page)) {
      handleStartSelfAnalysis();
      return;
    }
    if (tab) {
      setActiveTabs((current) => ({ ...current, [page]: tab }));
      return;
    }
    setActivePage(page);
    setBookingNoticeVisible(false);
    if (page !== "self") {
      setSelfAnalysisMode("overview");
    }
  };

  const handleStartSelfAnalysis = () => {
    setActivePage("self");
    setSelfAnalysisMode("overview");
    setBookingNoticeVisible(false);
  };

  const handleSpecialistRequest = () => {
    // TODO: Replace with booking / consultation / specialist request route when it exists.
    setBookingNoticeVisible(true);
  };

  const renderPage = () => {
    if (activePage === "self") {
      return <SelfAnalysis onModeChange={setSelfAnalysisMode} />;
    }
    if (!hasCompletedResults && activePage === "expert") {
      return (
        <LockedReportState
          bookingNoticeVisible={bookingNoticeVisible}
          onSpecialistRequest={handleSpecialistRequest}
          onStartSelfAnalysis={handleStartSelfAnalysis}
        />
      );
    }
    if (activePage === "expert") {
      return <ExpertAnalysis />;
    }
    if (activePage === "recommendations") {
      return <Recommendations />;
    }
    if (activePage === "history") {
      return <DynamicsHistory />;
    }
    return (
      <Overview
        bookingNoticeVisible={bookingNoticeVisible}
        hasCompletedResults={hasCompletedResults}
        onSpecialistRequest={handleSpecialistRequest}
        onStartSelfAnalysis={handleStartSelfAnalysis}
      />
    );
  };

  const isSelfAnalysisFocusMode = activePage === "self" && selfAnalysisMode === "form";

  return (
    <Layout
      activePage={activePage}
      activeTab={activeTabs[activePage]}
      focusMode={isSelfAnalysisFocusMode}
      hasCompletedResults={hasCompletedResults}
      onPrimaryAction={!hasCompletedResults && ["overview", "expert"].includes(activePage) ? handleStartSelfAnalysis : undefined}
      onTabChange={handleNavigation}
      pageTabs={pageTabs[activePage]}
    >
      {renderPage()}
    </Layout>
  );
}
