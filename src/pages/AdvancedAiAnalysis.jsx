import React, { useEffect, useMemo, useRef, useState } from "react";
import { selfAnalysis } from "../data/mockData.js";
import { calculateRemedyResults } from "../lib/bachScoring.js";
import {
  createHybridAnswer,
  getAnswerFreeText,
  getAnswerTags,
  getAnswerText,
  hasAnswerContent,
} from "../lib/firstIntakeAnswers.js";
import {
  ADVANCED_AI_PROGRESS_KEY,
  ADVANCED_AI_RESULT_KEY,
} from "../lib/advancedAiAnalysisStorage.js";
import {
  readJsonStorage,
  removeStorageItem,
  writeJsonStorage,
} from "../lib/firstIntakeStorage.js";

const scale10 = { type: "scale10" };
const bachScale = {
  type: "bachScale",
  scaleLabels: ["0 - нет / не про меня", "1 - немного", "2 - заметно", "3 - сильно"],
};

const quickStateSteps = [
  {
    id: "mainDrain",
    label: "Текущая точка",
    question: "Давайте начнём с текущей точки. Что сейчас больше всего забирает силы или внимание?",
    type: "text",
    placeholder: "Можно добавить ситуацию своими словами.",
    tagOptions: ["Усталость / нет сил", "Тревога", "Напряжение в теле", "Отношения / контакт", "Не понимаю, что происходит"],
  },
  { id: "problemStrength", label: "Проблема", question: "Насколько сильно это проявлено сейчас от 0 до 10?", ...scale10 },
  { id: "resourceLevel", label: "Ресурс", question: "Сколько ресурса сейчас от 0 до 10?", ...scale10 },
  { id: "anxietyLevel", label: "Тревога", question: "Тревога сейчас от 0 до 10?", ...scale10 },
  { id: "fatigueLevel", label: "Усталость", question: "Усталость сейчас от 0 до 10?", ...scale10 },
  {
    id: "trigger",
    label: "Что усиливает",
    question: "Что заметнее всего усиливает состояние?",
    type: "text",
    placeholder: "Например: спешка, конфликт, одиночество, перегруз.",
    tagOptions: ["Стресс / спешка", "Конфликт", "Недосып", "Неопределённость", "Перегрузка делами"],
  },
  {
    id: "relief",
    label: "Что помогает",
    question: "Что хотя бы немного помогает или возвращает опору?",
    type: "text",
    placeholder: "Можно назвать даже маленькую опору.",
    tagOptions: ["Отдых", "Поддержка человека", "Прогулка", "Тишина", "Понятный план", "Пока ничего"],
  },
];

const psychosomaticSteps = [
  {
    id: "bodyZone",
    label: "Зона проявления",
    question: "Где в теле или состоянии это проявляется заметнее всего?",
    type: "text",
    placeholder: "Можно уточнить ощущение или обстоятельства.",
    tagOptions: ["Голова", "Грудь / дыхание", "Живот", "Кожа", "Всё тело", "В мыслях"],
  },
  {
    id: "symptomPattern",
    label: "Как проявляется",
    question: "Как вы обычно замечаете это проявление?",
    type: "text",
    placeholder: "Например: сжимает, горит, тянет, появляется после контакта.",
    tagOptions: ["Сжимает", "Болит / тянет", "Жжение / зуд", "Слабость", "Ком в горле", "Внутреннее напряжение"],
  },
  {
    id: "bodyTrigger",
    label: "Что усиливает",
    question: "После чего это обычно усиливается?",
    type: "text",
    placeholder: "Ситуация, контакт, время дня, мысль.",
    tagOptions: ["Разговор / конфликт", "Рабочая нагрузка", "Страх оценки", "Переутомление", "Одиночество", "Неясная причина"],
  },
  {
    id: "bodyRelief",
    label: "Что облегчает",
    question: "Что немного облегчает телесное проявление?",
    type: "text",
    placeholder: "Любой безопасный способ облегчения.",
    tagOptions: ["Сон / отдых", "Тепло", "Движение", "Дыхание", "Поддержка", "Пока ничего"],
  },
  {
    id: "innerTheme",
    label: "Тема для проверки",
    question: "С какой внутренней темой это может быть связано, если смотреть бережно и без медицинских выводов?",
    type: "text",
    placeholder: "Например: границы, перегруз, страх, невысказанность.",
    tagOptions: ["Границы", "Невысказанное", "Контроль", "Страх", "Усталость", "Ответственность"],
  },
  { id: "tracking", label: "Что отслеживать", question: "Что будет полезно отслеживать ближайшие 3-7 дней?", type: "text", placeholder: "Когда усиливается, что помогает, какие ситуации повторяются." },
];

