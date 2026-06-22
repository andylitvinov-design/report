import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../src/data/workbookNavigation.js";

describe("workbookNavigation", () => {
  it("exposes the compact three-section first-level menu without legacy categories", () => {
    assert.deepEqual(
      workbookNavigation.map((item) => item.label),
      [
        "ИИ-приём",
        "Профиль / Отчёты",
        "Что дальше",
      ],
    );

    assert.equal(workbookNavigation.some((item) => item.label === "Ещё"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Личная сессия"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Самоанализ"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Первый приём"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Повторный AI-приём"), false);
  });

  it("resolves each app page to its active category and contextual subnav", () => {
    assert.equal(findWorkbookCategoryByPage("overview").id, "ai-session");
    assert.equal(findWorkbookCategoryByPage("self").id, "ai-session");
    assert.equal(findWorkbookCategoryByPage("advanced").id, "ai-session");
    assert.equal(findWorkbookCategoryByPage("consultations").id, "next-step");
    assert.equal(findWorkbookCategoryByPage("profile").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("expert").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("history").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("settings").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("recommendations").id, "next-step");

    assert.deepEqual(
      findWorkbookCategoryByPage("self").subnav.map((item) => item.label),
      ["Краткий", "Расширенный", "История"],
    );
  });
});
