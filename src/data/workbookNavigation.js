export const workbookNavigation = [
  {
    id: "intake",
    label: "Приём",
    shortLabel: "Приём",
    page: "self",
    pages: ["self", "advanced", "consultations"],
    subnav: [],
  },
  {
    id: "profile-reports",
    label: "Профиль / Отчёты",
    shortLabel: "Отчёты",
    page: "profile",
    pages: ["profile", "expert", "history", "settings"],
    subnav: [
      { id: "personal-analysis", label: "Личный анализ", page: "profile", tab: "personal-analysis" },
      { id: "ai-analysis", label: "ИИ-анализ", page: "expert", tab: "Меню отчётов" },
      { id: "data-dynamics", label: "Данные и динамика", page: "history", tab: "Динамика замеров" },
      { id: "access-settings", label: "Доступ и настройки", page: "settings", tab: "access-settings" },
    ],
  },
  {
    id: "prescription",
    label: "Назначение",
    shortLabel: "Назначение",
    page: "recommendations",
    pages: ["recommendations"],
    subnav: [
      { id: "master-prescription", label: "Рецепт Мастера", page: "recommendations", tab: "Рецепт Мастера" },
      { id: "ai-advice", label: "ИИ-советы", page: "recommendations", tab: "ИИ-советы" },
    ],
  },
];

export function findWorkbookCategoryByPage(page) {
  return workbookNavigation.find((item) => item.pages.includes(page)) || workbookNavigation[0];
}

export function findWorkbookCategoryById(id) {
  return workbookNavigation.find((item) => item.id === id) || workbookNavigation[0];
}

export function findActiveWorkbookSubnav(category, activePage, activeTab) {
  return (
    category.subnav.find((item) => item.tab && item.tab === activeTab) ||
    category.subnav.find((item) => item.page === activePage) ||
    category.subnav[0] ||
    null
  );
}