const resourceSteps = [
  { id: "bodyResource", label: "Тело", question: "Сколько ресурса сейчас в теле от 0 до 10?", ...scale10 },
  { id: "emotionResource", label: "Эмоции", question: "Сколько эмоциональной устойчивости сейчас от 0 до 10?", ...scale10 },
  { id: "relationshipResource", label: "Отношения", question: "Сколько опоры сейчас в контакте с людьми от 0 до 10?", ...scale10 },
  { id: "workResource", label: "Работа", question: "Сколько ресурса сейчас в делах, работе или реализации от 0 до 10?", ...scale10 },
  { id: "meaningResource", label: "Смысл", question: "Сколько ощущения смысла и направления сейчас от 0 до 10?", ...scale10 },
  { id: "energyResource", label: "Энергия", question: "Сколько общей энергии сейчас от 0 до 10?", ...scale10 },
  {
    id: "firstSupport",
    label: "Первая поддержка",
    question: "Какая сфера просит поддержки первой?",
    type: "text",
    placeholder: "Можно выбрать одну сферу или добавить свою.",
    tagOptions: ["Тело", "Эмоции", "Отношения", "Работа", "Смысл", "Энергия"],
  },
];

const therapyRequestSteps = [
  {
    id: "desiredChange",
    label: "Что изменить",
    question: "Что вы больше всего хотите изменить или прояснить в этой работе?",
    type: "text",
    placeholder: "Можно сформулировать неидеально, как есть.",
    tagOptions: ["Понять причину состояния", "Уменьшить напряжение", "Вернуть ресурс", "Улучшить контакт с людьми", "Сформулировать следующий шаг"],
  },
  { id: "desiredResult", label: "Нужный результат", question: "Какой результат был бы для вас ценным после ближайшей работы?", type: "text", placeholder: "Например: ясность, спокойнее в теле, понятный следующий шаг." },
  { id: "supportNeeded", label: "Поддержка", question: "Какая поддержка кажется сейчас важной?", type: "text", placeholder: "Структура, мягкий диалог, телесная опора, регулярная сверка..." },
  { id: "successMarker", label: "Признак движения", question: "По какому признаку вы поймёте, что стало чуть лучше?", type: "text", placeholder: "Что изменится в состоянии, контакте, теле или решениях?" },
  { id: "requestPhrase", label: "Формулировка", question: "Попробуйте одной фразой сформулировать терапевтический запрос.", type: "text", placeholder: "Я хочу прояснить / изменить / укрепить..." },
];

const bachQuestionSteps = selfAnalysis.questions
  .filter((question) => ["situation", "character", "control"].includes(question.section))
  .slice(0, 9)
  .map((question, index) => ({
    id: question.id,
    label: `Bach ${index + 1}`,
    question: index === 0
      ? "Сейчас посмотрим эмоциональные состояния. Насколько эта фраза похожа на вас в последние дни?"
      : question.text,
    statement: question.text,
    remedy: question.remedy,
    theme: question.theme,
    section: question.section,
    ...bachScale,
  }));

