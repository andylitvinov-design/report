import React, { useEffect, useMemo, useState } from "react";
import { QuestionCard, RemedyResultList } from "../components/Cards.jsx";
import { selfAnalysis } from "../data/mockData.js";
import { calculateBachScore, calculateRemedyResults } from "../lib/bachScoring.js";

const steps = [
  { id: "data", label: "Данные" },
  { id: "situation", label: "Ситуация", title: "Как я себя чувствую в данной ситуации?" },
  { id: "character", label: "Характер", title: "Какие устойчивые моменты особенно мешают мне?" },
  { id: "control", label: "Контроль", title: "Что сейчас больше всего напрягает или мучает меня?" },
  { id: "result", label: "Итог" },
];

const sectionIntro = {
  situation: "Оцените каждое утверждение по текущему состоянию.",
  character: "Здесь важны устойчивые паттерны, а не только сегодняшний день.",
  control: "Отметьте 5-7 самых точных пунктов или оцените всё, что явно проявлено.",
};

export default function SelfAnalysis({ onModeChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [mode, setMode] = useState("overview");
  const [activeStep, setActiveStep] = useState("data");
  const [focus, setFocus] = useState(selfAnalysis.focusOptions[0]);
  const [strength, setStrength] = useState(7);
  const [description, setDescription] = useState(
    "Усталость, внутренний шум, напряжение в теле. Хочется восстановить опору и не перегружаться."
  );
  const [scores, setScores] = useState(
    Object.fromEntries(selfAnalysis.questions.map((question) => [question.id, question.score]))
  );
  const [comments, setComments] = useState(
    Object.fromEntries(selfAnalysis.questions.map((question) => [question.id, ""]))
  );

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const sectionTotals = useMemo(() => {
    return selfAnalysis.questions.reduce(
      (acc, question) => {
        acc[question.section] += scores[question.id] || 0;
        return acc;
      },
      { situation: 0, character: 0, control: 0 }
    );
  }, [scores]);

  const questionCounts = useMemo(() => {
    return selfAnalysis.questions.reduce(
      (acc, question) => {
        acc[question.section] += 1;
        return acc;
      },
      { situation: 0, character: 0, control: 0 }
    );
  }, []);

  const bachScore = calculateBachScore({
    situation: sectionTotals.situation,
    character: sectionTotals.character,
    control: sectionTotals.control,
    crossSectionBonus: strength >= 7 ? 1 : 0,
    peakBonus: Math.max(...Object.values(scores)) >= 5 ? 1 : 0,
    controlPresenceBonus: sectionTotals.control > 0 ? 0.5 : 0,
  });

  const remedyResults = useMemo(
    () => calculateRemedyResults({ questions: selfAnalysis.questions, scores }),
    [scores]
  );

  const updateScore = (id, value) => setScores((current) => ({ ...current, [id]: value }));
  const updateComment = (id, value) => setComments((current) => ({ ...current, [id]: value }));
  const currentStepIndex = steps.findIndex((step) => step.id === activeStep);
  const visibleSection = ["situation", "character", "control"].includes(activeStep) ? activeStep : null;
  const visibleQuestions = visibleSection
    ? selfAnalysis.questions.filter((question) => question.section === visibleSection)
    : [];
  const selectedControlCount = selfAnalysis.questions.filter(
    (question) => question.section === "control" && (scores[question.id] || 0) > 0
  ).length;

  const goToStep = (stepId) => {
    setActiveStep(stepId);
    setMode("form");
  };

  const goNext = () => {
    const nextStep = steps[Math.min(currentStepIndex + 1, steps.length - 1)];
    setActiveStep(nextStep.id);
  };

  const goBack = () => {
    const previousStep = steps[Math.max(currentStepIndex - 1, 0)];
    setActiveStep(previousStep.id);
  };

  if (mode === "overview") {
    return (
      <div className="self-overview">
        <article className="card self-start-card">
          <p className="eyebrow">Самоанализ</p>
          <h2>Подготовьте новый срез без лишнего шума</h2>
          <p>
            Откройте сфокусированный режим, чтобы пройти данные, ситуацию, характер, контроль и получить
            предварительную Bach-группировку.
          </p>
          <div className="overview-actions">
            <button className="primary-btn" onClick={() => goToStep("data")} type="button">
              Начать самоанализ
            </button>
            <button className="secondary-btn" onClick={() => goToStep(activeStep)} type="button">
              Продолжить черновик
            </button>
            <button className="secondary-btn" onClick={() => goToStep("data")} type="button">
              Пройти повторную анкету
            </button>
            <button className="secondary-btn" type="button">Обновить только силу проблемы</button>
            <button className="secondary-btn" type="button">Добавить комментарий к состоянию</button>
          </div>
        </article>

        <section className="self-overview-grid">
          <article className="card status-card">
            <span>Статус</span>
            <strong>Черновик готов</strong>
            <p>Последний самоанализ: 21.05.2026. Следующая проверка нужна после изменения состояния.</p>
          </article>
          <article className="card status-card">
            <span>Сила проблемы</span>
            <strong>{strength}/10</strong>
            <p>Фокус: {focus}</p>
          </article>
          <article className="card status-card">
            <span>Черновик</span>
            <strong>{steps[currentStepIndex]?.label}</strong>
            <p>
              Сохранены ответы: {Object.values(scores).filter((score) => score > 0).length} из{" "}
              {selfAnalysis.questions.length}.
            </p>
          </article>
        </section>

        <article className="card">
          <div className="section-head">
            <div>
              <h2>Последний предварительный срез</h2>
              <p>Группы пересчитываются от текущих ответов в анкете.</p>
            </div>
            <button className="secondary-btn" onClick={() => goToStep("result")} type="button">
              Открыть итог
            </button>
          </div>
          <div className="result-grid three">
            <div>
              <h3>Основные кандидаты</h3>
              <RemedyResultList items={remedyResults.main} />
            </div>
            <div>
              <h3>Дополнительная поддержка</h3>
              <RemedyResultList items={remedyResults.support} />
            </div>
            <div>
              <h3>Требует проверки</h3>
              <RemedyResultList items={remedyResults.verify} />
            </div>
          </div>
        </article>

        <article className="card self-counts">
          <h2>Полная анкета сохранена</h2>
          <span>Ситуация: {questionCounts.situation}</span>
          <span>Характер: {questionCounts.character}</span>
          <span>Контроль: {questionCounts.control}</span>
        </article>
      </div>
    );
  }

  return (
    <div className="focused-form">
      <header className="form-progress card">
        <button className="secondary-btn" onClick={() => setMode("overview")} type="button">
          В кабинет
        </button>
        <div>
          <p className="eyebrow">Шаг {currentStepIndex + 1} из {steps.length}</p>
          <h1>{steps[currentStepIndex]?.label}</h1>
        </div>
        <button className="secondary-btn" type="button">Сохранить</button>
      </header>

      <nav className="step-nav" aria-label="Шаги самоанализа">
        {steps.map((step) => (
          <button
            className={step.id === activeStep ? "step-pill active" : "step-pill"}
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            type="button"
          >
            {step.label}
          </button>
        ))}
      </nav>

      {activeStep === "data" && (
        <article className="card">
          <h2>Текущие данные</h2>
          <div className="form-grid">
            <label className="field">
              <span>Дата</span>
              <input readOnly value={today} />
            </label>
            <label className="field">
              <span>Фокус работы</span>
              <select onChange={(event) => setFocus(event.target.value)} value={focus}>
                {selfAnalysis.focusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Сила проблемы сейчас: {strength}/10</span>
            <input
              max="10"
              min="0"
              onChange={(event) => setStrength(Number(event.target.value))}
              type="range"
              value={strength}
            />
          </label>

          <label className="field">
            <span>Краткое описание ситуации</span>
            <textarea onChange={(event) => setDescription(event.target.value)} value={description} />
          </label>
        </article>
      )}

      {visibleSection && (
        <div className="question-list">
          <article className="card question-section-head">
            <h2>{steps[currentStepIndex].title}</h2>
            <p>{sectionIntro[visibleSection]}</p>
            <span>
              Вопросов: {visibleQuestions.length}
              {visibleSection === "control" ? ` · отмечено: ${selectedControlCount}` : ""}
            </span>
          </article>
          {visibleQuestions.map((question, index) => (
            <QuestionCard
              comment={comments[question.id]}
              index={index}
              key={question.id}
              onCommentChange={updateComment}
              onScoreChange={updateScore}
              question={question}
              score={scores[question.id]}
            />
          ))}
        </div>
      )}

      {activeStep === "result" && (
        <article className="card result-panel">
          <h2>Итог самоанализа</h2>
          <p>
            Это предварительный срез по текущим ответам. Он помогает выбрать гипотезы для экспертной проверки,
            но не является медицинским выводом.
          </p>
          <div className="score-summary">
            <strong>{bachScore.displayValue}</strong>
            <span>предварительный Bach score</span>
          </div>
          <div className="result-grid three">
            <div>
              <h3>Основные кандидаты</h3>
              <RemedyResultList items={remedyResults.main} />
            </div>
            <div>
              <h3>Дополнительная поддержка</h3>
              <RemedyResultList items={remedyResults.support} />
            </div>
            <div>
              <h3>Требует проверки</h3>
              <RemedyResultList items={remedyResults.verify} />
            </div>
          </div>
          <div className="overview-actions">
            <button className="primary-btn" type="button">Сохранить самоанализ</button>
            <button className="secondary-btn" type="button">Запросить экспертный отчёт</button>
            <button className="secondary-btn" onClick={() => setMode("overview")} type="button">
              Вернуться в кабинет
            </button>
          </div>
        </article>
      )}

      <footer className="form-actions">
        <button className="secondary-btn" disabled={currentStepIndex === 0} onClick={goBack} type="button">
          Назад
        </button>
        <button className="primary-btn" disabled={currentStepIndex === steps.length - 1} onClick={goNext} type="button">
          Дальше
        </button>
      </footer>
    </div>
  );
}
