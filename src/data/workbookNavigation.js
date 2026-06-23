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
    id: "next-step",
    label: "Что дальше",
    shortLabel: "Дальше",
    page: "recommendations",
    pages: ["recommendations"],
    subnav: [
      { id: "current-assignment", label: "Текущее назначение", page: "recommendations", tab: "current-assignment" },
      { id: "support-plan", label: "План сопровождения", page: "recommendations", tab: "support-plan" },
      { id: "personal-session", label: "Личная сессия", page: "consultations", tab: "order" },
      { id: "next-action", label: "Следующий шаг", page: "recommendations", tab: "next-action" },
      { id: "next-check", label: "Следующая проверка", page: "recommendations", tab: "next-check" },
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
