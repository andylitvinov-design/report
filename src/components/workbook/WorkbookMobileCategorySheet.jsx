import React from "react";
import { workbookNavigation } from "../../data/workbookNavigation.js";

export default function WorkbookMobileCategorySheet({
  activeCategory,
  activeSubnav,
  id,
  onNavigate,
}) {
  return (
    <div className="workbook-mobile-nav-menu" id={id} role="menu">
      <div className="workbook-mobile-nav-section" aria-label="Категории">
        {workbookNavigation.map((item) => (
          <button
            aria-current={item.id === activeCategory.id ? "page" : undefined}
            className={item.id === activeCategory.id ? "workbook-mobile-nav-item active" : "workbook-mobile-nav-item"}
            key={item.id}
            onClick={() => onNavigate(item)}
            role="menuitem"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="workbook-mobile-subnav-section" aria-label={`Подкатегории: ${activeCategory.label}`}>
        {activeCategory.subnav.map((item) => (
          <button
            aria-current={item.id === activeSubnav.id ? "page" : undefined}
            className={item.id === activeSubnav.id ? "workbook-mobile-subnav-item active" : "workbook-mobile-subnav-item"}
            key={item.id}
            onClick={() => onNavigate(item)}
            role="menuitem"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
