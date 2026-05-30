import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { DEV_SESSION_COOKIE } from "@/lib/server/auth-constants"
import { resolveSafeNextPath } from "@/lib/server/auth-routing"
import { createGoogleSignInUrl } from "@/lib/server/supabase-auth"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const next = resolveSafeNextPath(requestUrl.searchParams.get("next"), "/cabinet")

  try {
    const url = await createGoogleSignInUrl(requestUrl.origin, next)
    if (!url) {
      if (process.env.NODE_ENV !== "production") {
        const cookieStore = await cookies()
        cookieStore.set(DEV_SESSION_COOKIE, "demo-client", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          path: "/",
        })
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }

      return NextResponse.redirect(new URL(`/login?error=google_oauth_not_configured&next=${encodeURIComponent(next)}`, requestUrl.origin))
    }

    return NextResponse.redirect(url)
  } catch (error) {
    const message = error instanceof Error ? error.message : "google_oauth_start_failed"
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`, requestUrl.origin))
  }
}
