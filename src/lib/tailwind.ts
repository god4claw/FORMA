/**
 * Derive Tailwind utilities from a specimen's CSS recipe.
 *
 * The recipes are the source of truth — one string per specimen, framework
 * agnostic. This module is a *derivation*, not a second hand-written version:
 * every declaration maps to a utility, and anything the map does not know falls
 * back to Tailwind's arbitrary-property syntax (`[border-bottom:1px_solid_#111]`),
 * which is valid without any theme configuration.
 *
 * Recipes that style several elements at once (`.track` + `.knob`) are grouped
 * by selector instead of being flattened into one meaningless class string.
 *
 * What it cannot preserve is documented rather than faked:
 * - `animation` references keyframes that live in `specimens.css`;
 * - `content` is only meaningful on `::before` / `::after`;
 * - a mapped font-family resolves to the closest generic family.
 */

type Declaration = { property: string; value: string };
type Block = { selector: string; declarations: Declaration[] };

const WEIGHT: Record<string, string> = {
  "300": "font-light",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
};

const DISPLAY: Record<string, string> = {
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  block: "block",
  "inline-block": "inline-block",
  none: "hidden",
};

const ALIGN: Record<string, string> = {
  center: "items-center",
  "flex-start": "items-start",
  "flex-end": "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

const JUSTIFY: Record<string, string> = {
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
  center: "justify-center",
  "flex-start": "justify-start",
  "flex-end": "justify-end",
};

/** Pseudo-classes become Tailwind variants. Longest first: `:focus-visible` before `:focus`. */
const PSEUDO_CLASS: Record<string, string> = {
  ":focus-visible": "focus-visible",
  ":first-child": "first",
  ":last-child": "last",
  ":hover": "hover",
  ":active": "active",
  ":focus": "focus",
  ":disabled": "disabled",
};

const PSEUDO_ELEMENT: Record<string, string> = {
  "::first-letter": "first-letter",
  "::placeholder": "placeholder",
  "::before": "before",
  "::after": "after",
};

const RADIUS_FULL = new Set(["999px", "9999px", "50%"]);
const SIDES: Record<string, string> = {
  "border-left": "border-l",
  "border-right": "border-r",
  "border-top": "border-t",
  "border-bottom": "border-b",
  "padding-left": "pl",
  "padding-right": "pr",
  "padding-top": "pt",
  "padding-bottom": "pb",
  "margin-left": "ml",
  "margin-right": "mr",
  "margin-top": "mt",
  "margin-bottom": "mb",
};

/** Arbitrary values cannot contain spaces; underscores stand in for them. */
function arbitraryValue(value: string): string {
  return value.replace(/\s+/g, "_");
}

function arbitraryProperty(property: string, value: string): string {
  return `[${property}:${arbitraryValue(value)}]`;
}

/** 1 value → p-x, 2 → px/py, 4 → one arbitrary shorthand. */
function boxClasses(prefix: string, value: string): string[] {
  const parts = value.split(/\s+/);
  if (parts.length === 1) return [`${prefix}-[${parts[0]}]`];
  if (parts.length === 2) return [`${prefix}x-[${parts[1]}]`, `${prefix}y-[${parts[0]}]`];
  return [`${prefix}-[${parts.join("_")}]`];
}

function borderClasses(prefix: string, value: string): string[] {
  const width = /\d[\d.]*(?:px|rem|em)?/.exec(value)?.[0];
  const color = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|currentColor|transparent)/.exec(value)?.[0];
  const style = /\b(solid|dashed|dotted|double)\b/.exec(value)?.[0];
  const out: string[] = [];
  if (width) out.push(`${prefix}-[${width}]`);
  if (color) out.push(`${prefix}-[${color}]`);
  if (style && style !== "solid") out.push(`${prefix}-${style}`);
  return out.length > 0 ? out : [arbitraryProperty(prefix.replace(/^border-/, "border-"), value)];
}

