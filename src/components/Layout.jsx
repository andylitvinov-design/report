import React from "react";
import { client, navigation, specialistComments } from "../data/mockData.js";

const clientNavigation = {
  overview: "Профиль / Обзор",
  expert: "Результаты (Отчёт)",
  recommendations: "Назначение",
  self: "Первый приём (Анализ)",
  history: "Рекомендации",
};

const actionLabels = {
  overview: "+ Новая оценка",
  expert: "Открыть результаты",
  recommendations: "Обновить назначение",
  history: "Открыть динамику",
};

const lockedForNewUser = new Set(["expert", "recommendations", "history"]);

export default function Layout({
  activePage,
  pageTabs,
  activeTab,
  focusMode = false,
  hasCompletedResults = true,
  onPrimaryAction,
  onTabChange,
  children,
  clientOverride = null,
  userAction = null,
}) {
  const currentNav = navigation.find((item) => item.id === activePage);
  const navLabel = clientNavigation[activePage] || currentNav?.label;
  const cabinetClient = clientOverride || client;
  const isNewUser = !hasCompletedResults;
  const currentLabel = isNewUser && activePage === "expert"
    ? "Результаты появятся после первого анализа"
    : navLabel;
  const shellClassName = [
    "app-shell",
    focusMode ? "focus-mode" : "",
    isNewUser ? "new-user-shell" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const topbarActionLabel = isNewUser && ["overview", "expert"].includes(activePage)
    ? "Пройти первый анализ"
    : actionLabels[activePage] || "+ Новая оценка";
  const subtitle = isNewUser
    ? `${cabinetClient.name} · Первый срез ещё не пройден`
    : activePage === "self"
      ? `${cabinetClient.name} · Первый диалог для прояснения текущего состояния`
      : `${cabinetClient.name} · Фокус: ${cabinetClient.focus} · Последний срез: ${cabinetClient.lastSlice}`;

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
          <span>{cabinetClient.email || `ID ${cabinetClient.id}`}</span>
          <span>{isNewUser ? "Первый срез не пройден" : `Статус: ${cabinetClient.nextSession || "первичный анализ"}`}</span>
          {userAction}
        </div>
      </aside>

      <main className="main-shell">
        {!focusMode && (
          <section className="topbar">
            <div>
              <p className="eyebrow">{currentLabel}</p>
              <h1>{currentLabel}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
            {activePage !== "self" ? (
              <button className="primary-btn" onClick={onPrimaryAction} type="button">
                {topbarActionLabel}
              </button>
            ) : null}
          </section>
        )}

        <div className="mobile-nav" aria-label="Мобильная навигация">
          {navigation.map((item) => {
            const locked = isNewUser && lockedForNewUser.has(item.id);
            const nextStep = isNewUser && item.id === "self";
            const className = [
              "tab",
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
                {clientNavigation[item.id] || item.label}
              </button>
            );
          })}
        </div>

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

        {hasCompletedResults && <aside className="specialist-panel">
          {activePage === "self" ? (
            <>
              <article className="card">
                <h2>Как отвечать</h2>
                <p>{specialistComments[activePage]}</p>
                <button className="primary-btn full" type="button">Запросить отчёт</button>
              </article>
              <article className="card soft-card">
                <h3>Что получится</h3>
                <p>
                  После первичного диалога получится рабочая карта: что сейчас главное,
                  что усиливает состояние, что облегчает и какая поддержка может быть полезна.
                </p>
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
