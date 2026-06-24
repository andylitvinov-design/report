import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("settings page renders the master plan switcher separately from client package formats", () => {
  const source = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  const settingsBlock = source.match(/if \(activePage === "settings"\) \{[\s\S]*?if \(activePage === "consultations"\)/);

  assert.ok(settingsBlock);
  assert.match(source, /import MasterPlanSwitcher/);
  assert.match(settingsBlock[0], /<MasterPlanSwitcher/);
  assert.match(settingsBlock[0], /masterPlanId=/);
  assert.match(settingsBlock[0], /onPlanChange=/);
  assert.match(settingsBlock[0], /packageFormats\.map/);
  assert.match(source, /query\.get\("section"\) === "settings"/);
});
