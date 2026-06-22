export const workbookNavigation = [
  {
    id: "ai-intake",
    label: "ИИ-приём",
    shortLabel: "Приём",
    page: "self",
    pages: ["overview", "self", "advanced"],
    subnav: [
      { id: "brief", label: "Краткий", page: "self" },
      { id: "request", label: "Запрос", page: "self" },
      { id: "bach", label: "Анализ Баха", page: "self" },
      { id: "extended", label: "Расширенный", page: "advanced" },
      { id: "ai-history", label: "История ИИ-приёмов", page: "profile" },
    ],
  },
  {
    id: "session",
    label: "Личная сессия",
    shortLabel: "Сессия",
    page: "consultations",
    pages: ["consultations"],
    subnav: [
      { id: "latest-report", label: "Последний отчёт", page: "consultations" },
      { id: "book", label: "Заказать сессию", page: "consultations" },
      { id: "session-history", label: "История сессий", page: "consultations" },
    ],
  },
  {
    id: "profile-reports",
    label: "Профиль / Отчёты",
    shortLabel: "Отчёты",
    page: "profile",
    pages: ["profile", "expert", "history", "settings"],
    subnav: [
      { id: "personal", label: "Личный анализ", page: "profile" },
      { id: "ai-reports", label: "ИИ-анализ", page: "profile" },
      { id: "data-dynamics", label: "Данные и динамика", page: "profile" },
      { id: "access", label: "Доступ и настройки", page: "settings" },
    ],
  },
  {
    id: "next",
    label: "Что дальше",
    shortLabel: "Дальше",
    page: "recommendations",
    pages: ["recommendations"],
    subnav: [
      { id: "current-assignment", label: "Текущее назначение", page: "recommendations" },
      { id: "support-plan", label: "План сопровождения", page: "recommendations" },
      { id: "next-step", label: "Следующий шаг", page: "recommendations" },
      { id: "next-check", label: "Следующая проверка", page: "recommendations" },
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
    category.subnav[0]
  );
}
