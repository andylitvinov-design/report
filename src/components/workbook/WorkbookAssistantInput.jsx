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
      <textarea id={id} name={name} onChange={onChange} placeholder={placeholder} value={value} />
      <button className="primary-btn" onClick={onSubmit} type="button">
        {buttonLabel}
      </button>
      {notice ? <p className="answer-notice" role="status">{notice}</p> : null}
    </div>
  );
}
