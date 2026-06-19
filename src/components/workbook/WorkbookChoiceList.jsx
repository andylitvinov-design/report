import React from "react";

export default function WorkbookChoiceList({ choices, label = "Варианты ответа" }) {
  return (
    <div className="workbook-choice-list" aria-label={label}>
      {choices.map((choice) => (
        <button
          aria-pressed={choice.isSelected}
          className={choice.isSelected ? "workbook-choice active" : "workbook-choice"}
          key={choice.id}
          onClick={choice.onSelect}
          type="button"
        >
          <span>{choice.label}</span>
          {choice.description ? <small>{choice.description}</small> : null}
        </button>
      ))}
    </div>
  );
}
