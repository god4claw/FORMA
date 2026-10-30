import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CATEGORIES,
  SPECIMENS,
  SPECIMEN_BY_ID,
  SPECIMEN_BY_SLUG,
  categoryBySlug,
  neighborsOf,
  padId,
  searchSpecimens,
  specimenPath,
  specimensInCategory,
} from "./specimens.ts";

describe("catalogue data", () => {
  it("holds one hundred specimens", () => {
    assert.equal(SPECIMENS.length, 100);
  });

  it("numbers specimens 001–100 without gaps or repeats", () => {
    const ids = SPECIMENS.map((s) => s.id).sort((a, b) => a - b);
    assert.deepEqual(
      ids,
      Array.from({ length: 100 }, (_, i) => i + 1),
    );
    assert.equal(SPECIMEN_BY_ID.size, 100);
  });

  it("gives every specimen a unique, URL-safe slug", () => {
    const slugs = SPECIMENS.map((s) => s.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.equal(SPECIMEN_BY_SLUG.size, 100);
    for (const slug of slugs) {
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("keeps every shelf range in sync with its contents", () => {
    let covered = 0;
    for (const category of CATEGORIES) {
      const items = specimensInCategory(category.slug);
      const expected = category.range[1] - category.range[0] + 1;
      assert.equal(items.length, expected, `${category.slug} size`);
      for (const item of items) {
        assert.ok(item.id >= category.range[0] && item.id <= category.range[1]);
        assert.equal(item.category, category.slug);
      }
      covered += items.length;
    }
    assert.equal(covered, SPECIMENS.length);
  });

  it("gives every specimen a note, tags and a CSS recipe", () => {
    for (const specimen of SPECIMENS) {
      assert.ok(specimen.name.length > 0, `name ${specimen.id}`);
      assert.ok(specimen.nameRu.length > 0, `nameRu ${specimen.id}`);
      assert.ok(specimen.note.length > 0, `note ${specimen.id}`);
      assert.ok(specimen.tags.length > 0, `tags ${specimen.id}`);
      assert.ok(specimen.css.includes("{") && specimen.css.includes("}"), `css ${specimen.id}`);
    }
  });
});

describe("addresses", () => {
  it("builds a stable path per specimen", () => {
    const specimen = SPECIMEN_BY_ID.get(1);
    assert.ok(specimen);
    assert.equal(specimenPath(specimen), "/s/ink-fill");
  });

  it("pads numbers to three digits", () => {
    assert.equal(padId(7), "007");
    assert.equal(padId(100), "100");
  });

  it("resolves shelves by slug and rejects unknown ones", () => {
    assert.equal(categoryBySlug("buttons")?.labelEn, "Buttons");
    assert.equal(categoryBySlug("nope"), undefined);
  });
});

describe("navigation", () => {
  it("wraps previous / next inside the same shelf", () => {
    const first = SPECIMEN_BY_ID.get(1);
    const last = SPECIMEN_BY_ID.get(24);
    assert.ok(first && last);
    assert.equal(neighborsOf(1).prev?.id, 24);
    assert.equal(neighborsOf(1).next?.id, 2);
    assert.equal(neighborsOf(24).next?.id, 1);
  });

  it("returns nothing for an unknown id", () => {
    assert.deepEqual(neighborsOf(9999), {});
  });
});

describe("search", () => {
  it("returns the full list for an empty query", () => {
    assert.equal(searchSpecimens("   ").length, SPECIMENS.length);
  });

  it("matches by number, padded number, name, Russian name and tag", () => {
    assert.ok(searchSpecimens("001").some((s) => s.id === 1));
    assert.ok(searchSpecimens("ink fill").some((s) => s.id === 1));
    assert.ok(searchSpecimens("чернила").some((s) => s.id === 1));
    assert.ok(searchSpecimens("fill").some((s) => s.id === 1));
  });

  it("respects the list it is given", () => {
    const shelf = specimensInCategory("buttons");
    const found = searchSpecimens("fill", shelf);
    assert.ok(found.length > 0);
    assert.ok(found.every((s) => s.category === "buttons"));
  });

  it("returns nothing for a query that cannot match", () => {
    assert.equal(searchSpecimens("zzzz-no-such-specimen").length, 0);
  });
});
