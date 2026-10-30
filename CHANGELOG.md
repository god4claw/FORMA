# Changelog

## 1.2.0

**Added**

- A JS pane for the twelve specimens that actually hold state — switch,
  segmented control, checkbox, radio cards, textarea counter, OTP, stepper, load
  button, pair, removable chip, tabs, pagination. Each script is vanilla, scoped
  to the specimen's own markup, and pairs with the HTML fragment, so
  HTML + CSS + JS is a working artefact.
- `src/lib/behaviors.ts` and its tests: coverage of the interactive set, no
  imports/JSX/React in a snippet, every script scoped to a `.sp-*` root.
- Every script verified in Chrome by pasting the HTML fragment plus the script
  into an empty page and performing the interaction.

**Changed**

- The recipe block shows the JS tab only where a behaviour exists; the other
  eighty-eight units stay CSS/Tailwind/HTML, because a script on a static button
  would be filler.
- README and CONTRIBUTING explain the split and the cost: the scripts are a
  second source of truth next to `live.tsx`.

## 1.1.0

**Added**

- Tailwind next to the CSS recipe. `src/lib/tailwind.ts` derives utilities from
  the same declarations: states become variants, descendant rules become
  `[&_span]:`, multi-element recipes are grouped by selector, and anything
  without a named utility falls back to an arbitrary value. Covered by tests
  across all 100 specimens.
- A self-contained HTML fragment. `src/lib/snippet.ts` takes the rendered
  specimen, keeps every rule that matches it, resolves the custom properties and
  `@keyframes` those rules reference, and prints markup with its styles — ready
  to paste into an empty file.

**Changed**

- The recipe block is a three-format control (CSS / Tailwind / HTML); the copy
  button copies the active format and names it in the live region.
- README explains why CSS is the source of truth, how Tailwind and the HTML
  fragment are derived, and what the fragment does not carry.

## 1.0.0

First release: the catalogue stands on its own.

**Added**

- A page per specimen at `/s/<slug>`, with its own title, description, canonical
  link and Open Graph tags — every unit is now shareable and indexable.
- `specimenPath`, `neighborsOf` and per-shelf metadata in `src/lib/specimens.ts`.
- Unit tests for the catalogue: counts, ids, slugs, shelf ranges, search,
  neighbours (`src/lib/specimens.test.ts`).
- CI (typecheck, lint, test, build), `CONTRIBUTING.md`, `.prettierrc`,
  `.editorconfig`, `.env.example`.
- Copy feedback through a live region, with an explicit failure message.
- Keyboard shortcut hint for search, and a real link from every card.
- Screenshots regenerated at 2× from the running production build.

**Changed**

- The card title is a link to the specimen page; the canvas still opens the
  quick view for mouse users.
- The Studio scene headers link their specimen numbers to the specimen pages.
- README rewritten to match what the repository actually contains.

**Removed**

- The application-builder scaffold that shipped with the first commit: auth
  (Better Auth, PGlite, `pg`, `kysely`, `jose`), `app-data`, `db`, `multiplayer`,
  preview bridge, `server/`, `.grok/`, `startup.sh` and 25 build scripts —
  28 files and 124 KB of code that no route could reach.
- 36 unused dependencies and the `db:migrate` step in `build`.
