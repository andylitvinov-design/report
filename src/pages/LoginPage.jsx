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
    <main className="auth-page auth-split-page">
      <section className="auth-visual-panel" aria-label="PsiTherapy">
        <div className="auth-visual-copy">
          <h1>Начните путь к ясности</h1>
          <p>Самоанализ, экспертная диагностика и рекомендации в одном личном кабинете.</p>
        </div>
        <p className="auth-visual-brand">PsiTherapy</p>
      </section>

      <section className="auth-form-panel" aria-labelledby="auth-login-title">
        <div className="auth-form-card">
          <p className="auth-brand">PsiTherapy</p>
          <h2 id="auth-login-title">Вход в личный кабинет</h2>
          <p className="auth-lead">
            Войдите через Google, чтобы открыть отчёты, самоанализ и рекомендации.
          </p>

          {!authEnv.isConfigured && (
            <div className="auth-notice">
              <strong>Supabase ещё не настроен.</strong>
              <span>Добавьте в Vercel переменные VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.</span>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-actions">
            <button className="primary-btn auth-google-btn" type="button" onClick={handleGoogleLogin} disabled={status === "loading" || !authEnv.isConfigured}>
              {status === "loading" ? "Открываю Google…" : "Войти через Google"}
            </button>
            <a className="auth-link" href="/demo">
              Вернуться к демо отчёта
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
