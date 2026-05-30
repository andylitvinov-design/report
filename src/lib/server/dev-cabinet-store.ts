import type { AnalysisRun, CabinetUser, ClientProfile, Recommendation, Report } from "@/types/cabinet"

type DevState = {
  users: CabinetUser[]
  profiles: ClientProfile[]
  runs: AnalysisRun[]
  reports: Report[]
  recommendations: Recommendation[]
}

const globalStore = globalThis as typeof globalThis & { __cabinetDevStore?: DevState }

function now() {
  return new Date().toISOString()
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

function getStore() {
  if (!globalStore.__cabinetDevStore) {
    globalStore.__cabinetDevStore = {
      users: [],
      profiles: [],
      runs: [],
      reports: [],
      recommendations: [],
    }
  }
  return globalStore.__cabinetDevStore
}

export function resetDevCabinetStoreForTests() {
  globalStore.__cabinetDevStore = {
    users: [],
    profiles: [],
    runs: [],
    reports: [],
    recommendations: [],
  }
}

export async function upsertDevUser(input: {
  provider: string
  providerUserId: string
  email: string
  name?: string | null
  avatarUrl?: string | null
}) {
  const store = getStore()
  const email = input.email.toLowerCase()
  const existing = store.users.find((user) => user.email === email || user.provider_user_id === input.providerUserId)
  const stamp = now()

  if (existing) {
    existing.name = input.name ?? existing.name
    existing.avatar_url = input.avatarUrl ?? existing.avatar_url
    existing.updated_at = stamp
    return existing
  }

  const user: CabinetUser = {
    id: input.provider === "dev" ? input.providerUserId : `dev_${input.provider}_${input.providerUserId}`,
    provider: input.provider,
    provider_user_id: input.providerUserId,
    email,
    name: input.name ?? email.split("@")[0],
    avatar_url: input.avatarUrl ?? null,
    role: "client",
    created_at: stamp,
    updated_at: stamp,
  }
  store.users.push(user)
  await ensureDevProfile(user.id, user.name ?? user.email.split("@")[0], null)
  return user
}

export async function ensureDevProfile(userId: string, displayName: string, focusArea: string | null) {
  const store = getStore()
  const existing = store.profiles.find((profile) => profile.user_id === userId)
  const stamp = now()
  if (existing) {
    existing.display_name = displayName || existing.display_name
    existing.focus_area = focusArea ?? existing.focus_area
    existing.updated_at = stamp
    return existing
  }

  const profile: ClientProfile = {
    id: createId("profile"),
    user_id: userId,
    display_name: displayName,
    birth_date: null,
    focus_area: focusArea,
    created_at: stamp,
    updated_at: stamp,
  }
  store.profiles.push(profile)
  return profile
}

export async function createDevAnalysisRun(
  userId: string,
  input: { focusArea: string; title?: string; summary?: string }
) {
  const store = getStore()
  const user = store.users.find((item) => item.id === userId) ?? (await upsertDevUser({
    provider: "dev",
    providerUserId: userId,
    email: `${userId}@dev.local`,
    name: "Demo Client",
  }))
  const profile = await ensureDevProfile(user.id, user.name ?? "Demo Client", input.focusArea)
  const stamp = now()
  const run: AnalysisRun = {
    id: createId("run"),
    user_id: user.id,
    profile_id: profile.id,
    type: "self_analysis",
    status: "submitted",
    title: input.title ?? `Самоанализ: ${input.focusArea}`,
    summary: input.summary ?? "Новый срез принят и ожидает экспертной интерпретации.",
    dao_level: 4,
    primary_element: "Дерево",
    bottleneck: "Земля",
    created_at: stamp,
    updated_at: stamp,
  }
  store.runs.push(run)

  const report: Report = {
    id: createId("report"),
    analysis_run_id: run.id,
    user_id: user.id,
    title: `Отчет: ${run.title}`,
    report_json: { focusArea: input.focusArea, source: "dev_fallback" },
    report_markdown: `## ${run.title}\n\n${run.summary}`,
    pdf_url: null,
    created_at: stamp,
    updated_at: stamp,
  }
  store.reports.push(report)
  store.recommendations.push({
    id: createId("recommendation"),
    report_id: report.id,
    user_id: user.id,
    items_json: [
      { title: "Olive", text: "Снизить нагрузку и восстановить базовый ресурс." },
      { title: "White Chestnut", text: "Фиксировать повторяющиеся мысли вечером." },
    ],
    repeat_check_after: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    created_at: stamp,
  })

  return run
}

export async function listDevAnalysisRunsForUser(userId: string) {
  return getStore().runs
    .filter((run) => run.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getDevCabinetSnapshot(user: CabinetUser) {
  const store = getStore()
  const profile = await ensureDevProfile(user.id, user.name ?? user.email.split("@")[0], "Здоровье / тело")
  if (!store.runs.some((run) => run.user_id === user.id)) {
    await createDevAnalysisRun(user.id, {
      focusArea: profile.focus_area ?? "Здоровье / тело",
      title: "Первичный срез",
      summary: "Стартовый демонстрационный срез для локальной разработки.",
    })
  }

  const runs = await listDevAnalysisRunsForUser(user.id)
  const latestRun = runs[0] ?? null
  const latestReport = latestRun
    ? store.reports.find((report) => report.user_id === user.id && report.analysis_run_id === latestRun.id) ?? null
    : null
  const recommendations = latestReport
    ? store.recommendations.filter((item) => item.user_id === user.id && item.report_id === latestReport.id)
    : []

  return { user, profile, runs, latestRun, latestReport, recommendations }
}
