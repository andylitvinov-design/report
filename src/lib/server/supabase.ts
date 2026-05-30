import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

import { getPrivateEnv, getPublicEnv } from "@/lib/server/env"

export async function getSupabaseServerClient() {
  const env = getPublicEnv()
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null

  const cookieStore = await cookies()

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}

export function getSupabaseAdminClient() {
  const publicEnv = getPublicEnv()
  const privateEnv = getPrivateEnv()
  if (!publicEnv.supabaseUrl || !privateEnv.supabaseServiceRoleKey) return null

  return createClient(publicEnv.supabaseUrl, privateEnv.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function createSupabaseBrowserClient() {
  const env = getPublicEnv()
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey)
}
