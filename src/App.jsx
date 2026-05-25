import React, { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout.jsx";
import { selfAnalysis } from "./data/mockData.js";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import Overview from "./pages/Overview.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";
import {
  completeGoogleCallback,
  getSafeNextPath,
  getStoredSession,
  signOut,
  startGoogleSignIn,
} from "./lib/auth.js";
import { createAnalysisRunForUser } from "./lib/clientRepository.js";

const pageTabs = {
  overview: ["Состояние", "Графики", "Следующий шаг", "Комментарий"],
  self: selfAnalysis.tabs,
  expert: ["Интерпретация", "Проверка", "Финализация"],
  recommendations: ["Формула", "Практика", "Контроль"],
  history: ["График", "История", "Сравнение"],
};

const pageRoutes = {
  overview: "/cabinet",
  self: "/cabinet/self-analysis",
  expert: "/cabinet/expert-analysis",
  recommendations: "/cabinet/recommendations",
  history: "/cabinet/history",
};

function getPageFromPath(pathname) {
  if (pathname === "/cabinet/self-analysis") return "self";
  if (pathname === "/cabinet/expert-analysis") return "expert";
  if (pathname === "/cabinet/recommendations") return "recommendations";
  if (pathname === "/cabinet/history") return "history";
  return "overview";
}

function isProtectedPath(pathname) {
  return pathname === "/" || pathname.startsWith("/cabinet");
}

function navigateTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function LoginPage({ nextPath, onLogin }) {
  return (
    <main className="login-shell">
      <section className="login-card card">
        <p className="eyebrow">Holistic Therapy Cabinet</p>
        <h1>Личный кабинет клиента</h1>
        <p className="subtitle">
          Войдите через Google, чтобы видеть прошлые анализы, рекомендации, динамику состояния и проходить повторные срезы.
        </p>
        <button className="google-btn" type="button" onClick={() => onLogin(nextPath)}>
          <span className="google-mark" aria-hidden="true">G</span>
          Войти через Google
        </button>
        <p className="auth-note">
          Если Supabase env не настроены, включается dev fallback-сессия без внешнего OAuth. Для production нужно применить `supabase/schema.sql` и задать переменные из `.env.example`.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [user, setUser] = useState(() => getStoredSession());
  const [authError, setAuthError] = useState(null);
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    self: selfAnalysis.tabs[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    history: pageTabs.history[0],
  });

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    if (path === "/auth/google") {
      const params = new URLSearchParams(window.location.search);
      startGoogleSignIn(getSafeNextPath(params.get("next"), "/cabinet"));
    }

    if (path === "/auth/callback") {
      const params = new URLSearchParams(window.location.search);
      const next = getSafeNextPath(params.get("next"), "/cabinet");
      completeGoogleCallback()
        .then((sessionUser) => {
          setUser(sessionUser);
          navigateTo(next);
        })
        .catch((error) => {
          setAuthError(error instanceof Error ? error.message : "Не удалось завершить Google вход.");
          navigateTo(`/login?next=${encodeURIComponent(next)}`);
        });
    }
  }, [path]);

  useEffect(() => {
    if (path === "/" && user) {
      navigateTo("/cabinet");
    }
  }, [path, user]);

  const activePage = useMemo(() => getPageFromPath(path), [path]);
  const isLogin = path === "/login" || path === "/auth/google" || path === "/auth/callback";
  const requestedNext = getSafeNextPath(new URLSearchParams(window.location.search).get("next"), "/cabinet");

  const handleLogin = (nextPath = "/cabinet") => {
    setAuthError(null);
    startGoogleSignIn(nextPath);
    setUser(getStoredSession());
  };

  const handleSignOut = () => {
    signOut();
    setUser(null);
    navigateTo("/login?next=/cabinet");
  };

  const handleNavigation = (page, tab) => {
    if (tab) {
      setActiveTabs((current) => ({ ...current, [page]: tab }));
      return;
    }
    navigateTo(pageRoutes[page] || "/cabinet");
  };

  const handleNewAnalysis = () => {
    createAnalysisRunForUser(user, {
      title: "Новый повторный самоанализ",
      summary: "Черновик нового среза для повторной проверки динамики.",
    });
    navigateTo("/cabinet/history");
  };

  if ((isProtectedPath(path) && !user) || isLogin) {
    const nextPath = path === "/login" ? requestedNext : getSafeNextPath(path, "/cabinet");
    return (
      <>
        <LoginPage nextPath={nextPath} onLogin={handleLogin} />
        {authError ? <div className="auth-error">{authError}</div> : null}
      </>
    );
  }

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
      return <DynamicsHistory user={user} />;
    }
    return <Overview />;
  };

  return (
    <Layout
      activePage={activePage}
      activeTab={activeTabs[activePage]}
      onTabChange={handleNavigation}
      onNewAnalysis={handleNewAnalysis}
      onSignOut={handleSignOut}
      pageTabs={pageTabs[activePage]}
      user={user}
    >
      {renderPage()}
    </Layout>
  );
}
