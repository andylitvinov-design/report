import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("settings page renders only client package formats without the master plan switcher", () => {
  const source = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  const settingsBlock = source.match(/if \(activePage === "settings"\) \{[\s\S]*?if \(activePage === "consultations"\)/);

  assert.ok(settingsBlock);
  assert.doesNotMatch(source, /import MasterPlanSwitcher/);
  assert.doesNotMatch(settingsBlock[0], /<MasterPlanSwitcher/);
  assert.doesNotMatch(settingsBlock[0], /masterPlanId=/);
  assert.doesNotMatch(settingsBlock[0], /onPlanChange=/);
  assert.match(settingsBlock[0], /packageFormats\.map/);
  assert.match(source, /title: "Глубокая поддержка"/);
  assert.match(source, /price: "300€\/мес"/);
  assert.match(source, /Запрос сохранён как следующий шаг\. Автоматическая оплата не запускается\./);
  assert.match(settingsBlock[0], /onClick=\{isCurrent \? undefined : handleSpecialistRequest\}/);
  assert.match(source, /query\.get\("section"\) === "settings"/);
});
