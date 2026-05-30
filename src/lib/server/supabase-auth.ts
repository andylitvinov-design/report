import { getSupabaseServerClient } from "@/lib/server/supabase"

export async function createGoogleSignInUrl(origin: string, next = "/cabinet") {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) throw error
  return data.url
}

export async function signOutSupabase() {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return
  await supabase.auth.signOut()
}
