# ADR 0002 — Tiptap/ProseMirror as the editor engine and part of the public API

- **Status:** Accepted
- **Date:** 2026-10-01
- **Phase:** 03 (Editor Core)
- **Source:** `ARCHITECTURE.md` §5.1, §5.2, §5.3, §26.1 (OQ-2, OQ-3)

## Context

RumahKodingku Editor needs a document model, transactions, selection, schema,
input rules, history, and an extension system. Reimplementing these is out of
scope and would create a second, incompatible engine.

Tiptap 3 sits on top of ProseMirror and is the intended engine. The editor core
must expose `JSONContent`, `Editor`, and `AnyExtension` to consumers (adapters
and applications), so Tiptap cannot be a hidden implementation detail.

## Decision

1. Tiptap + ProseMirror is the editor engine. The project does not reimplement
   document state, transactions, selections, schema, history, input rules, or
   the extension system.
2. Tiptap types are part of the public contract. `editor-core` re-exports
   `JSONContent`, `Editor`, and `AnyExtension` from `@tiptap/core` instead of
   wrapping them in duplicate types.
3. Every Tiptap package that `editor-core` imports or exposes is declared as a
   `peerDependency` (with a matching `devDependency`), so only one
   Tiptap/ProseMirror instance exists in a consumer project.
4. The supported Tiptap major is 3.x. A Tiptap major upgrade is a breaking
   change for consumers.

## Alternatives considered

- **Hide Tiptap behind wrapper types.** Rejected: it duplicates a large public
  surface, drifts from upstream, and prevents consumers from passing Tiptap
  extensions directly.
- **Bundle Tiptap as a `dependency`.** Rejected: it risks duplicate engine
  instances and version conflicts in consumer projects.
- **Reimplement a minimal editor.** Rejected: violates the "do not reimplement
  ProseMirror" principle and multiplies maintenance.

## Consequences

- `editor-core` depends on a pinned Tiptap major and re-exports a curated set of
  its types.
- Consumers must install Tiptap peers; one copy-paste install command is
  documented to keep this manageable.
- Core value is limited to presets, RK extensions, typed configuration, upload
  contracts, toolbar definitions, and content utilities.

## References

- `ARCHITECTURE.md` §5, §6.1, §26.1 (OQ-2, OQ-3)
- `packages/editor-core/package.json` (peerDependencies)
- `packages/editor-core/src/index.ts`
