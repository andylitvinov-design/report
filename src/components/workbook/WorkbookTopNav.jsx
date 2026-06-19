import React from "react";

export const workbookNavGroups = [
  { id: "overview", label: "Обзор", page: "overview" },
  { id: "intakes", label: "Приёмы", page: "self" },
  { id: "ai", label: "ИИ-анализ", page: "advanced" },
  { id: "results", label: "Результаты", page: "expert" },
  { id: "support", label: "Поддержка", page: "recommendations" },
  { id: "more", label: "Ещё", page: "history" },
];

export default function WorkbookTopNav({ activeGroup = "overview", onNavigate }) {
  return (
    <nav className="workbook-top-nav" aria-label="Разделы журнала">
      {workbookNavGroups.map((item) => (
        <button
          aria-current={item.id === activeGroup ? "page" : undefined}
          className={item.id === activeGroup ? "workbook-nav-item active" : "workbook-nav-item"}
          key={item.id}
          onClick={() => onNavigate?.(item.page)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
