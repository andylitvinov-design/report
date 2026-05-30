import Link from "next/link"

import { GoogleIdentityButton } from "@/components/auth/google-identity-button"
import { getAuthContext } from "@/lib/server/auth"

export default async function HomePage() {
  const auth = await getAuthContext()

  return (
    <main className="landing-shell">
      <section className="landing-panel">
        <p className="eyebrow">Кабинет клиента</p>
        <h1>Holistic Therapy</h1>
        <p className="subtitle">
          Личный кабинет для текущих анализов, экспертных отчетов, рекомендаций и динамики повторных срезов.
        </p>
        <div className="action-row">
          {auth.isAuthenticated ? <Link className="primary-btn" href="/cabinet">Открыть кабинет</Link> : <GoogleIdentityButton />}
          <Link className="ghost-link" href="/docs/client-cabinet/prototype/overview.html">Статический прототип</Link>
        </div>
      </section>
    </main>
  )
}
