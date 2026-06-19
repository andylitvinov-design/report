import React from "react";
import { DynamicsChart, ThemeBars } from "../components/Charts.jsx";
import { FormulaList, MetricCard } from "../components/Cards.jsx";
import { overview } from "../data/mockData.js";

function CurrentDashboard() {
  return (
    <section className="cabinet-page-shell overview-page-shell" aria-labelledby="overview-current-title">
      <article className="cabinet-story-panel overview-story-panel">
        <div className="cabinet-hero-surface">
          <p className="eyebrow">Личная тетрадь</p>
          <h2 id="overview-current-title">Текущая карта состояния</h2>
          <p>
            Здесь собраны последние срезы: что забирает ресурс, где состояние уже меняется
            и какие темы требуют мягкого наблюдения.
          </p>
        </div>

        <div className="metrics-grid overview-metrics-grid">
          {overview.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <article className="cabinet-notebook-block">
          <div className="section-head">
            <div>
              <h3>Динамика</h3>
              <p>Снижение напряжения и восстановление ресурса по последним срезам.</p>
            </div>
          </div>
          <DynamicsChart points={overview.dynamics} />
        </article>
      </article>

      <aside className="cabinet-action-panel overview-action-panel" aria-label="Рабочие действия">
        <article className="cabinet-action-card">
          <p className="card-kicker">Следующий шаг</p>
          <h3>Формула поддержки</h3>
          <p>Повторная проверка через 7 дней.</p>
          <FormulaList items={overview.formula} />
        </article>
        <article className="cabinet-action-card soft">
          <h3>Ведущие темы</h3>
          <ThemeBars items={overview.themes} />
        </article>
        <p className="safety-note">
          Самоанализ и рекомендации не заменяют медицинскую или психотерапевтическую помощь.
        </p>
      </aside>
    </section>
  );
}

function AfterFirstStepList() {
  return (
    <div className="cabinet-step-list" aria-label="Что появится после первого шага">
      {["Самоотчёт", "Результаты", "Рекомендации", "История"].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function NewUserDashboard({
  bookingNoticeVisible,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <section className="cabinet-page-shell new-user-page-shell" aria-labelledby="new-user-title">
      <article className="cabinet-story-panel new-user-story-panel">
        <div className="cabinet-hero-surface">
          <p className="eyebrow">Первый шаг</p>
          <h2 id="new-user-title">Добро пожаловать в кабинет</h2>
          <p>
            Сначала мы создадим базовую точку состояния: что сейчас беспокоит, где
            теряется ресурс и какие темы требуют внимания.
          </p>
        </div>

        <div className="cabinet-notebook-block">
          <h3>Что создаст первый приём</h3>
          <p>
            После короткого самоанализа здесь появится личная тетрадь: самоотчёт,
            результаты, рекомендации и история наблюдений.
          </p>
          <AfterFirstStepList />
        </div>

        <p className="safety-note">
          Самоанализ не заменяет медицинскую или психотерапевтическую помощь.
        </p>
      </article>

      <aside className="cabinet-action-panel new-user-action-panel" aria-label="Первое действие">
        <article className="cabinet-action-card primary-action-card">
          <p className="card-kicker">Главный следующий шаг</p>
          <h3>Пройти первый приём — самоанализ</h3>
          <p>
            Ответьте на вопросы по одному. Система сохранит первичную карту состояния и
            откроет первый самоотчёт.
          </p>
          <button className="primary-btn full" onClick={onStartSelfAnalysis} type="button">
            Пройти первый приём
          </button>
        </article>

        <article className="cabinet-action-card">
          <h3>Заказать встречу со специалистом</h3>
          <p>Подходит, если хочется живого сопровождения и персонального разбора.</p>
          <button className="secondary-btn full" onClick={onSpecialistRequest} type="button">
            Заказать встречу
          </button>
        </article>

        {bookingNoticeVisible && (
          <p className="placeholder-notice" role="status">
            Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}

        <article className="cabinet-action-card compact-status-card">
          <span>Статус</span>
          <strong>Базовая точка ещё не создана</strong>
          <p>После первого приёма откроются результаты, рекомендации и история.</p>
        </article>
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
