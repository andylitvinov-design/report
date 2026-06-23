export const workbookNavigation = [
  {
    id: "intake",
    label: "Приём",
    shortLabel: "Приём",
    page: "self",
    pages: ["self", "advanced", "consultations"],
    subnav: [
      { id: "ai-intake", label: "ИИ-приём", page: "self", tab: "ai-intake" },
      { id: "master-intake", label: "Приём у Мастера", page: "consultations", tab: "master-intake" },
    ],
  },
  {
    id: "profile",
    label: "Профиль",
    shortLabel: "Профиль",
    page: "profile",
    pages: ["profile", "history", "settings"],
    subnav: [
      { id: "profile-now", label: "Сейчас", page: "profile", tab: "profile-now" },
      { id: "profile-dynamics", label: "Динамика", page: "history", tab: "Динамика замеров" },
      { id: "profile-settings", label: "Настройки", page: "settings", tab: "settings" },
    ],
  },
  {
    id: "next-actions",
    label: "Что делать",
    shortLabel: "Что делать",
    page: "recommendations",
    pages: ["recommendations", "expert"],
    subnav: [
      { id: "master-reports", label: "Отчёты Мастера", page: "recommendations", tab: "Отчёты Мастера" },
      { id: "ai-reports", label: "ИИ-отчёты", page: "recommendations", tab: "ИИ-отчёты" },
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
