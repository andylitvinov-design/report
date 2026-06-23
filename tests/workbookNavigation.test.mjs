import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import {
  findWorkbookCategoryByPage,
  workbookNavigation,
} from "../src/data/workbookNavigation.js";

describe("workbookNavigation", () => {
  it("keeps intake as the first visible section and removes overview", () => {
    assert.deepEqual(
      workbookNavigation.map((item) => item.label),
      [
        "Приём",
        "Профиль / Отчёты",
        "Что дальше",
      ],
    );

    assert.equal(workbookNavigation.some((item) => item.label === "Обзор"), false);
    assert.equal(workbookNavigation.some((item) => item.id === "overview"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Ещё"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Личная сессия"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Самоанализ"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Первый приём"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Повторный AI-приём"), false);
  });

  it("keeps compact mobile labels for the top mobile navigation", () => {
    assert.deepEqual(
      workbookNavigation.map((item) => item.shortLabel),
      ["Приём", "Отчёты", "Дальше"],
    );
  });

  it("resolves each app page to its active category and contextual subnav", () => {
    assert.equal(findWorkbookCategoryByPage("overview").id, "intake");
    assert.equal(findWorkbookCategoryByPage("self").id, "intake");
    assert.equal(findWorkbookCategoryByPage("advanced").id, "intake");
    assert.equal(findWorkbookCategoryByPage("consultations").id, "intake");
    assert.equal(findWorkbookCategoryByPage("profile").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("expert").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("history").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("settings").id, "profile-reports");
    assert.equal(findWorkbookCategoryByPage("recommendations").id, "next-step");

    assert.deepEqual(
      findWorkbookCategoryByPage("self").subnav.map((item) => item.label),
      [],
    );
  });
});

describe("first intake baseline hints", () => {
  it("keeps the initial baseline answer hints to six visible choices", () => {
    const source = readFileSync(new URL("../src/pages/SelfAnalysis.jsx", import.meta.url), "utf8");
    const mainConcern = source.match(/id: "mainConcern"[\s\S]*?tagOptions: \[([\s\S]*?)\]/);

    assert.ok(mainConcern);
    const labels = [...mainConcern[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

    assert.deepEqual(labels, [
      "Тревога / беспокойство",
      "Усталость / нет сил",
      "Напряжение в теле",
      "Эмоциональная тяжесть",
      "Отношения / одиночество",
      "Работа / деньги / будущее",
    ]);
    assert.equal(labels.length <= 6, true);
  });
});