function fontFamily(value: string): string {
  const lower = value.toLowerCase();
  if (lower.includes("monospace")) return "font-mono";
  if (lower.includes("sans-serif")) return "font-sans";
  if (lower.includes("serif")) return "font-serif";
  return arbitraryProperty("font-family", value.replace(/["']/g, ""));
}

/** Colors fit inside `bg-[…]`; gradients and shorthands do not. */
function isSimpleColor(value: string): boolean {
  return /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|currentColor|transparent|[a-zA-Z]+)$/.test(
    value,
  );
}

function sizeClasses(prefix: string, value: string): string[] {
  if (value === "100%") return [`${prefix}-full`];
  if (value === "auto") return [`${prefix}-auto`];
  return [`${prefix}-[${value}]`];
}

function classesFor({ property, value }: Declaration): string[] {
  const side = SIDES[property];
  if (side && property.startsWith("border-")) return borderClasses(side, value);
  if (side) return [`${side}-[${value}]`];

  switch (property) {
    case "background":
      if (value === "transparent") return ["bg-transparent"];
      if (value === "currentColor") return ["bg-current"];
      if (value === "none") return [arbitraryProperty("background", value)];
      if (!isSimpleColor(value)) return [arbitraryProperty("background", value)];
      return [`bg-[${value}]`];
    case "background-color":
      return [`bg-[${value}]`];
    case "color":
      if (value === "currentColor") return ["text-current"];
      if (value === "transparent") return ["text-transparent"];
      if (!isSimpleColor(value)) return [arbitraryProperty("color", value)];
      return [`text-[${value}]`];
    case "border-radius":
      if (RADIUS_FULL.has(value)) return ["rounded-full"];
      if (value === "0") return ["rounded-none"];
      return [`rounded-[${value}]`];
    case "box-shadow":
      if (value === "none") return ["shadow-none"];
      return [`shadow-[${arbitraryValue(value)}]`];
    case "font-size":
      return [`text-[${value}]`];
    case "font-weight":
      return [WEIGHT[value] ?? arbitraryProperty("font-weight", value)];
    case "font-family":
      return [fontFamily(value)];
    case "font-style":
      return value === "italic" ? ["italic"] : [arbitraryProperty("font-style", value)];
    case "font-variant-numeric":
      return value === "tabular-nums" ? ["tabular-nums"] : [arbitraryProperty(property, value)];
    case "line-height":
      return [`leading-[${value}]`];
    case "letter-spacing":
      return [`tracking-[${value}]`];
    case "text-transform":
      if (value === "uppercase") return ["uppercase"];
      if (value === "lowercase") return ["lowercase"];
      if (value === "capitalize") return ["capitalize"];
      return [arbitraryProperty(property, value)];
    case "text-align":
      return [`text-${value}`];
    case "text-decoration":
      return value === "line-through" ? ["line-through"] : [arbitraryProperty(property, value)];
    case "display":
      return [DISPLAY[value] ?? arbitraryProperty(property, value)];
    case "align-items":
      return [ALIGN[value] ?? arbitraryProperty(property, value)];
    case "justify-content":
      return [JUSTIFY[value] ?? arbitraryProperty(property, value)];
    case "flex-direction":
      if (value === "column") return ["flex-col"];
      if (value === "row") return ["flex-row"];
      return [arbitraryProperty(property, value)];
    case "flex":
      return value === "1" ? ["flex-1"] : [arbitraryProperty(property, value)];
    case "gap":
      return [`gap-[${value}]`];
    case "padding":
      return boxClasses("p", value);
    case "margin":
      return boxClasses("m", value);
    case "width":
      return sizeClasses("w", value);
    case "height":
      return sizeClasses("h", value);
    case "min-width":
      return [`min-w-[${value}]`];
    case "min-height":
      return [`min-h-[${value}]`];
    case "opacity":
      return [`opacity-[${value}]`];
    case "overflow":
      return value === "hidden" ? ["overflow-hidden"] : [arbitraryProperty(property, value)];
    case "position":
      return [value];
    case "border":
      return borderClasses("border", value);
    case "scale":
      return [`scale-[${value}]`];
    case "float":
      return [`float-${value}`];
    case "appearance":
      return value === "none" ? ["appearance-none"] : [arbitraryProperty(property, value)];
    case "resize":
      return value === "none" ? ["resize-none"] : [arbitraryProperty(property, value)];
    case "grid-auto-flow":
      return value === "column" ? ["grid-flow-col"] : [arbitraryProperty(property, value)];
    case "grid-template-columns":
      return [`grid-cols-[${arbitraryValue(value)}]`];
    case "cursor":
      return [`cursor-${value}`];
    case "content":
      return [`content-[${arbitraryValue(value.replace(/"/g, "'"))}]`];
    default:
      return [arbitraryProperty(property, value)];
  }
}

function parseBlocks(css: string): Block[] {
  const blocks: Block[] = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1]
      .split(",")
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const declarations: Declaration[] = [];
    for (const raw of match[2].split(";")) {
      const text = raw.trim();
      if (!text) continue;
      const split = text.indexOf(":");
      if (split < 0) continue;
      declarations.push({
        property: text.slice(0, split).trim(),
        value: text.slice(split + 1).trim(),
      });
    }
    if (declarations.length === 0) continue;
    for (const selector of selectors) blocks.push({ selector, declarations });
  }
  return blocks;
}

