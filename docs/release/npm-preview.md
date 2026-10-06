# npm Package Preview (Task 09.09)

> **Status:** Awaiting human review
> **Date:** 2026-10-06
> **Phase:** 09 (Release Engineering)
> **Target version:** `0.1.0` (first public release)

This document summarizes exactly what a public npm consumer will see. It requires
human approval before the first publish (Phase 09 §13).

## 1. Packages

| | `@rumahkodingku/editor-core` | `@rumahkodingku/editor-react` |
| --- | --- | --- |
| Version | `0.1.0` | `0.1.0` |
| Access | `public` | `public` |
| Description | Framework-independent core for RumahKodingku Editor. | React adapter for RumahKodingku Editor. |
| License | MIT | MIT |

## 2. Public metadata

Both packages share:

- **Repository:** `git+https://github.com/Rumahkodingku/editor.git`
  (`directory`: the package folder)
- **Homepage:** `https://github.com/Rumahkodingku/editor#readme`
- **Bugs:** `https://github.com/Rumahkodingku/editor/issues`
- **Keywords:** `tiptap`, `prosemirror`, `rich-text-editor`, `wysiwyg`, `editor`
  (`editor-react` also `react`)
- **Engines:** `node >= 22`
- **Type:** `module` (ESM)
- **`publishConfig`:** `{ "access": "public", "provenance": true }`

## 3. Exports and files

| | `editor-core` | `editor-react` |
| --- | --- | --- |
| Exports | `.` (types + import) | `.` + `./styles.css` |
| `sideEffects` | `false` | `["**/*.css"]` |
| Published files | `dist/index.js`, `dist/index.d.ts`, `README.md`, `LICENSE`, `package.json` | + `dist/styles.css` |
| Packed size | ~12.2 kB | ~17.6 kB |
| Brotli bundle | 5.88 kB | 8.34 kB |

## 4. Peer dependencies

- `editor-core`: `@tiptap/core ^3.31.4`, `@tiptap/pm ^3.31.4`,
  `@tiptap/starter-kit ^3.31.4`, `@tiptap/extension-image ^3.31.4`,
  `@tiptap/extensions ^3.31.4`, `@tiptap/html ^3.31.4`, and optional
  `happy-dom ^20.8.9` (server-side `jsonToHTML`).
- `editor-react`: `@tiptap/core ^3.31.4`, `@tiptap/react ^3.31.4`, `react ^19`,
  `react-dom ^19`; `editor-core` is a normal dependency.

## 5. Installation command (as documented)

```bash
pnpm add @rumahkodingku/editor-react @rumahkodingku/editor-core \
  @tiptap/core @tiptap/react @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extensions @tiptap/html \
  react react-dom
```

```ts
import "@rumahkodingku/editor-react/styles.css";
```

## 6. Naming and scope

- Scope `@rumahkodingku` — **availability must be confirmed** with the registry
  owner before publish (`ARCHITECTURE.md` §26.4.4).
- Package names follow the architecture's published-package list (§17.4).

## 7. Human review checklist

- [ ] Package names (`@rumahkodingku/editor-core`, `@rumahkodingku/editor-react`)
- [ ] Initial public version (`0.1.0`)
- [ ] Public descriptions
- [ ] License (MIT)
- [ ] Package access (public)
- [ ] Public metadata (repository, homepage, bugs, keywords)
- [ ] Scope availability
