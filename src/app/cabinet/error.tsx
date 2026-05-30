"use client"

import { ErrorState } from "@/components/cabinet/states"

export default function CabinetError({ error }: { error: Error }) {
  return <section className="workspace"><ErrorState message={error.message} /></section>
}