function baseSelector(selector: string): string {
  return /^[^\s:>[\]]+/.exec(selector)?.[0] ?? selector;
}

/**
 * Turn `.btn:hover span` into the `hover:[&_span]:` prefix, `.stack::before`
 * into `before:`, and so on. Returns "" for the base element itself.
 */
function variantPrefix(selector: string): string {
  const base = baseSelector(selector);
  let rest = selector.slice(base.length).trim();
  const variants: string[] = [];

  while (rest.length > 0) {
    const pseudoElement = Object.keys(PSEUDO_ELEMENT).find((p) => rest.startsWith(p));
    if (pseudoElement) {
      variants.push(PSEUDO_ELEMENT[pseudoElement]);
      rest = rest.slice(pseudoElement.length).trim();
      continue;
    }
    const pseudoClass = Object.keys(PSEUDO_CLASS).find((p) => rest.startsWith(p));
    if (pseudoClass) {
      variants.push(PSEUDO_CLASS[pseudoClass]);
      rest = rest.slice(pseudoClass.length).trim();
      continue;
    }
    if (rest.startsWith("[data-")) {
      const end = rest.indexOf("]");
      const inner = rest.slice(1, end).replace(/^data-/, "").replace(/["']/g, "");
      variants.push(`data-[${inner}]`);
      rest = rest.slice(end + 1).trim();
      continue;
    }
    if (rest.startsWith(">")) {
      variants.push(`[&>${rest.slice(1).trim().replace(/\s+/g, "_")}]`);
      rest = "";
      continue;
    }
    // Descendant combinator: `.split .menu`, `.btn span`.
    variants.push(`[&_${rest.replace(/\s+/g, "_")}]`);
    rest = "";
  }

  return variants.length > 0 ? `${variants.join(":")}:` : "";
}

/** Any whitespace left inside an arbitrary value would split the class in two. */
function sanitize(utility: string): string {
  return utility.replace(/\[([^\]]*)\]/g, (_match, inner: string) => `[${inner.replace(/\s+/g, "_")}]`);
}

/**
 * One class string when the recipe styles a single element (including its
 * states and descendants); one commented group per element otherwise.
 */
export function cssToTailwind(css: string): string {
  const groups = new Map<string, string[]>();
  for (const block of parseBlocks(css)) {
    const base = baseSelector(block.selector);
    const prefix = variantPrefix(block.selector);
    const classes = groups.get(base) ?? [];
    for (const declaration of block.declarations) {
      for (const utility of classesFor(declaration)) {
        const full = sanitize(`${prefix}${utility}`);
        if (!classes.includes(full)) classes.push(full);
      }
    }
    groups.set(base, classes);
  }

  if (groups.size <= 1) return [...groups.values()][0]?.join(" ") ?? "";

  return [...groups.entries()]
    .map(([base, classes]) => `/* ${base} */\n${classes.join(" ")}`)
    .join("\n\n");
}
