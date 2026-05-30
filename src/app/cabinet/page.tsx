import { DynamicsChart, ThemeBars } from "@/components/cabinet/charts"
import { EmptyState } from "@/components/cabinet/states"
import { getCurrentCabinetUser } from "@/lib/server/auth"
import { getCabinetSnapshot } from "@/lib/server/cabinet-repository"

const themes = [
  { label: "Истощение", value: 80 },
  { label: "Внутренний шум", value: 70 },
  { label: "Границы", value: 58 },
]

export default async function CabinetOverviewPage() {
  const user = await getCurrentCabinetUser()
  if (!user) return null
  const snapshot = await getCabinetSnapshot(user)
  const latest = snapshot.latestRun
  const chartPoints = snapshot.runs.slice(0, 4).reverse().map((run, index) => ({
    key: run.id,
    label: new Date(run.created_at).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
    problem: Math.max(2, 8 - index),
    resource: Math.min(9, 3 + index),
  }))

  return (
    <>
      <section className="workspace report-first">
        {latest ? (
          <>
            <div className="metrics-grid">
              <article className="metric-card orange"><span>DAO level</span><strong>{latest.dao_level}/10</strong></article>
              <article className="metric-card green"><span>Ведущий элемент</span><strong>{latest.primary_element}</strong></article>
              <article className="metric-card orange"><span>Bottleneck</span><strong>{latest.bottleneck}</strong></article>
              <article className="metric-card blue"><span>Всего срезов</span><strong>{snapshot.runs.length}</strong></article>
            </div>
            <article className="card report-summary">
              <h2>{latest.title}</h2>
              <p>{latest.summary}</p>
              {snapshot.latestReport ? <p className="subtitle">{snapshot.latestReport.title}</p> : null}
            </article>
          </>
        ) : (
          <EmptyState title="История пока пустая" text="Создайте первый самоанализ, чтобы увидеть динамику и отчет." />
        )}

        <div className="dashboard-grid">
          <article className="card">
            <h2>График динамики</h2>
            <DynamicsChart points={chartPoints.length ? chartPoints : [{ key: "start", label: "старт", problem: 7, resource: 4 }]} />
          </article>
          <article className="card">
            <h2>Ведущие темы</h2>
            <ThemeBars items={themes} />
          </article>
        </div>
      </section>

      <aside className="specialist-panel">
        <article className="card soft-card">
          <h2>Следующий шаг</h2>
          <p>Если прошло 7-10 дней после последнего среза, лучше пройти короткий повторный самоанализ.</p>
        </article>
      </aside>
    </>
  )
}
