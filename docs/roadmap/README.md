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
| 06    | Editor MVP                              | 🚧 In progress |
| 07    | Browser & Accessibility                 | ⬜          |
| 08    | Documentation                           | ⬜          |
| 09    | Release Engineering                     | ⬜          |

## Current Phase

**Phase 06 — Editor MVP (in progress) — Sections A–G implemented**

Phases 00–05 are complete. Phase 06 implements the React-facing Editor MVP:
composable surfaces (`EditorProvider`, `EditorContent`, `EditorToolbar`,
`ToolbarGroup`), a complete default toolbar (bold/italic/underline, headings
H1–H6, lists, blockquote, inline code + code block, horizontal rule, link,
image, undo/redo), link and image popovers, image upload progress/error/alt UI,
styling, and React/type tests. Adapter-composed link/image controls keep the
core `ToolbarItemDefinition` model unchanged. Sections H–N (accessibility audit,
formal tests, playground, browser validation, docs, phase gate) remain. Release
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
- `phase-09-release-engineering.md`

## Rules

- `PRD.md` defines **what & why**.
- `ARCHITECTURE.md` defines **technical architecture & constraints**.
- `AGENTS.md` defines **operational rules for AI agents**.
- The phase document defines the **execution plan**.
- The next phase begins once the exit criteria for the previous phase have been met.
