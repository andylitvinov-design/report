import React, { useEffect, useMemo, useState } from "react";

const FIRST_INTAKE_INITIAL_ANSWERS = {
  mainConcern: "",
  feltArea: "",
  intensity: "",
  trigger: "",
  relief: "",
  desiredOutcome: "",
  notes: {},
};

const FIRST_INTAKE_STEPS = [
  {
    id: "mainConcern",
    label: "Главный фокус",
    therapist:
      "Смотрю на вашу текущую ситуацию. С чего лучше начать: что сейчас сильнее всего беспокоит?",
    options: [
      "Физическое состояние / симптомы",
      "Эмоции и тревога",
      "Усталость / нет сил",
      "Отношения / контакт с людьми",
      "Работа / деньги / реализация",
      "Не понимаю, что происходит",
    ],
  },
  {
    id: "feltArea",
    label: "Где ощущается",
    therapist: "Где это сейчас ощущается сильнее всего?",
    options: [
      "Голова / напряжение",
      "Грудь / дыхание",
      "Живот / пищеварение",
      "Кожа / воспаление",
      "Общая слабость",
      "В отношениях / контакте",
      "В мыслях / невозможности решить",
      "Другое",
    ],
  },
  {
    id: "intensity",
    label: "Сила состояния",
    therapist: "Насколько это сейчас сильно, если смотреть честно по последним дням?",
    options: [
      "1-3: слабо, но заметно",
      "4-6: мешает жить",
      "7-8: сильно захватывает",
      "9-10: почти невозможно выдерживать",
    ],
  },
  {
    id: "trigger",
    label: "Что усиливает",
    therapist: "Что обычно усиливает это состояние?",
    options: [
      "Стресс / спешка",
      "Конфликт / давление",
      "Одиночество",
      "Усталость / недосып",
      "Страх оценки",
      "Неопределённость",
      "Не знаю",
    ],
  },
  {
    id: "relief",
    label: "Что облегчает",
    therapist: "Что хотя бы немного облегчает состояние?",
    options: [
      "Отдых",
      "Поддержка другого человека",
      "Тепло / тело / прикосновение",
      "Понимание причины",
      "Природа / прогулка",
      "Структура и план",
      "Пока ничего",
    ],
  },
  {
    id: "desiredOutcome",
    label: "Желаемый результат",
    therapist: "Что было бы самым полезным результатом первого приёма?",
    options: [
      "Понять главную причину состояния",
      "Получить короткий план поддержки",
      "Понять, какой отчёт нужен специалисту",
      "Определить, что проверить дальше",
      "Собрать состояние в ясную картину",
    ],
  },
];

