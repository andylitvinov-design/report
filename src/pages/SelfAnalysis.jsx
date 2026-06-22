import React, { useEffect, useMemo, useState } from "react";
import { AnalysisResultPanel } from "../components/Cards.jsx";
import WorkbookAssistantInput from "../components/workbook/WorkbookAssistantInput.jsx";
import WorkbookBook from "../components/workbook/WorkbookBook.jsx";
import WorkbookChoiceList from "../components/workbook/WorkbookChoiceList.jsx";
import WorkbookPage from "../components/workbook/WorkbookPage.jsx";
import WorkbookSafetyNote from "../components/workbook/WorkbookSafetyNote.jsx";
import WorkbookThemeBadge from "../components/workbook/WorkbookThemeBadge.jsx";
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
      "Тревога / беспокойство",
      "Усталость / нет сил",
      "Напряжение в теле",
      "Эмоциональная тяжесть",
      "Отношения / одиночество",
      "Работа / деньги / будущее",
      "Здоровье / тело",
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

function IntakeProgressMap({ currentPartIndex }) {
  return (
    <div className="intake-progress-map" aria-label="Прогресс первого приёма">
      {parts.map((item, index) => {
        const status = index < currentPartIndex ? "done" : index === currentPartIndex ? "active" : "";
        return (
          <span className={status} key={item.id}>
            <b>{index + 1}</b>
            {item.shortTitle}
          </span>
        );
      })}
    </div>
  );
}

function IntakeBaselineMini({ baseline }) {
  const mainConcern = getAnswerText(baseline.mainConcern);
  const relief = getAnswerText(baseline.relief);

  if (!mainConcern && baseline.problemStrength === undefined && baseline.resourceLevel === undefined) {
    return null;
  }

  return (
    <div className="intake-baseline-mini" aria-label="Сохранённая базовая точка">
      <span>Сохранённые фрагменты</span>
      {mainConcern ? <p>{mainConcern}</p> : null}
      <div>
        {baseline.problemStrength !== undefined ? <strong>Проблема {baseline.problemStrength}/10</strong> : null}
        {baseline.resourceLevel !== undefined ? <strong>Ресурс {baseline.resourceLevel}/10</strong> : null}
      </div>
      {relief ? <small>Опора: {relief}</small> : null}
    </div>
  );
}

function IntakeContextPanel({ part, state, stepLabel, partLabel }) {
  const baseline = state.answers.baseline;

  return (
    <aside className="intake-context-panel" aria-label="Контекст первого приёма">
      <div className="intake-context-surface">
        <p className="card-kicker">Первый приём</p>
        <h2>{part.title}</h2>
        <p>{partIntroText[part.id]}</p>

        <div className="intake-context-meta">
          <span>{partLabel}</span>
          <strong>{stepLabel}</strong>
        </div>

        <IntakeProgressMap currentPartIndex={state.currentPartIndex} />
      </div>

      <div className="intake-hint-card">
        <h3>Как отвечать</h3>
        <p>
          Идём по одному вопросу. Отвечайте по текущему состоянию, не идеально и не за всю
          историю жизни. Подсказки можно сочетать со своими словами.
        </p>
      </div>

      <IntakeBaselineMini baseline={baseline} />

      <p className="safety-note">
        Самоанализ и рекомендации не заменяют медицинскую или психотерапевтическую помощь.
      </p>
    </aside>
  );
}

const choiceIconForLabel = (label = "") => {
  if (/голова|мысл/i.test(label)) return "head";
  if (/груд|дых|отнош|поддерж/i.test(label)) return "heart";
  if (/живот|тело|кожа|здоров/i.test(label)) return "body";
  return "leaf";
};

function AnalysisNavigatorWorkspace({
  activeAnalysis,
  onSelectAnalysis,
  onSpecialistRequest,
  onStartAnalysis,
}) {
  return (
    <section className="analysis-navigator-workspace" aria-labelledby="analysis-navigator-title">
      <div className="analysis-navigator-header">
        <div>
          <p className="eyebrow">Профиль / Самоанализ</p>
          <h2 id="analysis-navigator-title">Результаты выбранного анализа</h2>
        </div>
        <p>Краткое резюме, динамика и следующий шаг.</p>
      </div>
      <AnalysisResultPanel
        analysis={activeAnalysis}
        onSelectAnalysis={onSelectAnalysis}
        onSpecialistRequest={onSpecialistRequest}
        onStartAnalysis={onStartAnalysis}
      />
    </section>
  );
}

