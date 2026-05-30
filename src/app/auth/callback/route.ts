import { NextResponse } from "next/server"

import { provisionUserFromAuth } from "@/lib/server/auth"
import { resolveSafeNextPath } from "@/lib/server/auth-routing"
import { getSupabaseServerClient } from "@/lib/server/supabase"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const next = resolveSafeNextPath(requestUrl.searchParams.get("next"), "/cabinet")

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}&next=${encodeURIComponent(next)}`, requestUrl.origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/login?error=missing_code&next=${encodeURIComponent(next)}`, requestUrl.origin))
  }

  const supabase = await getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.redirect(new URL(`/login?error=supabase_not_configured&next=${encodeURIComponent(next)}`, requestUrl.origin))
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(exchangeError.message)}&next=${encodeURIComponent(next)}`, requestUrl.origin))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) await provisionUserFromAuth(user)

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
