import { getSupabaseAdminClient } from "@/lib/server/supabase"
import { createDevAnalysisRun, getDevCabinetSnapshot, upsertDevUser } from "@/lib/server/dev-cabinet-store"
import type { CabinetSnapshot, CabinetUser } from "@/types/cabinet"

type UserInput = {
  provider: string
  providerUserId: string
  email: string
  name?: string | null
  avatarUrl?: string | null
}

export async function upsertSupabaseUser(input: UserInput) {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return upsertDevUser(input)
  }

  const stamp = new Date().toISOString()
  const { data: existing, error: lookupError } = await supabase
    .from("users")
    .select("*")
    .eq("provider", input.provider)
    .eq("provider_user_id", input.providerUserId)
    .maybeSingle()

  if (lookupError) throw lookupError

  if (existing) {
    const { data, error } = await supabase
      .from("users")
      .update({
        email: input.email.toLowerCase(),
        name: input.name ?? existing.name,
        avatar_url: input.avatarUrl ?? existing.avatar_url,
        updated_at: stamp,
      })
      .eq("id", existing.id)
      .select("*")
      .single()
    if (error) throw error
    await ensureSupabaseProfile(data as CabinetUser)
    return data as CabinetUser
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      provider: input.provider,
      provider_user_id: input.providerUserId,
      email: input.email.toLowerCase(),
      name: input.name ?? input.email.split("@")[0],
      avatar_url: input.avatarUrl ?? null,
      role: "client",
      created_at: stamp,
      updated_at: stamp,
    })
    .select("*")
    .single()
  if (error) throw error
  await ensureSupabaseProfile(data as CabinetUser)
  return data as CabinetUser
}

async function ensureSupabaseProfile(user: CabinetUser) {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const { data: existing, error: lookupError } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()
  if (lookupError) throw lookupError
  if (existing) return existing

  const stamp = new Date().toISOString()
  const { data, error } = await supabase
    .from("client_profiles")
    .insert({
      user_id: user.id,
      display_name: user.name ?? user.email.split("@")[0],
      focus_area: "Здоровье / тело",
      created_at: stamp,
      updated_at: stamp,
    })
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function getCabinetSnapshot(user: CabinetUser): Promise<CabinetSnapshot> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return getDevCabinetSnapshot(user)

  const profile = await ensureSupabaseProfile(user)
  if (!profile) return getDevCabinetSnapshot(user)

  const { data: runs, error: runsError } = await supabase
    .from("analysis_runs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  if (runsError) throw runsError

  const latestRun = runs?.[0] ?? null
  const { data: latestReport, error: reportError } = latestRun
    ? await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .eq("analysis_run_id", latestRun.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null, error: null }
  if (reportError) throw reportError

  const { data: recommendations, error: recommendationsError } = latestReport
    ? await supabase
        .from("recommendations")
        .select("*")
        .eq("user_id", user.id)
        .eq("report_id", latestReport.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null }
  if (recommendationsError) throw recommendationsError

  return {
    user,
    profile,
    runs: runs ?? [],
    latestRun,
    latestReport,
    recommendations: recommendations ?? [],
  }
}

export async function createAnalysisRunForUser(
  user: CabinetUser,
  input: { focusArea: string; title?: string; summary?: string }
) {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return createDevAnalysisRun(user.id, input)

  const profile = await ensureSupabaseProfile(user)
  if (!profile) throw new Error("Client profile is unavailable.")

  const stamp = new Date().toISOString()
  const { data: run, error } = await supabase
    .from("analysis_runs")
    .insert({
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
    })
    .select("*")
    .single()
  if (error) throw error

  const { error: answersError } = await supabase.from("analysis_answers").insert({
    analysis_run_id: run.id,
    payload_json: { focusArea: input.focusArea, source: "cabinet_form" },
    created_at: stamp,
  })
  if (answersError) throw answersError

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .insert({
      analysis_run_id: run.id,
      user_id: user.id,
      title: `Отчет: ${run.title}`,
      report_json: { focusArea: input.focusArea },
      report_markdown: `## ${run.title}\n\n${run.summary}`,
      pdf_url: null,
      created_at: stamp,
      updated_at: stamp,
    })
    .select("*")
    .single()
  if (reportError) throw reportError

  const { error: recommendationsError } = await supabase.from("recommendations").insert({
    report_id: report.id,
    user_id: user.id,
    items_json: [
      { title: "Olive", text: "Снизить нагрузку и восстановить базовый ресурс." },
      { title: "White Chestnut", text: "Фиксировать повторяющиеся мысли вечером." },
    ],
    repeat_check_after: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    created_at: stamp,
  })
  if (recommendationsError) throw recommendationsError
  return run
}
