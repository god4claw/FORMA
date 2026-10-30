/**
 * Build a self-contained HTML snippet from a rendered specimen.
 *
 * The catalogue's promise is "take this and use it", so the snippet has to work
 * outside the app: markup from the live DOM, plus every rule from the loaded
 * stylesheets that actually matches that markup, plus the custom properties and
 * keyframes those rules reference. Nothing is hand-written — if a specimen
 * changes, its snippet changes with it.
 *
 * Limits are real and worth stating: fonts come from the `<link>` at the top,
 * and behaviour (state, handlers) is not part of the snapshot — this is markup
 * and paint, not a component.
 */

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600&display=swap";

/** Tokens the fragment needs even when no kept rule mentions them. */
const ALWAYS_TOKENS = ["--font-sans", "--font-display", "--font-mono"];

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

type KeptRule = { selector: string; body: string; conditions: string[] };

function collectClasses(root: HTMLElement): Set<string> {
  const classes = new Set<string>();
  root.classList.forEach((name) => classes.add(name));
  for (const element of root.querySelectorAll<HTMLElement>("*")) {
    element.classList.forEach((name) => classes.add(name));
  }
  return classes;
}

/** Cheap pre-filter: does the selector mention a class that exists here? */
function couldMatch(selector: string, classes: Set<string>): boolean {
  const names = [...selector.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
  if (names.length === 0) return true;
  return names.some((name) => classes.has(name));
}

/** Drop pseudo-classes/elements so `querySelector` can answer the question. */
function stripPseudos(selector: string): string {
  return selector
    .replace(/::?[a-z-]+(\([^)]*\))?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesCanvas(root: HTMLElement, selector: string): boolean {
  return selector.split(",").some((part) => {
    const cleaned = stripPseudos(part);
    if (!cleaned) return false;
    try {
      return root.matches(cleaned) || root.querySelector(cleaned) !== null;
    } catch {
      return false;
    }
  });
}

function walkRules(
  rules: CSSRuleList,
  conditions: string[],
  visit: (rule: CSSStyleRule, conditions: string[]) => void,
  keyframes: Map<string, string>,
): void {
  for (const rule of Array.from(rules)) {
    const typed = rule as CSSRule & {
      cssRules?: CSSRuleList;
      conditionText?: string;
      name?: string;
      cssText?: string;
    };

    if (rule.type === CSSRule.KEYFRAMES_RULE) {
      if (typed.name && typed.cssText) keyframes.set(typed.name, typed.cssText);
      continue;
    }

    // `CSSStyleRule` also exposes `cssRules` (nested CSS), so the style-rule
    // branch has to come first — otherwise every declaration is skipped.
    if (rule.type === CSSRule.STYLE_RULE) {
      visit(rule as CSSStyleRule, conditions);
      if (typed.cssRules && typed.cssRules.length > 0) {
        walkRules(typed.cssRules, conditions, visit, keyframes);
      }
      continue;
    }

    if (typed.cssRules) {
      let nested = conditions;
      if (rule.type === CSSRule.MEDIA_RULE && typed.conditionText) {
        nested = [...conditions, `@media ${typed.conditionText}`];
      } else if (rule.type === CSSRule.SUPPORTS_RULE && typed.conditionText) {
        nested = [...conditions, `@supports ${typed.conditionText}`];
      }
      walkRules(typed.cssRules, nested, visit, keyframes);
    }
  }
}

function prettyCss(text: string): string {
  return text
    .replace(/\s*\{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/\n{2,}/g, "\n");
}

function formatHtml(node: Node, depth = 0): string {
  const pad = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.replace(/\s+/g, " ").trim();
    return text ? `${pad}${text}\n` : "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const attrs = [...element.attributes]
    .map((attribute) => ` ${attribute.name}="${attribute.value.replace(/"/g, "&quot;")}"`)
    .join("");

  if (VOID_TAGS.has(tag)) return `${pad}<${tag}${attrs}>\n`;

  const children = [...element.childNodes];
  const textOnly = children.length > 0 && children.every((child) => child.nodeType === Node.TEXT_NODE);

  if (children.length === 0) return `${pad}<${tag}${attrs}></${tag}>\n`;
  if (textOnly) {
    const text = children
      .map((child) => child.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    return `${pad}<${tag}${attrs}>${text}</${tag}>\n`;
  }

  const inner = children.map((child) => formatHtml(child, depth + 1)).join("");
  return `${pad}<${tag}${attrs}>\n${inner}${pad}</${tag}>\n`;
}

function resolveVars(bodies: string[], doc: Document): string[] {
  const names = new Set<string>(ALWAYS_TOKENS);
  for (const body of bodies) {
    for (const match of body.matchAll(/var\((--[\w-]+)/g)) names.add(match[1]);
  }
  const root = doc.documentElement;
  const declarations: string[] = [];
  for (const name of names) {
    const value = getComputedStyle(root).getPropertyValue(name).trim();
    if (value) declarations.push(`  ${name}: ${value};`);
  }
  return declarations;
}

export function extractSnippet(root: HTMLElement): string {
  const classes = collectClasses(root);
  const kept: KeptRule[] = [];
  const keyframes = new Map<string, string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin sheet: nothing to read
    }
    walkRules(
      rules,
      [],
      (rule, conditions) => {
        const selector = rule.selectorText;
        if (!selector || !couldMatch(selector, classes)) return;
        if (!matchesCanvas(root, selector)) return;
        kept.push({ selector, body: rule.style.cssText, conditions });
      },
      keyframes,
    );
  }

  // `animation` is a shorthand: the browser serialises it with the duration
  // first, so the name has to be matched against the known keyframes.
  const usedKeyframes: string[] = [];
  for (const rule of kept) {
    for (const declaration of rule.body.matchAll(/animation(?:-name)?:\s*([^;}]+)/g)) {
      for (const [name, cssText] of keyframes) {
        if (new RegExp(`\\b${name}\\b`).test(declaration[1]) && !usedKeyframes.includes(cssText)) {
          usedKeyframes.push(cssText);
        }
      }
    }
  }

  const vars = resolveVars(
    kept.map((rule) => rule.body),
    root.ownerDocument,
  );

  const blocks: string[] = [];
  if (vars.length > 0) blocks.push(`:root {\n${vars.join("\n")}\n}`);

  // In the app the canvas font comes from <body>; a fragment has no body, so the
  // same value is scoped to the fragment's own root instead.
  const rootClass = [...root.classList][0];
  if (rootClass && vars.some((line) => line.includes("--font-sans"))) {
    blocks.push(`.${rootClass} {\n  font-family: var(--font-sans);\n}`);
  }

  for (const rule of kept) {
    const body = prettyCss(`${rule.selector} { ${rule.body} }`).trimEnd();
    blocks.push(
      rule.conditions.length > 0
        ? `${rule.conditions.join(" ")} {\n${body.replace(/^/gm, "  ")}\n}`
        : body,
    );
  }
  for (const cssText of usedKeyframes) blocks.push(prettyCss(cssText).trimEnd());

  return [
    `<link rel="stylesheet" href="${FONT_LINK}">`,
    "",
    "<style>",
    blocks.join("\n\n").replace(/^/gm, "  "),
    "</style>",
    "",
    formatHtml(root).trimEnd(),
    "",
  ].join("\n");
}
