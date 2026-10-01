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
| 04    | React Adapter                           | ⬜          |
| 05    | Playground                              | ⬜          |
| 06    | Editor MVP                              | ⬜          |
| 07    | Browser & Accessibility                 | ⬜          |
| 08    | Documentation                           | ⬜          |
| 09    | Release Engineering                     | ⬜          |

## Current Phase

**Phase 03 — Editor Core**

Phases 00–03 are complete. `editor-core` now provides the framework-independent
core API (editor creation, default extensions, the RK image-upload extension,
content utilities, JSON/HTML serialization, persistence schema versioning, the
upload contract, toolbar definitions, and editor labels), verified by unit,
integration, and type tests plus package validation. ADRs 0002–0004 are recorded.
Work proceeds to Phase 04 (React adapter).

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
