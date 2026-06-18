import React from "react";
import { DynamicsChart, ThemeBars } from "../components/Charts.jsx";
import { FormulaList, MetricCard } from "../components/Cards.jsx";
import { overview } from "../data/mockData.js";

function CurrentDashboard() {
  return (
    <>
      <div className="metrics-grid">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="card">
          <div className="section-head">
            <div>
              <h2>Динамика</h2>
              <p>Снижение напряжения и восстановление ресурса по последним срезам.</p>
            </div>
          </div>
          <DynamicsChart points={overview.dynamics} />
        </article>

        <article className="card">
          <h2>Ведущие темы</h2>
          <ThemeBars items={overview.themes} />
        </article>
      </div>

      <article className="card">
        <h2>Формула поддержки</h2>
        <p className="subtitle">Повторная проверка через 7 дней.</p>
        <FormulaList items={overview.formula} />
      </article>
    </>
  );
}

function NewUserDashboard({
  bookingNoticeVisible,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <section className="new-user-dashboard" aria-labelledby="new-user-title">
      <article className="card onboarding-card">
        <div className="onboarding-copy">
          <p className="eyebrow">Первый шаг</p>
          <h2 id="new-user-title">Добро пожаловать в кабинет</h2>
          <p>
            Чтобы подготовить первую оценку состояния, выберите удобный формат первого приёма.
          </p>
        </div>

        <div className="onboarding-options">
          <article className="onboarding-option">
            <div>
              <h3>Пройти первый приём — самоанализ</h3>
              <p>
                Заполните анкету, чтобы система собрала первичный срез состояния и подготовила
                основу для отчёта.
              </p>
            </div>
            <button className="primary-btn full" onClick={onStartSelfAnalysis} type="button">
              Пройти анкету
            </button>
          </article>

          <article className="onboarding-option">
            <div>
              <h3>Заказать встречу со специалистом</h3>
              <p>
                Выберите этот вариант, если хотите живую консультацию и персональный разбор.
              </p>
            </div>
            <button className="secondary-btn full" onClick={onSpecialistRequest} type="button">
              Заказать встречу
            </button>
          </article>
        </div>

        {bookingNoticeVisible && (
          <p className="placeholder-notice" role="status">
            Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}

        <p className="onboarding-footnote">
          После первого приёма здесь появятся результаты, динамика, рекомендации и отчёты.
        </p>
      </article>
    </section>
  );
}

export default function Overview(props) {
  if (!props.hasCompletedResults) {
    return <NewUserDashboard {...props} />;
  }

  return <CurrentDashboard />;
}
