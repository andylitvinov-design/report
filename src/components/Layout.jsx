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
  expert: "Открыть отчёт",
  recommendations: "Обновить назначение",
  self: "Начать самоанализ",
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
}) {
  const currentNav = navigation.find((item) => item.id === activePage);
  const navLabel = clientNavigation[activePage] || currentNav?.label;
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
  const topbarActionLabel = isNewUser && ["overview", "expert"].includes(activePage) ? "Пройти первый анализ" : actionLabels[activePage] || "+ Новая оценка";
  const subtitle = isNewUser
    ? `${client.name} / ID ${client.id} · Первый срез ещё не пройден`
    : `${client.name} / ID ${client.id} · Фокус: ${client.focus} · Последний срез: ${client.lastSlice}`;

  return (
    <div className={shellClassName}>
      <aside className="sidebar" aria-label="Основная навигация">
        <div className="brand">
          <strong>Holistic Therapy Cabinet</strong>
          <span>Кабинет натуральной терапии</span>
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
          <strong>{client.name}</strong>
          <span>ID {client.id}</span>
          <span>{isNewUser ? "Первый срез не пройден" : `Сессия: ${client.nextSession}`}</span>
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
            <button className="primary-btn" onClick={onPrimaryAction} type="button">{topbarActionLabel}</button>
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
          <article className="card">
            <h2>Комментарий специалиста</h2>
            <p>{specialistComments[activePage]}</p>
            <button className="primary-btn full" type="button">Запросить отчёт</button>
          </article>
          <article className="card soft-card">
            <h3>Следующий шаг</h3>
            <p>Если прошло 7-10 дней, лучше пройти короткий повторный срез.</p>
          </article>
        </aside>}
      </main>
    </div>
  );
}
