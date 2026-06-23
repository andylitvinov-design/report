import assert from "node:assert/strict";
import { test } from "node:test";
import { clientCabinet } from "../src/data/mockData.js";
import { getFriendlyCabinetError, isRawBackendError } from "../src/lib/cabinetDataGuards.js";

const expectedSections = ["Мои заказы", "Мои курсы", "Избранное", "Чат"];
const removedSections = [
  "Кабинет Мастера",
  "Полученные мандалы",
  "Мои фото / цели",
  "Мастерская",
  "Фото / Медиа",
  "Гримуар",
  "Услуги",
  "Заказы",
  "Чаты",
];

test("client cabinet exposes exactly four client sections", () => {
  assert.deepEqual(clientCabinet.sections.map((item) => item.label), expectedSections);
});

test("removed master and duplicate sections are not in the client cabinet sections", () => {
  const labels = clientCabinet.sections.map((item) => item.label).join(" | ");
  for (const label of removedSections) {
    assert.equal(labels.includes(label), false, label);
  }
});

test("courses include the Reiki Yggdrasil level one example", () => {
  assert.equal(
    clientCabinet.courses.items.some((item) => item.title === "Рейки Иггдрасиль — 1 ступень"),
    true,
  );
});

test("raw backend errors are classified and replaced with friendly copy", () => {
  const rawError = "column profile_cabinet_service_orders.client_profile_id does not exist";
  const friendly = getFriendlyCabinetError(rawError);
  assert.equal(isRawBackendError(rawError), true);
  assert.equal(friendly.includes("profile_cabinet_service_orders"), false);
  assert.equal(friendly.includes("client_profile_id"), false);
  assert.equal(friendly.includes("does not exist"), false);
});
