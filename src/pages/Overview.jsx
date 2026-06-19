import React from "react";
import WorkbookBook from "../components/workbook/WorkbookBook.jsx";
import WorkbookPage from "../components/workbook/WorkbookPage.jsx";
import WorkbookSafetyNote from "../components/workbook/WorkbookSafetyNote.jsx";
import WorkbookShell from "../components/workbook/WorkbookShell.jsx";
import { overview } from "../data/mockData.js";

function WorkbookActionButton({ children, description, onClick, variant = "secondary" }) {
  return (
    <button className={`workbook-overview-action ${variant}`} onClick={onClick} type="button">
      <span>{children}</span>
      {description ? <small>{description}</small> : null}
    </button>
  );
}

function AfterFirstStepList() {
  return (
    <div className="workbook-overview-list" aria-label="Что появится после первого шага">
      {["результаты", "поддержка", "динамика"].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function NewUserMobileOverview({
  bookingNoticeVisible,
  onContinueIntake,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <div className="workbook-mobile-overview" aria-label="Мягкий AI-приём">
      <section className="workbook-mobile-hero">
        <p className="workbook-kicker">Мягкий AI-сеанс</p>
        <h1 className="workbook-title">Начните с мягкого AI-приёма</h1>
        <p className="workbook-mobile-promise">
          AI задаст несколько бережных вопросов и создаст первую карту состояния.
        </p>
        <div className="workbook-mobile-primary">
          <button className="workbook-overview-action primary" onClick={onStartSelfAnalysis} type="button">
            <span>Пройти первый приём</span>
            <small>Guided AI session для первого среза</small>
          </button>
        </div>
      </section>

      <section className="workbook-mobile-secondary" aria-label="Другие варианты">
        <p className="workbook-kicker">Другие варианты</p>
        <div className="workbook-overview-actions">
          <WorkbookActionButton
            description="Оставить запрос на живое сопровождение"
            onClick={onSpecialistRequest}
          >
            Заказать встречу
          </WorkbookActionButton>
          <WorkbookActionButton
            description="Вернуться к сохранённым ответам"
            onClick={onContinueIntake}
          >
            Продолжить приём
          </WorkbookActionButton>
        </div>

        <section className="workbook-overview-note" aria-labelledby="mobile-after-first-step-title">
          <span aria-hidden="true">✦</span>
          <div>
            <h2 id="mobile-after-first-step-title">Что появится после первого шага</h2>
            <AfterFirstStepList />
          </div>
        </section>

        <WorkbookSafetyNote>
          Самонаблюдение помогает увидеть состояние мягче, но не заменяет медицинскую или
          психотерапевтическую помощь.
        </WorkbookSafetyNote>

        {bookingNoticeVisible && (
          <p className="placeholder-notice workbook-overview-status" role="status">
            Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
          </p>
        )}
      </section>
    </div>
  );
}

function NewUserWorkbook({
  bookingNoticeVisible,
  onContinueIntake,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <>
      <NewUserMobileOverview
        bookingNoticeVisible={bookingNoticeVisible}
        onContinueIntake={onContinueIntake}
        onSpecialistRequest={onSpecialistRequest}
        onStartSelfAnalysis={onStartSelfAnalysis}
      />
      <WorkbookBook className="workbook-overview-book workbook-overview-book-desktop">
        <WorkbookPage side="left" variant="message" backgroundVariant="lake">
          <p className="workbook-kicker">Мягкий AI-сеанс</p>
          <h1 className="workbook-title">Начните с мягкого AI-приёма</h1>
          <span className="workbook-title-rule" aria-hidden="true" />
          <p className="workbook-body workbook-lead">
            AI задаст несколько бережных вопросов, поможет заметить состояние и создать первую карту поддержки.
          </p>

          <section className="workbook-overview-note" aria-labelledby="after-first-step-title">
            <span aria-hidden="true">✦</span>
            <div>
              <h2 id="after-first-step-title">Что появится после первого шага</h2>
              <AfterFirstStepList />
            </div>
          </section>

          <WorkbookSafetyNote>
            Самонаблюдение помогает увидеть состояние мягче, но не заменяет медицинскую или
            психотерапевтическую помощь.
          </WorkbookSafetyNote>
        </WorkbookPage>

        <WorkbookPage side="right" variant="response">
          <p className="workbook-kicker">Сейчас</p>
          <h2 className="workbook-question">Что делаем сейчас?</h2>
          <div className="workbook-overview-actions" aria-label="Действия на сейчас">
            <WorkbookActionButton
              description="Создать первую карту состояния"
              onClick={onStartSelfAnalysis}
              variant="primary"
            >
              Пройти первый приём
            </WorkbookActionButton>
            <WorkbookActionButton
              description="Оставить запрос на живое сопровождение"
              onClick={onSpecialistRequest}
            >
              Заказать встречу
            </WorkbookActionButton>
            <WorkbookActionButton
              description="Вернуться к сохранённым ответам"
              onClick={onContinueIntake}
            >
              Продолжить приём
            </WorkbookActionButton>
          </div>
          {bookingNoticeVisible && (
            <p className="placeholder-notice workbook-overview-status" role="status">
              Раздел записи к специалисту ещё подключается. Запрос сохранён как следующий шаг.
            </p>
          )}
        </WorkbookPage>
      </WorkbookBook>
    </>
  );
}

function CurrentUserWorkbook({
  onAskAssistant,
  onOpenResults,
  onRepeatAiIntake,
}) {
  const [firstTheme, secondTheme] = overview.themes;
  const [firstFormula] = overview.formula;

  return (
    <WorkbookBook className="workbook-overview-book">
      <WorkbookPage side="left" variant="message" backgroundVariant="lake">
        <p className="workbook-kicker">Обзор</p>
        <h1 className="workbook-title">Сообщение для вас</h1>
        <span className="workbook-title-rule" aria-hidden="true" />
        <p className="workbook-body workbook-lead">
          Сейчас главное - бережно восстановить ресурс и не расширять нагрузку быстрее,
          чем состояние успевает стабилизироваться.
        </p>

        <section className="workbook-overview-note" aria-labelledby="current-state-title">
          <span aria-hidden="true">✦</span>
          <div>
            <h2 id="current-state-title">Что меняется</h2>
            <p>
              Напряжение постепенно снижается; в работе остаются {firstTheme.label.toLowerCase()}
              {secondTheme ? ` и ${secondTheme.label.toLowerCase()}` : ""}.
            </p>
            <p>Мягкая опора сейчас: {firstFormula} и короткий повторный срез через несколько дней.</p>
          </div>
        </section>

        <p className="workbook-overview-suggestion">
          Сегодня достаточно выбрать один следующий шаг и не превращать наблюдение в список задач.
        </p>
      </WorkbookPage>

      <WorkbookPage side="right" variant="response">
        <p className="workbook-kicker">Сейчас</p>
        <h2 className="workbook-question">Что делаем сейчас?</h2>
        <div className="workbook-overview-actions" aria-label="Действия на сейчас">
          <WorkbookActionButton description="Перейти к сохранённому отчёту" onClick={onOpenResults} variant="primary">
            Открыть результаты
          </WorkbookActionButton>
          <WorkbookActionButton description="Создать новую точку наблюдения" onClick={onRepeatAiIntake}>
            Пройти повторный ИИ-приём
          </WorkbookActionButton>
          <WorkbookActionButton description="Перейти к поддержке и вопросу" onClick={onAskAssistant}>
            Задать вопрос ассистенту
          </WorkbookActionButton>
        </div>
      </WorkbookPage>
    </WorkbookBook>
  );
}

export default function Overview({
  bookingNoticeVisible,
  clientName,
  hasCompletedResults,
  onAskAssistant,
  onContinueIntake,
  onNavigate,
  onOpenResults,
  onRepeatAiIntake,
  onSpecialistRequest,
  onStartSelfAnalysis,
}) {
  return (
    <WorkbookShell activeGroup="overview" onNavigate={onNavigate} userName={clientName}>
      <section className="workbook-overview-page" aria-label="Обзор мягкого AI-приёма">
        {hasCompletedResults ? (
          <CurrentUserWorkbook
            onAskAssistant={onAskAssistant}
            onOpenResults={onOpenResults}
            onRepeatAiIntake={onRepeatAiIntake}
          />
        ) : (
          <NewUserWorkbook
            bookingNoticeVisible={bookingNoticeVisible}
            onContinueIntake={onContinueIntake}
            onSpecialistRequest={onSpecialistRequest}
            onStartSelfAnalysis={onStartSelfAnalysis}
          />
        )}
      </section>
    </WorkbookShell>
  );
}
