import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

describe("assignment section UX", () => {
  it("keeps exactly two assignment tabs", () => {
    const tabs = appSource.match(/recommendations:\s*\[([^\]]+)\]/);
    assert.ok(tabs);
    const labels = [...tabs[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

    assert.deepEqual(labels, ["Рецепт Мастера", "ИИ-советы"]);
  });

  it("shows master recipe as a manual-only empty state without fake prescription content", () => {
    assert.match(appSource, /masterPrescription\s*=\s*null/);
    assert.match(appSource, /Рецепт Мастера пока не добавлен/);
    assert.match(appSource, /добавляется специалистом вручную/);
    assert.match(appSource, /Заказать сессию/);
    assert.doesNotMatch(appSource, /Текущее назначение/);
    assert.doesNotMatch(appSource, /Что принимать \/ использовать/);
  });

  it("keeps AI advice behind completed intake results and labels it as non-medical advice", () => {
    assert.match(appSource, /selectedTab\s*===\s*"Рецепт Мастера"/);
    assert.match(appSource, /ИИ-советы появятся после тестов/);
    assert.match(appSource, /Пройти ИИ-приём/);
    assert.match(appSource, /ИИ-советы по текущему срезу/);
    assert.match(appSource, /не медицинское назначение/);
  });
});
