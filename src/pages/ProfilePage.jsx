import React, { useEffect, useState } from "react";
import {
  authEnv,
  clearStoredSession,
  exchangeOAuthCodeFromUrl,
  getCurrentUser,
  getStoredSession,
  isStoredSessionExpired,
  signOut,
} from "../lib/authClient.js";

function userDisplayName(user) {
  return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Клиент PsiTherapy";
}

export default function ProfilePage() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!authEnv.isConfigured) {
        setAuthStatus("missing-config");
        return;
      }

      try {
        const session = await exchangeOAuthCodeFromUrl();
        const storedSession = session || getStoredSession();

        if (!storedSession?.access_token || isStoredSessionExpired(storedSession)) {
          clearStoredSession();
          if (isMounted) setAuthStatus("signed-out");
          return;
        }

        const currentUser = await getCurrentUser(storedSession);
        if (!isMounted) return;

        setUser(currentUser);
        setAuthStatus(currentUser ? "signed-in" : "signed-out");
      } catch (loadError) {
        clearStoredSession();
        if (!isMounted) return;
        setError(loadError?.message || "Не удалось загрузить пользователя.");
        setAuthStatus("error");
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    window.location.assign("/login");
  };

  if (authStatus === "loading") {
    return (
      <main className="auth-page">
        <section className="auth-card card">
          <p className="eyebrow">PsiTherapy</p>
          <h1>Загружаю кабинет…</h1>
          <p className="subtitle">Проверяю Google-сессию и доступ к профилю.</p>
        </section>
      </main>
    );
  }

  if (authStatus === "missing-config") {
    return (
      <main className="auth-page">
        <section className="auth-card card">
          <p className="eyebrow">Настройка нужна</p>
          <h1>Supabase Auth ещё не подключён</h1>
          <p className="subtitle">Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Vercel для проекта psitherapy.</p>
          <a className="secondary-btn auth-inline-btn" href="/login">На страницу входа</a>
        </section>
      </main>
    );
  }

  if (authStatus === "signed-out") {
    return (
      <main className="auth-page">
        <section className="auth-card card">
          <p className="eyebrow">Нужен вход</p>
          <h1>Откройте кабинет через Google</h1>
          <p className="subtitle">После входа здесь появятся ваши отчёты, самоанализ и рекомендации.</p>
          <a className="primary-btn auth-inline-btn" href="/login">Войти через Google</a>
        </section>
      </main>
    );
  }

  if (authStatus === "error") {
    return (
      <main className="auth-page">
        <section className="auth-card card">
          <p className="eyebrow">Ошибка входа</p>
          <h1>Google-сессия не загрузилась</h1>
          <p className="subtitle">{error}</p>
          <a className="primary-btn auth-inline-btn" href="/login">Попробовать снова</a>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-hero card">
        <div>
          <p className="eyebrow">Личный кабинет PsiTherapy</p>
          <h1>{userDisplayName(user)}</h1>
          <p className="subtitle">Вход через Google работает. Следующий слой — подключение личных отчётов, самоанализа и рекомендаций.</p>
        </div>
        <button className="secondary-btn" type="button" onClick={handleSignOut}>Выйти</button>
      </section>

      <section className="profile-grid">
        <article className="card profile-card">
          <span>Аккаунт</span>
          <strong>{user?.email}</strong>
          <p>Google ID подтверждён через Supabase Auth.</p>
        </article>

        <article className="card profile-card">
          <span>Мои отчёты</span>
          <strong>Готовится</strong>
          <p>Здесь будет список персональных терапевтических отчётов.</p>
        </article>

        <article className="card profile-card">
          <span>Самоанализ</span>
          <strong>Следующий этап</strong>
          <p>Форма самоанализа будет подключена к отдельным таблицам PsiTherapy.</p>
        </article>
      </section>
    </main>
  );
}
