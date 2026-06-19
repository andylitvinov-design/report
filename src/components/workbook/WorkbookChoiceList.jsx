import React from "react";

function ChoiceIcon({ type = "leaf" }) {
  const paths = {
    head: (
      <>
        <path d="M18 7.5c5.4 0 9.7 4 9.7 9.3 0 3.2-1.5 5.2-3.6 7.3v4.4h-8.7v-3.7h-2.7v-4.2c-1.7-1.5-2.5-3.4-2.5-5.7 0-4.3 3.3-7.7 7.8-7.7Z" />
        <path d="M16 15.2c1.2-2.1 4.9-2 5.8.3.8 2.2-1.5 4.4-3.7 3.7-1.8-.6-2.4-2.4-1.5-3.7" />
      </>
    ),
    heart: (
      <>
        <path d="M18.5 27.5s-8.5-5.1-8.5-11.2c0-3.2 2.1-5.5 5-5.5 1.8 0 3 1 3.5 2 .6-1 1.8-2 3.6-2 2.9 0 5 2.3 5 5.5 0 6.1-8.6 11.2-8.6 11.2Z" />
        <path d="M25.2 8.8c1.2.9 2.1 2.1 2.7 3.6" />
      </>
    ),
    body: (
      <>
        <path d="M16.1 7.7c-1.4 4.1.1 6.5 2.9 8.1 3.5 2 4.2 5.6 2.2 8.3-1.4 1.9-3.8 2.8-6.5 2.3" />
        <path d="M11.8 25.6c2.1-2.5 2.7-5.1 1.6-7.9-1.4-3.4-.9-6.4 1.4-9" />
        <path d="M11.2 28c2.8-1.2 5.2-1.2 7.4 0" />
      </>
    ),
    leaf: (
      <>
        <path d="M18.5 29V8" />
        <path d="M18.5 14.5c-4.1-3.7-7.4-3.6-10-.2 4 .8 7.2.8 10 .2Z" />
        <path d="M18.5 20.5c4.7-4.1 8.3-4 11-.2-4.4.9-7.8.9-11 .2Z" />
      </>
    ),
  };

  return (
    <svg className="workbook-choice-icon" viewBox="0 0 36 36" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
        {paths[type] || paths.leaf}
      </g>
    </svg>
  );
}

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
          <ChoiceIcon type={choice.icon} />
          <span>{choice.label}</span>
          {choice.description ? <small>{choice.description}</small> : null}
          <b aria-hidden="true">→</b>
        </button>
      ))}
    </div>
  );
}
