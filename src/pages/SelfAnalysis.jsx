import React, { useEffect, useMemo, useRef, useState } from "react";
import { selfAnalysis } from "../data/mockData.js";
import { calculateRemedyResults } from "../lib/bachScoring.js";
import {
  FIRST_INTAKE_PROGRESS_KEY,
  FIRST_INTAKE_RESULT_KEY,
  readJsonStorage,
  removeStorageItem,
  writeJsonStorage,
} from "../lib/firstIntakeStorage.js";
import {
  createHybridAnswer,
  getAnswerFreeText,
  getAnswerTags,
  getAnswerText,
  hasAnswerContent,
} from "../lib/firstIntakeAnswers.js";

const baselineSteps = [
  {
    id: "mainConcern",
    label: "Главная точка состояния",
    question: "Что сейчас больше всего забирает силы или внимание?",
    type: "text",
    placeholder: "Например: усталость после общения, тревога утром, напряжение в груди...",
    tagOptions: [
      "Усталость / нет сил",
      "Тревога",
      "Напряжение в теле",
      "Кожа / воспаление",
      "Не понимаю, что происходит",
    ],
  },
  {
    id: "feltArea",
    label: "Где ощущается",
    question: "Где это ощущается сильнее всего?",
    type: "text",
    placeholder: "Можно уточнить место, ситуацию или ощущение.",
    tagOptions: [
      "Голова",
      "Грудь / дыхание",
      "Живот",
      "Кожа",
      "В мыслях",
    ],
  },
  {
    id: "problemStrength",
    label: "Сила влияния",
    question: "Насколько сильно это сейчас влияет на состояние — от 0 до 10?",
    type: "scale10",
    helper: "0 — почти не влияет, 10 — захватывает почти полностью.",
  },
  {
    id: "resourceLevel",
    label: "Внутренний ресурс",
    question: "Сколько внутреннего ресурса сейчас ощущается — от 0 до 10?",
    type: "scale10",
    helper: "0 — совсем нет сил, 10 — чувствую устойчивую опору.",
  },
  {
    id: "anxietyLevel",
    label: "Тревога / напряжение",
    question: "Сколько тревоги или внутреннего напряжения сейчас — от 0 до 10?",
    type: "scale10",
  },
  {
    id: "fatigueLevel",
    label: "Усталость",
    question: "Насколько выражена усталость — от 0 до 10?",
    type: "scale10",
  },
  {
    id: "lifeImpact",
    label: "Влияние на жизнь",
    question: "Насколько это мешает жить и действовать — от 0 до 10?",
    type: "scale10",
  },
  {
    id: "trigger",
    label: "Что усиливает",
    question: "Что обычно делает это состояние сильнее?",
    type: "text",
    placeholder: "Можно добавить свою ситуацию или время дня.",
    tagOptions: [
      "Стресс / спешка",
      "Конфликт / давление",
      "Страх оценки",
      "Недосып / усталость",
      "Неопределённость",
    ],
  },
  {
    id: "relief",
    label: "Что облегчает",
    question: "Что хотя бы немного помогает или возвращает опору?",
    type: "text",
    placeholder: "Можно добавить свою опору или уточнение.",
    tagOptions: [
      "Отдых",
      "Поддержка человека",
      "Тепло / тело",
      "Природа / прогулка",
      "Понимание причины",
    ],
  },
  { id: "freeComment", label: "Комментарий", question: "Хотите добавить своими словами?", type: "comment", placeholder: "Коротко добавьте важный нюанс." },
];

const therapySteps = [
  { id: "desiredChange", label: "Что изменить", question: "Что хочется изменить?", placeholder: "Что должно стать иначе в состоянии или реакции?" },
  { id: "desiredResult1to3Sessions", label: "Результат 1-3 сессии", question: "Какой результат был бы ценным через 1-3 сессии?", placeholder: "Например: больше ясности, ниже напряжение, понятный следующий шаг." },
  { id: "mustNotLose", label: "Что сохранить", question: "Что важно не потерять?", placeholder: "Что должно остаться бережно сохранено?" },
  { id: "preferredSupport", label: "Поддержка", question: "Какая поддержка кажется подходящей?", placeholder: "Структура, мягкое сопровождение, телесные практики, разговор..." },
  { id: "formulatedRequest", label: "Формулировка запроса", question: "Сформулируем запрос: что вы хотите получить от работы?", placeholder: "Я хочу прояснить / изменить / укрепить..." },
];

