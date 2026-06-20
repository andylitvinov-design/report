import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../src/data/workbookNavigation.js";

describe("workbookNavigation", () => {
  it("exposes the full category menu without a More catch-all", () => {
    assert.deepEqual(
      workbookNavigation.map((item) => item.label),
      [
        "Главная",
        "Профиль",
        "Самоанализ",
        "ИИ-анализ",
        "Отчёты",
        "Консультации",
        "Поддержка",
        "История",
        "Настройки",
      ],
    );

    assert.equal(workbookNavigation.some((item) => item.label === "Ещё"), false);
  });

  it("resolves each app page to its active category and contextual subnav", () => {
    assert.equal(findWorkbookCategoryByPage("overview").id, "home");
    assert.equal(findWorkbookCategoryByPage("profile").id, "profile");
    assert.equal(findWorkbookCategoryByPage("self").id, "self");
    assert.equal(findWorkbookCategoryByPage("advanced").id, "ai");
    assert.equal(findWorkbookCategoryByPage("expert").id, "reports");
    assert.equal(findWorkbookCategoryByPage("consultations").id, "consultations");
    assert.equal(findWorkbookCategoryByPage("recommendations").id, "support");
    assert.equal(findWorkbookCategoryByPage("history").id, "history");
    assert.equal(findWorkbookCategoryByPage("settings").id, "settings");

    assert.deepEqual(
      findWorkbookCategoryByPage("settings").subnav.map((item) => item.label),
      ["Профиль", "Уведомления", "Приватность", "Помощь", "Выйти"],
    );
  });
});
