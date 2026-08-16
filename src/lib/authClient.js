import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "",
};

const REQUEST_TIMEOUT_MS = 12000;

export const authEnv = {
  provider: "firebase",
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  isConfigured: Object.values(firebaseConfig).every(Boolean),
};

let firebaseApp = null;
let firebaseAuth = null;

function authError(message, details = null) {
  const error = new Error(message);
  error.details = details;
  return error;
}

function requireConfig() {
  if (!authEnv.isConfigured) {
    throw authError("Для Google-входа нужно настроить Firebase переменные в Vercel.");
  }
}

function getFirebaseAuth() {
  requireConfig();

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
  }

  return firebaseAuth;
}

function normalizeFirebaseUser(user) {
  if (!user) return null;

  return {
    id: user.uid,
    email: user.email || "",
    user_metadata: {
      full_name: user.displayName || "",
      name: user.displayName || "",
      avatar_url: user.photoURL || "",
    },
    app_metadata: {
      provider: "firebase",
    },
  };
}

function waitForFirebaseUser(timeoutMs = REQUEST_TIMEOUT_MS) {
  const auth = getFirebaseAuth();

  if (auth.currentUser) {
    return Promise.resolve(normalizeFirebaseUser(auth.currentUser));
  }

  return new Promise((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => {
      unsubscribe();
      reject(authError("Вход загружается слишком долго. Проверьте подключение и попробуйте снова.", {
        status: 408,
        timeout: true,
      }));
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        globalThis.clearTimeout(timeoutId);
        unsubscribe();
        resolve(normalizeFirebaseUser(user));
      },
      (error) => {
        globalThis.clearTimeout(timeoutId);
        unsubscribe();
        reject(authError("Не удалось загрузить Firebase-сессию.", error));
      },
    );
  });
}

export function getStoredSession() {
  if (!authEnv.isConfigured || !firebaseAuth?.currentUser) return null;
  return { provider: "firebase", access_token: "firebase-session" };
}

export function clearStoredSession() {
  if (!authEnv.isConfigured || !firebaseAuth) return;
  void firebaseSignOut(firebaseAuth);
}

export function isStoredSessionExpired() {
  return false;
}

export async function exchangeOAuthCodeFromUrl() {
  if (typeof window === "undefined" || !authEnv.isConfigured) return null;

  const auth = getFirebaseAuth();
  const result = await getRedirectResult(auth);
  return normalizeFirebaseUser(result?.user || auth.currentUser);
}

export async function signInWithGoogle(redirectPath = "/profile") {
  requireConfig();

  const safePath = redirectPath.startsWith("/") && !redirectPath.startsWith("//") ? redirectPath : "/profile";
  const redirectTo = new URL(safePath, window.location.origin).toString();
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({ prompt: "select_account" });
  sessionStorage.setItem("psitherapy-auth-redirect", redirectTo);
  window.history.replaceState({}, document.title, safePath);
  await signInWithRedirect(auth, provider);
}

export async function getCurrentUser() {
  return waitForFirebaseUser();
}

export function signOut() {
  if (!authEnv.isConfigured || !firebaseAuth) return;
  void firebaseSignOut(firebaseAuth);
}
