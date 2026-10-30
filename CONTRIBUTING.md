# Adding a specimen

A specimen is three files touched, nothing more. The catalogue is data, the unit
is a component, the look is a class.

## 1. Add the data

Append an entry to `SPECIMENS` in [`src/lib/specimens.ts`](../src/lib/specimens.ts):

```ts
{
  id: 101,
  slug: "quiet-badge",           // unique, lowercase, dashes only — becomes /s/quiet-badge
  name: "Quiet Badge",
  nameRu: "Тихий бейдж",
  category: "chips",             // buttons | surfaces | type | chips | controls | chrome
  world: "mist",                 // ink | paper | mist | studio | night | grid
  tags: ["status", "quiet"],
  note: "Одна строка: зачем эта форма и когда её брать.",
  css: `.badge { background: #d8d4cb; color: #1a1916; border-radius: 999px; }`,
},
```

If you open a new shelf, extend `CategorySlug` and `CATEGORIES` too — the tests
check that ranges, categories and counts agree.

## 2. Draw it

Add a component to [`src/components/specimens/live.tsx`](../src/components/specimens/live.tsx)
and register it in the `SpecimenLive` switch. It must be a real, working control:
the whole point of the catalogue is that nothing here is a screenshot.

## 3. Style it

Add the class to [`src/specimens.css`](../src/specimens.css). Rules of the house:

- **form before colour** — one accent, hairline borders, concentric radii;
- status colour only on the marker, never on the whole panel;
- no external assets, no images, no fonts beyond the three already loaded;
- honour `prefers-reduced-motion` (the global reset already does most of it).

The Tailwind tab is derived from `css` by [`src/lib/tailwind.ts`](../src/lib/tailwind.ts) —
do not write a second version by hand. If a declaration converts badly, add a
mapping there and a case in `tailwind.test.ts`.

The HTML tab is derived from the rendered DOM by
[`src/lib/snippet.ts`](../src/lib/snippet.ts): it keeps the stylesheet rules that
match the specimen. It has no unit tests (it needs a real stylesheet), so check
it in a browser before opening a PR — open a specimen, switch to HTML, copy the
fragment into an empty `.html` file and compare it with the card.

## 4. If it holds state

Add a vanilla script to [`src/lib/behaviors.ts`](../src/lib/behaviors.ts), keyed
by the specimen id. Rules:

- plain DOM, no framework, no build step — it runs in a `<script>` after the
  HTML fragment;
- scope it to the specimen's own root class (`.sp-*`), never `document.body`;
- drive the same attributes the component drives (`data-on`, `aria-pressed`), so
  the copied CSS keeps working;
- keep it short. If the behaviour needs more than ~20 lines, it probably belongs
  in the component, not in a snippet.

`behaviors.test.ts` checks the shape and the coverage; the interaction itself is
checked by pasting HTML + JS into an empty page and clicking. Do that before the
PR — CI cannot run a browser.

## Before opening a PR

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

All four run in CI. Keep the CSS recipe in the data and the class in the
stylesheet in sync — the copy button hands the recipe to the user verbatim.

## Wording

The interface is Russian, the README is bilingual. In the data, `name` is the
English name of the form, `nameRu` is the Russian one, and `note` is a single
Russian sentence explaining when to reach for it. Tags are lowercase English
facet words (`fill`, `ghost`, `mono`, `editorial`) — they are what search
matches on.
