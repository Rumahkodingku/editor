# Consumer and dependency verification

> **Status:** Complete (pre-release)
> **Date:** 2026-10-06
> **Phase:** 09 (Release Engineering) — tasks 09.07 and 09.08
> **Tooling:** `scripts/consumer-smoke/verify.mjs` (`pnpm run check:consumer`)

## 1. Method

A clean consumer is created **outside the monorepo**. The packages are packed with
`pnpm pack`, which rewrites the internal `workspace:*` range to a concrete
version, and installed with **npm** (no workspace resolution). The temp project
is discarded afterwards.

```bash
pnpm run check:consumer
```

## 2. Results (pre-release, packages at `0.0.0`)

| Step | Result |
| --- | --- |
| `pnpm run build` | ✅ packages built |
| `pnpm pack` (core + react) | ✅ tarballs include `dist`, `README.md`, `LICENSE` |
| `npm install` (tarballs + React 19 + Tiptap 3.31.4 peers) | ✅ resolved, no workspace |
| Node ESM import + core API (`createEmptyDocument`, envelope helpers) | ✅ |
| `tsc --noEmit` against the public declarations | ✅ |
| Production `vite build` (`<Editor>` + stylesheet + `ImageUpload`) | ✅ |

Manual smoke also confirmed the documented install command resolves the peers
from the registry.

## 3. Dependency graph (task 09.08)

- **Tiptap:** every `@tiptap/*` package resolves to a single version line,
  **`3.31.4`**. No duplicate Tiptap installations.
- **ProseMirror:** every `prosemirror-*` package resolves to a single version
  (`prosemirror-model@1.25.12`, `prosemirror-state@1.4.4`,
  `prosemirror-view@1.42.6`, and siblings). No duplicate engine instances.
- **React:** `react` / `react-dom` `^19.3.0` as peers; supplied by the consumer.
- **`editor-react → editor-core`:** a normal dependency, rewritten from
  `workspace:*` to the released version at pack/publish time
  (`0.0.0` now, `0.1.0` at release).

### Intentional peer warnings

- `attw` reports `node10` / `node16 (from CJS)` resolution for both packages.
  These are **ignored by the `esm-only` profile**: the packages are ESM-only by
  design (`ARCHITECTURE.md` §17.2), so CommonJS `require` resolution is not
  supported.

## 4. Supported environment

| Item | Supported |
| --- | --- |
| Node (build tooling) | `>= 22.18` (tsdown requirement) |
| Node (runtime for published code) | `>= 22` |
| React | `^19` |
| Tiptap | `3.x` (all packages on one line) |
| Package managers | npm, pnpm, Bun (standard npm tarball) |

The clean install is validated with **npm**. The tarball is a standard npm
artifact, so pnpm and Bun resolve it the same way; pnpm from the registry is
covered again after release (task 09.16).

## 5. Post-release verification

Task 09.16 repeats the flow against the **published** packages (`0.1.0` from the
npm registry) and records the result here.
