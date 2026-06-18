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
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    onModeChange?.("overview");
  }, [onModeChange]);

  const step = FIRST_INTAKE_STEPS[currentStep];
  const answeredSteps = useMemo(
    () => FIRST_INTAKE_STEPS.filter((item) => answers[item.id]),
    [answers]
  );
  const visibleSteps = isComplete
    ? FIRST_INTAKE_STEPS
    : FIRST_INTAKE_STEPS.slice(0, currentStep + 1);
  const progressLabel = isComplete
    ? `Шаг ${FIRST_INTAKE_STEPS.length} из ${FIRST_INTAKE_STEPS.length}`
    : `Шаг ${currentStep + 1} из ${FIRST_INTAKE_STEPS.length}`;

  const resetDialog = () => {
    setCurrentStep(0);
    setAnswers(FIRST_INTAKE_INITIAL_ANSWERS);
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

  return (
    <div className="first-intake-page first-intake-dialog">
      <article className="card intake-chat-card">
        <header className="chat-card-header">
          <div>
            <p className="card-kicker">Первый приём</p>
            <h2>Диалог для прояснения состояния</h2>
          </div>
          <span className="chat-progress">{progressLabel}</span>
        </header>

        <div className="chat-window" aria-live="polite">
          <div className="chat-bubble therapist-bubble intro-bubble">
            <span>Специалист</span>
            <p>Я задам несколько коротких вопросов, чтобы прояснить текущее состояние.</p>
          </div>

          {visibleSteps.map((item) => (
            <React.Fragment key={item.id}>
              <div className="chat-bubble therapist-bubble">
                <span>Специалист</span>
                <p>{item.therapist}</p>
              </div>
              {answers[item.id] ? (
                <div className="chat-bubble user-bubble">
                  <span>Вы</span>
                  <p>{answers[item.id]}</p>
                  {answers.notes[item.id] ? <small>{answers.notes[item.id]}</small> : null}
                </div>
              ) : null}
            </React.Fragment>
          ))}

          {isComplete ? (
            <div className="chat-bubble therapist-bubble final-bubble">
              <span>Специалист</span>
              <p>
                Спасибо. Уже видно несколько важных точек, из которых можно собрать
                предварительное понимание и рабочую карту для дальнейшего прояснения.
              </p>
            </div>
          ) : null}
        </div>

        {!isComplete ? (
          <>
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

            <label className="field compact-note">
              <span>Добавить своими словами</span>
              <textarea
                id={`first-intake-note-${step.id}`}
                name={`first-intake-note-${step.id}`}
                onChange={(event) => updateNote(event.target.value)}
                placeholder="Коротко опишите нюанс, если хочется уточнить ответ."
                value={answers.notes[step.id] || ""}
              />
            </label>
          </>
        ) : (
          <section className="intake-summary-panel" aria-label="Предварительное понимание">
            <h3>Предварительное понимание</h3>
            <div className="summary-point-grid">
              <div>
                <span>Что сейчас главное</span>
                <strong>{answers.mainConcern}</strong>
                <p>{answers.feltArea} · {answers.intensity}</p>
              </div>
              <div>
                <span>Что усиливает</span>
                <strong>{answers.trigger}</strong>
                <p>Это может быть полезно проверить в динамике последних дней.</p>
              </div>
              <div>
                <span>Что облегчает</span>
                <strong>{answers.relief}</strong>
                <p>Эта опора может войти в короткий план поддержки.</p>
              </div>
              <div>
                <span>Что прояснять дальше</span>
                <strong>{answers.desiredOutcome}</strong>
                <p>Это не медицинская диагностика, а материал для специалиста.</p>
              </div>
            </div>
          </section>
        )}

        <footer className="chat-actions">
          {!isComplete && answeredSteps.length > 0 ? (
            <button className="secondary-btn" onClick={goBack} type="button">
              Назад
            </button>
          ) : null}
          {!isComplete && answeredSteps.length > 0 ? (
            <button className="secondary-btn" onClick={resetDialog} type="button">
              Начать заново
            </button>
          ) : null}
          {isComplete ? (
            <>
              <button className="primary-btn" type="button">Запросить отчёт специалиста</button>
              <button className="secondary-btn" onClick={continueClarifying} type="button">
                Продолжить уточнение
              </button>
              <button className="secondary-btn" onClick={resetDialog} type="button">
                Начать заново
              </button>
            </>
          ) : null}
        </footer>
      </article>
    </div>
  );
}
