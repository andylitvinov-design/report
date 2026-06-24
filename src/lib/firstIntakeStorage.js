export const FIRST_INTAKE_PROGRESS_KEY = "profile:first-intake-progress:v1";
export const FIRST_INTAKE_RESULT_KEY = "profile:first-intake-result:v1";

export function readJsonStorage(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function writeJsonStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function readFirstIntakeResult() {
  return readJsonStorage(FIRST_INTAKE_RESULT_KEY);
}

export function readFirstIntakeProgress() {
  return readJsonStorage(FIRST_INTAKE_PROGRESS_KEY);
}
