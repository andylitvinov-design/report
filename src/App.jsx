import React, { useState } from "react";
import Layout from "./components/Layout.jsx";
import { selfAnalysis } from "./data/mockData.js";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import Overview from "./pages/Overview.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";

const pageTabs = {
  overview: ["Состояние", "Графики", "Следующий шаг", "Комментарий"],
  self: selfAnalysis.tabs,
  expert: ["Интерпретация", "Проверка", "Финализация"],
  recommendations: ["Формула", "Практика", "Контроль"],
  history: ["График", "История", "Сравнение"],
};

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    self: selfAnalysis.tabs[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    history: pageTabs.history[0],
  });

  const handleNavigation = (page, tab) => {
    if (tab) {
      setActiveTabs((current) => ({ ...current, [page]: tab }));
      return;
    }
    setActivePage(page);
  };

  const renderPage = () => {
    if (activePage === "self") {
      return <SelfAnalysis activeTab={activeTabs.self} />;
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

  return (
    <Layout
      activePage={activePage}
      activeTab={activeTabs[activePage]}
      onTabChange={handleNavigation}
      pageTabs={pageTabs[activePage]}
    >
      {renderPage()}
    </Layout>
  );
}
