"use client"

import Link from "next/link"
import { useTransition } from "react"

import { signOutAction } from "@/app/actions"
import type { AuthContext } from "@/types/cabinet"

export function AuthEntryButton({ auth }: { auth: AuthContext }) {
  const [isPending, startTransition] = useTransition()

  if (auth.isAuthenticated) {
    return (
      <button
        className="auth-btn"
        disabled={isPending}
        onClick={() => startTransition(async () => signOutAction())}
        type="button"
      >
        {auth.email ?? "Аккаунт"} / {isPending ? "..." : "Выйти"}
      </button>
    )
  }

  return (
    <Link className="auth-btn" href="/login">
      Войти
    </Link>
  )
}
