"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getCurrentCabinetUser, setDevSession } from "@/lib/server/auth"
import { createAnalysisRunForUser } from "@/lib/server/cabinet-repository"
import { signOutSupabase } from "@/lib/server/supabase-auth"

export async function signOutAction() {
  await signOutSupabase()
  await setDevSession(null)
  redirect("/login")
}

export async function createAnalysisAction(formData: FormData) {
  const user = await getCurrentCabinetUser()
  if (!user) redirect("/login?next=/cabinet/self-analysis")

  const focusArea = String(formData.get("focusArea") ?? "Здоровье / тело")
  const title = String(formData.get("title") ?? "").trim() || undefined
  await createAnalysisRunForUser(user, { focusArea, title })
  revalidatePath("/cabinet")
  revalidatePath("/cabinet/history")
  redirect("/cabinet/history")
}
