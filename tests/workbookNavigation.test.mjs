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
        "Профиль",
        "Что делать",
      ],
    );

    assert.equal(workbookNavigation.some((item) => item.label === "Обзор"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Профиль / Отчёты"), false);
    assert.equal(workbookNavigation.some((item) => item.label === "Назначение"), false);
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
      ["Приём", "Профиль", "Что делать"],
    );
  });

  it("resolves each app page to its active category and contextual subnav", () => {
    assert.equal(findWorkbookCategoryByPage("overview").id, "intake");
    assert.equal(findWorkbookCategoryByPage("self").id, "intake");
    assert.equal(findWorkbookCategoryByPage("advanced").id, "intake");
    assert.equal(findWorkbookCategoryByPage("consultations").id, "intake");
    assert.equal(findWorkbookCategoryByPage("profile").id, "profile");
    assert.equal(findWorkbookCategoryByPage("history").id, "profile");
    assert.equal(findWorkbookCategoryByPage("settings").id, "profile");
    assert.equal(findWorkbookCategoryByPage("recommendations").id, "next-actions");
    assert.equal(findWorkbookCategoryByPage("expert").id, "next-actions");

    assert.deepEqual(
      findWorkbookCategoryByPage("recommendations").subnav.map((item) => item.label),
      ["Отчёты Мастера", "ИИ-отчёты"],
    );

    assert.deepEqual(
      findWorkbookCategoryByPage("self").subnav.map((item) => item.label),
      ["ИИ-приём", "Приём у Мастера"],
    );

    assert.deepEqual(
      findWorkbookCategoryByPage("profile").subnav.map((item) => item.label),
      ["Сейчас", "Динамика", "Настройки"],
    );
  });
});

describe("first intake baseline hints", () => {
  it("keeps AI intake entry as a soft hero-led onboarding screen", () => {
    const source = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
    const component = source.match(/function AiIntakeDashboard\([\s\S]*?\n}\n\nfunction ConsultationPlaceholder/);

    assert.ok(component);
    assert.match(component[0], /Мягкий AI-сеанс/);
    assert.match(component[0], /Начните с мягкого AI-приёма/);
    assert.match(component[0], /AI задаст несколько бережных вопросов и создаст первую карту состояния\./);
    assert.match(component[0], /Пройти первый приём/);
    assert.match(component[0], /Guided AI session для первого среза/);
    assert.match(component[0], /Другие варианты/);
    assert.match(component[0], /Заказать встречу/);
    assert.match(component[0], /Оставить запрос на живое сопровождение/);
    assert.match(component[0], /Продолжить приём/);
    assert.match(component[0], /Вернуться к сохранённым ответам/);
    assert.doesNotMatch(component[0], /Пройти краткий ИИ-приём/);
    assert.doesNotMatch(component[0], /Расширенный ИИ-приём/);
    assert.doesNotMatch(component[0], /Откроется после краткого приёма/);
  });

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