export const AI_ANALYSIS_PROGRAMS = [
  {
    id: "quick-state",
    title: "Быстрый срез состояния",
    description: "Коротко оценить текущее состояние: проблема, ресурс, тревога, усталость, что усиливает и что помогает.",
    estimatedSteps: 7,
    parts: ["baseline"],
    steps: quickStateSteps,
  },
  {
    id: "bach-emotions",
    title: "Bach-анализ эмоций",
    description: "Проверить эмоциональные состояния по группам Bach: ситуация, устойчивые реакции, напряжение и контроль.",
    estimatedSteps: 9,
    parts: ["situation", "character", "control"],
    steps: bachQuestionSteps,
  },
  {
    id: "psychosomatic-symptom",
    title: "Психосоматика симптома",
    description: "Посмотреть, где проявляется симптом, что его усиливает, что облегчает и с какой внутренней темой он может быть связан.",
    estimatedSteps: 6,
    parts: ["body", "trigger", "relief", "theme"],
    steps: psychosomaticSteps,
  },
  {
    id: "resource-profile",
    title: "Ресурсный профиль",
    description: "Оценить ресурс по ключевым сферам: тело, эмоции, отношения, работа, смысл и энергия.",
    estimatedSteps: 7,
    parts: ["resource"],
    steps: resourceSteps,
  },
  {
    id: "therapy-request",
    title: "Запрос на терапию",
    description: "Сформулировать, что хочется изменить, какой результат нужен и какую поддержку важно получить.",
    estimatedSteps: 5,
    parts: ["request"],
    steps: therapyRequestSteps,
  },
  {
    id: "full-advanced",
    title: "Полный расширенный анализ",
    description: "Пройти несколько блоков подряд и собрать более глубокую рабочую карту состояния.",
    estimatedSteps: 14,
    parts: ["baseline", "bach", "body", "resource", "request"],
    steps: [
      ...quickStateSteps.slice(0, 5),
      ...bachQuestionSteps.slice(0, 4),
      ...psychosomaticSteps.slice(0, 2),
      ...resourceSteps.slice(0, 2),
      therapyRequestSteps[0],
    ],
  },
];

