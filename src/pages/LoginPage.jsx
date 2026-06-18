import React, { useState } from "react";
import { authEnv, signInWithGoogle } from "../lib/authClient.js";

export default function LoginPage() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setStatus("loading");
    setError("");

    try {
      await signInWithGoogle("/profile");
    } catch (loginError) {
      setStatus("error");
      setError(loginError?.message || "Не удалось начать вход через Google.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card card">
        <div>
          <p className="eyebrow">PsiTherapy</p>
          <h1>Вход в личный кабинет</h1>
          <p className="subtitle">
            Войдите через Google, чтобы открыть клиентский кабинет, отчёты, самоанализ и рекомендации.
          </p>
        </div>

        {!authEnv.isConfigured && (
          <div className="auth-notice">
            <strong>Supabase ещё не настроен.</strong>
            <span>Добавьте в Vercel переменные VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.</span>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <button className="primary-btn auth-google-btn" type="button" onClick={handleGoogleLogin} disabled={status === "loading" || !authEnv.isConfigured}>
          {status === "loading" ? "Открываю Google…" : "Войти через Google"}
        </button>

        <a className="auth-link" href="/">
          Вернуться к демо отчёта
        </a>
      </section>
    </main>
  );
}
