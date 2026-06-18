import React, { useState } from "react";
import { authEnv, signInWithGoogle } from "../lib/authClient.js";

export default function LoginPage() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const analysisSteps = [
    {
      title: "Самоанализ текущего состояния",
      text: "Короткие вопросы помогают собрать картину: эмоции, ресурс, напряжение, запрос и повторяющиеся темы.",
    },
    {
      title: "Первичный разбор ситуации",
      text: "Система собирает ответы в понятную структуру: текущее состояние, главный узел, ресурс и следующий шаг.",
    },
    {
      title: "Персональные рекомендации",
      text: "Вы получаете мягкие рекомендации по поддержке: что отслеживать, на что опереться и с чего начать.",
    },
    {
      title: "Личный кабинет",
      text: "Ваши отчёты, самоанализ и динамика сохраняются в одном месте.",
    },
  ];

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
    <main className="auth-page auth-landing">
      <section className="auth-hero" aria-labelledby="auth-hero-title">
        <div className="auth-hero-copy">
          <p className="auth-brand">PsiTherapy</p>
          <h1 id="auth-hero-title">Бесплатный личный анализ ситуации</h1>
          <p className="auth-lead">
            Понять, что с вами происходит, где главный внутренний узел, и какие шаги могут поддержать вас сейчас.
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
              {status === "loading" ? "Открываю Google…" : "Пройти бесплатный анализ через Google"}
            </button>
            <p>
              Вход через Google нужен, чтобы сохранить ваши ответы, открыть личный кабинет и показать персональные рекомендации после анализа.
            </p>
            <a className="auth-link" href="/demo">
              Посмотреть демо отчёта
            </a>
          </div>
        </div>

        <div className="auth-preview" aria-label="Как работает личный анализ">
          <div className="auth-preview-panel">
            <span>Первый анализ</span>
            <strong>Состояние → Узел → Ресурс → Шаг</strong>
            <p>После входа ответы сохраняются в кабинете и становятся основой персональных рекомендаций.</p>
          </div>
          <div className="auth-preview-list">
            {analysisSteps.map((step) => (
              <article className="auth-step-card" key={step.title}>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="auth-safety-note" aria-label="Важное уточнение">
        <p>
          PsiTherapy не ставит медицинские диагнозы и не заменяет врача или психотерапевта. При серьёзных симптомах лучше обратиться к специалисту.
        </p>
      </section>
    </main>
  );
}
