import React, { useState } from "react";
import Layout from "./components/Layout.jsx";
import { clientProgress, selfAnalysis } from "./data/mockData.js";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Overview from "./pages/Overview.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";
import { readFirstIntakeResult } from "./lib/firstIntakeStorage.js";

export const pageTabs = {
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

function RoutedApp() {
  const path = window.location.pathname;
  const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";

  if (path === "/") {
    return <ReportApp forceDemo={demoMode} />;
  }

  if (path === "/login") {
    return <LoginPage />;
  }

  if (path === "/profile") {
    return <ProfilePage />;
  }

  if (path === "/demo") {
    return <ReportApp forceDemo />;
  }

  return <LoginPage />;
}

export function ReportApp({ clientOverride = null, forceDemo = false, userAction = null }) {
  const [activePage, setActivePage] = useState("overview");
  const [selfAnalysisMode, setSelfAnalysisMode] = useState("overview");
  const [bookingNoticeVisible, setBookingNoticeVisible] = useState(false);
  const [firstIntakeResult, setFirstIntakeResult] = useState(() => readFirstIntakeResult());
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    self: selfAnalysis.tabs[0],
    history: pageTabs.history[0],
  });
  const completedFromProgress =
    clientProgress.assessments.some((item) => item.status === "completed") ||
    clientProgress.reports.some((item) => item.status === "completed") ||
    clientProgress.results.some((item) => item.status === "completed");
  const hasCompletedResults =
    forceDemo ||
    Boolean(firstIntakeResult) ||
    completedFromProgress ||
    clientOverride?.hasCompletedFirstConsultation === true ||
    clientOverride?.hasCompletedResults === true;

  const handleNavigation = (page, tab) => {
    if (!hasCompletedResults && page === "expert") {
      setActivePage("expert");
      setBookingNoticeVisible(false);
      return;
    }
    if (!hasCompletedResults && ["recommendations", "history"].includes(page)) {
      openFirstIntake();
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

  const openFirstIntake = () => {
    setActivePage("self");
    setSelfAnalysisMode("overview");
    setBookingNoticeVisible(false);
  };

  const handleSpecialistRequest = () => {
    setBookingNoticeVisible(true);
  };

  const openResultReport = (tab) => {
    setActivePage("expert");
    setActiveTabs((current) => ({ ...current, expert: tab }));
  };

  const handleFirstIntakeComplete = (result) => {
    setFirstIntakeResult(result);
    setActivePage("expert");
    setSelfAnalysisMode("overview");
    setActiveTabs((current) => ({ ...current, expert: "Самоотчёт" }));
  };

  const handleFirstIntakeSaveAndExit = () => {
    setActivePage("overview");
    setSelfAnalysisMode("overview");
  };

  const renderPage = () => {
    if (activePage === "self") {
      return (
        <SelfAnalysis
          onComplete={handleFirstIntakeComplete}
          onModeChange={setSelfAnalysisMode}
          onSaveAndExit={handleFirstIntakeSaveAndExit}
        />
      );
    }
    if (!hasCompletedResults && activePage === "expert") {
      return (
        <LockedReportState
          bookingNoticeVisible={bookingNoticeVisible}
          onSpecialistRequest={handleSpecialistRequest}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "expert") {
      return (
        <ExpertAnalysis
          activeTab={activeTabs.expert}
          clientOverride={clientOverride}
          firstIntakeResult={firstIntakeResult}
          onSelectReport={openResultReport}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
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
        onStartSelfAnalysis={openFirstIntake}
      />
    );
  };

  const isSelfAnalysisFocusMode = activePage === "self" && selfAnalysisMode === "form";

  return (
    <Layout
      activePage={activePage}
      activeTab={activeTabs[activePage]}
      clientOverride={clientOverride}
      focusMode={isSelfAnalysisFocusMode}
      hasCompletedResults={hasCompletedResults}
      hideSpecialistPanel={activePage === "expert"}
      onPrimaryAction={!hasCompletedResults && ["overview", "expert"].includes(activePage) ? openFirstIntake : undefined}
      onTabChange={handleNavigation}
      pageTabs={pageTabs[activePage]}
      userAction={userAction}
    >
      {renderPage()}
    </Layout>
  );
}

export default RoutedApp;
