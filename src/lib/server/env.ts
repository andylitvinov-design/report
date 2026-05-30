export function getPublicEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "",
  }
}

export function getPrivateEnv() {
  return {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "",
    googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || "",
  }
}

export function isSupabaseConfigured() {
  const env = getPublicEnv()
  return Boolean(env.supabaseUrl && env.supabaseAnonKey)
}

export function isSupabaseAdminConfigured() {
  return Boolean(isSupabaseConfigured() && getPrivateEnv().supabaseServiceRoleKey)
}
