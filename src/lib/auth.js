const SESSION_KEY = "report-cabinet-session-v1";

export function getAuthConfig() {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  };
}

export function isGoogleAuthConfigured() {
  const config = getAuthConfig();
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

export function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function createDevSession() {
  return storeSession({
    id: "dev-google-user",
    provider: "dev-google",
    email: "client@example.com",
    name: "Demo Client",
    avatarUrl: "",
    role: "client",
  });
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getSafeNextPath(value, fallback = "/cabinet") {
  if (!value || !value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export function startGoogleSignIn(nextPath = "/cabinet") {
  const next = getSafeNextPath(nextPath);
  const { supabaseUrl, supabaseAnonKey } = getAuthConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    createDevSession();
    window.location.assign(next);
    return;
  }

  const redirectTo = new URL("/auth/callback", window.location.origin);
  redirectTo.searchParams.set("next", next);

  const authUrl = new URL("/auth/v1/authorize", supabaseUrl);
  authUrl.searchParams.set("provider", "google");
  authUrl.searchParams.set("redirect_to", redirectTo.toString());
  authUrl.searchParams.set("response_type", "token");

  window.location.assign(authUrl.toString());
}

async function fetchSupabaseUser(accessToken) {
  const { supabaseUrl, supabaseAnonKey } = getAuthConfig();
  if (!supabaseUrl || !supabaseAnonKey || !accessToken) return null;

  const response = await fetch(new URL("/auth/v1/user", supabaseUrl), {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function completeGoogleCallback() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");

  if (!accessToken) {
    return createDevSession();
  }

  const user = await fetchSupabaseUser(accessToken);
  if (!user?.email) {
    throw new Error("Google auth succeeded, but Supabase user data is unavailable.");
  }

  return storeSession({
    id: `google-${String(user.id || user.email).slice(0, 24)}`,
    provider: "google",
    providerUserId: user.id || null,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split("@")[0],
    avatarUrl: user.user_metadata?.avatar_url || "",
    role: "client",
  });
}