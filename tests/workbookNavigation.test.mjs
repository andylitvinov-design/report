import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../src/data/workbookNavigation.js";

describe("workbookNavigation", () => {
  it("exposes only the four compact first-level sections", () => {
    assert.deepEqual(
      workbookNavigation.map((item) => item.label),
      [
        "ИИ-приём",
        "Личная сессия",
        "Профиль / Отчёты",
        "Что дальше",
      ],
    );

    assert.deepEqual(
      workbookNavigation.map((item) => item.shortLabel),
      ["Приём", "Сессия", "Отчёты", "Дальше"],
    );
  });

  it("resolves each app page to its active category and contextual subnav", () => {
    assert.equal(findWorkbookCategoryByPage("overview").id, "ai-intake");
    assert.equal(findWorkbookCategoryByPage("self").id, "ai-intake");
    assert.equal(findWorkbookCategoryByPage("advanced").id, "ai-intake");
    assert.equal(findWorkbookCategoryByPage("consultations").id, "session");
    assert.equal(findWorkbookCategoryByPage("profile").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("expert").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("history").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("settings").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("recommendations").id, "next");

    assert.deepEqual(
      findWorkbookCategoryByPage("self").subnav.map((item) => item.label),
      ["Краткий", "Запрос", "Анализ Баха", "Расширенный", "История ИИ-приёмов"],
    );
  });
});
