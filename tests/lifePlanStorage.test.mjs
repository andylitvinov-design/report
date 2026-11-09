import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  createEmptyLifePlanSections,
  getLifePlanStorageKey,
  hasLifePlanContent,
  normalizeLifePlanSections,
  readLifePlan,
  saveLifePlan
} from "../src/lib/lifePlanStorage.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

test("life plan starts with nine optional life areas", () => {
  const sections = createEmptyLifePlanSections();
  assert.equal(Object.keys(sections).length, 9);
  assert.equal(hasLifePlanContent(sections), false);
});

test("normalization keeps known text fields and rejects unknown sections", () => {
  const sections = normalizeLifePlanSections({
    wellbeing: { current: "  Высокая нагрузка  ", desired: "Больше устойчивости", unexpected: "ignore" },
    unexpected: { current: "ignore" }
  });
  assert.equal(sections.wellbeing.current, "  Высокая нагрузка  ");
  assert.equal(sections.wellbeing.desired, "Больше устойчивости");
  assert.equal(sections.wellbeing.actions, "");
  assert.equal(sections.unexpected, undefined);
  assert.equal(hasLifePlanContent(sections), true);
});

test("plan storage is isolated per authenticated account", () => {
  const storage = memoryStorage();
  const a = saveLifePlan({
    ownerId: "user-a",
    email: "a@example.com",
    sections: { direction: { desired: "My goals" } },
    storage,
    now: new Date("2026-11-09T17:00:00.000Z")
  });
  saveLifePlan({
    ownerId: "user-b",
    email: "b@example.com",
    sections: { career: { desired: "New work" } },
    storage
  });
  assert.equal(readLifePlan({ ownerId: "user-a", storage }).sections.direction.desired, "My goals");
  assert.equal(readLifePlan({ ownerId: "user-b", storage }).sections.career.desired, "New work");
  assert.notEqual(getLifePlanStorageKey("user-a"), getLifePlanStorageKey("user-b"));
  assert.equal(a.updatedAt, "2026-11-09T17:00:00.000Z");
});

test("corrupted plan storage safely returns an empty result", () => {
  const storage = memoryStorage();
  storage.setItem(getLifePlanStorageKey("user-a"), "{bad json");
  assert.equal(readLifePlan({ ownerId: "user-a", storage }), null);
});

test("My Coaching Plan is linked from the Profile navigation and authenticated route", () => {
  const navigation = readFileSync(new URL("../src/data/workbookNavigation.js", import.meta.url), "utf8");
  const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/pages/LifePlanPage.jsx", import.meta.url), "utf8");
  assert.match(navigation, /label: "My Coaching Plan", page: "lifePlan"/);
  assert.match(navigation, /pages: \["profile", "lifePlan", "history", "settings"\]/);
  assert.match(app, /query\.get\("section"\) === "coaching-plan"/);
  assert.match(app, /activePage === "lifePlan"/);
  assert.match(page, /Отчёты и консультации/);
  assert.match(page, /Возможная последовательность встреч/);
  assert.match(page, /clientVisible === false/);
  assert.match(page, /не передаются специалистам автоматически/);
});
