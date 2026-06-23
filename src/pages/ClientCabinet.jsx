import React, { useState } from "react";
import { clientCabinet } from "../data/mockData.js";
import { getFriendlyCabinetError } from "../lib/cabinetDataGuards.js";

const sectionConfig = {
  orders: {
    title: "Мои заказы",
    intro: "Полученные мандалы и материалы, которые уже переданы клиенту.",
    empty: "Пока нет полученных мандал. Когда мастер передаст материал, он появится здесь.",
  },
  courses: {
    title: "Мои курсы",
    intro: "Курсы и программы, на которые клиент подписан.",
    empty: "Пока нет активных курсов.",
  },
  favorites: {
    title: "Избранное",
    intro: "Сохранённые услуги и материалы для быстрого доступа.",
    empty: "Пока ничего не добавлено в избранное.",
  },
  chat: {
    title: "Чат",
    intro: "Диалог с мастером и вход в сообщения.",
    empty: "Пока нет активного диалога. Здесь появятся сообщения после начала общения.",
  },
};

function EmptyState({ message, error }) {
  const friendlyError = getFriendlyCabinetError(error);

  return (
    <div className="empty-state">
      <strong>{friendlyError || message}</strong>
      <p>Раздел готов к работе и покажет данные, когда они будут доступны.</p>
    </div>
  );
}

function OrdersSection() {
  const { orders } = clientCabinet;

  return (
    <div className="client-section-list">
      {orders.items.length > 0 ? (
        orders.items.map((item) => (
          <article className="client-section-card" key={item.id}>
            <div>
              <span>{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <a className="text-link" href={item.href}>{item.action}</a>
          </article>
        ))
      ) : (
        <EmptyState message={sectionConfig.orders.empty} error={orders.error} />
      )}
    </div>
  );
}

function MasterDeliveredFeed() {
  const { orders } = clientCabinet;
  const deliveredItems = orders.items.filter((item) => item.status === "Передано мастером");

  if (deliveredItems.length === 0) {
    return null;
  }

  return (
    <section className="master-delivered-feed" aria-labelledby="master-delivered-title">
      <div className="master-delivered-heading">
        <p className="eyebrow">Лента кабинета</p>
        <h2 id="master-delivered-title">Передано мастером</h2>
      </div>
      <div className="master-delivered-list">
        {deliveredItems.map((item) => (
          <article className="master-delivered-card" key={item.id}>
            <div className="master-delivered-copy">
              <span className="master-delivered-status">{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <a className="master-delivered-action" href={item.href} aria-label={`${item.action}: ${item.title}`}>
              {item.action}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function CoursesSection() {
  const { courses } = clientCabinet;

  return (
    <div className="client-section-list">
      {courses.items.length > 0 ? (
        courses.items.map((item) => (
          <article className="client-section-card" key={item.id}>
            <div>
              <span>{item.progress}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <a className="text-link" href={item.href}>{item.action}</a>
          </article>
        ))
      ) : (
        <EmptyState message={sectionConfig.courses.empty} error={courses.error} />
      )}
    </div>
  );
}

function FavoritesSection() {
  const { favorites } = clientCabinet;

  return (
    <div className="client-section-list">
      {favorites.items.length > 0 ? (
        favorites.items.map((item) => (
          <article className="client-section-card" key={item.id}>
            <div>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <button className="secondary-btn" type="button">{item.action}</button>
          </article>
        ))
      ) : (
        <EmptyState message={sectionConfig.favorites.empty} error={favorites.error} />
      )}
    </div>
  );
}

function ChatSection() {
  const { chat } = clientCabinet;

  return (
    <div className="client-section-list">
      {chat.items.length > 0 ? (
        chat.items.map((item) => (
          <article className="client-section-card" key={item.id}>
            <div>
              <span>{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <button className="primary-btn" type="button">{item.action}</button>
          </article>
        ))
      ) : (
        <EmptyState message={sectionConfig.chat.empty} error={chat.error} />
      )}
    </div>
  );
}

const sectionRenderers = {
  orders: <OrdersSection />,
  courses: <CoursesSection />,
  favorites: <FavoritesSection />,
  chat: <ChatSection />,
};

export default function ClientCabinet() {
  const [activeSection, setActiveSection] = useState(clientCabinet.sections[0].id);
  const config = sectionConfig[activeSection] || sectionConfig.orders;

  return (
    <div className="client-cabinet">
      <section className="client-section-hero card">
        <div>
          <p className="eyebrow">Личный кабинет</p>
          <h2>{config.title}</h2>
          <p>{config.intro}</p>
        </div>
        <div className="client-section-switcher" aria-label="Разделы личного кабинета">
          {clientCabinet.sections.map((section) => (
            <button
              className={section.id === activeSection ? "tab active" : "tab"}
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </div>
      </section>

      <MasterDeliveredFeed />

      {activeSection === "orders" ? null : (sectionRenderers[activeSection] || sectionRenderers.orders)}
    </div>
  );
}
