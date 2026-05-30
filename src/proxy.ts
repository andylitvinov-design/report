import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { DEV_SESSION_COOKIE } from "@/lib/server/auth-constants"
import { getCabinetRedirectTarget } from "@/lib/server/auth-routing"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith("/cabinet")) return NextResponse.next()

  if (request.cookies.get(DEV_SESSION_COOKIE)?.value && process.env.NODE_ENV !== "production") {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseAnonKey) {
    let response = NextResponse.next({ request })
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) return response
  }

  const target = getCabinetRedirectTarget(pathname, false)
  return NextResponse.redirect(new URL(target ?? "/login?next=/cabinet", request.url))
}

export const config = {
  matcher: ["/cabinet/:path*"],
}
