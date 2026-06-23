import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

describe("assignment section UX", () => {
  it("keeps exactly two next-action tabs", () => {
    const tabs = appSource.match(/recommendations:\s*\[([^\]]+)\]/);
    assert.ok(tabs);
    const labels = [...tabs[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

    assert.deepEqual(labels, ["Отчёты Мастера", "ИИ-отчёты"]);
  });

  it("locks master reports to personal access and keeps them manual-only", () => {
    assert.match(appSource, /selectedTab\s*===\s*"Отчёты Мастера"/);
    assert.match(appSource, /Для доступа перейти на Пакет Персональный/);
    assert.match(appSource, /Мастер-отчёты не генерируются автоматически/);
    assert.match(appSource, /Без автогенерации/);
    assert.match(appSource, /Перейти на Пакет Персональный/);
    assert.doesNotMatch(appSource, /Текущее назначение/);
    assert.doesNotMatch(appSource, /Что принимать \/ использовать/);
  });

  it("shows five AI report directions and keeps them behind intake results", () => {
    assert.match(appSource, /ИИ-отчёты появятся после ИИ-приёма/);
    assert.match(appSource, /Пройти ИИ-приём/);
    assert.match(appSource, /Пять направлений ИИ-отчётов/);
    assert.match(appSource, /План-программа коррекции в гомеопатии/);
    assert.match(appSource, /План-программа коррекции в натуропатии/);
    assert.match(appSource, /План-программа коррекции в цветочной терапии Баха/);
    assert.match(appSource, /Отчёт Рекомендации телесной терапии/);
    assert.match(appSource, /Отчёт рекомендация Образной Терапии/);
    assert.match(appSource, /не медицинское назначение/);
  });
});
