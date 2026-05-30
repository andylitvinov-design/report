import { GoogleIdentityButton } from "@/components/auth/google-identity-button"
import { resolveSafeNextPath } from "@/lib/server/auth-routing"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const params = await searchParams
  const nextPath = resolveSafeNextPath(params.next, "/cabinet")

  return (
    <main className="landing-shell">
      <section className="landing-panel login-panel">
        <p className="eyebrow">Авторизация</p>
        <h1>Вход в кабинет</h1>
        <p className="subtitle">Войдите через Google, чтобы открыть личные отчеты и историю анализов.</p>
        {params.error ? <p className="form-error">Google OAuth не настроен или вход не завершен: {params.error}</p> : null}
        <GoogleIdentityButton nextPath={nextPath} />
      </section>
    </main>
  )
}
