import { createAnalysisAction } from "@/app/actions"
import { getCurrentCabinetUser } from "@/lib/server/auth"
import { getCabinetSnapshot } from "@/lib/server/cabinet-repository"

const focusOptions = [
  "Здоровье / тело",
  "Эмоции / тревога",
  "Отношения",
  "Деньги / работа",
  "Энергия / усталость",
  "Выбор / решение",
]

export default async function SelfAnalysisPage() {
  const user = await getCurrentCabinetUser()
  if (!user) return null
  const snapshot = await getCabinetSnapshot(user)

  return (
    <>
      <section className="workspace report-first">
        <article className="card">
          <h2>Данные</h2>
          <p>Профиль: {snapshot.profile.display_name}</p>
          <p>Фокус: {snapshot.profile.focus_area ?? "не указан"}</p>
          <p>Последний срез: {snapshot.latestRun ? new Date(snapshot.latestRun.created_at).toLocaleDateString("ru-RU") : "нет данных"}</p>
        </article>

        <article className="card">
          <h2>Сделать самоанализ</h2>
          <form action={createAnalysisAction} className="analysis-form">
            <label className="field">
              <span>Название</span>
              <input name="title" placeholder="Например: Повторный срез после 7 дней" />
            </label>
            <label className="field">
              <span>Фокус работы</span>
              <select name="focusArea" defaultValue={snapshot.profile.focus_area ?? focusOptions[0]}>
                {focusOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <button className="primary-btn" type="submit">Перейти к шагам</button>
          </form>
        </article>
      </section>
      <aside className="specialist-panel">
        <article className="card soft-card">
          <h2>Контроль повтора</h2>
          <p>Повторный самоанализ нужен, если состояние изменилось или прошло 7-10 дней после рекомендаций.</p>
        </article>
      </aside>
    </>
  )
}
