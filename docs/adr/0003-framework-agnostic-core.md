# ADR 0003 — Framework-agnostic editor core

- **Status:** Accepted
- **Date:** 2026-10-01
- **Phase:** 03 (Editor Core)
- **Source:** `ARCHITECTURE.md` §2, §4.3, §6.1, §12

## Context

React is the first supported UI framework, and a Vue adapter is planned. If
editor logic lived in the React package, every future adapter would duplicate
it, and the core API would be shaped by React concerns (props, hooks,
lifecycle).

The core still needs the DOM at runtime: Tiptap requires a DOM to create an
`EditorView`. "Framework-agnostic" is not the same as "DOM-free".

## Decision

1. `editor-core` MUST NOT import or depend on React, React DOM, Vue, Angular,
   Svelte, Next.js, Tailwind CSS, or application modules.
2. `editor-core` MUST NOT ship UI styling or UI components. The published
   stylesheet is owned by the framework adapter (`editor-react`).
3. Core APIs avoid framework concepts: no `onChange`, no controlled/uncontrolled
   props, no file-picker UI. Adapters own those.
4. `editor-core` MAY require a DOM-capable runtime when an editor is actually
   created, but importing the package MUST NOT touch browser globals
   (`window`, `document`) at module load. This keeps the package safe in SSR.
5. Public types that reference DOM types (`File`, `AbortSignal`, `Element`) are
   acceptable; they are handled by the adapter or a browser-capable runtime.

## Alternatives considered

- **Put shared logic in `editor-react` and extract later.** Rejected: extraction
  later is more expensive and encourages leaking React semantics into the API.
- **Make the core DOM-free.** Rejected: Tiptap's editor requires a DOM; a
  DOM-free core would need a parallel, reduced implementation.
- **Allow framework imports behind tree-shakeable entry points.** Rejected:
  peer/engine duplication and SSR hazards outweigh the convenience.

## Consequences

- `editor-core` is import-safe in Node/SSR; editor creation is deferred to a
  DOM-capable runtime.
- The React adapter stays thin and re-exports core types/contracts.
- Framework-specific behavior is verified in the adapter packages.

## References

- `ARCHITECTURE.md` §2, §4, §6.1, §12
- `packages/editor-core/src/import-safety.test.ts`
