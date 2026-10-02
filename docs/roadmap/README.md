# Implementation Roadmap

Implementation roadmap for **RumahKodingku Editor**.

Details for each phase will be saved in separate files in this folder.

## Phases

| Phase | Name                                    | Status      |
| ----- | --------------------------------------- | ----------- |
| 00    | Repository Foundation & Agent Readiness | Done        |
| 01    | Build & Package Infrastructure          | Done        |
| 02    | Test Infrastructure                     | Done        |
| 03    | Editor Core                             | Done        |
| 04    | React Adapter                           | Done        |
| 05    | Playground                              | Done        |
| 06    | Editor MVP                              | ⬜          |
| 07    | Browser & Accessibility                 | ⬜          |
| 08    | Documentation                           | ⬜          |
| 09    | Release Engineering                     | ⬜          |

## Current Phase

**Phase 05 — Playground (complete) — next: Phase 06**

Phases 00–05 are complete. `editor-core` provides the framework-independent core
API (Phase 03) and `editor-react` provides the React adapter (Phase 04), both
verified by unit, integration, and type tests plus package validation.
`apps/playground` (Phase 05) is the internal validation environment: a Vite +
React app that consumes the packages through their public exports only, with
scenario-based surfaces, JSON/HTML inspectors, mock image upload, and basic
browser smoke/interaction tests. ADRs 0002–0004 are recorded. Work proceeds to
Phase 06 (Editor UX / toolbar / dialogs); release engineering and Changesets
remain deferred to Phase 09.

## Phase Documents

- `phase-00-foundation.md`
- `phase-01-build-package-infrastructure.md`
- `phase-02-test-infrastructure.md`
- `phase-03-editor-core.md`
- `phase-04-react-adapter.md`
- `phase-05-playground.md`
- `phase-06-editor-mvp.md`
- `phase-07-browser-accessibility.md`
- `phase-08-documentation.md`
- `phase-09-release-engineering.md`

## Rules

- `PRD.md` defines **what & why**.
- `ARCHITECTURE.md` defines **technical architecture & constraints**.
- `AGENTS.md` defines **operational rules for AI agents**.
- The phase document defines the **execution plan**.
- The next phase begins once the exit criteria for the previous phase have been met.
