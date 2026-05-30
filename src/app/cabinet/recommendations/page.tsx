import { EmptyState } from "@/components/cabinet/states"
import { getCurrentCabinetUser } from "@/lib/server/auth"
import { getCabinetSnapshot } from "@/lib/server/cabinet-repository"

export default async function RecommendationsPage() {
  const user = await getCurrentCabinetUser()
  if (!user) return null
  const snapshot = await getCabinetSnapshot(user)
  const items = snapshot.recommendations.flatMap((item) => item.items_json)

  return (
    <>
      <section className="workspace report-first">
        {items.length ? (
          <div className="recommendation-list">
            {items.map((item, index) => (
              <article className="card recommendation-card" key={index}>
                <span>активная рекомендация</span>
                <h2>{String(item.title ?? "Рекомендация")}</h2>
                <p>{String(item.text ?? "")}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Формула поддержки пока не назначена" text="Она появится после первого экспертного отчёта." />
        )}
      </section>
      <aside className="specialist-panel">
        <article className="card soft-card">
          <h2>Что отслеживать</h2>
          <p>Повторная проверка обычно проводится через 7 дней после выбора формулы поддержки.</p>
        </article>
      </aside>
    </>
  )
}
