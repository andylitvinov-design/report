import { history as demoHistory } from "../data/mockData.js";

const STORAGE_KEY = "report-cabinet-analysis-runs-v1";

export function getUserStorageKey(userId) {
  return `${STORAGE_KEY}:${userId || "guest"}`;
}

export function seedAnalysisRunsForUser(user) {
  const userId = user?.id;
  if (!userId) return [];

  const storageKey = getUserStorageKey(userId);
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return JSON.parse(existing);

  const seeded = demoHistory.map((item, index) => ({
    id: `${userId}-analysis-${index + 1}`,
    userId,
    profileId: `${userId}-profile`,
    type: index === 0 ? "self_analysis" : "follow_up",
    status: "analyzed",
    title: item.event,
    summary: `Срез от ${item.date}: проблема ${item.problem}/10, ресурс ${item.resource}/10.`,
    daoLevel: item.resource,
    primaryElement: index % 2 === 0 ? "Земля" : "Вода",
    bottleneck: index % 2 === 0 ? "истощение опоры" : "сжатие ресурса",
    createdAt: item.date,
    updatedAt: item.date,
    problem: item.problem,
    resource: item.resource,
  }));

  window.localStorage.setItem(storageKey, JSON.stringify(seeded));
  return seeded;
}

export function listAnalysisRunsForUser(user) {
  if (!user?.id) return [];
  const storageKey = getUserStorageKey(user.id);
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return seedAnalysisRunsForUser(user);

  try {
    return JSON.parse(raw).filter((item) => item.userId === user.id);
  } catch {
    return seedAnalysisRunsForUser(user);
  }
}

export function createAnalysisRunForUser(user, input = {}) {
  if (!user?.id) {
    throw new Error("Требуется авторизация для создания анализа.");
  }

  const current = listAnalysisRunsForUser(user);
  const now = new Date().toISOString().slice(0, 10);
  const run = {
    id: `${user.id}-analysis-${Date.now()}`,
    userId: user.id,
    profileId: `${user.id}-profile`,
    type: input.type || "self_analysis",
    status: "draft",
    title: input.title || "Новый повторный самоанализ",
    summary: input.summary || "Черновик нового среза состояния.",
    daoLevel: input.daoLevel ?? null,
    primaryElement: input.primaryElement || null,
    bottleneck: input.bottleneck || null,
    createdAt: now,
    updatedAt: now,
    problem: input.problem ?? null,
    resource: input.resource ?? null,
  };

  const next = [run, ...current];
  window.localStorage.setItem(getUserStorageKey(user.id), JSON.stringify(next));
  return run;
}
