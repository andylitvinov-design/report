const STORAGE_PREFIX = "psitherapy:my-coaching-plan:v1";

function normalizeOwner(value) {
  return String(value || "").trim().toLowerCase();
}

export function getLifePlanStorageKey(ownerId, email = "") {
  const owner = normalizeOwner(ownerId) || normalizeOwner(email) || "anonymous";
  return `${STORAGE_PREFIX}:${encodeURIComponent(owner)}`;
}

function getStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage || null;
  } catch {
    return null;
  }
}

export function createEmptyLifePlanSections() {
  return {
    direction: { current: "", desired: "", actions: "", notes: "" },
    wellbeing: { current: "", desired: "", actions: "", notes: "" },
    relationships: { current: "", desired: "", actions: "", notes: "" },
    career: { current: "", desired: "", actions: "", notes: "" },
    money: { current: "", desired: "", actions: "", notes: "" },
    growth: { current: "", desired: "", actions: "", notes: "" },
    lifestyle: { current: "", desired: "", actions: "", notes: "" },
    goals: { current: "", desired: "", actions: "", notes: "" },
    reflection: { current: "", desired: "", actions: "", notes: "" },
  };
}

export function normalizeLifePlanSections(value) {
  const defaults = createEmptyLifePlanSections();
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([key, template]) => {
    const section = source[key] && typeof source[key] === "object" ? source[key] : {};
    return [key, Object.fromEntries(Object.keys(template).map((field) => [
      field,
      typeof section[field] === "string" ? section[field].slice(0, 8000) : "",
    ]))];
  }));
}

export function hasLifePlanContent(sections) {
  return Object.values(normalizeLifePlanSections(sections)).some((section) =>
    Object.values(section).some((value) => value.trim().length > 0)
  );
}

export function readLifePlan({ ownerId = "", email = "", storage = null } = {}) {
  const target = getStorage(storage);
  if (!target) return null;
  try {
    const raw = target.getItem(getLifePlanStorageKey(ownerId, email));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      sections: normalizeLifePlanSections(parsed?.sections),
      updatedAt: typeof parsed?.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return null;
  }
}

export function saveLifePlan({ ownerId = "", email = "", sections, storage = null, now = new Date() } = {}) {
  const target = getStorage(storage);
  if (!target) throw new Error("Хранилище плана недоступно в этом браузере.");
  const value = {
    sections: normalizeLifePlanSections(sections),
    updatedAt: now.toISOString(),
  };
  try {
    target.setItem(getLifePlanStorageKey(ownerId, email), JSON.stringify(value));
  } catch {
    throw new Error("Не удалось сохранить план в этом браузере. Проверьте свободное место и настройки приватности.");
  }
  return value;
}
