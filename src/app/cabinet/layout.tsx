import { redirect } from "next/navigation"

import { CabinetNav, CabinetSidebar } from "@/components/cabinet/nav"
import { getCurrentCabinetUser } from "@/lib/server/auth"

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentCabinetUser()
  if (!user) redirect("/login?next=/cabinet")

  return (
    <div className="app-shell">
      <CabinetSidebar />
      <main className="main-shell">
        <section className="topbar">
          <div>
            <p className="eyebrow">Личный кабинет</p>
            <h1>Кабинет клиента</h1>
            <p className="subtitle">
              {user.email} · данные и история фильтруются по текущему пользователю
            </p>
          </div>
        </section>
        <CabinetNav />
        {children}
      </main>
    </div>
  )
}
