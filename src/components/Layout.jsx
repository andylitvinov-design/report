import React, { useState } from "react";
import { AnalysisMenuCard } from "./Cards.jsx";
import WorkbookShell from "./workbook/WorkbookShell.jsx";
import {
  client,
  navigation,
  specialistComments,
  therapeuticNavigatorHint,
  topNavigation,
} from "../data/mockData.js";

const clientNavigation = {
  overview: "Приём",
  profile: "Профиль",
  expert: "Результаты (Отчёт)",
  recommendations: "Что делать",
  self: "ИИ-приём",
  advanced: "Расширенный ИИ-анализ",
  history: "Рекомендации",
  consultations: "Приём у Мастера",
  settings: "Настройки",
};

const actionLabels = {
  overview: "Пройти краткий ИИ-приём",
  profile: "Пройти анализ",
  expert: "Открыть результаты",
  recommendations: "Обновить назначение",
  settings: "Сохранить настройки",
  advanced: "Выбрать анализ",
  history: "Открыть динамику",
  consultations: "Заказать встречу",
};

const lockedForNewUser = new Set(["expert", "recommendations", "history"]);
const therapeuticSections = new Set(["profile", "self"]);
const mobilePrimaryNavigation = [
  { id: "intake", label: "Приём", page: "self", pages: ["self", "advanced", "consultations"] },
  { id: "profile", label: "Профиль", page: "profile", pages: ["profile", "history", "settings"] },
  { id: "next-actions", label: "Что делать", page: "recommendations", pages: ["recommendations", "expert"] },
];

