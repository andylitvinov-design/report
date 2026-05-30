import Link from "next/link"

const items = [
  ["/cabinet", "Профиль / Обзор"],
  ["/cabinet/expert-analysis", "Отчёт эксперта"],
  ["/cabinet/recommendations", "Назначение"],
  ["/cabinet/self-analysis", "Сделать самоанализ"],
  ["/cabinet/history", "Рекомендации"],
]

export function CabinetNav() {
  return (
    <nav className="mobile-nav cabinet-links" aria-label="Разделы кабинета">
      {items.map(([href, label]) => (
        <Link className="tab" href={href} key={href}>
          {label}
        </Link>
      ))}
    </nav>
  )
}

export function CabinetSidebar() {
  return (
    <aside className="sidebar" aria-label="Основная навигация">
      <div className="brand">
        <strong>Holistic Therapy Cabinet</strong>
        <span>Кабинет натуральной терапии</span>
      </div>
      <nav className="nav-list">
        {items.map(([href, label]) => (
          <Link className="nav-item" href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="client-mini">
        <strong>Личный кабинет</strong>
        <span>История и отчеты доступны только текущему пользователю.</span>
      </div>
    </aside>
  )
}
