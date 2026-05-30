"use client"

import { useTransition } from "react"

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="google-mark" viewBox="0 0 24 24">
      <path d="M21.6 12.23c0-.68-.06-1.34-.18-1.97H12v3.73h5.39a4.6 4.6 0 0 1-1.99 3.01v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.27Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.22-2.5c-.9.6-2.05.95-3.4.95-2.61 0-4.82-1.76-5.61-4.12H3.06v2.58A10 10 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.39 13.89a5.98 5.98 0 0 1 0-3.78V7.53H3.06a10 10 0 0 0 0 8.94l3.33-2.58Z" fill="#FBBC05" />
      <path d="M12 5.98c1.47 0 2.79.5 3.82 1.47l2.86-2.86C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.06 7.53l3.33 2.58c.79-2.36 3-4.13 5.61-4.13Z" fill="#EA4335" />
    </svg>
  )
}

export function GoogleIdentityButton({ nextPath = "/cabinet" }: { nextPath?: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      className="google-btn"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          const url = new URL("/auth/google", window.location.origin)
          url.searchParams.set("next", nextPath)
          window.location.assign(url.toString())
        })
      }}
      type="button"
    >
      <GoogleMark />
      {isPending ? "Переходим в Google..." : "Войти через Google"}
    </button>
  )
}