export default function SelfAnalysis({
  activeAnalysis,
  clientName,
  mode = "form",
  onComplete,
  onModeChange,
  onNavigate,
  onSaveAndExit,
  onSelectAnalysis,
  onSpecialistRequest,
  onStartAnalysis,
}) {
  useEffect(() => {
    if (mode === "navigator") {
      onModeChange?.("overview");
    }
  }, [mode, onModeChange]);

  if (mode === "navigator") {
    return (
      <AnalysisNavigatorWorkspace
        activeAnalysis={activeAnalysis}
        onSelectAnalysis={onSelectAnalysis}
        onSpecialistRequest={onSpecialistRequest}
        onStartAnalysis={onStartAnalysis}
      />
    );
  }

  return (
    <SelfAnalysisForm
      clientName={clientName}
      onComplete={onComplete}
      onModeChange={onModeChange}
      onNavigate={onNavigate}
      onSaveAndExit={onSaveAndExit}
    />
  );
}

function SelfAnalysisForm({ clientName, onComplete, onModeChange, onNavigate, onSaveAndExit }) {
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
  const currentTheme = step.theme || step.label || part.shortTitle;
  const scaleChoices = [
    { id: "scale-low", icon: "leaf", label: "Слабо", description: "примерно 2 из 10", value: 2 },
    { id: "scale-mid", icon: "body", label: "Заметно", description: "примерно 5 из 10", value: 5 },
    { id: "scale-high", icon: "heart", label: "Сильно", description: "примерно 8 из 10", value: 8 },
  ];
  const bachChoices = [
    { id: "bach-no", icon: "leaf", label: "Нет / не про меня", description: "0", value: 0 },
    { id: "bach-some", icon: "body", label: "Заметно", description: "2", value: 2 },
    { id: "bach-strong", icon: "heart", label: "Сильно", description: "3", value: 3 },
  ];
  const tagChoices = (step.tagOptions || []).slice(0, 3).map((tag) => ({
    id: tag,
    icon: choiceIconForLabel(tag),
    label: tag,
    isSelected: draftTags.includes(tag),
    onSelect: () => toggleDraftTag(tag),
  }));
  const workbookChoiceItems = step.type === "scale10"
    ? scaleChoices.map((item) => ({ ...item, isSelected: Number(currentAnswer) === item.value, onSelect: () => setAnswer(item.value) }))
    : part.kind === "bach"
      ? bachChoices.map((item) => ({ ...item, isSelected: Number(currentAnswer) === item.value, onSelect: () => setAnswer(item.value) }))
      : tagChoices;

  if (restoreChoiceVisible) {
    return (
      <section className="first-intake-page first-intake-dialog restore-intake-shell">
        <WorkbookBook>
          <WorkbookPage side="left" variant="message" backgroundVariant="lake">
            <p className="workbook-kicker">Первый приём</p>
            <h1 className="workbook-title">Вы уже начали AI-приём.</h1>
            <p className="workbook-body">Можно вернуться к тому же месту или начать заново, если состояние сегодня другое.</p>
            <div className="workbook-progress-card">
              <span>Текущая часть</span>
              <strong>{partLabel}</strong>
              <small>Обновлено: {formatDateTime(state.updatedAt)}</small>
            </div>
            <WorkbookSafetyNote>
              Самоанализ и рекомендации не заменяют медицинскую или психотерапевтическую помощь.
            </WorkbookSafetyNote>
          </WorkbookPage>
          <WorkbookPage side="right" variant="response">
            <p className="workbook-kicker">Продолжить</p>
            <h2 className="workbook-question">У вас есть незавершённый первый приём.</h2>
            <p className="workbook-body">Выберите, что сделать сейчас.</p>
            <div className="workbook-action-row">
              <button className="secondary-btn" onClick={goToMainMenu} type="button">
                В главное меню
              </button>
              <button className="primary-btn" onClick={() => setRestoreChoiceVisible(false)} type="button">
                Продолжить
              </button>
              <button className="soft-warning-btn" onClick={() => setRestartConfirmVisible(true)} type="button">
                Начать заново
              </button>
            </div>
            {restartChoiceSheet}
          </WorkbookPage>
        </WorkbookBook>
      </section>
    );
  }

  return (
    <section className="first-intake-page first-intake-dialog">
      <WorkbookBook>
        <WorkbookPage side="left" variant="message" backgroundVariant="lake">
          <h1 className="workbook-title">AI-приём самонаблюдения</h1>
          <span className="workbook-title-rule" aria-hidden="true" />
          <p className="workbook-body workbook-lead">Сейчас главное — двигаться мягко и замечать, что меняется.</p>
          <div className="workbook-news-card">
            <span aria-hidden="true">☘</span>
            <div>
              <strong>Что нового</strong>
              <p>Ресурс немного вырос</p>
              <p>Напряжение стало мягче</p>
            </div>
          </div>
          <div className="workbook-topic-card">
            <span aria-hidden="true">☘</span>
            <p>Работаем с темой:<br />{currentTheme}</p>
          </div>
          <div className="workbook-progress-card">
            <span>{partLabel}</span>
            <strong>{stepLabel}</strong>
          </div>
          <div className="workbook-progress-compact">
            <IntakeProgressMap currentPartIndex={state.currentPartIndex} />
          </div>
          {state.currentPartIndex >= 1 && state.currentPartIndex <= 3 ? (
            <CompactBaselineStrip baseline={state.answers.baseline} />
          ) : null}
          <WorkbookSafetyNote>
            Отвечайте как есть сегодня. Здесь нет правильных или неправильных ответов.
          </WorkbookSafetyNote>
        </WorkbookPage>

        <WorkbookPage side="right" variant="response">
            <div className="workbook-response-head">
              <p className="workbook-kicker">Ваш ответ</p>
              <WorkbookThemeBadge>{currentTheme}</WorkbookThemeBadge>
            </div>
            <h2 className="workbook-question">{step.question}</h2>
            {step.helper ? <p className="workbook-helper">{step.helper}</p> : null}

            {isPendingBaselineTransition ? (
              <section className="workbook-transition-panel" aria-label="Переход к Bach: ситуация">
                <BaselineSummaryCard baseline={state.answers.baseline} />
                <p>Базовая точка сохранена. Теперь можно перейти к состояниям Bach, связанным с текущей ситуацией.</p>
                <button className="primary-btn" onClick={continueToBachSituation} type="button">
                  Перейти к Bach: ситуация
                </button>
              </section>
            ) : (
              <section className="workbook-answer-panel" aria-label="Ответ на текущий вопрос">
                {workbookChoiceItems.length > 0 ? (
                  <WorkbookChoiceList
                    choices={workbookChoiceItems}
                    label={step.type === "scale10" || part.kind === "bach" ? "Шкала ответа" : "Подсказки для ответа"}
                  />
                ) : null}
                {step.type !== "scale10" && part.kind !== "bach" ? (
                  <WorkbookAssistantInput
                    id={`first-intake-${step.id}`}
                    name={`first-intake-${step.id}`}
                    notice={answerNotice}
                    onChange={(event) => setDraftValue(event.target.value)}
                    onSubmit={submitDraft}
                    placeholder={step.placeholder || "Или напишите своими словами..."}
                    value={draftValue}
                  />
                ) : null}
                {step.type === "scale10" ? (
                  <p className="workbook-helper">Число сохранится совместимо со старой шкалой: 2, 5 или 8 из 10.</p>
                ) : null}
                {part.kind === "bach" ? (
                  <p className="workbook-helper">Ответ сохраняется числом для прежнего Bach scoring.</p>
                ) : null}
              </section>
            )}

            {hasAnswerContent(currentAnswer) ? (
              <div className="workbook-current-answer" aria-live="polite">
                <span>Сохранённый ответ</span>
                <p>{answerLabel(step, currentAnswer)}</p>
              </div>
            ) : null}

            <footer className="workbook-actions">
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
                <button className="soft-warning-btn" onClick={() => setRestartConfirmVisible(true)} type="button">
                  Начать заново
                </button>
              ) : null}
            </footer>
            {restartChoiceSheet}
        </WorkbookPage>
      </WorkbookBook>
    </section>
  );
}