const parts = [
  { id: "baseline", title: "Базовая точка состояния", shortTitle: "Базовая точка состояния", kind: "baseline", steps: baselineSteps },
  { id: "bachSituation", title: "Bach: что похоже на состояние сейчас", shortTitle: "Bach: состояние сейчас", kind: "bach", source: "situation" },
  { id: "bachCharacter", title: "Bach: что часто повторяется", shortTitle: "Bach: повторяющиеся темы", kind: "bach", source: "character" },
  { id: "bachControl", title: "Bach: что держит напряжение", shortTitle: "Bach: острое напряжение", kind: "bach", source: "control" },
  { id: "therapyRequest", title: "Запрос на терапию", shortTitle: "Запрос на терапию", kind: "therapy", steps: therapySteps },
];

const makeInitialState = () => ({
  version: 1,
  currentPartIndex: 0,
  currentStepIndex: 0,
  answers: {
    baseline: {},
    bach: {},
    therapyRequest: {},
  },
  status: "draft",
  updatedAt: null,
  completedAt: null,
  pendingTransitionToPartIndex: null,
});

const partIntroText = {
  baseline: "Часть 1 — измеримая базовая точка: что беспокоит и насколько сильно.",
  bachSituation: "Смотрим текущие эмоциональные состояния, связанные с ситуацией.",
  bachCharacter: "Смотрим устойчивые эмоциональные паттерны, которые могут повторяться в разных ситуациях.",
  bachControl: "Смотрим точки острого напряжения и контроля, которые сейчас могут усиливать нагрузку.",
  therapyRequest: "Формулируем запрос: что хочется изменить и какую поддержку важно получить.",
};

