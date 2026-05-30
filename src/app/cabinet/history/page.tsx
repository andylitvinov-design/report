import { EmptyState } from "@/components/cabinet/states"
import { getCurrentCabinetUser } from "@/lib/server/auth"
import { getCabinetSnapshot } from "@/lib/server/cabinet-repository"

export default async function HistoryPage() {
  const user = await getCurrentCabinetUser()
  if (!user) return null
  const snapshot = await getCabinetSnapshot(user)

  return (
    <>
      <section className="workspace report-first">
        <article className="card">
          <h2>Рекомендации и история изменений</h2>
          <p>Показаны карта личности, динамика замеров и записи пользователя {user.email}.</p>
        </article>
        {snapshot.runs.length ? (
          <div className="history-list">
            {snapshot.runs.map((run) => (
              <article className="card history-item" key={run.id}>
                <div>
                  <span>{new Date(run.created_at).toLocaleString("ru-RU")}</span>
                  <h3>{run.title}</h3>
                  <p>{run.summary}</p>
                </div>
                <div className="history-values">
                  <strong className="orange">{run.status}</strong>
                  <strong className="blue">{run.primary_element}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="История изменений пустая" text="Создайте новый самоанализ, чтобы он появился здесь." />
        )}
      </section>
      <aside className="specialist-panel">
        <article className="card soft-card">
          <h2>Приватность</h2>
          <p>Запросы к хранилищу всегда фильтруются по user_id текущей сессии.</p>
        </article>
      </aside>
    </>
  )
}
