import { beforeEach, describe, expect, it } from "vitest"

import {
  createDevAnalysisRun,
  listDevAnalysisRunsForUser,
  resetDevCabinetStoreForTests,
} from "@/lib/server/dev-cabinet-store"

describe("dev cabinet repository", () => {
  beforeEach(() => {
    resetDevCabinetStoreForTests()
  })

  it("scopes analysis history to the current user", async () => {
    await createDevAnalysisRun("user-a", {
      focusArea: "Сон",
      title: "Срез пользователя A",
    })
    await createDevAnalysisRun("user-b", {
      focusArea: "Энергия",
      title: "Срез пользователя B",
    })

    const userAHistory = await listDevAnalysisRunsForUser("user-a")

    expect(userAHistory).toHaveLength(1)
    expect(userAHistory[0]?.title).toBe("Срез пользователя A")
    expect(userAHistory[0]?.user_id).toBe("user-a")

    const userBHistory = await listDevAnalysisRunsForUser("user-b")

    expect(userBHistory).toHaveLength(1)
    expect(userBHistory[0]?.title).toBe("Срез пользователя B")
    expect(userBHistory[0]?.user_id).toBe("user-b")
  })
})