const formatDateTime = (value) => {
  if (!value) return "нет даты";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const answerLabel = (step, value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  if (step.type === "scale10") {
    return `${value}/10`;
  }
  if (step.kind === "bach") {
    const labels = ["0 - нет / не про меня", "1 - немного", "2 - заметно", "3 - сильно"];
    return labels[Number(value)] || String(value);
  }
  return getAnswerText(value);
};

const getPartSteps = (part) => {
  if (part.kind === "bach") {
    return selfAnalysis.questions
      .filter((question) => question.section === part.source)
      .map((question, index) => ({
        id: question.id,
        label: `Bach ${index + 1}`,
        question: question.text,
        kind: "bach",
        source: part.source,
        remedy: question.remedy,
        theme: question.theme,
      }));
  }

  return part.steps;
};

const getAnswerGroup = (state, part) => {
  if (part.kind === "baseline") return state.answers.baseline;
  if (part.kind === "therapy") return state.answers.therapyRequest;
  return state.answers.bach;
};

const buildFormulatedRequest = (therapyRequest, baseline) =>
  [
    `Я хочу прояснить / изменить / укрепить: ${getAnswerText(therapyRequest.formulatedRequest || therapyRequest.desiredChange) || "текущий запрос требует уточнения"}.`,
    `Сейчас больше всего мешает: ${getAnswerText(baseline.mainConcern) || "не указано"}.`,
    `Хочу прийти к: ${getAnswerText(therapyRequest.desiredResult1to3Sessions) || "понятному результату на ближайшие 1-3 сессии"}.`,
    `Важно учитывать: ${getAnswerText(therapyRequest.mustNotLose) || "сохранить ресурс и устойчивость"}.`,
  ].join(" ");

const calculateIntakeResult = (state) => {
  const now = new Date().toISOString();
  const baseline = {
    ...state.answers.baseline,
    updatedAt: now,
  };
  const bachResults = calculateRemedyResults({
    questions: selfAnalysis.questions,
    scores: state.answers.bach,
  });
  const therapyRequest = {
    ...state.answers.therapyRequest,
    formulatedRequest: buildFormulatedRequest(state.answers.therapyRequest, baseline),
    updatedAt: now,
  };

  return {
    version: 1,
    symptomBaseline: baseline,
    bachResults,
    therapyRequest,
    status: "completed",
    completedAt: now,
  };
};

function BaselineSummaryCard({ baseline }) {
  return (
    <section className="intake-summary-panel" aria-label="Базовая точка состояния">
      <h3>Базовая точка состояния</h3>
      <div className="summary-point-grid">
        <div>
          <span>Проблема</span>
          <strong>{baseline.problemStrength ?? "не указано"}/10</strong>
          <p>{getAnswerText(baseline.mainConcern) || "Главная точка состояния требует уточнения."}</p>
        </div>
        <div>
          <span>Ресурс</span>
          <strong>{baseline.resourceLevel ?? "не указано"}/10</strong>
          <p>{getAnswerText(baseline.relief) || "Опора требует уточнения."}</p>
        </div>
        <div>
          <span>Тревога / усталость</span>
          <strong>{baseline.anxietyLevel ?? "не указано"}/10 · {baseline.fatigueLevel ?? "не указано"}/10</strong>
          <p>Первая измеримая точка для будущего сравнения.</p>
        </div>
        <div>
          <span>Влияние и триггер</span>
          <strong>{baseline.lifeImpact ?? "не указано"}/10</strong>
          <p>{getAnswerText(baseline.trigger) || "Триггер требует уточнения."}</p>
        </div>
        {hasAnswerContent(baseline.freeComment) ? (
          <div>
            <span>Комментарий клиента</span>
            <strong>{getAnswerText(baseline.freeComment)}</strong>
            <p>Сохранено в рабочую карту.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CompactBaselineStrip({ baseline }) {
  return (
    <div className="baseline-status-strip" aria-label="Краткая базовая точка">
      <span>Базовая точка сохранена</span>
      <strong>Проблема {baseline.problemStrength ?? "не указано"}/10</strong>
      <strong>Ресурс {baseline.resourceLevel ?? "не указано"}/10</strong>
    </div>
  );
}

function RestartChoiceSheet({ onCancel, onResetCurrentPart, onResetFullIntake }) {
  return (
    <div className="intake-reset-overlay" role="presentation">
      <article
        aria-labelledby="intake-reset-title"
        aria-modal="true"
        className="intake-reset-sheet"
        role="dialog"
      >
        <header>
          <p className="card-kicker">Начать заново</p>
          <h2 id="intake-reset-title">Что начать заново?</h2>
        </header>
        <p>Можно очистить только текущую часть или начать весь первый приём сначала.</p>
        <div className="intake-reset-actions">
          <button className="secondary-btn" onClick={onResetCurrentPart} type="button">
            Начать заново текущий раздел
          </button>
          <button className="secondary-btn danger-action" onClick={onResetFullIntake} type="button">
            Начать заново весь диалог
          </button>
          <button className="ghost-btn" onClick={onCancel} type="button">
            Отмена — продолжить
          </button>
        </div>
      </article>
    </div>
  );
}

export default function SelfAnalysis({ onComplete, onModeChange, onSaveAndExit }) {
  const chatWindowRef = useRef(null);
  const [state, setState] = useState(() => readJsonStorage(FIRST_INTAKE_PROGRESS_KEY) || makeInitialState());
  const [restoreChoiceVisible, setRestoreChoiceVisible] = useState(() => {
    const saved = readJsonStorage(FIRST_INTAKE_PROGRESS_KEY);
    return Boolean(saved && saved.status !== "completed" && saved.updatedAt);
  });
  const [draftValue, setDraftValue] = useState("");
  const [restartConfirmVisible, setRestartConfirmVisible] = useState(false);
  const [draftTags, setDraftTags] = useState([]);
  const [answerNotice, setAnswerNotice] = useState("");

  const part = parts[state.currentPartIndex] || parts[0];
  const steps = useMemo(() => getPartSteps(part), [part]);
  const step = steps[state.currentStepIndex] || steps[0];
  const answerGroup = getAnswerGroup(state, part);
  const currentAnswer = answerGroup[step?.id];
  const isComplete = state.status === "completed";
  const isPendingBaselineTransition = state.pendingTransitionToPartIndex === 1;
  const visibleSteps = isComplete || isPendingBaselineTransition ? steps : steps.slice(0, state.currentStepIndex + 1);
  const hasAnyAnswer =
    Object.keys(state.answers.baseline).length > 0 ||
    Object.keys(state.answers.bach).length > 0 ||
    Object.keys(state.answers.therapyRequest).length > 0;

  useEffect(() => {
    onModeChange?.("form");
  }, [onModeChange]);

  useEffect(() => {
    setDraftValue(currentAnswer === undefined ? "" : getAnswerFreeText(currentAnswer));
    setDraftTags(getAnswerTags(currentAnswer));
    setAnswerNotice("");
  }, [currentAnswer, step?.id]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow) return;
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
  }, [state, restoreChoiceVisible]);

  const persistState = (nextState) => {
    const prepared = { ...nextState, updatedAt: new Date().toISOString() };
    setState(prepared);
    writeJsonStorage(FIRST_INTAKE_PROGRESS_KEY, prepared);
    return prepared;
  };

  const setAnswer = (value) => {
    const nextAnswers = { ...state.answers };
    if (part.kind === "baseline") {
      nextAnswers.baseline = { ...nextAnswers.baseline, [step.id]: value };
    } else if (part.kind === "therapy") {
      nextAnswers.therapyRequest = { ...nextAnswers.therapyRequest, [step.id]: value };
    } else {
      nextAnswers.bach = { ...nextAnswers.bach, [step.id]: value };
    }

    const isLastStep = state.currentStepIndex >= steps.length - 1;
    const isLastPart = state.currentPartIndex >= parts.length - 1;
    let nextState = {
      ...state,
      answers: nextAnswers,
      currentStepIndex: isLastStep ? 0 : state.currentStepIndex + 1,
      currentPartIndex: isLastStep && !isLastPart ? state.currentPartIndex + 1 : state.currentPartIndex,
      pendingTransitionToPartIndex: null,
    };

    if (part.kind === "baseline" && isLastStep && !isLastPart) {
      nextState = {
        ...nextState,
        currentPartIndex: state.currentPartIndex,
        currentStepIndex: state.currentStepIndex,
        pendingTransitionToPartIndex: state.currentPartIndex + 1,
      };
    }

    if (isLastStep && isLastPart) {
      const completedAt = new Date().toISOString();
      nextState = { ...nextState, status: "completed", completedAt };
      const result = calculateIntakeResult(nextState);
      writeJsonStorage(FIRST_INTAKE_RESULT_KEY, result);
      writeJsonStorage(FIRST_INTAKE_PROGRESS_KEY, nextState);
      setState(nextState);
      onComplete?.(result);
      return;
    }

    persistState(nextState);
  };

  const toggleDraftTag = (tag) => {
    setAnswerNotice("");
    setDraftTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }
      if (current.length >= 3) {
        setAnswerNotice("Можно выбрать до 3 вариантов");
        return current;
      }
      return [...current, tag];
    });
  };

  const submitDraft = () => {
    if (!step) return;

    if (step.tagOptions) {
      const value = createHybridAnswer(draftTags, draftValue);
      if (!hasAnswerContent(value)) {
        setAnswerNotice("Выберите 1–3 подсказки или добавьте пару слов своими словами.");
        return;
      }
      setAnswer(value);
      return;
    }

    if (draftValue.trim() === "") {
      setAnswerNotice("Выберите 1–3 подсказки или добавьте пару слов своими словами.");
      return;
    }

    const value = step.type === "scale10" ? Number(draftValue) : draftValue.trim();
    setAnswer(value);
  };

  const resetCurrentPart = () => {
    const currentPart = parts[state.currentPartIndex] || parts[0];
    const nextAnswers = {
      baseline: { ...state.answers.baseline },
      bach: { ...state.answers.bach },
      therapyRequest: { ...state.answers.therapyRequest },
    };

    if (currentPart.kind === "baseline") {
      nextAnswers.baseline = {};
    } else if (currentPart.kind === "therapy") {
      nextAnswers.therapyRequest = {};
    } else {
      const currentPartStepIds = new Set(getPartSteps(currentPart).map((item) => item.id));
      nextAnswers.bach = Object.fromEntries(
        Object.entries(nextAnswers.bach).filter(([key]) => !currentPartStepIds.has(key))
      );
    }

    removeStorageItem(FIRST_INTAKE_RESULT_KEY);
    persistState({
      ...state,
      answers: nextAnswers,
      currentStepIndex: 0,
      status: "draft",
      completedAt: null,
      pendingTransitionToPartIndex: null,
    });
    setDraftValue("");
    setDraftTags([]);
    setRestoreChoiceVisible(false);
    setRestartConfirmVisible(false);
  };

  const resetFullIntake = () => {
    const nextState = makeInitialState();
    removeStorageItem(FIRST_INTAKE_PROGRESS_KEY);
    removeStorageItem(FIRST_INTAKE_RESULT_KEY);
    setState(nextState);
    setDraftValue("");
    setDraftTags([]);
    setRestoreChoiceVisible(false);
    setRestartConfirmVisible(false);
  };

  const goBack = () => {
    const nextPartIndex = state.currentStepIndex > 0 ? state.currentPartIndex : Math.max(state.currentPartIndex - 1, 0);
    const nextSteps = getPartSteps(parts[nextPartIndex]);
    const nextStepIndex =
      state.currentStepIndex > 0 ? state.currentStepIndex - 1 : nextPartIndex === state.currentPartIndex ? 0 : nextSteps.length - 1;
    persistState({ ...state, status: "draft", currentPartIndex: nextPartIndex, currentStepIndex: nextStepIndex });
  };

  const saveAndExit = () => {
    persistState(state);
    onSaveAndExit?.();
  };

  const goToMainMenu = () => {
    persistState(state);
    onSaveAndExit?.();
  };

  const continueToBachSituation = () => {
    persistState({
      ...state,
      currentPartIndex: 1,
      currentStepIndex: 0,
      pendingTransitionToPartIndex: null,
      status: "draft",
    });
  };

  const restartChoiceSheet = restartConfirmVisible ? (
    <RestartChoiceSheet
      onCancel={() => setRestartConfirmVisible(false)}
      onResetCurrentPart={resetCurrentPart}
      onResetFullIntake={resetFullIntake}
    />
  ) : null;

  const partLabel = `Часть ${state.currentPartIndex + 1} из ${parts.length} · ${part.shortTitle}`;
  const stepLabel = `Шаг ${Math.min(state.currentStepIndex + 1, steps.length)} из ${steps.length}`;

  if (restoreChoiceVisible) {
    return (
      <div className="first-intake-page first-intake-dialog">
        <article className="card intake-chat-card restore-intake-card">
          <header className="chat-card-header">
            <div>
              <p className="card-kicker">Первый приём</p>
              <h2>У вас есть незавершённый первый приём</h2>
            </div>
            <span className="chat-progress">{partLabel}</span>
          </header>
          <section className="restore-intake-body">
            <p>Продолжить с места остановки или начать заново?</p>
            <div className="summary-point-grid">
              <div>
                <span>Текущая часть</span>
                <strong>{partLabel}</strong>
              </div>
              <div>
                <span>Обновлено</span>
                <strong>{formatDateTime(state.updatedAt)}</strong>
              </div>
            </div>
          </section>
          <footer className="chat-actions">
            <button className="primary-btn" onClick={() => setRestoreChoiceVisible(false)} type="button">
              Продолжить
            </button>
            <button className="soft-warning-btn" onClick={() => setRestartConfirmVisible(true)} type="button">
              Начать заново
            </button>
          </footer>
          {restartChoiceSheet}
        </article>
      </div>
    );
  }

  return (
    <div className="first-intake-page first-intake-dialog">
      <article className="card intake-chat-card">
        <header className="chat-card-header">
          <div>
            <p className="card-kicker">{partLabel}</p>
            <h2>{part.title}</h2>
            <p className="part-intro-copy">{partIntroText[part.id]}</p>
          </div>
          <span className="chat-progress">{stepLabel}</span>
        </header>

        {state.currentPartIndex >= 1 && state.currentPartIndex <= 3 ? (
          <div className="baseline-strip-wrap">
            <CompactBaselineStrip baseline={state.answers.baseline} />
            <details className="baseline-details-drawer">
              <summary>Показать базовую точку</summary>
              <BaselineSummaryCard baseline={state.answers.baseline} />
            </details>
          </div>
        ) : null}

        <div className="chat-window" aria-live="polite" ref={chatWindowRef}>
          <div className="chat-bubble therapist-bubble intro-bubble">
            <span>Специалист</span>
            {part.kind === "baseline" ? (
              <p>
                Давайте начнём спокойно. Я задам несколько коротких вопросов, чтобы увидеть главную точку текущего состояния.
                Можно выбрать подсказки или добавить пару слов своими словами.
              </p>
            ) : (
              <p>{partIntroText[part.id] || "Идём по одному вопросу. Ответ сохраняется сразу и станет частью рабочей карты."}</p>
            )}
          </div>

          {visibleSteps.map((item) => (
            <React.Fragment key={item.id}>
              <div className={item.id === step?.id && !hasAnswerContent(currentAnswer) && !isComplete ? "chat-bubble therapist-bubble current-question-bubble" : "chat-bubble therapist-bubble"}>
                <span>Специалист</span>
                <p>{item.question}</p>
              </div>
              {hasAnswerContent(answerGroup[item.id]) ? (
                <div className="chat-bubble user-bubble">
                  <span>Вы</span>
                  <p>{answerLabel(item, answerGroup[item.id])}</p>
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        {isPendingBaselineTransition ? (
          <section className="intake-transition-panel" aria-label="Переход к Bach: ситуация">
            <BaselineSummaryCard baseline={state.answers.baseline} />
            <div className="transition-message">
              <p>Спасибо. Базовая точка состояния сохранена.</p>
              <p>Теперь мы перейдём ко второй части — Bach: ситуация.</p>
              <p>
                Здесь мы смотрим не на силу симптома, а на эмоциональные состояния,
                которые могут быть связаны с текущей ситуацией.
              </p>
              <p>Отвечайте по тому, насколько фраза похожа на вас сейчас.</p>
              <button className="primary-btn" onClick={continueToBachSituation} type="button">
                Перейти к Bach: ситуация
              </button>
            </div>
          </section>
        ) : null}

        {!isPendingBaselineTransition ? (
        <section className="answer-panel" aria-label="Ответ на текущий вопрос">
          <div className="answer-panel-head">
            <span>{step.label}</span>
            <strong>
              {part.kind === "bach"
                ? "Насколько это похоже на вас сейчас?"
                : step.type === "scale10"
                  ? "Отметьте по ощущению от 0 до 10"
                  : "Выберите 1–3 подсказки или добавьте своими словами"}
            </strong>
          </div>

          {step.type === "scale10" ? (
            <>
              <div className="option-grid scale-grid">
                {Array.from({ length: 11 }, (_, value) => (
                  <button className="answer-chip scale-chip" key={value} onClick={() => setAnswer(value)} type="button">
                    {value}
                  </button>
                ))}
              </div>
              <p className="scale-helper">{step.helper || "0 — совсем не ощущается, 10 — максимально выражено."}</p>
            </>
          ) : part.kind === "bach" ? (
            <div className="option-grid bach-scale-grid">
              {[0, 1, 2, 3].map((value) => (
                <button className="answer-chip" key={value} onClick={() => setAnswer(value)} type="button">
                  {answerLabel(step, value)}
                </button>
              ))}
            </div>
          ) : (
            <div className="field compact-note inline-answer-field">
              <span>{step.type === "comment" ? "Добавить своими словами" : "Ваши слова"}</span>
              {step.tagOptions ? (
                <div className="option-grid tag-chip-grid" aria-label="Подсказки для ответа">
                  {step.tagOptions.map((tag) => (
                    <button
                      aria-pressed={draftTags.includes(tag)}
                      className={draftTags.includes(tag) ? "answer-chip tag-chip active" : "answer-chip tag-chip"}
                      key={tag}
                      onClick={() => toggleDraftTag(tag)}
                      type="button"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ) : null}
              <textarea
                id={`first-intake-${step.id}`}
                name={`first-intake-${step.id}`}
                onChange={(event) => setDraftValue(event.target.value)}
                placeholder={step.placeholder}
                value={draftValue}
              />
              <button className="primary-btn" onClick={submitDraft} type="button">
                Сохранить ответ
              </button>
              {answerNotice ? <p className="answer-notice" role="status">{answerNotice}</p> : null}
            </div>
          )}
        </section>
        ) : null}

        <footer className="chat-actions">
          {hasAnyAnswer ? (
            <button className="secondary-btn" onClick={goBack} type="button">
              Назад
            </button>
          ) : null}
          {hasAnyAnswer ? (
            <div className="intake-navigation-actions" aria-label="Навигация первого приёма">
              <button className="secondary-btn" onClick={saveAndExit} type="button">
                Сохранить и выйти
              </button>
              <button className="ghost-btn" onClick={goToMainMenu} type="button">
                Перейти в главное меню
              </button>
              <button className="soft-warning-btn" onClick={() => setRestartConfirmVisible(true)} type="button">
                Начать заново
              </button>
            </div>
          ) : null}
        </footer>
        {restartChoiceSheet}
      </article>
    </div>
  );
}
