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

export default function Layout({
  activePage,
  pageTabs,
  activeTab,
  focusMode = false,
  onTabChange,
  children,
  clientOverride = null,
  userAction = null,
}) {
  const currentNav = navigation.find((item) => item.id === activePage);
  const currentLabel = clientNavigation[activePage] || currentNav?.label;
  const cabinetClient = clientOverride || client;

  return (
    <div className={focusMode ? "app-shell focus-mode" : "app-shell"}>
      <aside className="sidebar" aria-label="Основная навигация">
        <div className="brand">
          <strong>PsiTherapy</strong>
          <span>Личный кабинет</span>
        </div>
        <nav className="nav-list">
          {navigation.map((item) => (
            <button
              className={item.id === activePage ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              {clientNavigation[item.id] || item.label}
            </button>
          ))}
        </nav>
        <div className="client-mini">
          <strong>{cabinetClient.name}</strong>
          <span>{cabinetClient.email || `ID ${cabinetClient.id}`}</span>
          <span>Статус: {cabinetClient.nextSession || "первичный анализ"}</span>
          {userAction}
        </div>
      </aside>

      <main className="main-shell">
        {!focusMode && (
          <section className="topbar">
            <div>
              <p className="eyebrow">{currentLabel}</p>
              <h1>{currentLabel}</h1>
              <p className="subtitle">
                {activePage === "self"
                  ? `${cabinetClient.name} · Первый диалог для прояснения текущего состояния`
                  : `${cabinetClient.name} · Фокус: ${cabinetClient.focus} · Последний срез: ${cabinetClient.lastSlice}`}
              </p>
            </div>
            {activePage !== "self" ? (
              <button className="primary-btn" type="button">
                {actionLabels[activePage] || "+ Новая оценка"}
              </button>
            ) : null}
          </section>
        )}

        <div className="mobile-nav" aria-label="Мобильная навигация">
          {navigation.map((item) => (
            <button
              className={item.id === activePage ? "tab active" : "tab"}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              {clientNavigation[item.id] || item.label}
            </button>
          ))}
        </div>

        {!focusMode && pageTabs?.length > 0 && (
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

        <aside className="specialist-panel">
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
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