const makeInitialState = (programId = null) => ({
  selectedProgramId: programId,
  currentStep: 0,
  answers: {},
  notes: "",
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

const getProgram = (programId) => AI_ANALYSIS_PROGRAMS.find((program) => program.id === programId);

const answerLabel = (step, value) => {
  if (step.type === "scale10") return `${value}/10`;
  if (step.type === "bachScale") return step.scaleLabels[Number(value)] || String(value);
  return getAnswerText(value);
};

const metricValue = (answers, key) => {
  const value = Number(answers[key]);
  return Number.isFinite(value) ? value : null;
};

const buildBachResult = (answers) => calculateRemedyResults({
  questions: selfAnalysis.questions,
  scores: answers,
});

const buildAdvancedResult = (state) => {
  const program = getProgram(state.selectedProgramId);
  const answers = state.answers || {};
  const completedAt = state.completedAt || new Date().toISOString();
  const bachResults = buildBachResult(answers);
  const topCandidates = [...(bachResults.main || []), ...(bachResults.support || [])].slice(0, 5);
  const resourceScores = ["bodyResource", "emotionResource", "relationshipResource", "workResource", "meaningResource", "energyResource"]
    .map((key) => metricValue(answers, key))
    .filter((value) => value !== null);
  const resourceAverage = resourceScores.length
    ? Math.round((resourceScores.reduce((sum, value) => sum + value, 0) / resourceScores.length) * 10) / 10
    : metricValue(answers, "resourceLevel");

  const summaries = {
    "quick-state": {
      title: "Быстрый срез: рабочая карта",
      keyMetrics: [
        ["Проблема", metricValue(answers, "problemStrength")],
        ["Ресурс", metricValue(answers, "resourceLevel")],
        ["Тревога", metricValue(answers, "anxietyLevel")],
        ["Усталость", metricValue(answers, "fatigueLevel")],
      ],
      sections: [
        ["Что забирает силы", getAnswerText(answers.mainDrain) || "требует уточнения"],
        ["Триггер", getAnswerText(answers.trigger) || "требует уточнения"],
        ["Что помогает", getAnswerText(answers.relief) || "требует уточнения"],
        ["Следующий шаг", "Сверить главный триггер и первую опору со специалистом."],
      ],
      hypothesis: `Текущая рабочая карта: ${getAnswerText(answers.mainDrain) || "главная тема требует уточнения"}. Может быть полезно проверить, что усиливает состояние и какая опора снижает расход ресурса.`,
    },
    "bach-emotions": {
      title: "Bach: предварительная эмоциональная группировка",
      keyMetrics: topCandidates.slice(0, 3).map((item) => [item.remedy, item.total]),
      sections: [
        ["Группы Bach", topCandidates.map((item) => `${item.remedy}: ${item.theme}`).join("; ") || "ответов пока недостаточно"],
        ["Top candidates", topCandidates.map((item) => item.remedy).join(", ") || "требуют уточнения"],
        ["Безопасная формулировка", "Это предварительная эмоциональная группировка, не медицинское назначение."],
      ],
      hypothesis: "Эмоциональная группировка требует проверки специалистом и не заменяет медицинскую помощь.",
    },
    "psychosomatic-symptom": {
      title: "Психосоматика: зона и тема для проверки",
      keyMetrics: [],
      sections: [
        ["Телесная зона", getAnswerText(answers.bodyZone) || "требует уточнения"],
        ["Что усиливает", getAnswerText(answers.bodyTrigger) || "требует уточнения"],
        ["Что облегчает", getAnswerText(answers.bodyRelief) || "требует уточнения"],
        ["Возможная тема", getAnswerText(answers.innerTheme) || "может быть полезно проверить со специалистом"],
        ["Что отслеживать", getAnswerText(answers.tracking) || "реакции тела, контекст и облегчение"],
      ],
      hypothesis: `Может быть полезно проверить связь телесной зоны (${getAnswerText(answers.bodyZone) || "не указано"}) с темой: ${getAnswerText(answers.innerTheme) || "требует уточнения"}.`,
    },
    "resource-profile": {
      title: "Ресурсный профиль",
      keyMetrics: [["Средний ресурс", resourceAverage]],
      sections: [
        ["Тело", metricValue(answers, "bodyResource")],
        ["Эмоции", metricValue(answers, "emotionResource")],
        ["Отношения", metricValue(answers, "relationshipResource")],
        ["Работа", metricValue(answers, "workResource")],
        ["Смысл", metricValue(answers, "meaningResource")],
        ["Энергия", metricValue(answers, "energyResource")],
        ["Первая поддержка", getAnswerText(answers.firstSupport) || "требует уточнения"],
      ],
      hypothesis: `Рабочая карта ресурса показывает первую сферу поддержки: ${getAnswerText(answers.firstSupport) || "требует проверки"}.`,
    },
    "therapy-request": {
      title: "Запрос на терапию",
      keyMetrics: [],
      sections: [
        ["Готовая формулировка", getAnswerText(answers.requestPhrase || answers.desiredChange) || "запрос требует уточнения"],
        ["Нужный результат", getAnswerText(answers.desiredResult) || "не указано"],
        ["Важная поддержка", getAnswerText(answers.supportNeeded) || "не указано"],
        ["Признак движения", getAnswerText(answers.successMarker) || "не указано"],
      ],
      hypothesis: `Предварительная формулировка запроса: ${getAnswerText(answers.requestPhrase || answers.desiredChange) || "требует уточнения со специалистом"}.`,
    },
    "full-advanced": {
      title: "Полный расширенный анализ: рабочая карта",
      keyMetrics: [
        ["Проблема", metricValue(answers, "problemStrength")],
        ["Ресурс", resourceAverage],
        ["Тревога", metricValue(answers, "anxietyLevel")],
        ["Усталость", metricValue(answers, "fatigueLevel")],
      ],
      sections: [
        ["Главная тема", getAnswerText(answers.mainDrain || answers.desiredChange) || "требует уточнения"],
        ["Bach candidates", topCandidates.map((item) => item.remedy).join(", ") || "требуют уточнения"],
        ["Телесная зона", getAnswerText(answers.bodyZone) || "не указано"],
        ["Первая поддержка", getAnswerText(answers.firstSupport || answers.desiredChange) || "требует проверки"],
      ],
      hypothesis: "Расширенная рабочая карта собрана как предварительное понимание и требует проверки специалистом.",
    },
  };

  const summary = summaries[state.selectedProgramId] || summaries["quick-state"];

  return {
    version: 1,
    selectedProgramId: state.selectedProgramId,
    programTitle: program?.title || "Расширенный ИИ-анализ",
    completedAt,
    status: "completed",
    answers,
    title: summary.title,
    keyMetrics: summary.keyMetrics,
    sections: summary.sections,
    hypothesis: summary.hypothesis,
    safetyNote: "Предварительное понимание не является медицинским заключением, назначением или заменой медицинской помощи.",
  };
};

function ProgramSelection({ draft, onContinueDraft, onRestartDraft, onSelectProgram }) {
  return (
    <div className="advanced-ai-page">
      {draft ? (
        <article className="card advanced-draft-card">
          <div>
            <p className="card-kicker">Черновик</p>
            <h2>Есть незавершённый расширенный анализ</h2>
            <p>Можно продолжить с места остановки, начать заново или выбрать другую программу.</p>
          </div>
          <div className="summary-point-grid">
            <div>
              <span>Программа</span>
              <strong>{getProgram(draft.selectedProgramId)?.title || "Расширенный анализ"}</strong>
            </div>
            <div>
              <span>Обновлено</span>
              <strong>{formatDateTime(draft.updatedAt)}</strong>
            </div>
          </div>
          <div className="next-step-actions">
            <button className="primary-btn" onClick={onContinueDraft} type="button">Продолжить</button>
            <button className="secondary-btn" onClick={onRestartDraft} type="button">Начать заново</button>
            <button className="secondary-btn" onClick={() => onSelectProgram(null)} type="button">Выбрать другую программу</button>
          </div>
        </article>
      ) : null}

      <section className="card advanced-programs-card" aria-labelledby="advanced-ai-title">
        <div className="advanced-programs-head">
          <div>
            <p className="card-kicker">Расширенный ИИ-анализ</p>
            <h2 id="advanced-ai-title">Расширенный ИИ-анализ</h2>
            <p>
              Выберите, с какого анализа начать. Каждый тест проходит в формате мягкого диалога:
              один вопрос, один ответ, следующий шаг.
            </p>
          </div>
        </div>
        <div className="advanced-program-grid">
          {AI_ANALYSIS_PROGRAMS.map((program) => (
            <article className="advanced-program-card" key={program.id}>
              <div>
                <span>{program.estimatedSteps} шагов</span>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </div>
              <button className="primary-btn" onClick={() => onSelectProgram(program.id)} type="button">
                Начать
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResultView({ result, saved, onSave, onRestart, onSpecialistRequest }) {
  return (
    <article className="card lab-report-card advanced-result-card">
      <div className="section-head">
        <div>
          <span className="card-kicker">{result.programTitle}</span>
          <h2>{result.title}</h2>
        </div>
        <span className="lab-badge">требует проверки специалистом</span>
      </div>
      <p>{result.hypothesis}</p>
      <p className="safety-note">{result.safetyNote}</p>

      {result.keyMetrics.length > 0 ? (
        <div className="lab-result-grid">
          {result.keyMetrics.map(([label, value]) => (
            <div className="lab-result-item" key={label}>
              <span>{label}</span>
              <strong>{value ?? "не указано"}{typeof value === "number" ? "/10" : ""}</strong>
            </div>
          ))}
        </div>
      ) : null}

      <div className="lab-result-grid">
        {result.sections.map(([label, value]) => (
          <div className="lab-result-item" key={label}>
            <span>{label}</span>
            <strong>{value ?? "требует уточнения"}</strong>
          </div>
        ))}
      </div>

      <div className="next-step-actions">
        <button className="primary-btn" onClick={onSave} type="button">
          {saved ? "Сохранено в результаты" : "Сохранить в результаты"}
        </button>
        <button className="secondary-btn" onClick={onSpecialistRequest} type="button">Запросить отчёт специалиста</button>
        <button className="secondary-btn" onClick={onRestart} type="button">Выбрать другой анализ</button>
      </div>
    </article>
  );
}

export default function AdvancedAiAnalysis({ onModeChange, onResultSaved, onSaveAndExit }) {
  const chatWindowRef = useRef(null);
  const [state, setState] = useState(() => readJsonStorage(ADVANCED_AI_PROGRESS_KEY) || makeInitialState());
  const [draftValue, setDraftValue] = useState("");
  const [draftTags, setDraftTags] = useState([]);
  const [answerNotice, setAnswerNotice] = useState("");
  const [resultSaved, setResultSaved] = useState(false);
  const program = getProgram(state.selectedProgramId);
  const steps = program?.steps || [];
  const step = steps[state.currentStep] || steps[0];
  const currentAnswer = step ? state.answers[step.id] : null;
  const hasDraft = Boolean(state.selectedProgramId && state.status === "draft" && state.updatedAt);
  const hasAnyAnswer = Object.keys(state.answers || {}).length > 0;
  const isComplete = state.status === "completed" && program;
  const result = isComplete ? buildAdvancedResult(state) : null;
  const visibleSteps = isComplete ? steps : steps.slice(0, state.currentStep + 1);

  useEffect(() => {
    onModeChange?.(program ? "form" : "overview");
  }, [onModeChange, program]);

  useEffect(() => {
    setDraftValue(currentAnswer === undefined || currentAnswer === null ? "" : getAnswerFreeText(currentAnswer));
    setDraftTags(getAnswerTags(currentAnswer));
    setAnswerNotice("");
  }, [currentAnswer, step?.id]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow) return;
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
  }, [state]);

  const persistState = (nextState) => {
    const prepared = { ...nextState, updatedAt: new Date().toISOString() };
    setState(prepared);
    writeJsonStorage(ADVANCED_AI_PROGRESS_KEY, prepared);
    return prepared;
  };

  const selectProgram = (programId) => {
    if (!programId) {
      const nextState = makeInitialState();
      removeStorageItem(ADVANCED_AI_PROGRESS_KEY);
      setState(nextState);
      setResultSaved(false);
      return;
    }
    const nextState = makeInitialState(programId);
    persistState(nextState);
    setResultSaved(false);
  };

  const restartFlow = () => {
    removeStorageItem(ADVANCED_AI_PROGRESS_KEY);
    setState(makeInitialState());
    setResultSaved(false);
  };

  const setAnswer = (value) => {
    const nextAnswers = { ...state.answers, [step.id]: value };
    const isLastStep = state.currentStep >= steps.length - 1;
    const completedAt = isLastStep ? new Date().toISOString() : state.completedAt;
    persistState({
      ...state,
      answers: nextAnswers,
      currentStep: isLastStep ? state.currentStep : state.currentStep + 1,
      status: isLastStep ? "completed" : "draft",
      completedAt,
    });
  };

  const toggleDraftTag = (tag) => {
    setAnswerNotice("");
    setDraftTags((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag);
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
        setAnswerNotice("Выберите 1-3 подсказки или напишите коротко своими словами");
        return;
      }
      setAnswer(value);
      return;
    }

    if (draftValue.trim() === "") {
      setAnswerNotice("Напишите коротко своими словами");
      return;
    }

    setAnswer(draftValue.trim());
  };

  const goBack = () => {
    persistState({ ...state, status: "draft", currentStep: Math.max(state.currentStep - 1, 0) });
    setResultSaved(false);
  };

  const saveAndExit = () => {
    persistState(state);
    onSaveAndExit?.();
  };

  const saveResult = () => {
    if (!result) return;
    writeJsonStorage(ADVANCED_AI_RESULT_KEY, result);
    setResultSaved(true);
    onResultSaved?.(result);
  };

  const stepLabel = program ? `Шаг ${Math.min(state.currentStep + 1, steps.length)} из ${steps.length}` : "";

  if (!program) {
    return (
      <ProgramSelection
        draft={hasDraft ? state : null}
        onContinueDraft={() => setState(state)}
        onRestartDraft={restartFlow}
        onSelectProgram={selectProgram}
      />
    );
  }

  if (result) {
    return (
      <div className="first-intake-page first-intake-dialog advanced-ai-dialog">
        <ResultView
          result={result}
          saved={resultSaved}
          onRestart={restartFlow}
          onSave={saveResult}
          onSpecialistRequest={() => setAnswerNotice("Запрос сохранён как следующий шаг для специалиста.")}
        />
        {answerNotice ? <p className="answer-notice advanced-result-notice" role="status">{answerNotice}</p> : null}
      </div>
    );
  }

  return (
    <div className="first-intake-page first-intake-dialog advanced-ai-dialog">
      <article className="card intake-chat-card">
        <header className="chat-card-header">
          <div>
            <p className="card-kicker">Расширенный ИИ-анализ</p>
            <h2>{program.title}</h2>
          </div>
          <span className="chat-progress">{stepLabel}</span>
        </header>

        <div className="chat-window" aria-live="polite" ref={chatWindowRef}>
          <div className="chat-bubble therapist-bubble intro-bubble">
            <span>Специалист</span>
            <p>Идём мягко: один вопрос, один ответ, следующий шаг. Ответ можно выбрать подсказкой или добавить своими словами.</p>
          </div>
          {visibleSteps.map((item) => (
            <React.Fragment key={item.id}>
              <div className={item.id === step.id && !hasAnswerContent(currentAnswer) ? "chat-bubble therapist-bubble current-question-bubble" : "chat-bubble therapist-bubble"}>
                <span>Специалист</span>
                <p>{item.question}</p>
                {item.statement ? <small>{item.statement}</small> : null}
              </div>
              {hasAnswerContent(state.answers[item.id]) || state.answers[item.id] === 0 ? (
                <div className="chat-bubble user-bubble">
                  <span>Вы</span>
                  <p>{answerLabel(item, state.answers[item.id])}</p>
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <section className="answer-panel" aria-label="Ответ на текущий вопрос">
          <div className="answer-panel-head">
            <span>{step.label}</span>
            <strong>{step.type === "bachScale" ? "Оцените фразу" : step.type === "scale10" ? "Выберите число" : "Ответьте коротко"}</strong>
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
              <p className="scale-helper">0 - совсем нет, 10 - максимально сильно.</p>
            </>
          ) : step.type === "bachScale" ? (
            <div className="option-grid bach-scale-grid">
              {[0, 1, 2, 3].map((value) => (
                <button className="answer-chip" key={value} onClick={() => setAnswer(value)} type="button">
                  {answerLabel(step, value)}
                </button>
              ))}
            </div>
          ) : (
            <div className="field compact-note inline-answer-field">
              <span>Ваш ответ</span>
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
                id={`advanced-ai-${step.id}`}
                name={`advanced-ai-${step.id}`}
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
          {hasAnyAnswer ? <button className="secondary-btn" onClick={goBack} type="button">Назад</button> : null}
          {hasAnyAnswer ? <button className="secondary-btn" onClick={saveAndExit} type="button">Сохранить и выйти</button> : null}
          {hasAnyAnswer ? <button className="secondary-btn" onClick={restartFlow} type="button">Начать заново</button> : null}
        </footer>
      </article>
    </div>
  );
}