export default function SelfAnalysis({ onModeChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(FIRST_INTAKE_INITIAL_ANSWERS);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    onModeChange?.(isStarted && !isComplete ? "form" : "overview");
  }, [isComplete, isStarted, onModeChange]);

  const step = FIRST_INTAKE_STEPS[currentStep];
  const answeredSteps = useMemo(
    () => FIRST_INTAKE_STEPS.filter((item) => answers[item.id]),
    [answers]
  );

  const startDialog = () => {
    setIsStarted(true);
    setIsComplete(false);
  };

  const resetDialog = () => {
    setCurrentStep(0);
    setAnswers(FIRST_INTAKE_INITIAL_ANSWERS);
    setIsStarted(false);
    setIsComplete(false);
  };

  const chooseOption = (option) => {
    setAnswers((current) => ({ ...current, [step.id]: option }));

    if (currentStep < FIRST_INTAKE_STEPS.length - 1) {
      setCurrentStep((value) => value + 1);
      return;
    }

    setIsComplete(true);
  };

  const updateNote = (value) => {
    setAnswers((current) => ({
      ...current,
      notes: {
        ...current.notes,
        [step.id]: value,
      },
    }));
  };

  const goBack = () => {
    setIsComplete(false);
    setCurrentStep((value) => Math.max(value - 1, 0));
  };

  const continueClarifying = () => {
    setIsComplete(false);
    setCurrentStep(FIRST_INTAKE_STEPS.length - 1);
  };

  if (!isStarted) {
    return (
      <div className="first-intake-page">
        <article className="card first-intake-hero-card">
          <p className="eyebrow">Первичный диалог</p>
          <h2>Давайте спокойно проясним, что с вами сейчас происходит</h2>
          <p>
            Я задам несколько коротких вопросов. Отвечайте не идеально, а как есть сейчас.
            Нам важно поймать текущее состояние, главный узел и то, что сейчас требует поддержки.
          </p>
          <div className="overview-actions">
            <button className="primary-btn" onClick={startDialog} type="button">
              Начать первый приём
            </button>
            <button className="secondary-btn" onClick={resetDialog} type="button">
              Начать заново
            </button>
          </div>
        </article>

        <section className="self-overview-grid first-intake-status-grid">
          <article className="card status-card">
            <span>Формат</span>
            <strong>6 коротких шагов</strong>
            <p>Мягкий диалог вместо длинной анкеты.</p>
          </article>
          <article className="card status-card">
            <span>Цель</span>
            <strong>Прояснение</strong>
            <p>Рабочая карта состояния для специалиста, без медицинской диагностики.</p>
          </article>
          <article className="card status-card">
            <span>Черновик</span>
            <strong>{answeredSteps.length}/6</strong>
            <p>Ответы хранятся только локально в текущем сеансе.</p>
          </article>
        </section>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="first-intake-page">
        <article className="card first-intake-summary">
          <p className="eyebrow">Рабочая гипотеза</p>
          <h2>Предварительное понимание</h2>
          <p>Сейчас видно несколько важных точек:</p>
          <ol>
            <li>где находится главный дискомфорт;</li>
            <li>что его усиливает;</li>
            <li>что даёт хотя бы небольшое облегчение;</li>
            <li>какой результат первого анализа для вас сейчас важнее всего.</li>
          </ol>
          <p>
            На основе этого можно подготовить первичный отчёт специалиста. Это не медицинская
            диагностика, а рабочая карта текущего состояния для дальнейшего прояснения.
          </p>

          <div className="answer-recap" aria-label="Выбранные ответы">
            {FIRST_INTAKE_STEPS.map((item) => (
              <div className="answer-recap-row" key={item.id}>
                <span>{item.label}</span>
                <strong>{answers[item.id]}</strong>
              </div>
            ))}
          </div>

          <div className="overview-actions">
            <button className="primary-btn" type="button">Запросить отчёт специалиста</button>
            <button className="secondary-btn" onClick={continueClarifying} type="button">
              Продолжить уточнение
            </button>
            <button className="secondary-btn" type="button">Сохранить как черновик</button>
            <button className="secondary-btn" onClick={resetDialog} type="button">
              Начать заново
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="focused-form first-intake-dialog">
      <header className="form-progress card">
        <button className="secondary-btn" disabled={currentStep === 0} onClick={goBack} type="button">
          Назад
        </button>
        <div>
          <p className="eyebrow">Шаг {currentStep + 1} из {FIRST_INTAKE_STEPS.length}</p>
          <h1>{step.label}</h1>
        </div>
        <button className="secondary-btn" onClick={resetDialog} type="button">
          Начать заново
        </button>
      </header>

      <article className="card intake-chat-card">
        <p className="card-kicker">Первый приём</p>
        <h2>Давайте спокойно проясним, что с вами сейчас происходит</h2>
        <p className="dialog-description">
          Я задам несколько коротких вопросов. Отвечайте не идеально, а как есть сейчас.
          Нам важно поймать текущее состояние, главный узел и то, что сейчас требует поддержки.
        </p>

        <div className="chat-window" aria-live="polite">
          <div className="chat-bubble therapist-bubble">
            <span>Терапевт</span>
            <p>{step.therapist}</p>
          </div>

          {answeredSteps.map((item) => (
            <div className="chat-bubble user-bubble" key={item.id}>
              <span>Вы</span>
              <p>{answers[item.id]}</p>
              {answers.notes[item.id] ? <small>{answers.notes[item.id]}</small> : null}
            </div>
          ))}
        </div>

        <div className="option-grid" aria-label="Варианты ответа">
          {step.options.map((option) => (
            <button
              className={answers[step.id] === option ? "answer-chip active" : "answer-chip"}
              key={option}
              onClick={() => chooseOption(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <label className="field">
          <span>Добавить своими словами</span>
          <textarea
            onChange={(event) => updateNote(event.target.value)}
            placeholder="Коротко опишите нюанс, если хочется уточнить ответ."
            value={answers.notes[step.id] || ""}
          />
        </label>
      </article>
    </div>
  );
}
