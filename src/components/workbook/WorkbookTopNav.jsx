import React from "react";
import {
  findActiveWorkbookSubnav,
  findWorkbookCategoryById,
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../../data/workbookNavigation.js";
import WorkbookSubNav from "./WorkbookSubNav.jsx";

export default function WorkbookTopNav({ activeGroup, activePage = "self", activeTab = "", onNavigate }) {
  const activeCategory = activeGroup
    ? findWorkbookCategoryById(activeGroup)
    : findWorkbookCategoryByPage(activePage);
  const activeSubnav = findActiveWorkbookSubnav(activeCategory, activePage, activeTab);

  const handleNavigate = (item) => {
    onNavigate?.(item.page, item.tab);
  };

  return (
    <div className="workbook-nav-wrap">
      <nav className="workbook-mobile-nav-row" aria-label="Основные разделы">
        {workbookNavigation.map((item) => {
          const active = item.pages.includes(activePage);
          return (
            <button
              aria-current={active ? "page" : undefined}
              className={active ? "workbook-mobile-nav-pill active" : "workbook-mobile-nav-pill"}
              key={item.id}
              onClick={() => handleNavigate(item)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <nav className="workbook-top-nav" aria-label="Категории личного кабинета">
        {workbookNavigation.map((item) => (
          <button
            aria-current={item.id === activeCategory.id ? "page" : undefined}
            className={item.id === activeCategory.id ? "workbook-nav-item active" : "workbook-nav-item"}
            key={item.id}
            onClick={() => handleNavigate(item)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <WorkbookSubNav activeSubnav={activeSubnav} category={activeCategory} onNavigate={handleNavigate} />
    </div>
  );
}
