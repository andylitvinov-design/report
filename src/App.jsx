import React, { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout.jsx";
import { analysisCatalog, client, clientProgress, selfAnalysis } from "./data/mockData.js";
import AdvancedAiAnalysis from "./pages/AdvancedAiAnalysis.jsx";
import ClientCabinet from "./pages/ClientCabinet.jsx";
import DynamicsHistory from "./pages/DynamicsHistory.jsx";
import ExpertAnalysis from "./pages/ExpertAnalysis.jsx";
import LoginPage from "./pages/LoginPage.jsx";
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
  recommendations: ["Отчёты Мастера", "ИИ-отчёты"],
  self: [],
  advanced: [],
  history: ["Текущие рекомендации", "Карта личности", "Динамика замеров", "История", "Следующий шаг"],
  consultations: [],
};

const packageFormats = [
  {
    id: "basic",
    title: "Базовый",
    price: "0€",
    description: "Короткий ИИ-приём и базовые результаты.",
  },
  {
    id: "expanded",
    title: "Расширенный",
    price: "5€",
    description: "Доступ к расширенным диагностикам и ИИ-отчётам.",
  },
  {
    id: "personal",
    title: "Личный",
    price: "50€",
    description: "Расширенный формат плюс одна персональная сессия вне очереди.",
  },
  {
    id: "support",
    title: "Сопровождение",
    price: "200€",
    description: "Входит 4 сессии плюс 4 недели дистанционной энергетической коррекции и поддержки через препараты.",
  },
];

const accessRank = {
  basic: 0,
  expanded: 1,
  personal: 2,
  support: 3,
};

const aiReportCards = [
  {
    id: "homeopathy",
    title: "План-программа коррекции в гомеопатии",
    source: "по результатам ИИ-приёма и текущего запроса",
  },
  {
    id: "naturopathy",
    title: "План-программа коррекции в натуропатии",
    source: "по ресурсу, нагрузке и режиму восстановления",
  },
  {
    id: "bach",
    title: "План-программа коррекции в цветочной терапии Баха",
    source: "по Bach-блоку и эмоциональным темам",
  },
  {
    id: "body-therapy",
    title: "Отчёт Рекомендации телесной терапии",
    source: "по телесным маркерам и уровню напряжения",
  },
  {
    id: "imaginal-therapy",
    title: "Отчёт рекомендация Образной Терапии",
    source: "по запросу и повторяющимся образам",
  },
];

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
  onOpenPersonalIntake,
  onStartAdvanced,
  onStartBrief,
}) {
  const hasBriefIntake = Boolean(firstIntakeResult);
  const primaryCtaLabel = hasBriefIntake ? "Повторный ИИ-приём" : "Пройти краткий ИИ-приём";

  return (
    <section className="compact-section-page" aria-labelledby="ai-intake-title">
      <div className="intake-option-row" aria-label="Варианты приёма">
        <button className="intake-option-pill active" type="button">
          ИИ-приём
        </button>
        <button className="intake-option-pill" type="button" onClick={onOpenPersonalIntake}>
          Приём у Мастера
        </button>
      </div>
      <article className="card compact-route-hero">
        <h2 id="ai-intake-title">ИИ-приём</h2>
        <p>Сначала AI поможет сделать краткий срез состояния. После него можно пройти расширенный приём.</p>
        <div className="compact-route-actions">
          <button className="primary-btn" type="button" onClick={onStartBrief}>
            {primaryCtaLabel}
          </button>
        </div>
        <p className="compact-route-note">
          {hasBriefIntake
            ? "Новый срез сохранится в историю."
            : "3-5 минут. После появится первая карта состояния."}
        </p>
      </article>

      <div className="compact-route-grid">
        <article className={hasBriefIntake ? "card compact-route-card" : "card compact-route-card soft-locked-card"}>
          <span>Расширенный ИИ-приём</span>
          <h3>Больше деталей</h3>
          <p>Можно пройти после краткого ИИ-приёма.</p>
          <button className="secondary-btn" disabled={!hasBriefIntake} type="button" onClick={onStartAdvanced}>
            {hasBriefIntake ? "Открыть расширенный ИИ-приём" : "Откроется после краткого приёма"}
          </button>
          <small className="compact-route-hint">
            {hasBriefIntake
              ? advancedAiResult
                ? "Последний расширенный срез сохранён"
                : "Доступен сейчас"
              : "Откроется после краткого приёма"}
          </small>
        </article>
        <article className="card compact-route-card">
          <span>Приём у Мастера</span>
          <h3>Живой разбор</h3>
          <p>Заявка на сопровождение со специалистом.</p>
          <button className="secondary-btn" type="button" onClick={onOpenPersonalIntake}>
            Открыть личный приём
          </button>
          <small className="compact-route-hint">Отдельный вариант в разделе Приём</small>
        </article>
      </div>
    </section>
  );
}

