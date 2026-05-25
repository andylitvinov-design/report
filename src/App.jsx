import React, { useState } from "react";
import Layout from "./components/Layout.jsx";
import { selfAnalysis } from "./data/mockData.js";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import Overview from "./pages/Overview.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";

const pageTabs = {
  "profile-overview": ["Состояние", "Динамика", "Психологический портрет", "Карта личности"],
  "expert-report": ["Последний отчёт", "Отчёты по датам", "Механизм", "У-Син", "Препараты"],
  assignment: ["Текущая формула", "Bach", "Натуротерапия", "Практики", "Что отслеживать"],
  "self-analysis": selfAnalysis.tabs,
  recommendations: ["Текущие рекомендации", "Карта личности", "Динамика замеров", "История", "Следующий шаг"],
};

export default function App() {
  const [activePage, setActivePage] = useState("profile-overview");
  const [activeTabs, setActiveTabs] = useState({
    "profile-overview": pageTabs["profile-overview"][0],
    "expert-report": pageTabs["expert-report"][0],
    assignment: pageTabs.assignment[0],
    "self-analysis": selfAnalysis.tabs[0],
    recommendations: pageTabs.recommendations[0],
  });

  const handleNavigation = (page, tab) => {
    if (tab) {
      setActiveTabs((current) => ({ ...current, [page]: tab }));
      return;
    }
    setActivePage(page);
  };

  const renderPage = () => {
    if (activePage === "self-analysis") {
      return <SelfAnalysis activeTab={activeTabs["self-analysis"]} />;
    }
    if (activePage === "expert-report") {
      return <ExpertAnalysis />;
    }
    if (activePage === "assignment") {
      return <Recommendations />;
    }
    if (activePage === "recommendations") {
      return <DynamicsHistory />;
    }
    return <Overview />;
  };

  const isSelfAnalysisFocusMode =
    activePage === "self-analysis" && activeTabs["self-analysis"] !== "Данные";

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
