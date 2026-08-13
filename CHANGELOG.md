# Changelog

## [0.2.0] — 2026-08-13

### Fixed
- `npm ci` failed on React 19 because unused `react-flow-renderer@10` was still a dependency
- CI smoked `next dev` instead of a production build

### Added
- Vitest unit tests for goal-injection validation
- `npm test` / `npm run typecheck`
- SECURITY.md and an honest README (mock/demo, not live Hermes)
- Length cap (2000) on `POST /api/goals`

### Changed
- CI: Node 20.19, lint, typecheck, test, `next build`, `next start` smoke
