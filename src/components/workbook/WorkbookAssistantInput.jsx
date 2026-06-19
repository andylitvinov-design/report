import React from "react";

export default function WorkbookAssistantInput({
  buttonLabel = "Сохранить ответ",
  id,
  label = "Или напишите своими словами",
  name,
  notice = "",
  onChange,
  onSubmit,
  placeholder,
  value,
}) {
  return (
    <div className="workbook-assistant-input">
      <label htmlFor={id}>{label}</label>
      <div className="workbook-input-row">
        <textarea id={id} name={name} onChange={onChange} placeholder={placeholder} value={value} />
        <button className="workbook-send-btn" aria-label={buttonLabel} onClick={onSubmit} type="button">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 15.4 27 5l-7.8 22-4.4-9.7L5 15.4Z" />
            <path d="m14.8 17.3 5.4-5.5" />
          </svg>
        </button>
      </div>
      {notice ? <p className="answer-notice" role="status">{notice}</p> : null}
    </div>
  );
}
