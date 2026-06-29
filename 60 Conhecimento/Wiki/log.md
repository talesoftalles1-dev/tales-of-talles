# Log

Append-only record of wiki activity. Newest entries at the bottom. Each entry starts with `## [YYYY-MM-DD] <type> | <short title>` so it stays parseable (e.g. `grep "^## \[" log.md | tail -5`).

Entry types: `ingest`, `query`, `lint`.

## [2026-06-27] setup | Wiki scaffold created

Initialized vault structure: `raw/` (immutable sources), `wiki/` (entities, concepts, sources, index, log), and the schema at `CLAUDE.md`. No sources ingested yet — domain not yet chosen.
