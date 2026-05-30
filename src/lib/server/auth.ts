import { cookies } from "next/headers"

import { isSupabaseConfigured } from "@/lib/server/env"
import { getSupabaseServerClient } from "@/lib/server/supabase"
import { upsertDevUser } from "@/lib/server/dev-cabinet-store"
import { upsertSupabaseUser } from "@/lib/server/cabinet-repository"
import { DEV_SESSION_COOKIE } from "@/lib/server/auth-constants"
import type { AuthContext, CabinetUser } from "@/types/cabinet"

function fallbackEmailFromUserId(userId: string) {
  return userId.includes("@") ? userId : `${userId}@dev.local`
}

export async function provisionUserFromAuth(authUser: {
  id: string
  email?: string | null
  user_metadata?: { avatar_url?: string | null; full_name?: string | null; name?: string | null }
}) {
  if (!authUser.email) return null
  const name = authUser.user_metadata?.full_name?.trim() || authUser.user_metadata?.name?.trim() || authUser.email.split("@")[0]
  const avatarUrl = authUser.user_metadata?.avatar_url?.trim() || null
  return upsertSupabaseUser({
    provider: "google",
    providerUserId: authUser.id,
    email: authUser.email,
    name,
    avatarUrl,
  })
}

export async function getCurrentCabinetUser(): Promise<CabinetUser | null> {
  const supabase = await getSupabaseServerClient()
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.email) return provisionUserFromAuth(user)
  }

  const cookieStore = await cookies()
  const devUserId = cookieStore.get(DEV_SESSION_COOKIE)?.value
  if (!devUserId || process.env.NODE_ENV === "production") return null

  return upsertDevUser({
    provider: "dev",
    providerUserId: devUserId,
    email: fallbackEmailFromUserId(devUserId),
    name: "Demo Client",
  })
}

export async function getAuthContext(): Promise<AuthContext> {
  const user = await getCurrentCabinetUser()
  return {
    hasOAuth: isSupabaseConfigured() || process.env.NODE_ENV !== "production",
    isAuthenticated: Boolean(user),
    userId: user?.id ?? null,
    email: user?.email ?? null,
  }
}

export async function setDevSession(userId: string | null) {
  if (process.env.NODE_ENV === "production") return
  const cookieStore = await cookies()
  if (!userId) {
    cookieStore.delete(DEV_SESSION_COOKIE)
    return
  }
  cookieStore.set(DEV_SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  })
}
