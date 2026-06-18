import React, { useState } from "react";
import { client, navigation, specialistComments } from "../data/mockData.js";

const clientNavigation = {
  overview: "Профиль / Обзор",
  expert: "Результаты (Отчёт)",
  recommendations: "Назначение",
  self: "Первый приём (Анализ)",
  advanced: "Расширенный ИИ-анализ",
  history: "Рекомендации",
};

const actionLabels = {
  overview: "+ Новая оценка",
  expert: "Открыть результаты",
  recommendations: "Обновить назначение",
  settings: "Сохранить настройки",
  advanced: "Выбрать анализ",
  history: "Открыть динамику",
};

const lockedForNewUser = new Set(["expert", "recommendations", "history"]);

export default function Layout({
  activePage,
  pageTabs,
  activeTab,
  focusMode = false,
  hasCompletedResults = true,
  hideSpecialistPanel = false,
  onPrimaryAction,
  onTabChange,
  onOpenSettings,
  onSignOut,
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
    focusMode ? "focus-mode" : "",
    isNewUser ? "new-user-shell" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const mainShellClassName = [
    "main-shell",
    hideSpecialistPanel ? "no-specialist-panel" : "",
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
  const mobileMenuItems = [
    { id: "overview", label: clientNavigation.overview, page: "overview" },
    { id: "self", label: clientNavigation.self, page: "self" },
    { id: "advanced", label: clientNavigation.advanced, page: "advanced" },
    { id: "expert", label: clientNavigation.expert, page: "expert" },
    { id: "recommendations", label: clientNavigation.recommendations, page: "recommendations" },
    { id: "history", label: clientNavigation.history, page: "history" },
  ];

  const handleMobileNavigation = (item) => {
    onTabChange(item.page, item.tab);
    setIsMobileMenuOpen(false);
  };

  const handleOpenSettings = () => {
    onOpenSettings?.();
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    setIsMobileMenuOpen(false);
    onSignOut?.();
  };

  return (
    <div className={shellClassName}>
      <aside className="sidebar" aria-label="Основная навигация">
        <div className="brand">
          <strong>PsiTherapy</strong>
          <span>Личный кабинет</span>
        </div>
        <nav className="nav-list">
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
      </aside>

      <main className={mainShellClassName}>
        {!focusMode && (
          <section className="topbar">
            <div>
              <p className="eyebrow">{currentLabel}</p>
              <h1>{currentLabel}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
            {activePage !== "self" && activePage !== "settings" ? (
              <button className="primary-btn" onClick={onPrimaryAction} type="button">
                {topbarActionLabel}
              </button>
            ) : null}
          </section>
        )}

        {!focusMode && (
          <div className="mobile-menu" aria-label="Мобильная навигация">
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-cabinet-menu"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            >
              <span aria-hidden="true">☰</span>
              Меню
            </button>

            {isMobileMenuOpen && (
              <>
                <button
                  className="mobile-menu-backdrop"
                  type="button"
                  aria-label="Закрыть меню"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="mobile-menu-panel" id="mobile-cabinet-menu">
                  <div className="mobile-menu-header">
                    <strong>PsiTherapy</strong>
                    <button className="ghost-btn mobile-menu-close" type="button" onClick={() => setIsMobileMenuOpen(false)}>
                      Закрыть
                    </button>
                  </div>

                  <div className="mobile-menu-section">
                    <p className="mobile-menu-title">Разделы</p>
                    {mobileMenuItems.map((item) => {
                      const locked = isNewUser && lockedForNewUser.has(item.page);
                      const nextStep = isNewUser && item.page === "self";
                      const active = item.tab
                        ? activePage === item.page && activeTab === item.tab
                        : activePage === item.page;
                      const className = [
                        "mobile-menu-item",
                        active ? "active" : "",
                        locked ? "locked" : "",
                        nextStep ? "next-step" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <button
                          className={className}
                          key={item.id}
                          onClick={() => handleMobileNavigation(item)}
                          type="button"
                        >
                          <span>{item.label}</span>
                          {active && <small>текущий раздел</small>}
                          {!active && nextStep && <small>главный следующий шаг</small>}
                          {locked && <small>после первого среза</small>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mobile-account-card">
                    <p className="mobile-menu-title">Аккаунт</p>
                    <strong>{cabinetClient.name}</strong>
                    <span>{cabinetClient.email || accountId || "Email не указан"}</span>
                    <span>Статус: {accountStatus}</span>
                    {accountId && <span>{accountId}</span>}
                  </div>

                  <div className="mobile-account-actions">
                    <button className="secondary-btn" type="button" onClick={handleOpenSettings}>
                      Настройки
                    </button>
                    {onSignOut && (
                      <button className="ghost-warning-btn" type="button" onClick={handleSignOut}>
                        Выйти из кабинета
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!focusMode && !isNewUser && pageTabs?.length > 0 && (
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

        {hasCompletedResults && !hideSpecialistPanel && <aside className="specialist-panel">
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
