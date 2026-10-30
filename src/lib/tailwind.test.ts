import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SPECIMENS } from "./specimens.ts";
import { cssToTailwind } from "./tailwind.ts";

describe("cssToTailwind", () => {
  it("maps the common declarations of a flat recipe", () => {
    const css = `.btn { background: #f2efe9; color: #0c0c0b; border-radius: 8px; padding: 12px 20px; font-weight: 500; }`;
    assert.equal(
      cssToTailwind(css),
      "bg-[#f2efe9] text-[#0c0c0b] rounded-[8px] px-[20px] py-[12px] font-medium",
    );
  });

  it("keeps pseudo-class states on the same element", () => {
    const css = `.btn { background: #000; } .btn:active { scale: 0.96; }`;
    assert.equal(cssToTailwind(css), "bg-[#000] active:scale-[0.96]");
  });

  it("turns descendant selectors into arbitrary variants", () => {
    const css = `.btn:hover span { background-size: 100% 1px; }`;
    assert.equal(cssToTailwind(css), "hover:[&_span]:[background-size:100%_1px]");
  });

  it("turns data attributes into data variants without doubling the prefix", () => {
    const css = `.tab[data-on="true"] { box-shadow: inset 0 -2px 0 #0c0c0b; }`;
    assert.equal(cssToTailwind(css), "data-[on=true]:shadow-[inset_0_-2px_0_#0c0c0b]");
  });

  it("maps pseudo-elements to variants", () => {
    const css = `p::first-letter { float: left; font-size: 3.2em; }`;
    assert.equal(cssToTailwind(css), "first-letter:float-left first-letter:text-[3.2em]");
  });

  it("groups recipes that style several elements", () => {
    const css = `.track { width: 44px; } .knob { width: 20px; }`;
    const output = cssToTailwind(css);
    assert.match(output, /\/\* \.track \*\/\nw-\[44px\]/);
    assert.match(output, /\/\* \.knob \*\/\nw-\[20px\]/);
  });

  it("falls back to arbitrary properties for unknown declarations", () => {
    assert.equal(cssToTailwind(`.x { writing-mode: vertical-rl; }`), "[writing-mode:vertical-rl]");
    assert.equal(
      cssToTailwind(`.x { inset: 8px -6px auto; }`),
      "[inset:8px_-6px_auto]",
    );
  });

  it("keeps gradients out of bg-[…] so the value stays parseable", () => {
    const css = `.x { background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat; }`;
    const output = cssToTailwind(css);
    assert.ok(output.startsWith("[background:linear-gradient("), output);
    assert.ok(!output.includes("bg-[linear"), output);
  });

  it("uses named utilities where they exist", () => {
    assert.equal(cssToTailwind(`.x { border-radius: 999px; }`), "rounded-full");
    assert.equal(cssToTailwind(`.x { height: 100%; }`), "h-full");
    assert.equal(cssToTailwind(`.x { display: flex; align-items: center; }`), "flex items-center");
    assert.equal(cssToTailwind(`.x { font-variant-numeric: tabular-nums; }`), "tabular-nums");
  });

  it("is deterministic", () => {
    for (const specimen of SPECIMENS.slice(0, 10)) {
      assert.equal(cssToTailwind(specimen.css), cssToTailwind(specimen.css));
    }
  });
});

describe("every specimen", () => {
  it("produces a non-empty class list", () => {
    for (const specimen of SPECIMENS) {
      assert.ok(cssToTailwind(specimen.css).trim().length > 0, specimen.slug);
    }
  });

  it("never emits whitespace inside an arbitrary value", () => {
    for (const specimen of SPECIMENS) {
      const output = cssToTailwind(specimen.css);
      assert.doesNotMatch(output, /\[[^\]]*\s[^\]]*\]/, specimen.slug);
      assert.doesNotMatch(output, / {2,}/, specimen.slug);
    }
  });

  it("never emits an empty arbitrary value", () => {
    for (const specimen of SPECIMENS) {
      assert.doesNotMatch(cssToTailwind(specimen.css), /\[\]/, specimen.slug);
    }
  });
});
