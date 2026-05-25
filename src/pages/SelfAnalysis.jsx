import React, { useMemo, useState } from "react";
import { FormulaList, QuestionCard } from "../components/Cards.jsx";
import { selfAnalysis } from "../data/mockData.js";
import { calculateBachScore } from "../lib/bachScoring.js";

const sectionMap = {
  "Анкета ситуации": "situation",
  "Анкета характера": "character",
  "Контроль": "control",
};

export default function SelfAnalysis({ activeTab }) {
  const today = new Date().toISOString().slice(0, 10);
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

  const sectionTotals = useMemo(() => {
    return selfAnalysis.questions.reduce(
      (acc, question) => {
        acc[question.section] += scores[question.id] || 0;
        return acc;
      },
      { situation: 0, character: 0, control: 0 }
    );
  }, [scores]);

  const bachScore = calculateBachScore({
    situation: sectionTotals.situation,
    character: sectionTotals.character,
    control: sectionTotals.control,
    crossSectionBonus: strength >= 7 ? 1 : 0,
    peakBonus: Math.max(...Object.values(scores)) >= 5 ? 1 : 0,
    controlPresenceBonus: sectionTotals.control > 0 ? 0.5 : 0,
  });

  const updateScore = (id, value) => setScores((current) => ({ ...current, [id]: value }));
  const updateComment = (id, value) => setComments((current) => ({ ...current, [id]: value }));
  const visibleSection = sectionMap[activeTab];
  const visibleQuestions = visibleSection
    ? selfAnalysis.questions.filter((question) => question.section === visibleSection)
    : selfAnalysis.questions;

  if (activeTab === "Итог") {
    return (
      <article className="card result-panel">
        <h2>Итог самоанализа</h2>
        <p>
          This is a preliminary slice based on client answers. Final recommendations are formed after expert analysis.
        </p>
        <div className="score-summary">
          <strong>{bachScore.displayValue}</strong>
          <span>предварительный Bach score</span>
        </div>
        <div className="result-grid">
          <div>
            <h3>Main candidates</h3>
            <FormulaList items={["Olive", "White Chestnut"]} />
          </div>
          <div>
            <h3>Additional support</h3>
            <FormulaList items={["Elm"]} />
          </div>
          <div>
            <h3>Needs verification</h3>
            <FormulaList items={["Oak", "Centaury"]} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
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

      {activeTab !== "Текущие данные" && (
        <div className="question-list">
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

      <article className="card compact-result">
        <h2>Предварительный итог по Bach</h2>
        <div className="score-summary inline">
          <strong>{bachScore.displayValue}</strong>
          <span>total = situation + character + control * 1.5 + bonuses</span>
        </div>
        <FormulaList items={["Olive", "Elm", "White Chestnut"]} />
      </article>
    </>
  );
}
