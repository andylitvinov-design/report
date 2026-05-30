import { EmptyState } from "@/components/cabinet/states"
import { getCurrentCabinetUser } from "@/lib/server/auth"
import { getCabinetSnapshot } from "@/lib/server/cabinet-repository"

export default async function ExpertAnalysisPage() {
  const user = await getCurrentCabinetUser()
  if (!user) return null
  const snapshot = await getCabinetSnapshot(user)
  const latest = snapshot.latestRun

  return (
    <>
      <section className="workspace report-first">
        {latest ? (
          <article className="card">
            <h2>Последний экспертный отчёт</h2>
            <p>{latest.summary}</p>
            <div className="result-grid">
              <div><h3>Основной узел</h3><p>{latest.primary_element}: ресурс ниже нагрузки.</p></div>
              <div><h3>Бутылочное горлышко</h3><p>{latest.bottleneck}: требуется мягкое восстановление.</p></div>
              <div><h3>У-Син</h3><p>График динамики сверяется с повторным самоанализом.</p></div>
            </div>
          </article>
        ) : (
          <EmptyState title="Экспертный отчёт ещё не создан" text="Сначала заполните самоанализ." />
        )}
      </section>
      <aside className="specialist-panel">
        <article className="card warning-card">
          <h2>Повторная проверка</h2>
          <p>Не создавайте повторный экспертный отчёт раньше, чем появятся новые ответы или пройдёт контрольный период.</p>
        </article>
      </aside>
    </>
  )
}
