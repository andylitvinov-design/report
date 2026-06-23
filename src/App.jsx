import React, { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout.jsx";
import { analysisCatalog, client, clientProgress, selfAnalysis } from "./data/mockData.js";
import AdvancedAiAnalysis from "./pages/AdvancedAiAnalysis.jsx";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Overview from "./pages/Overview.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelfAnalysis from "./pages/SelfAnalysis.jsx";
import {
  authEnv,
  clearStoredSession,
  exchangeOAuthCodeFromUrl,
  getCurrentUser,
  getStoredSession,
  isStoredSessionExpired,
  signOut,
} from "./lib/authClient.js";
import { readAdvancedAiAnalysisResult } from "./lib/advancedAiAnalysisStorage.js";
import { readFirstIntakeResult } from "./lib/firstIntakeStorage.js";

export const pageTabs = {
  overview: [],
  profile: [],
  expert: ["Меню отчётов", "Самоотчёт", "Расширенный ИИ-анализ", "Диагностика эксперта", "Механизм", "У-Син", "Препараты"],
  recommendations: ["Текущая формула", "Bach", "Натуротерапия", "Практики", "Что отслеживать"],
  self: [],
  advanced: [],
  history: ["Текущие рекомендации", "Карта личности", "Динамика замеров", "История", "Следующий шаг"],
  consultations: [],
};

function isToday(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

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

function AiIntakeDashboard({
  advancedAiResult,
  firstIntakeResult,
  onOpenDynamics,
  onOpenReport,
  onStartAdvanced,
  onStartBrief,
}) {
  const hasBriefIntake = Boolean(firstIntakeResult);
  const completedToday = isToday(firstIntakeResult?.completedAt);

  return (
    <section className="compact-section-page" aria-labelledby="ai-intake-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">ИИ-приём</p>
        <h2 id="ai-intake-title">Краткий срез</h2>
        <p>Быстро понять запрос, состояние и первые опоры.</p>
        <div className="compact-route-actions">
          {completedToday ? (
            <>
              <button className="primary-btn" type="button" disabled>
                Сегодня ИИ-приём уже пройден
              </button>
              <button className="secondary-btn" type="button" onClick={onOpenReport}>
                Открыть последний отчёт
              </button>
              <button className="secondary-btn" type="button" onClick={onOpenDynamics}>
                Посмотреть динамику
              </button>
            </>
          ) : (
            <>
              <button className="primary-btn" type="button" onClick={onStartBrief}>
                Пройти короткий ИИ-приём
              </button>
              {hasBriefIntake && (
                <button className="secondary-btn" type="button" onClick={onStartAdvanced}>
                  Расширенный срез
                </button>
              )}
            </>
          )}
        </div>
        <p className="compact-route-note">
          {completedToday
            ? "Следующая проверка будет доступна завтра."
            : hasBriefIntake
              ? "Новый срез сохранится в историю."
              : "3–5 минут. После появится первая карта состояния."}
        </p>
      </article>

      <div className="compact-route-grid">
        <article className="card compact-route-card">
          <span>Расширенный</span>
          <h3>Глубже по шкалам</h3>
          <p>Больше деталей, когда краткого среза мало.</p>
          <button className="secondary-btn" disabled={!hasBriefIntake} type="button" onClick={onStartAdvanced}>
            Открыть расширенный
          </button>
          <small className="compact-route-hint">
            {advancedAiResult ? "Последний срез сохранён" : "После краткого приёма"}
          </small>
        </article>
        <article className="card compact-route-card">
          <span>История</span>
          <h3>Срезы и динамика</h3>
          <p>Открыть прошлые даты и сравнение.</p>
          <button className="secondary-btn" type="button" onClick={onOpenDynamics}>
            Открыть историю
          </button>
          <small className="compact-route-hint">После первого среза</small>
        </article>
      </div>
    </section>
  );
}

function ConsultationPlaceholder({
  bookingNoticeVisible,
  hasCompletedResults,
  onOpenReport,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <section className="compact-section-page" aria-labelledby="consultations-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">Личная сессия</p>
        <h2 id="consultations-title">Разбор отчёта со специалистом</h2>
        {hasCompletedResults ? (
          <p>Взять последний отчёт в работу.</p>
        ) : (
          <p>Сначала можно пройти короткий срез.</p>
        )}
        <div className="compact-route-actions">
          {hasCompletedResults ? (
            <>
              <button className="primary-btn" onClick={onOpenReport} type="button">
                Разобрать этот отчёт на личной сессии
              </button>
              <button className="secondary-btn" onClick={onSpecialistRequest} type="button">
                Заказать сессию
              </button>
            </>
          ) : (
            <>
              <button className="primary-btn" onClick={onStartSelfAnalysis} type="button">
                Пройти ИИ-приём
              </button>
              <button className="secondary-btn" onClick={onSpecialistRequest} type="button">
                Заказать сессию сразу
              </button>
            </>
          )}
        </div>
        {bookingNoticeVisible && (
          <p className="placeholder-notice" role="status">
            Раздел записи ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}
      </article>

      <div className="compact-route-grid">
        <article className="card compact-route-card">
          <span>Последний отчёт</span>
          <h3>{hasCompletedResults ? "Готов для разбора" : "Появится после ИИ-приёма"}</h3>
          <p>{hasCompletedResults ? "Открыть перед встречей." : "Поможет сформулировать запрос."}</p>
        </article>
        <article className="card compact-route-card">
          <span>История сессий</span>
          <h3>Прошедшие и будущие встречи</h3>
          <p>Даты, заметки и назначения.</p>
        </article>
      </div>
    </section>
  );
}

function ProfileReportsPage({ hasCompletedResults, onBookSession, onOpenReport, onStartSelfAnalysis }) {
  const reportText = hasCompletedResults
    ? "Последний ИИ-отчёт доступен."
    : "ИИ-отчёты появятся после первого ИИ-приёма.";

  return (
    <section className="compact-section-page" aria-labelledby="profile-reports-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">Профиль / Отчёты</p>
        <h2 id="profile-reports-title">Отчёты и динамика</h2>
        <p>Личный архив, последние результаты и настройки доступа.</p>
      </article>

      <div className="compact-archive-grid">
        <article className="card compact-route-card">
          <span>Личный анализ</span>
          <h3>Отчёты специалиста</h3>
          <p>Появятся после личной сессии.</p>
          <button className="secondary-btn" type="button" onClick={onBookSession}>Заказать сессию</button>
        </article>
        <article className="card compact-route-card">
          <span>ИИ-анализ</span>
          <h3>Последний ИИ-отчёт</h3>
          <p>{reportText}</p>
          <button className="secondary-btn" type="button" onClick={hasCompletedResults ? onOpenReport : onStartSelfAnalysis}>
            {hasCompletedResults ? "Открыть последний отчёт" : "Пройти ИИ-приём"}
          </button>
        </article>
        <article className="card compact-route-card">
          <span>Данные и динамика</span>
          <h3>Сравнение срезов</h3>
          <p>После двух и более ИИ-приёмов.</p>
          <button className="secondary-btn" type="button" onClick={onStartSelfAnalysis}>Пройти повторный ИИ-приём</button>
        </article>
        <article className="card compact-route-card">
          <span>Доступ и настройки</span>
          <h3>Аккаунт</h3>
          <p>Данные, вход и приватность.</p>
        </article>
      </div>
    </section>
  );
}

function NextStepsPage({ hasCompletedResults, onBookSession, onOpenReport, onRepeatAiIntake, onStartSelfAnalysis }) {
  if (!hasCompletedResults) {
    return (
      <section className="compact-section-page" aria-labelledby="next-empty-title">
        <article className="card compact-route-hero">
          <p className="eyebrow">Что дальше</p>
          <h2 id="next-empty-title">Сначала короткий срез</h2>
          <p>После него появится первый план действий.</p>
          <div className="compact-route-actions">
            <button className="primary-btn" type="button" onClick={onStartSelfAnalysis}>Пройти ИИ-приём</button>
            <button className="secondary-btn" type="button" onClick={onBookSession}>Заказать сессию</button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="compact-section-page" aria-labelledby="next-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">Что дальше</p>
        <h2 id="next-title">Текущее направление поддержки</h2>
        <p>Один фокус, мягкая поддержка и повторная проверка.</p>
        <div className="compact-route-actions">
          <button className="primary-btn" type="button" onClick={onOpenReport}>Открыть отчёт</button>
          <button className="secondary-btn" type="button" onClick={onBookSession}>Записаться на сессию</button>
          <button className="secondary-btn" type="button" onClick={onRepeatAiIntake}>Пройти повторную проверку</button>
        </div>
      </article>

      <div className="compact-archive-grid next-plan-grid">
        {[
          ["Главный фокус", "Снизить расход ресурса и оставить один понятный шаг на ближайшие дни."],
          ["Что поддерживать", "Сон, паузы и мягкие практики."],
          ["Что не перегружать", "Не расширять список задач."],
          ["Что делать мягко", "Отмечать изменения коротко, без жёсткой оценки и давления на результат."],
          ["Что принимать / использовать", "Только назначенное специалистом."],
          ["Что отслеживать", "Ресурс, напряжение и телесные маркеры."],
        ].map(([title, text]) => (
          <article className="card compact-route-card" key={title}>
            <span>Текущее назначение</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const isDemoCabinetEnabled = import.meta.env.VITE_ENABLE_DEMO_CABINET === "true";

function userDisplayName(user) {
  return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Клиент PsiTherapy";
}

function buildClientFromUser(user) {
  return {
    name: userDisplayName(user),
    email: user?.email || "",
    id: user?.id ? user.id.slice(0, 8).toUpperCase() : "CLIENT",
    focus: "первичный анализ ситуации",
    lastSlice: "ожидает первого приёма",
    nextSession: "вход через Google подтверждён",
  };
}

function CabinetLoadingScreen() {
  return (
    <main className="auth-page">
      <section className="auth-card card">
        <p className="eyebrow">PsiTherapy</p>
        <h1>Загружаю кабинет…</h1>
        <p className="subtitle">Проверяю Google-сессию и открываю структуру личного кабинета.</p>
      </section>
    </main>
  );
}

function CabinetAuthError({ error }) {
  return (
    <main className="auth-page">
      <section className="auth-card card">
        <p className="eyebrow">Ошибка входа</p>
        <h1>Google-сессия не загрузилась</h1>
        <p className="subtitle">{error}</p>
        <a className="primary-btn auth-inline-btn" href="/login">Попробовать снова</a>
      </section>
    </main>
  );
}

export function CabinetAuthGate() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!authEnv.isConfigured) {
        if (isMounted) setAuthStatus("signed-out");
        return;
      }

      try {
        const session = await exchangeOAuthCodeFromUrl();
        const storedSession = session || getStoredSession();

        if (!storedSession?.access_token || isStoredSessionExpired(storedSession)) {
          clearStoredSession();
          if (isMounted) setAuthStatus("signed-out");
          return;
        }

        const currentUser = await getCurrentUser(storedSession);
        if (!isMounted) return;

        if (!currentUser) {
          clearStoredSession();
          setAuthStatus("signed-out");
          return;
        }

        setUser(currentUser);
        setAuthStatus("signed-in");
      } catch (loadError) {
        clearStoredSession();
        if (!isMounted) return;
        setError(loadError?.message || "Не удалось загрузить пользователя.");
        setAuthStatus("error");
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const clientOverride = useMemo(() => buildClientFromUser(user), [user]);

  const handleSignOut = () => {
    signOut();
    window.location.assign("/login");
  };

  const signOutAction = (
    <button className="secondary-btn sidebar-logout" type="button" onClick={handleSignOut}>Выйти из кабинета</button>
  );

  if (authStatus === "loading") {
    return <CabinetLoadingScreen />;
  }

  if (authStatus === "signed-out") {
    return <LoginPage />;
  }

  if (authStatus === "error") {
    return <CabinetAuthError error={error} />;
  }

  return <ReportApp clientOverride={clientOverride} onSignOut={handleSignOut} userAction={signOutAction} />;
}

function RoutedApp() {
  const path = window.location.pathname;
  const requestedDemoMode = new URLSearchParams(window.location.search).get("demo") === "1";
  const demoMode = isDemoCabinetEnabled && requestedDemoMode;

  if (path === "/") {
    return demoMode ? <ReportApp forceDemo /> : <CabinetAuthGate />;
  }

  if (path === "/login") {
    return <LoginPage />;
  }

  if (path === "/profile") {
    return <CabinetAuthGate />;
  }

  if (path === "/demo") {
    return isDemoCabinetEnabled ? <ReportApp forceDemo /> : <LoginPage />;
  }

  return <LoginPage />;
}

export function ReportApp({ clientOverride = null, forceDemo = false, onSignOut = null, userAction = null }) {
  const [activePage, setActivePage] = useState("overview");
  const [selfAnalysisMode, setSelfAnalysisMode] = useState("overview");
  const [bookingNoticeVisible, setBookingNoticeVisible] = useState(false);
  const [firstIntakeResult, setFirstIntakeResult] = useState(() => readFirstIntakeResult());
  const [advancedAiResult, setAdvancedAiResult] = useState(() => readAdvancedAiAnalysisResult());
  const [advancedAnalysisMode, setAdvancedAnalysisMode] = useState("overview");
  const [activeAnalysisId, setActiveAnalysisId] = useState("general-state");
  const [activeTabs, setActiveTabs] = useState({
    overview: pageTabs.overview[0],
    expert: pageTabs.expert[0],
    recommendations: pageTabs.recommendations[0],
    self: selfAnalysis.tabs[0],
    advanced: "",
    history: pageTabs.history[0],
    consultations: "",
    profile: "",
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

  const analysisGroups = useMemo(() => {
    const completedAt = firstIntakeResult?.completedAt
      ? new Date(firstIntakeResult.completedAt).toLocaleDateString("ru-RU")
      : null;
    const advancedCompletedAt = advancedAiResult?.completedAt
      ? new Date(advancedAiResult.completedAt).toLocaleDateString("ru-RU")
      : null;

    return analysisCatalog.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.id === "general-state" && firstIntakeResult) {
          return {
            ...item,
            status: "single",
            first: { value: Number(firstIntakeResult.symptomBaseline?.resourceLevel) * 10 || item.first.value, date: completedAt },
            last: null,
            currentResult: "Первый самоанализ сохранён. Для динамики нужен повторный срез.",
          };
        }
        if (item.id === "advanced-1" && advancedAiResult) {
          return {
            ...item,
            title: advancedAiResult.programTitle || item.title,
            status: "single",
            first: { value: item.first.value, date: advancedCompletedAt },
            last: null,
            summary: advancedAiResult.hypothesis || item.summary,
            currentResult: advancedAiResult.title || item.currentResult,
          };
        }
        return item;
      }),
    }));
  }, [advancedAiResult, firstIntakeResult]);

  const selectedAnalysis = useMemo(
    () => analysisGroups.flatMap((group) => group.items).find((item) => item.id === activeAnalysisId) ||
      analysisGroups[1]?.items[0],
    [activeAnalysisId, analysisGroups]
  );

  const handleNavigation = (page, tab) => {
    if (page === "settings") {
      setActivePage("settings");
      setBookingNoticeVisible(false);
      setSelfAnalysisMode("overview");
      return;
    }
    if (!hasCompletedResults && page === "expert") {
      setActivePage("profile");
      setBookingNoticeVisible(false);
      return;
    }
    if (tab) {
      setActiveTabs((current) => ({ ...current, [page]: tab }));
      setActivePage(page);
      setBookingNoticeVisible(false);
      return;
    }
    setActivePage(page);
    setBookingNoticeVisible(false);
    if (page !== "self") {
      setSelfAnalysisMode("overview");
    }
    if (page !== "advanced") {
      setAdvancedAnalysisMode("overview");
    }
  };

  const openFirstIntake = () => {
    setActivePage("self");
    setSelfAnalysisMode("form");
    setBookingNoticeVisible(false);
  };

  const handleSpecialistRequest = () => {
    setBookingNoticeVisible(true);
  };

  const openSettings = () => {
    setActivePage("settings");
    setBookingNoticeVisible(false);
    setSelfAnalysisMode("overview");
  };

  const handleSelectAnalysis = (analysisId) => {
    setActiveAnalysisId(analysisId);
    if (!["profile", "self"].includes(activePage)) {
      setActivePage("self");
    }
    setSelfAnalysisMode("overview");
    setBookingNoticeVisible(false);
  };

  const handleStartAnalysis = (analysisId) => {
    if (analysisId === "expert-consultation") {
      setActivePage("consultations");
      handleSpecialistRequest();
      return;
    }

    if (analysisId.startsWith("advanced")) {
      setActivePage("advanced");
      setAdvancedAnalysisMode("overview");
      setBookingNoticeVisible(false);
      return;
    }

    setActiveAnalysisId(analysisId);
    openFirstIntake();
  };

  const openResultReport = (tab) => {
    setActivePage("expert");
    setActiveTabs((current) => ({ ...current, expert: tab }));
  };

  const handleFirstIntakeComplete = (result) => {
    setFirstIntakeResult(result);
    setActivePage("self");
    setSelfAnalysisMode("overview");
    setActiveAnalysisId("general-state");
  };

  const handleFirstIntakeSaveAndExit = () => {
    setActivePage("self");
    setSelfAnalysisMode("overview");
  };

  const handleAdvancedAiSaveAndExit = () => {
    setActivePage("self");
    setAdvancedAnalysisMode("overview");
  };

  const handleAdvancedAiResultSaved = (result) => {
    setAdvancedAiResult(result);
    setActivePage("self");
    setAdvancedAnalysisMode("overview");
    setActiveAnalysisId("advanced-1");
  };

  const renderPage = () => {
    if (activePage === "settings") {
      const accountName = clientOverride?.name || "Клиент PsiTherapy";
      const accountEmail = clientOverride?.email || "Email не указан";
      const accountStatus = clientOverride?.nextSession || (forceDemo ? "демо-режим" : "вход через Google подтверждён");
      const accountId = clientOverride?.id ? `ID ${clientOverride.id}` : "ID демо-кабинета";

      return (
        <section className="settings-page" aria-labelledby="settings-title">
          <article className="card settings-card">
            <p className="eyebrow">Аккаунт</p>
            <h2 id="settings-title">Настройки</h2>
            <div className="settings-grid">
              <div>
                <span>Профиль</span>
                <strong>{accountName}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{accountEmail}</strong>
              </div>
              <div>
                <span>Статус входа</span>
                <strong>{accountStatus}</strong>
              </div>
              <div>
                <span>Сессия</span>
                <strong>{accountId}</strong>
              </div>
            </div>
            {userAction ? <div className="settings-actions">{userAction}</div> : null}
          </article>
        </section>
      );
    }
    if (activePage === "consultations") {
      return (
        <ConsultationPlaceholder
          bookingNoticeVisible={bookingNoticeVisible}
          hasCompletedResults={hasCompletedResults}
          onOpenReport={() => openResultReport(pageTabs.expert[0])}
          onSpecialistRequest={handleSpecialistRequest}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "profile") {
      return (
        <ProfileReportsPage
          hasCompletedResults={hasCompletedResults}
          onBookSession={() => handleNavigation("consultations")}
          onOpenReport={() => openResultReport(pageTabs.expert[0])}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "self") {
      if (selfAnalysisMode !== "form") {
        return (
          <AiIntakeDashboard
            advancedAiResult={advancedAiResult}
            firstIntakeResult={firstIntakeResult}
            onOpenDynamics={() => handleNavigation("profile")}
            onOpenReport={() => openResultReport(pageTabs.expert[0])}
            onStartAdvanced={() => handleNavigation("advanced")}
            onStartBrief={openFirstIntake}
          />
        );
      }
      return (
        <SelfAnalysis
          activeAnalysis={selectedAnalysis}
          clientName={clientOverride?.name}
          mode={selfAnalysisMode === "form" ? "form" : "navigator"}
          onComplete={handleFirstIntakeComplete}
          onModeChange={setSelfAnalysisMode}
          onNavigate={handleNavigation}
          onSelectAnalysis={handleSelectAnalysis}
          onSaveAndExit={handleFirstIntakeSaveAndExit}
          onSpecialistRequest={handleSpecialistRequest}
          onStartAnalysis={handleStartAnalysis}
        />
      );
    }
    if (activePage === "advanced") {
      return (
        <AdvancedAiAnalysis
          onModeChange={setAdvancedAnalysisMode}
          onResultSaved={handleAdvancedAiResultSaved}
          onSaveAndExit={handleAdvancedAiSaveAndExit}
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
          advancedAiResult={advancedAiResult}
          clientOverride={clientOverride}
          firstIntakeResult={firstIntakeResult}
          onSelectReport={openResultReport}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "recommendations") {
      return (
        <NextStepsPage
          hasCompletedResults={hasCompletedResults}
          onBookSession={() => handleNavigation("consultations")}
          onOpenReport={() => openResultReport(pageTabs.expert[0])}
          onRepeatAiIntake={() => handleNavigation("advanced")}
          onStartSelfAnalysis={openFirstIntake}
        />
      );
    }
    if (activePage === "history") {
      return <DynamicsHistory />;
    }
    return (
      <Overview
        bookingNoticeVisible={bookingNoticeVisible}
        clientName={clientOverride?.name || client.name}
        hasCompletedResults={hasCompletedResults}
        onAskAssistant={() => handleNavigation("recommendations")}
        onContinueIntake={openFirstIntake}
        onNavigate={handleNavigation}
        onOpenResults={() => openResultReport(pageTabs.expert[0])}
        onRepeatAiIntake={() => handleNavigation("advanced")}
        onSpecialistRequest={handleSpecialistRequest}
        onStartSelfAnalysis={openFirstIntake}
      />
    );
  };

  const isSelfAnalysisFocusMode = activePage === "self" && selfAnalysisMode === "form";
  const isAdvancedAnalysisFocusMode = activePage === "advanced" && advancedAnalysisMode === "form";

  return (
    <Layout
      activePage={activePage}
      activeAnalysisId={activeAnalysisId}
      activeTab={activeTabs[activePage]}
      analysisGroups={analysisGroups}
      clientOverride={clientOverride}
      focusMode={isSelfAnalysisFocusMode || isAdvancedAnalysisFocusMode}
      hasCompletedResults={hasCompletedResults}
      hideSpecialistPanel={["expert", "settings", "profile", "self", "consultations"].includes(activePage)}
      onPrimaryAction={!hasCompletedResults && ["overview", "expert"].includes(activePage) ? openFirstIntake : undefined}
      onOpenSettings={openSettings}
      onSelectAnalysis={handleSelectAnalysis}
      onSignOut={onSignOut}
      onStartAnalysis={handleStartAnalysis}
      onTabChange={handleNavigation}
      pageTabs={pageTabs[activePage]}
      userAction={userAction}
      workbookMode
    >
      {renderPage()}
    </Layout>
  );
}

export default RoutedApp;
