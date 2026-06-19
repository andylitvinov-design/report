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
    <section className="new-user-dashboard cabinet-page-shell" aria-labelledby="new-user-title">
      <article className="cabinet-story-panel">
        <div className="cabinet-hero-surface">
          <p className="eyebrow">Первый шаг</p>
          <h2 id="new-user-title">Добро пожаловать в кабинет</h2>
          <p>
            Здесь начнётся ваша личная тетрадь состояния: сначала мы мягко соберём
            базовую точку, а после первого приёма откроются результаты, динамика и рекомендации.
          </p>

          <div className="cabinet-story-list" aria-label="Что будет создано">
            <span>Базовая точка текущего состояния</span>
            <span>Карта эмоциональных тем Bach</span>
            <span>Первый отчёт для дальнейшей работы</span>
          </div>

          <p className="cabinet-safety-note">
            Это пространство для самоанализа и подготовки к разговору со специалистом.
            Оно не заменяет медицинскую помощь и не ставит диагнозы.
          </p>
        </div>

        <div className="cabinet-notebook-strip" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </article>

      <aside className="cabinet-action-panel" aria-label="Первое действие">
        <div className="cabinet-action-head">
          <p className="card-kicker">С чего начать</p>
          <h3>Выберите формат первого приёма</h3>
          <p>Оба варианта ведут к первой рабочей карте, но с разным уровнем сопровождения.</p>
        </div>

        <div className="onboarding-options">
          <article className="onboarding-option primary-option">
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

        <div className="cabinet-status-block" aria-label="Статус кабинета">
          <span>Статус</span>
          <strong>Первый срез ещё не пройден</strong>
          <p>После завершения самоанализа кабинет откроет Results и сохранит базовую точку.</p>
        </div>
      </aside>
    </section>
  );
}

export default function Overview(props) {
  if (!props.hasCompletedResults) {
    return <NewUserDashboard {...props} />;
  }

  return <CurrentDashboard />;
}
