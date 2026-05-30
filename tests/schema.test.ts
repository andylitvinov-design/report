import { readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"

describe("Supabase schema", () => {
  it("defines the required client cabinet history tables", async () => {
    const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8")

    for (const table of [
      "users",
      "client_profiles",
      "analysis_runs",
      "analysis_answers",
      "reports",
      "recommendations",
    ]) {
      expect(schema).toMatch(new RegExp(`create table if not exists public\\.${table}`))
    }
  })

  it("enables RLS and adds user-history indexes", async () => {
    const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8")

    for (const table of [
      "users",
      "client_profiles",
      "analysis_runs",
      "analysis_answers",
      "reports",
      "recommendations",
    ]) {
      expect(schema).toContain(`alter table public.${table} enable row level security;`)
    }

    expect(schema).toContain("client_profiles_user_id_idx")
    expect(schema).toContain("analysis_runs_user_id_created_at_idx")
    expect(schema).toContain("reports_user_id_created_at_idx")
    expect(schema).toContain("recommendations_user_id_idx")
  })
})
