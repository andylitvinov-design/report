import React from "react";

export default function WorkbookSubNav({ activeSubnav, category, onNavigate }) {
  return (
    <nav className="workbook-subnav" aria-label={`Подкатегории: ${category.label}`}>
      {category.subnav.map((item) => (
        <button
          aria-current={item.id === activeSubnav.id ? "page" : undefined}
          className={item.id === activeSubnav.id ? "workbook-subnav-item active" : "workbook-subnav-item"}
          key={item.id}
          onClick={() => onNavigate(item)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