function ConsultationPlaceholder({
  bookingNoticeVisible,
  hasCompletedResults,
  onOpenAiIntake,
  onOpenReport,
  onSpecialistRequest,
}) {
  return (
    <section className="compact-section-page" aria-labelledby="consultations-title">
      <div className="intake-option-row" aria-label="Варианты приёма">
        <button className="intake-option-pill" type="button" onClick={onOpenAiIntake}>
          ИИ-приём
        </button>
        <button className="intake-option-pill active" type="button">
          Приём у Мастера
        </button>
      </div>
      <article className="card compact-route-hero">
        <h2 id="consultations-title">Приём у Мастера</h2>
        <p>Можно оставить заявку на живое сопровождение, если хочется разобрать состояние вместе со специалистом.</p>
        <div className="compact-route-actions">
          <button className="primary-btn" onClick={onSpecialistRequest} type="button">
            Оставить заявку
          </button>
          {hasCompletedResults && (
            <button className="secondary-btn" onClick={onOpenReport} type="button">
              Открыть последний отчёт
            </button>
          )}
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

function ProfileReportsPage({ hasCompletedResults, onBookSession, onOpenReport, onStartSelfAnalysis }) {
  const reportText = hasCompletedResults
    ? "Последний ИИ-отчёт доступен."
    : "ИИ-отчёты появятся после первого ИИ-приёма.";

  return (
    <section className="compact-section-page" aria-labelledby="profile-reports-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">Профиль</p>
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

export function NextStepsPage({
  activeTab = pageTabs.recommendations[0],
  accessLevel = "basic",
  hasCompletedResults,
  onBookSession,
  onOpenReport,
  onRepeatAiIntake,
  onStartSelfAnalysis,
}) {
  const selectedTab = pageTabs.recommendations.includes(activeTab) ? activeTab : pageTabs.recommendations[0];
  const hasPersonalAccess = accessRank[accessLevel] >= accessRank.personal;
  const hasExpandedAccess = accessRank[accessLevel] >= accessRank.expanded;

  if (selectedTab === "Отчёты Мастера") {
    return (
      <section className="compact-section-page" aria-labelledby="master-reports-title">
        <article className="card compact-route-hero">
          <p className="eyebrow">Отчёты Мастера</p>
          <h2 id="master-reports-title">
            {hasPersonalAccess ? "Отчёты Мастера добавляются вручную" : "Для доступа перейти на Пакет Персональный"}
          </h2>
          <p>
            {hasPersonalAccess
              ? "В этом разделе будут только отчёты, которые специалист подготовил и передал вручную после проверки."
              : "Мастер-отчёты не генерируются автоматически. Доступ открывается с пакета «Личный», после работы со специалистом."}
          </p>
          <div className="compact-route-actions">
            <button className="primary-btn" type="button" onClick={onBookSession}>
              {hasPersonalAccess ? "Запросить отчёт у Мастера" : "Перейти на Пакет Персональный"}
            </button>
          </div>
        </article>
        <article className="card soft-card master-report-safety">
          <h3>Без автогенерации</h3>
          <p>
            Раздел не создаёт мастер-отчёты сам и не показывает фиктивно успешную покупку. После заявки формат
            подтверждается отдельно.
          </p>
        </article>
      </section>
    );
  }

  if (!hasCompletedResults) {
    return (
      <section className="compact-section-page" aria-labelledby="ai-reports-empty-title">
        <article className="card compact-route-hero">
          <p className="eyebrow">ИИ-отчёты</p>
          <h2 id="ai-reports-empty-title">ИИ-отчёты появятся после ИИ-приёма</h2>
          <p>
            Сначала нужен короткий ИИ-приём, чтобы карточки опирались на ответы, а не на пустой шаблон.
            Отчёты Мастера добавляются специалистом вручную отдельно.
          </p>
          <div className="compact-route-actions">
            <button className="primary-btn" type="button" onClick={onStartSelfAnalysis}>Пройти ИИ-приём</button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="compact-section-page" aria-labelledby="ai-reports-title">
      <article className="card compact-route-hero">
        <p className="eyebrow">ИИ-отчёты</p>
        <h2 id="ai-reports-title">Пять направлений ИИ-отчётов</h2>
        <p>
          Это предварительные рабочие программы поддержки, а не медицинское назначение. Финальная версия
          требует проверки и не заменяет работу со специалистом.
        </p>
        <div className="compact-route-actions">
          <button className="primary-btn" disabled={!hasExpandedAccess} type="button">
            {hasExpandedAccess ? "Открыть ИИ-отчёты" : "Доступно в расширенном формате 5€"}
          </button>
          <button className="secondary-btn" type="button" onClick={onOpenReport}>Открыть текущие отчёты</button>
          <button className="secondary-btn" type="button" onClick={onRepeatAiIntake}>Пройти повторную проверку</button>
        </div>
      </article>

      <div className="compact-archive-grid next-plan-grid">
        {aiReportCards.map((report) => (
          <article
            className={hasExpandedAccess ? "card compact-route-card" : "card compact-route-card soft-locked-card"}
            key={report.id}
          >
            <span>{hasExpandedAccess ? report.source : "Расширенный формат 5€"}</span>
            <h3>{report.title}</h3>
            <p>
              {hasExpandedAccess
                ? "Каркас отчёта доступен по сохранённым результатам. Подробные рекомендации требуют проверки."
                : "Карточка видна как направление, но полный ИИ-отчёт закрыт до расширенного формата."}
            </p>
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

export function CabinetAuthGate({ initialPage = "self" } = {}) {
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

  return <ReportApp clientOverride={clientOverride} initialPage={initialPage} onSignOut={handleSignOut} userAction={signOutAction} />;
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
    return demoMode ? <ReportApp forceDemo initialPage="profile" /> : <CabinetAuthGate initialPage="profile" />;
  }

  if (path === "/demo") {
    return isDemoCabinetEnabled ? <ReportApp forceDemo /> : <LoginPage />;
  }

  return <LoginPage />;
}

export function ReportApp({ clientOverride = null, forceDemo = false, initialPage = "self", onSignOut = null, userAction = null }) {
  const [activePage, setActivePage] = useState(initialPage);
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
  const currentAccessLevel = clientOverride?.accessLevel || (forceDemo ? "expanded" : "basic");

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
    const targetPage = page === "overview" ? "self" : page;

    if (targetPage === "settings") {
      setActivePage("settings");
      setBookingNoticeVisible(false);
      setSelfAnalysisMode("overview");
      return;
    }
    if (!hasCompletedResults && targetPage === "expert") {
      setActivePage("profile");
      setBookingNoticeVisible(false);
      return;
    }
    if (tab) {
      setActiveTabs((current) => ({ ...current, [targetPage]: tab }));
      setActivePage(targetPage);
      setBookingNoticeVisible(false);
      return;
    }
    setActivePage(targetPage);
    setBookingNoticeVisible(false);
    if (targetPage !== "self") {
      setSelfAnalysisMode("overview");
    }
    if (targetPage !== "advanced") {
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
          <article className="card settings-card format-settings-card">
            <p className="eyebrow">Форматы</p>
            <h2>Пакеты доступа</h2>
            <p className="settings-note">
              Выбор формата здесь не запускает оплату и не подтверждает покупку. Доступ меняется только после
              отдельного подтверждения.
            </p>
            <div className="format-card-grid">
              {packageFormats.map((format) => {
                const isCurrent = format.id === currentAccessLevel;
                return (
                  <section className={isCurrent ? "format-card active" : "format-card"} key={format.id}>
                    <div>
                      <span>{format.title}</span>
                      <strong>{format.price}</strong>
                    </div>
                    <p>{format.description}</p>
                    <button className={isCurrent ? "secondary-btn" : "primary-btn"} type="button">
                      {isCurrent ? "Текущий формат" : "Запросить формат"}
                    </button>
                  </section>
                );
              })}
            </div>
            <p className="safety-note">
              Рекомендации и поддержка через препараты не являются медицинским назначением и требуют проверки специалистом.
            </p>
          </article>
        </section>
      );
    }
    if (activePage === "consultations") {
      return (
        <ConsultationPlaceholder
          bookingNoticeVisible={bookingNoticeVisible}
          hasCompletedResults={hasCompletedResults}
          onOpenAiIntake={() => handleNavigation("self")}
          onOpenReport={() => openResultReport(pageTabs.expert[0])}
          onSpecialistRequest={handleSpecialistRequest}
        />
      );
    }
    if (activePage === "profile") {
      return <ClientCabinet />;
    }
    if (activePage === "self") {
      if (selfAnalysisMode !== "form") {
        return (
          <AiIntakeDashboard
            advancedAiResult={advancedAiResult}
            firstIntakeResult={firstIntakeResult}
            onOpenPersonalIntake={() => handleNavigation("consultations")}
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
          accessLevel={currentAccessLevel}
          activeTab={activeTabs.recommendations}
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
      <AiIntakeDashboard
        advancedAiResult={advancedAiResult}
        firstIntakeResult={firstIntakeResult}
        onOpenPersonalIntake={() => handleNavigation("consultations")}
        onStartAdvanced={() => handleNavigation("advanced")}
        onStartBrief={openFirstIntake}
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
