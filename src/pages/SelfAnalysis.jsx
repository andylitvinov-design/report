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
    label: "Главный фокус",
    question: "Что сейчас главное?",
    type: "text",
    placeholder: "Можно добавить важный нюанс своими словами.",
    tagOptions: [
      "Усталость / нет сил",
      "Тревога",
      "Напряжение в теле",
      "Кожа / воспаление",
      "Сон / восстановление",
      "Отношения / контакт",
      "Работа / деньги",
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
      "Спина / шея",
      "Всё тело",
      "Эмоционально",
      "В мыслях",
    ],
  },
  { id: "problemStrength", label: "Сила проблемы", question: "Сила проблемы сейчас от 0 до 10?", type: "scale10" },
  { id: "resourceLevel", label: "Ресурс", question: "Сколько ресурса сейчас от 0 до 10?", type: "scale10" },
  { id: "anxietyLevel", label: "Тревога / напряжение", question: "Тревога / напряжение сейчас от 0 до 10?", type: "scale10" },
  { id: "fatigueLevel", label: "Усталость", question: "Усталость сейчас от 0 до 10?", type: "scale10" },
  { id: "lifeImpact", label: "Влияние на жизнь", question: "Насколько это мешает жить от 0 до 10?", type: "scale10" },
  {
    id: "trigger",
    label: "Что усиливает",
    question: "Что обычно усиливает это состояние?",
    type: "text",
    placeholder: "Можно добавить свою ситуацию или время дня.",
    tagOptions: [
      "Стресс / спешка",
      "Конфликт / давление",
      "Одиночество",
      "Страх оценки",
      "Усталость / недосып",
      "Неопределённость",
      "Перегрузка делами",
    ],
  },
  {
    id: "relief",
    label: "Что облегчает",
    question: "Что хотя бы немного облегчает?",
    type: "text",
    placeholder: "Можно добавить свою опору или уточнение.",
    tagOptions: [
      "Отдых",
      "Поддержка человека",
      "Тепло / тело / прикосновение",
      "Природа / прогулка",
      "Понимание причины",
      "Структура / план",
      "Тишина",
      "Пока ничего",
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
  { id: "baseline", title: "Жалоба / симптом / baseline состояния", shortTitle: "Baseline состояния", kind: "baseline", steps: baselineSteps },
  { id: "bachSituation", title: "Bach: ситуация", shortTitle: "Bach: ситуация", kind: "bach", source: "situation" },
  { id: "bachCharacter", title: "Bach: характер / устойчивые паттерны", shortTitle: "Bach: характер", kind: "bach", source: "character" },
  { id: "bachControl", title: "Bach: контроль / острое напряжение", shortTitle: "Bach: контроль", kind: "bach", source: "control" },
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
});

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
          <p>{getAnswerText(baseline.mainConcern) || "Главный фокус требует уточнения."}</p>
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
  const visibleSteps = isComplete ? steps : steps.slice(0, state.currentStepIndex + 1);
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
    };

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
        setAnswerNotice("Выберите 1–3 подсказки или напишите коротко своими словами");
        return;
      }
      setAnswer(value);
      return;
    }

    if (draftValue.trim() === "") {
      setAnswerNotice("Выберите 1–3 подсказки или напишите коротко своими словами");
      return;
    }

    const value = step.type === "scale10" ? Number(draftValue) : draftValue.trim();
    setAnswer(value);
  };

  const resetFlow = () => {
    const nextState = makeInitialState();
    removeStorageItem(FIRST_INTAKE_PROGRESS_KEY);
    removeStorageItem(FIRST_INTAKE_RESULT_KEY);
    setState(nextState);
    setDraftValue("");
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
            <button className="secondary-btn" onClick={() => setRestartConfirmVisible(true)} type="button">
              Начать заново
            </button>
            {restartConfirmVisible ? (
              <button className="secondary-btn danger-action" onClick={resetFlow} type="button">
                Подтвердить начало заново
              </button>
            ) : null}
          </footer>
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
          </div>
          <span className="chat-progress">{stepLabel}</span>
        </header>

        <div className="chat-window" aria-live="polite" ref={chatWindowRef}>
          <div className="chat-bubble therapist-bubble intro-bubble">
            <span>Специалист</span>
            <p>Идём по одному вопросу. Ответ сохраняется сразу и станет частью рабочей карты.</p>
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

        {state.currentPartIndex > 0 ? (
          <BaselineSummaryCard baseline={state.answers.baseline} />
        ) : null}

        <section className="answer-panel" aria-label="Ответ на текущий вопрос">
          <div className="answer-panel-head">
            <span>{step.label}</span>
            <strong>{part.kind === "bach" ? "Оцените проявленность" : "Ответьте коротко"}</strong>
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
              <p className="scale-helper">0 — совсем нет, 10 — максимально сильно.</p>
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
              <span>{step.type === "comment" ? "Добавить своими словами" : "Ваш ответ"}</span>
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

        <footer className="chat-actions">
          {hasAnyAnswer ? (
            <button className="secondary-btn" onClick={goBack} type="button">
              Назад
            </button>
          ) : null}
          {hasAnyAnswer ? (
            <button className="secondary-btn" onClick={saveAndExit} type="button">
              Сохранить и выйти
            </button>
          ) : null}
          {hasAnyAnswer ? (
            <button className="secondary-btn" onClick={() => setRestartConfirmVisible(true)} type="button">
              Начать заново
            </button>
          ) : null}
          {restartConfirmVisible ? (
            <button className="secondary-btn danger-action" onClick={resetFlow} type="button">
              Подтвердить начало заново
            </button>
          ) : null}
        </footer>
      </article>
    </div>
  );
}
