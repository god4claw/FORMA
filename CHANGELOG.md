# Changelog

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
