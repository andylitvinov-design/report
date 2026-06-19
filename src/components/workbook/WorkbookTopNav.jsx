import React, { useId, useState } from "react";

export const workbookNavGroups = [
  { id: "overview", label: "Обзор", page: "overview" },
  { id: "intakes", label: "Приёмы", page: "self" },
  { id: "ai", label: "ИИ-анализ", page: "advanced" },
  { id: "results", label: "Результаты", page: "expert" },
  { id: "support", label: "Поддержка", page: "recommendations" },
  { id: "more", label: "Ещё", page: "history" },
];

export default function WorkbookTopNav({ activeGroup = "overview", onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuId = useId();
  const activeItem = workbookNavGroups.find((item) => item.id === activeGroup) || workbookNavGroups[0];

  const handleNavigate = (item) => {
    onNavigate?.(item.page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="workbook-nav-wrap">
      <button
        aria-controls={menuId}
        aria-expanded={isMobileMenuOpen}
        aria-haspopup="menu"
        className="workbook-mobile-nav-trigger"
        onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span>{activeItem.label}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {isMobileMenuOpen && (
        <div className="workbook-mobile-nav-menu" id={menuId} role="menu">
          {workbookNavGroups.map((item) => (
            <button
              aria-current={item.id === activeGroup ? "page" : undefined}
              className={item.id === activeGroup ? "workbook-mobile-nav-item active" : "workbook-mobile-nav-item"}
              key={item.id}
              onClick={() => handleNavigate(item)}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <nav className="workbook-top-nav" aria-label="Разделы журнала">
        {workbookNavGroups.map((item) => (
          <button
            aria-current={item.id === activeGroup ? "page" : undefined}
            className={item.id === activeGroup ? "workbook-nav-item active" : "workbook-nav-item"}
            key={item.id}
            onClick={() => handleNavigate(item)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