export default function Layout({
  activePage,
  activeAnalysisId,
  analysisGroups = [],
  pageTabs,
  activeTab,
  focusMode = false,
  hasCompletedResults = true,
  hideSpecialistPanel = false,
  workbookMode = false,
  onPrimaryAction,
  onTabChange,
  onOpenSettings,
  onSelectAnalysis,
  onSignOut,
  onStartAnalysis,
  children,
  clientOverride = null,
  userAction = null,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentNav = navigation.find((item) => item.id === activePage);
  const navLabel = clientNavigation[activePage] || currentNav?.label;
  const cabinetClient = clientOverride || client;
  const isNewUser = !hasCompletedResults;
  const currentLabel = activePage === "settings"
    ? "Настройки"
    : isNewUser && activePage === "expert"
      ? "Результаты появятся после первого анализа"
      : navLabel;
  const shellClassName = [
    "app-shell",
    activePage ? `page-${activePage}` : "",
    focusMode ? "focus-mode" : "",
    workbookMode ? "workbook-mode" : "",
    isNewUser ? "new-user-shell" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const mainShellClassName = [
    "main-shell",
    activePage ? `page-${activePage}-main` : "",
    hideSpecialistPanel ? "no-specialist-panel" : "",
    workbookMode ? "workbook-main-shell" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const topbarActionLabel = isNewUser && ["overview", "expert"].includes(activePage)
    ? "Пройти первый анализ"
    : actionLabels[activePage] || "+ Новая оценка";
  const subtitle = activePage === "settings"
    ? `${cabinetClient.name} · Аккаунт и вход`
    : isNewUser
      ? `${cabinetClient.name} · Первый срез ещё не пройден`
      : activePage === "advanced"
        ? `${cabinetClient.name} · Углублённые тесты в формате мягкого диалога`
      : activePage === "self"
        ? `${cabinetClient.name} · Первый диалог для прояснения текущего состояния`
        : `${cabinetClient.name} · Фокус: ${cabinetClient.focus} · Последний срез: ${cabinetClient.lastSlice}`;
  const accountStatus = cabinetClient.nextSession || (isNewUser ? "первый срез не пройден" : "первичный анализ");
  const accountId = cabinetClient.id ? `ID ${cabinetClient.id}` : null;
  const mobileMenuItems = mobilePrimaryNavigation;
  const activeMobileMenuItem =
    mobileMenuItems.find((item) => item.pages.includes(activePage)) || mobileMenuItems[0];
  const showTherapeuticNavigator = therapeuticSections.has(activePage);

  const handleMobileNavigation = (item) => {
    onTabChange(item.page, item.tab);
    setIsMobileMenuOpen(false);
  };

  if (workbookMode) {
    return (
      <WorkbookShell
        activePage={activePage}
        activeTab={activeTab}
        onNavigate={onTabChange}
        userName={cabinetClient.name}
      >
        <main className={mainShellClassName}>
          <section className="workspace">{children}</section>
        </main>
      </WorkbookShell>
    );
  }

  return (
    <div className={shellClassName}>
      {!workbookMode && <header className="global-topbar" aria-label="Основные разделы сайта">
        <div className="brand">
          <strong>PsiTherapy</strong>
          <span>Личный кабинет</span>
        </div>
        <nav className="top-nav-list">
          {topNavigation.map((item) => {
            const locked = isNewUser && lockedForNewUser.has(item.id);
            const nextStep = isNewUser && item.id === "self";
            const className = [
              "top-nav-item",
              item.id === activePage ? "active" : "",
              locked ? "locked" : "",
              nextStep ? "next-step" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                className={className}
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>}

      {!workbookMode && <aside className="sidebar context-sidebar" aria-label="Контекстный навигатор раздела">
        {showTherapeuticNavigator ? (
          <>
            <article className="therapy-hint-card">
              <span>Навигатор</span>
              <p>{therapeuticNavigatorHint}</p>
            </article>
            <nav className="therapeutic-context-menu" aria-label="Тесты и анализы">
              {analysisGroups.map((group) => (
                <AnalysisMenuCard
                  activeId={activeAnalysisId}
                  group={group}
                  key={group.group}
                  onSelectAnalysis={onSelectAnalysis}
                  onStartAnalysis={onStartAnalysis}
                />
              ))}
            </nav>
          </>
        ) : (
          <nav className="nav-list" aria-label="Контекст раздела">
            {navigation.map((item) => {
              const locked = isNewUser && lockedForNewUser.has(item.id);
              const nextStep = isNewUser && item.id === "self";
              const className = [
                "nav-item",
                item.id === activePage ? "active" : "",
                locked ? "locked" : "",
                nextStep ? "next-step" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  className={className}
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  type="button"
                >
                  <span>{clientNavigation[item.id] || item.label}</span>
                  {nextStep && <small>главный следующий шаг</small>}
                  {locked && <small>после первого среза</small>}
                </button>
              );
            })}
          </nav>
        )}
        <div className="client-mini">
          <strong>{cabinetClient.name}</strong>
          <span>{cabinetClient.email || accountId}</span>
          <span>Статус: {accountStatus}</span>
          {accountId && <span>{accountId}</span>}
          {onOpenSettings && (
            <button className="secondary-btn sidebar-settings" type="button" onClick={onOpenSettings}>
              Настройки
            </button>
          )}
          {userAction}
        </div>
      </aside>}

      <main className={mainShellClassName}>
        {!focusMode && !workbookMode && (
          <section className="topbar">
            <div>
              <p className="eyebrow">{currentLabel}</p>
              <h1>{currentLabel}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
            {onPrimaryAction && activePage !== "self" && activePage !== "settings" ? (
              <button className="primary-btn" onClick={onPrimaryAction} type="button">
                {topbarActionLabel}
              </button>
            ) : null}
          </section>
        )}

        {!focusMode && !workbookMode && (
          <div className="mobile-menu" aria-label="Мобильная навигация">
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-cabinet-menu"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            >
              <span>{activeMobileMenuItem.label}</span>
              <span aria-hidden="true">▾</span>
            </button>

            {isMobileMenuOpen && (
              <div className="mobile-menu-panel" id="mobile-cabinet-menu">
                {mobileMenuItems.map((item) => {
                  const active = item.pages.includes(activePage);
                  const className = [
                    "mobile-menu-item",
                    active ? "active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      aria-current={active ? "page" : undefined}
                      className={className}
                      key={item.id}
                      onClick={() => handleMobileNavigation(item)}
                      type="button"
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!focusMode && !workbookMode && !isNewUser && pageTabs?.length > 0 && (
          <div className="tabs" aria-label="Разделы страницы">
            {pageTabs.map((tab) => (
              <button
                className={tab === activeTab ? "tab active" : "tab"}
                key={tab}
                onClick={() => onTabChange(activePage, tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <section className="workspace">{children}</section>

        {hasCompletedResults && !workbookMode && !hideSpecialistPanel && <aside className="specialist-panel">
          {activePage === "self" || activePage === "advanced" ? (
            <>
              <article className="card">
                <h2>{activePage === "advanced" ? "Как проходить тест" : "Как отвечать"}</h2>
                <p>{specialistComments[activePage]}</p>
                <button className="primary-btn full" type="button">Запросить отчёт</button>
              </article>
              <article className="card soft-card">
                <h3>{activePage === "advanced" ? "Что сохранится" : "Что получится"}</h3>
                {activePage === "advanced" ? (
                  <p>
                    После завершения можно сохранить последний расширенный анализ в раздел результатов
                    как материал для специалиста.
                  </p>
                ) : (
                  <p>
                    После первичного диалога получится рабочая карта: что сейчас главное,
                    что усиливает состояние, что облегчает и какая поддержка может быть полезна.
                  </p>
                )}
              </article>
              <p className="safety-note">Самоанализ и рекомендации не заменяют медицинскую или психотерапевтическую помощь.</p>
            </>
          ) : (
            <>
              <article className="card">
                <h2>Комментарий специалиста</h2>
                <p>{specialistComments[activePage]}</p>
                <button className="primary-btn full" type="button">Запросить отчёт</button>
              </article>
              <article className="card soft-card">
                <h3>Следующий шаг</h3>
                <p>Если прошло 7-10 дней, лучше пройти короткий повторный срез.</p>
              </article>
              <p className="safety-note">Самоанализ и рекомендации не заменяют медицинскую или психотерапевтическую помощь.</p>
            </>
          )}
        </aside>}
      </main>
    </div>
  );
}
