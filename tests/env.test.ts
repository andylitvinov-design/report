import { afterEach, describe, expect, it } from "vitest"

import { isSupabaseConfigured } from "@/lib/server/env"

const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const originalSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function restoreEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: string | undefined) {
  if (value === undefined) {
    delete process.env[name]
    return
  }
  process.env[name] = value
}

describe("auth environment", () => {
  afterEach(() => {
    restoreEnv("NEXT_PUBLIC_SUPABASE_URL", originalSupabaseUrl)
    restoreEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", originalSupabaseAnonKey)
  })

  it("keeps local dev fallback available when Supabase public env is absent", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(isSupabaseConfigured()).toBe(false)
  })

  it("uses Supabase auth only when both public values are configured", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(isSupabaseConfigured()).toBe(false)

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"

    expect(isSupabaseConfigured()).toBe(true)
  })
})
