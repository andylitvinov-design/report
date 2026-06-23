import React from "react";
import {
  findActiveWorkbookSubnav,
  findWorkbookCategoryById,
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../../data/workbookNavigation.js";
import WorkbookSubNav from "./WorkbookSubNav.jsx";

const mobileWorkbookNavigation = [
  { id: "overview", label: "Обзор", page: "overview", pages: ["overview"] },
  ...workbookNavigation,
];

export default function WorkbookTopNav({ activeGroup, activePage = "overview", activeTab = "", onNavigate }) {
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
        {mobileWorkbookNavigation.map((item) => {
          const active = item.id === "overview"
            ? activePage === "overview"
            : item.pages.includes(activePage);

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
