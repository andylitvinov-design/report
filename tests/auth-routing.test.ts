import { describe, expect, it } from "vitest"

import { getCabinetRedirectTarget, resolveSafeNextPath } from "@/lib/server/auth-routing"

describe("auth routing", () => {
  it("keeps cabinet next paths local and rejects external redirects", () => {
    expect(resolveSafeNextPath("/cabinet/history", "/cabinet")).toBe("/cabinet/history")
    expect(resolveSafeNextPath("https://evil.example/cabinet", "/cabinet")).toBe("/cabinet")
    expect(resolveSafeNextPath("//evil.example", "/cabinet")).toBe("/cabinet")
  })

  it("redirects unauthenticated cabinet access to the Google entry route", () => {
    expect(getCabinetRedirectTarget("/cabinet/history", false)).toBe("/login?next=%2Fcabinet%2Fhistory")
    expect(getCabinetRedirectTarget("/cabinet", true)).toBeNull()
  })
})
