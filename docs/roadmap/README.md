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
| 06    | Editor MVP                              | Done        |
| 07    | Browser & Accessibility                 | Done        |
| 08    | Documentation                           | Done        |
| 09    | Release Engineering                     | ⬜          |

## Current Phase

**Phase 09 — Release Engineering (next)**

Phases 00–08 are complete. Phase 06 delivered the React-facing Editor MVP
(composable surfaces, the default toolbar, link/image popovers, image upload
progress/error/alt UI, styling, and React/type tests). Phase 07 added browser and
accessibility validation in `tests/browser/`: a Chromium/Firefox/WebKit Playwright
matrix, `@axe-core/playwright` audits of the editor, and specs for rendering,
typing, formatting, toolbar keyboard navigation, link/image flows, read-only and
disabled states, controlled mode, selection/focus, paste, drag/drop, IME/Unicode,
and responsive viewports. Phase 08 published the public documentation in
`apps/fumadocs` in English and Indonesian: installation, quick start, fundamentals,
features, guides, accessibility, API reference, live examples, SEO metadata, and
LLM endpoints (`/llms.txt`, `/llms-full.txt`, per-page Markdown). Release
engineering and Changesets remain deferred to Phase 09.

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

Phase 09 (Release Engineering) does not have a phase document yet; it is planned
and approved separately.

## Rules

- `PRD.md` defines **what & why**.
- `ARCHITECTURE.md` defines **technical architecture & constraints**.
- `AGENTS.md` defines **operational rules for AI agents**.
- The phase document defines the **execution plan**.
- The next phase begins once the exit criteria for the previous phase have been met.
