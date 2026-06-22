import React, { useEffect, useId, useState } from "react";
import {
  findActiveWorkbookSubnav,
  findWorkbookCategoryById,
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../../data/workbookNavigation.js";

export default function WorkbookTopNav({ activeGroup, activePage = "overview", activeTab = "", onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuId = useId();
  const activeCategory = activeGroup
    ? findWorkbookCategoryById(activeGroup)
    : findWorkbookCategoryByPage(activePage);
  const activeSubnav = findActiveWorkbookSubnav(activeCategory, activePage, activeTab);

  const handleNavigate = (item) => {
    onNavigate?.(item.page, item.tab);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

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
        <span>{activeCategory.label}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {isMobileMenuOpen && (
        <div className="workbook-mobile-nav-menu" id={menuId} role="menu">
          <div className="workbook-mobile-nav-section" aria-label="Категории">
            {workbookNavigation.map((item) => (
              <button
                aria-current={item.id === activeCategory.id ? "page" : undefined}
                className={item.id === activeCategory.id ? "workbook-mobile-nav-item active" : "workbook-mobile-nav-item"}
                key={item.id}
                onClick={() => handleNavigate(item)}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

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

      <nav className="workbook-subnav" aria-label={`Подкатегории: ${activeCategory.label}`}>
        {activeCategory.subnav.map((item) => (
          <button
            aria-current={item.id === activeSubnav.id ? "page" : undefined}
            className={item.id === activeSubnav.id ? "workbook-subnav-item active" : "workbook-subnav-item"}
            key={item.id}
            onClick={() => handleNavigate(item)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="workbook-mobile-bottom-nav" aria-label="Основные разделы">
        {workbookNavigation.map((item) => (
          <button
            aria-current={item.id === activeCategory.id ? "page" : undefined}
            className={item.id === activeCategory.id ? "workbook-mobile-bottom-item active" : "workbook-mobile-bottom-item"}
            key={item.id}
            onClick={() => handleNavigate(item)}
            type="button"
          >
            {item.shortLabel || item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
