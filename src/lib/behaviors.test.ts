import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BEHAVIORS, behaviorOf } from "./behaviors.ts";
import { SPECIMEN_BY_ID } from "./specimens.ts";

const ids = Object.keys(BEHAVIORS).map(Number);

describe("behaviours", () => {
  it("only covers specimens that exist", () => {
    for (const id of ids) {
      assert.ok(SPECIMEN_BY_ID.has(id), `unknown specimen ${id}`);
    }
  });

  it("covers the twelve units that hold state", () => {
    assert.deepEqual(ids.sort((a, b) => a - b), [20, 24, 71, 84, 85, 86, 87, 89, 91, 92, 98, 100]);
  });

  it("does not ship a script for the native range input", () => {
    assert.equal(behaviorOf(88), undefined);
  });

  it("gives every entry a note and a script", () => {
    for (const id of ids) {
      const behavior = BEHAVIORS[id];
      assert.ok(behavior.note.length > 10, `note ${id}`);
      assert.ok(behavior.js.trim().length > 0, `js ${id}`);
    }
  });

  it("keeps every script vanilla — no imports, JSX or React", () => {
    for (const id of ids) {
      const js = BEHAVIORS[id].js;
      assert.doesNotMatch(js, /^\s*import\s/m, `import ${id}`);
      assert.doesNotMatch(js, /React|useState|jsx|className=/, `react ${id}`);
      assert.doesNotMatch(js, /<\/?[a-z][^>]*>/i, `markup ${id}`);
      assert.match(js, /addEventListener/, `listener ${id}`);
    }
  });

  it("targets a class that the specimen markup actually renders", () => {
    for (const id of ids) {
      const selector = BEHAVIORS[id].js.match(/querySelector(?:All)?\("(\.[\w-]+)/)?.[1];
      assert.ok(selector, `selector ${id}`);
      assert.ok(selector.startsWith(".sp-"), `namespace ${id}: ${selector}`);
    }
  });
});
