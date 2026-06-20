export const workbookNavigation = [
  {
    id: "home",
    label: "Главная",
    page: "overview",
    pages: ["overview"],
    subnav: [
      { id: "overview", label: "Обзор", page: "overview" },
      { id: "start", label: "Старт", page: "overview" },
      { id: "whats-new", label: "Что нового", page: "overview" },
      { id: "next", label: "Следующий шаг", page: "overview" },
    ],
  },
  {
    id: "profile",
    label: "Профиль",
    page: "profile",
    pages: ["profile"],
    subnav: [
      { id: "profile-data", label: "Данные", page: "profile" },
      { id: "account", label: "Состояние аккаунта", page: "profile" },
      { id: "security", label: "Безопасность", page: "settings" },
      { id: "logout", label: "Выход", page: "settings" },
    ],
  },
  {
    id: "self",
    label: "Самоанализ",
    page: "self",
    pages: ["self"],
    subnav: [
      { id: "first-intake", label: "Первый приём", page: "self" },
      { id: "follow-up", label: "Повторный AI-приём", page: "advanced" },
      { id: "resume", label: "Незавершённый приём", page: "self" },
    ],
  },
  {
    id: "ai",
    label: "ИИ-анализ",
    page: "advanced",
    pages: ["advanced"],
    subnav: [
      { id: "advanced", label: "Расширенный анализ", page: "advanced" },
      { id: "quick", label: "Быстрые сценарии", page: "advanced" },
      { id: "body", label: "Тело", page: "advanced" },
      { id: "emotions", label: "Эмоции", page: "advanced" },
      { id: "resource", label: "Ресурс", page: "advanced" },
      { id: "relations", label: "Отношения", page: "advanced" },
    ],
  },
  {
    id: "reports",
    label: "Отчёты",
    page: "expert",
    pages: ["expert"],
    subnav: [
      { id: "self-report", label: "Самоотчёт", page: "expert", tab: "Самоотчёт" },
      { id: "expert", label: "Диагностика", page: "expert", tab: "Диагностика эксперта" },
      { id: "mechanism", label: "Механизм", page: "expert", tab: "Механизм" },
      { id: "wuxing", label: "У-Син", page: "expert", tab: "У-Син" },
      { id: "remedies", label: "Препараты", page: "expert", tab: "Препараты" },
      { id: "dynamics", label: "Динамика", page: "history" },
    ],
  },
  {
    id: "consultations",
    label: "Консультации",
    page: "consultations",
    pages: ["consultations"],
    subnav: [
      { id: "book", label: "Записаться", page: "consultations" },
      { id: "my-consults", label: "Мои консультации", page: "consultations" },
      { id: "specialist-request", label: "Запрос специалисту", page: "consultations" },
    ],
  },
  {
    id: "support",
    label: "Поддержка",
    page: "recommendations",
    pages: ["recommendations"],
    subnav: [
      { id: "assignment", label: "Назначение", page: "recommendations" },
      { id: "recommendations", label: "Рекомендации", page: "recommendations" },
      { id: "plan", label: "План действий", page: "recommendations" },
      { id: "track", label: "Что отслеживать", page: "recommendations" },
    ],
  },
  {
    id: "history",
    label: "История",
    page: "history",
    pages: ["history"],
    subnav: [
      { id: "dynamics", label: "Динамика", page: "history" },
      { id: "slices", label: "Срезы по датам", page: "history" },
      { id: "baseline", label: "Сравнить с baseline", page: "history" },
      { id: "archive", label: "Архив", page: "history" },
    ],
  },
  {
    id: "settings",
    label: "Настройки",
    page: "settings",
    pages: ["settings"],
    subnav: [
      { id: "profile", label: "Профиль", page: "settings" },
      { id: "notifications", label: "Уведомления", page: "settings" },
      { id: "privacy", label: "Приватность", page: "settings" },
      { id: "help", label: "Помощь", page: "settings" },
      { id: "logout", label: "Выйти", page: "settings" },
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
