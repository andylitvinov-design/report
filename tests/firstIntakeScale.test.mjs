import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync(new URL("../src/pages/SelfAnalysis.jsx", import.meta.url), "utf8");

function extractConstArray(name) {
  const match = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  assert.ok(match, `${name} array exists`);
  return match[1];
}

describe("first intake scale10 choices", () => {
  it("renders brief intake scale10 as direct numeric 0-10 choices", () => {
    const match = source.match(/const scaleChoices = Array\.from\(\{ length: 11 \}, \(_, value\) => \(\{([\s\S]*?)\}\)\);/);

    assert.ok(match, "scaleChoices generates 11 numeric options");
    assert.match(match[1], /label: String\(value\)/);
    assert.match(match[1], /value,/);
    assert.equal(match[1].includes("Слабо"), false);
    assert.equal(match[1].includes("Заметно"), false);
    assert.equal(match[1].includes("Сильно"), false);
  });

  it("explains the 0-10 scale without the old 2, 5, 8 mapping", () => {
    assert.equal(source.includes("2, 5 или 8 из 10"), false);
    assert.match(source, /0.+10/);
  });

  it("keeps Bach choices and Bach scoring values unchanged", () => {
    const bachChoices = extractConstArray("bachChoices");
    const labels = [...bachChoices.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]);
    const values = [...bachChoices.matchAll(/value: ([0-9]+)/g)].map((match) => Number(match[1]));

    assert.deepEqual(labels, ["Нет / не про меня", "Заметно", "Сильно"]);
    assert.deepEqual(values, [0, 2, 3]);
  });
});
