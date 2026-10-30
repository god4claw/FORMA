# Changelog

## 1.1.0

**Added**

- Tailwind next to the CSS recipe. `src/lib/tailwind.ts` derives utilities from
  the same declarations: states become variants, descendant rules become
  `[&_span]:`, multi-element recipes are grouped by selector, and anything
  without a named utility falls back to an arbitrary value. Covered by tests
  across all 100 specimens.

**Changed**

- The recipe block is a two-format control (CSS / Tailwind); the copy button
  copies the active format and names it in the live region.
- README explains why CSS is the source of truth and Tailwind is a derivation.

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
