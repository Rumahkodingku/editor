# ADR 0004 — JSON is the canonical content format

- **Status:** Accepted
- **Date:** 2026-10-01
- **Phase:** 03 (Editor Core)
- **Source:** `ARCHITECTURE.md` §11, §26.1 (OQ-6, OQ-10)

## Context

Rich-text content must be persisted and exchanged. Two common representations
exist: Tiptap/ProseMirror JSON and HTML. Supporting both as first-class
controlled values creates dual-state semantics, lossy round-trips, and security
risk (HTML injection).

Persisted content also outlives the code that produced it, so it needs a schema
version that is independent from Tiptap's internal version.

## Decision

1. Tiptap/ProseMirror JSON is the canonical content representation for input and
   persistence. `editor-core` works with `JSONContent`.
2. HTML is an output format only. It is produced through helpers
   (`toHTML`, `jsonToHTML`) and is NEVER accepted as a controlled value in the
   MVP. JSON stays canonical.
3. Persisted content is wrapped in the envelope `{ schemaVersion, content }`.
   `editor-core` owns `EDITOR_SCHEMA_VERSION` and the envelope helpers
   (`createPersistenceEnvelope`, `parsePersistenceEnvelope`,
   `isSupportedSchemaVersion`, `isPersistenceEnvelope`).
4. Unsupported schema versions fail predictably with
   `EditorSchemaVersionError`; the version is never silently ignored or coerced.
5. Schema changes that are not backward compatible require an explicit migration.

## Alternatives considered

- **HTML as the canonical value.** Rejected: lossy, unsafe by default, and
  conflicts with structured manipulation.
- **Accept both JSON and HTML as `value`.** Rejected: dual controlled-state
  semantics and ambiguous change detection.
- **Version content inside the editor component.** Rejected: persistence is a
  boundary concern; the component works with plain `JSONContent`.

## Consequences

- Public input/output types use `JSONContent`; consumers convert to HTML only for
  rendering/email/preview.
- Server-safe HTML generation is provided (`jsonToHTML`), and it does not make
  arbitrary HTML safe for injection — consumers remain responsible for
  sanitizing rendered HTML.
- Migration helpers are added only when the first incompatible schema change
  requires one.

## References

- `ARCHITECTURE.md` §11, §26.1 (OQ-6, OQ-10)
- `packages/editor-core/src/persistence/persistence.ts`
- `packages/editor-core/src/serialization/serialization.ts`
