import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const selfAnalysisSource = readFileSync(new URL("../src/pages/SelfAnalysis.jsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const testCatalogSource = readFileSync(new URL("../src/data/testCatalog.js", import.meta.url), "utf8");

describe("first intake product structure", () => {
  it("shows the first intake as four product parts", () => {
    assert.equal(selfAnalysisSource.includes("Часть 1 из 5"), false);
    assert.match(selfAnalysisSource, /Часть 1 из 4 · Базовая точка состояния/);
    assert.match(selfAnalysisSource, /Часть 2 из 4 · Bach: ситуация/);
    assert.match(selfAnalysisSource, /Часть 3 из 4 · Bach: личный фон/);
    assert.match(selfAnalysisSource, /Часть 4 из 4 · Bach: поддержка/);
  });

  it("uses the required final optional comment wording", () => {
    assert.match(selfAnalysisSource, /Напишите, если хотите что-то добавить ещё про своё состояние\./);
    assert.match(selfAnalysisSource, /Коротко добавьте важный нюанс, если он есть\./);
    assert.equal(selfAnalysisSource.includes("Хотите добавить своими словами?"), false);
  });

  it("renders a compact first intake stage ruler", () => {
    assert.match(selfAnalysisSource, /Первичный ИИ-приём/);
    assert.match(selfAnalysisSource, /1 Точка · 2 Bach: ситуация · 3 Bach: фон · 4 Bach: поддержка/);
    assert.match(selfAnalysisSource, /first-intake-stage-ruler/);
  });
});

describe("intake catalogue organization", () => {
  it("presents the primary intake as one basic card", () => {
    assert.match(appSource, /Базовый первичный приём/);
    assert.match(appSource, /Первичный ИИ-приём/);
    assert.match(appSource, /4 части: точка состояния и 3 анкеты Bach\./);
    assert.match(appSource, /Расширенный приём/);
  });

  it("does not expose Bach as an independent catalogue test", () => {
    assert.equal(testCatalogSource.includes('id: "bach-state"'), false);
    assert.equal(testCatalogSource.includes("Bach / эмоциональное состояние"), false);
  });
});
