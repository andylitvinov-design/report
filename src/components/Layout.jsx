import React from "react";
import { client, navigation, specialistComments } from "../data/mockData.js";

export default function Layout({ activePage, pageTabs, activeTab, onTabChange, children }) {
  const currentNav = navigation.find((item) => item.id === activePage);

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Основная навигация">
        <div className="brand">
          <strong>Holistic Therapy Cabinet</strong>
          <span>Кабинет натуральной терапии</span>
        </div>
        <nav className="nav-list">
          {navigation.map((item) => (
            <button
              className={item.id === activePage ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="client-mini">
          <strong>{client.name}</strong>
          <span>ID {client.id}</span>
          <span>Сессия: {client.nextSession}</span>
        </div>
      </aside>

      <main className="main-shell">
        <section className="topbar">
          <div>
            <p className="eyebrow">{currentNav?.label}</p>
            <h1>{currentNav?.label}</h1>
            <p className="subtitle">
              {client.name} / ID {client.id} · Фокус: {client.focus} · Последний срез: {client.lastSlice}
            </p>
          </div>
          <button className="primary-btn" type="button">+ Новая оценка</button>
        </section>

        <div className="mobile-nav" aria-label="Мобильная навигация">
          {navigation.map((item) => (
            <button
              className={item.id === activePage ? "tab active" : "tab"}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        {pageTabs?.length > 0 && (
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
          <article className="card">
            <h2>Комментарий специалиста</h2>
            <p>{specialistComments[activePage]}</p>
            <button className="primary-btn full" type="button">Запросить анализ</button>
          </article>
          <article className="card soft-card">
            <h3>Следующий шаг</h3>
            <p>Если прошло 7-10 дней, лучше пройти короткий повторный срез.</p>
          </article>
        </aside>
      </main>
    </div>
  );
}
