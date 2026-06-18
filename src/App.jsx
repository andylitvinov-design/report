import React, { useState } from "react";
import Layout from "./components/Layout.jsx";
import { selfAnalysis } from "./data/mockData.js";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Overview from "./pages/Overview.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";

const pageTabs = {
  overview: ["Состояние", "Динамика", "Психологический портрет", "Карта личности"],
  expert: ["Последний отчёт", "Отчёты по датам", "Механизм", "У-Син", "Препараты"],
  recommendations: ["Текущая формула", "Bach", "Натуротерапия", "Практики", "Что отслеживать"],
  self: [],
  history: ["Текущие рекомендации", "Карта личности", "Динамика замеров", "История", "Следующий шаг"],
};

function RoutedApp() {
  const path = window.location.pathname;

  if (path === "/" || path === "/login") {
    return <LoginPage />;
  }

  if (path === "/profile") {
    return <ProfilePage />;
  }

  if (path === "/demo") {
    return <ReportApp />;
  }

  return <LoginPage />;
}

function ReportApp() {
  const [activePage, setActivePage] = useState("overview");
  const [selfAnalysisMode, setSelfAnalysisMode] = useState("overview");
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    self: selfAnalysis.tabs[0],
    history: pageTabs.history[0],
  });

  const handleNavigation = (page, tab) => {
    if (tab) {
      setActiveTabs((current) => ({ ...current, [page]: tab }));
      return;
    }
    setActivePage(page);
    if (page !== "self") {
      setSelfAnalysisMode("overview");
    }
  };

  const renderPage = () => {
    if (activePage === "self") {
      return <SelfAnalysis onModeChange={setSelfAnalysisMode} />;
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
    return <Overview />;
  };

  const isSelfAnalysisFocusMode = activePage === "self" && selfAnalysisMode === "form";

  return (
    <Layout
      activePage={activePage}
      activeTab={activeTabs[activePage]}
      focusMode={isSelfAnalysisFocusMode}
      onTabChange={handleNavigation}
      pageTabs={pageTabs[activePage]}
    >
      {renderPage()}
    </Layout>
  );
}

export default RoutedApp;
