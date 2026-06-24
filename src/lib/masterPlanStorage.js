import { MASTER_PLAN_IDS, normalizeMasterPlanId } from "./masterPlans.js";

const STORAGE_KEY_PREFIX = "psitherapy:master-plan";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function getMasterPlanStorageKey(email) {
  const normalizedEmail = normalizeEmail(email);
  return `${STORAGE_KEY_PREFIX}:${normalizedEmail || "anonymous"}`;
}

export function getDefaultMasterPlanForEmail(email, adminEmail = import.meta.env?.VITE_ADMIN_EMAIL || "") {
  const normalizedEmail = normalizeEmail(email);
  const normalizedAdminEmail = normalizeEmail(adminEmail);
  if (normalizedEmail && normalizedAdminEmail && normalizedEmail === normalizedAdminEmail) {
    return MASTER_PLAN_IDS.PRACTIC;
  }
  return MASTER_PLAN_IDS.START;
}

function getBrowserStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

export function resolveStoredMasterPlan({
  email = "",
  adminEmail = import.meta.env?.VITE_ADMIN_EMAIL || "",
  storage = null,
} = {}) {
  const defaultPlan = getDefaultMasterPlanForEmail(email, adminEmail);
  const browserStorage = getBrowserStorage(storage);
  if (!browserStorage) return defaultPlan;

  try {
    const savedPlan = browserStorage.getItem(getMasterPlanStorageKey(email));
    return savedPlan ? normalizeMasterPlanId(savedPlan) : defaultPlan;
  } catch {
    return defaultPlan;
  }
}

export function saveStoredMasterPlan({ email = "", planId, storage = null } = {}) {
  const browserStorage = getBrowserStorage(storage);
  const normalizedPlanId = normalizeMasterPlanId(planId);
  if (!browserStorage) return normalizedPlanId;

  try {
    browserStorage.setItem(getMasterPlanStorageKey(email), normalizedPlanId);
  } catch {
    return normalizedPlanId;
  }

  return normalizedPlanId;
}
