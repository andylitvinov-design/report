import React, { useEffect, useMemo, useState } from "react";
import { ReportApp } from "../App.jsx";
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

function buildClientFromUser(user) {
  return {
    name: userDisplayName(user),
    email: user?.email || "",
    id: user?.id ? user.id.slice(0, 8).toUpperCase() : "CLIENT",
    focus: "первичный анализ ситуации",
    lastSlice: "ожидает первого приёма",
    nextSession: "вход через Google подтверждён",
  };
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

  const clientOverride = useMemo(() => buildClientFromUser(user), [user]);

  const handleSignOut = () => {
    signOut();
    window.location.assign("/login");
  };

  const signOutAction = (
    <button className="secondary-btn sidebar-logout" type="button" onClick={handleSignOut}>Выйти из кабинета</button>
  );

  if (authStatus === "loading") {
    return (
      <main className="auth-page">
        <section className="auth-card card">
          <p className="eyebrow">PsiTherapy</p>
          <h1>Загружаю кабинет…</h1>
          <p className="subtitle">Проверяю Google-сессию и открываю структуру личного кабинета.</p>
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

  return <ReportApp clientOverride={clientOverride} onSignOut={handleSignOut} userAction={signOutAction} />;
}
