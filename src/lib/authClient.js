const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL?.replace(/\/$/, "") || "";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

const SESSION_KEY = "psitherapy-session";
const PKCE_VERIFIER_KEY = "psitherapy-pkce-verifier";
const REQUEST_TIMEOUT_MS = 12000;

export const authEnv = {
  url: SUPABASE_URL,
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};

function authError(message, details = null) {
  const error = new Error(message);
  error.details = details;
  return error;
}

function requireConfig() {
  if (!authEnv.isConfigured) {
    throw authError("Для Google-входа нужно настроить VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Vercel.");
  }
}

async function request(path, options = {}) {
  requireConfig();

  const {
    method = "GET",
    body,
    accessToken,
    headers = {},
    timeoutMs = REQUEST_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${SUPABASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw authError("Вход загружается слишком долго. Проверьте подключение и попробуйте снова.", {
        status: 408,
        timeout: true,
      });
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw authError(data?.msg || data?.message || "Ошибка Supabase Auth запроса.", {
      ...(data && typeof data === "object" ? data : {}),
      status: response.status,
    });
  }

  return data;
}

function base64UrlEncode(value) {
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function createPkceVerifier() {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function createPkceChallenge(verifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64UrlEncode(digest);
}

function storeSession(session) {
  if (!session?.access_token) return null;

  const expiresAt = Number(session.expires_at) || (session.expires_in ? Math.floor(Date.now() / 1000) + Number(session.expires_in) : null);
  const storedSession = {
    access_token: session.access_token,
    refresh_token: session.refresh_token || "",
    expires_at: expiresAt,
    token_type: session.token_type || "bearer",
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(storedSession));
  return storedSession;
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isStoredSessionExpired(session) {
  if (!session?.expires_at) return false;
  const expiresAt = Number(session.expires_at);
  if (!Number.isFinite(expiresAt)) return false;
  return expiresAt * 1000 <= Date.now();
}

export async function exchangeOAuthCodeFromUrl() {
  if (typeof window === "undefined" || !authEnv.isConfigured) return null;

  const searchParams = new URLSearchParams(window.location.search);
  const authCode = searchParams.get("code");
  if (!authCode) return getStoredSession();

  const codeVerifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
  if (!codeVerifier) return getStoredSession();

  try {
    const data = await request("/auth/v1/token?grant_type=pkce", {
      method: "POST",
      body: {
        auth_code: authCode,
        code_verifier: codeVerifier,
      },
    });
    const storedSession = storeSession(data);
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);
    return storedSession;
  } catch (error) {
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);
    throw error;
  }
}

export async function signInWithGoogle(redirectPath = "/profile") {
  requireConfig();

  const safePath = redirectPath.startsWith("/") && !redirectPath.startsWith("//") ? redirectPath : "/profile";
  const redirectTo = new URL(safePath, window.location.origin).toString();
  const authorizeUrl = new URL("/auth/v1/authorize", `${SUPABASE_URL}/`);
  const codeVerifier = createPkceVerifier();
  const codeChallenge = await createPkceChallenge(codeVerifier);

  sessionStorage.setItem(PKCE_VERIFIER_KEY, codeVerifier);
  authorizeUrl.searchParams.set("provider", "google");
  authorizeUrl.searchParams.set("redirect_to", redirectTo);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "s256");

  window.location.assign(authorizeUrl.toString());
}

export async function getCurrentUser(session = getStoredSession()) {
  if (!session?.access_token) return null;

  return request("/auth/v1/user", {
    accessToken: session.access_token,
  });
}

export function signOut() {
  clearStoredSession();
}
