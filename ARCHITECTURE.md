# RumahKodingku Editor — Architecture

> **Status:** Approved
> **Version:** 1.1
> **Last Updated:** 2026-09-30
> **Applies to:** `Rumahkodingku/editor`

This document records the architectural decisions for RumahKodingku Editor and the rules that implementation must follow.

## 0. How to Read This Document

- **MUST / MUST NOT** — binding rule. Violations require an explicit review (see §24).
- **SHOULD / SHOULD NOT** — default rule. Deviate only with a written reason.
- **MAY** — optional.
- Sections marked **(Decided)** are settled. Sections marked **(Proposed)** are accepted as the direction for API contracts and structures, and MAY be refined during implementation.
- Resolved decisions and remaining checks are listed in **§26**. Anything that is neither marked Decided nor listed in §26 is not settled. Agents and contributors MUST NOT treat it as decided, and new unresolved questions are added to §26.5.
- Code samples are illustrative unless the section says they are a contract.

### Status meanings

**Approved** means every architectural decision needed to start implementation is resolved (§26.1) and this document is the source of truth. It does **not** mean the code already exists. Three separate gates apply:

| Gate                 | Where              | When                                                 |
| -------------------- | ------------------ | ---------------------------------------------------- |
| Document approval    | this header, §26.5 | Approved when no open question blocks implementation |
| Implementation gates | §26.3              | Completed during initial implementation              |
| Pre-publish gates    | §26.4              | Completed before the first public release            |

Changing a **Decided** item requires the change-control process in §24. A **Proposed** item MAY be refined during implementation without re-approving this document, but the refinement MUST be reflected here in the same change.

---

## 1. Overview

RumahKodingku Editor is a reusable WYSIWYG rich text editor built as a layered TypeScript monorepo on top of **Tiptap + ProseMirror**.

### Goals

- A small, typed, composable editor that can be dropped into future projects with minimal setup.
- A core that does not depend on any UI framework, so adapters (React first, Vue later) stay thin.
- No forced dependency on Tailwind or any storage/backend provider.

### Non-goals (for now)

- Reimplementing the ProseMirror document/state engine.
- Real-time collaboration, Markdown import/export, and Vue support. They are planned but must not shape the MVP.
- Shipping a hosted backend or storage implementation.

### Dependency diagram

**Convention: `A → B` means "A depends on B".**

```text
playground ─────► editor-react ─────► editor-core ─────► Tiptap / ProseMirror
fumadocs   ─────► editor-react (workspace devDependency, live demos)

editor-vue (future) ─────► editor-core
```

`editor-react` also depends on `@tiptap/react` (see §5).

---

## 2. Principles (Decided)

1. **Framework independence.** `editor-core` MUST NOT import or depend on React, Vue, Angular, Svelte, or any UI framework.
2. **Separation of concerns.** Editor state, rendering, UI controls, serialization, infrastructure, and framework integration MUST stay separate.
3. **Single source of truth.** Tiptap/ProseMirror owns the document state. Application state libraries MUST NOT hold the document as primary state.
4. **Dependency inversion.** Infrastructure (uploads, storage, APIs) MUST be exposed through interfaces or callbacks. The packages MUST NOT assume a provider.
5. **Small public API.** Common usage SHOULD need only a few props. Advanced features are added through extensions.
6. **Consumer-friendly dependencies.** Published packages MUST NOT require consumers to install Tailwind or unrelated application dependencies.
7. **ESM-first.** Packages are published as ES modules. CommonJS MAY be added only for a concrete compatibility need.
8. **Documentation is part of the API.** A public API change MUST update the docs in the same change.
9. **Prefer extensions over conditionals.** Feature behavior SHOULD live in extensions, not in `if` branches inside core.
10. **No premature abstraction.** Code is extracted into `editor-core` only when it is genuinely framework-independent and already needed. Empty folders and speculative layers SHOULD NOT be created.

---

## 3. Repository Structure

### 3.1 Current state (as of this version)

After Phase 00 (repository foundation) and Phase 01 (build and package
infrastructure), the repository contains:

```text
editor/
├── .agents/
├── .husky/
├── apps/
│   └── fumadocs/            # documentation app (Next.js + Fumadocs)
├── docs/
│   ├── adr/                 # empty; created with the first ADR
│   └── roadmap/
├── packages/
│   ├── config/              # @editor/config — shared tsconfig (internal, not published)
│   ├── editor-core/         # @rumahkodingku/editor-core — tsdown build, no features yet
│   └── editor-react/        # @rumahkodingku/editor-react — tsdown build, no features yet
├── AGENTS.md
├── ARCHITECTURE.md
├── LICENSE                  # MIT
├── PRD.md
├── README.md
├── biome.json
├── bts.jsonc                # scaffold metadata
├── commitlint.config.mjs
├── lint-staged.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── skills-lock.json
├── tsconfig.json
└── turbo.json
```

`editor-core` and `editor-react` exist as Phase 01 skeletons: package metadata,
explicit `exports`, ESM and declaration output through tsdown, Tiptap/React peer
contracts, and a placeholder stylesheet. They contain **no editor API or features
yet**. `apps/playground`, `.changeset/`, and any ADR do **not** exist yet.
`bunfig.toml` and the scaffold Varlock workflow were removed in Phase 00.

### 3.2 Target structure (Proposed)

```text
editor/
├── apps/
│   ├── fumadocs/            # documentation + live demos
│   └── playground/          # Vite + React, manual/visual validation
├── packages/
│   ├── config/              # shared TS/build configuration (internal, not published)
│   ├── editor-core/
│   ├── editor-react/
│   └── editor-vue/          # future
├── docs/adr/                # created with the first ADR
├── PRD.md
├── ARCHITECTURE.md
├── AGENTS.md                # operational rules for AI agents
├── CONTRIBUTING.md          # to be created
├── CHANGELOG.md / .changeset/   # to be created (Phase 09)
└── LICENSE                  # MIT
```

Files listed as "to be created" MUST exist before any rule refers to them as mandatory reading.

### 3.3 Responsibilities

| Area                    | Responsibility                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/editor-core`  | Framework-independent editor logic: configuration, default extensions, RK extensions, content utilities, upload contract, toolbar definitions |
| `packages/editor-react` | React components, hooks, lifecycle integration, default toolbar rendering, stylesheet                                                         |
| `packages/editor-vue`   | Future Vue adapter                                                                                                                            |
| `packages/config`       | Internal shared configuration. Not published                                                                                                  |
| `apps/playground`       | Development, manual testing, visual validation                                                                                                |
| `apps/fumadocs`         | Public documentation and live demos                                                                                                           |

`apps/*` are applications. Tooling that only applies to applications (for example the Varlock env schema generated by the scaffold) MUST NOT leak into published packages.

---

## 4. Dependency Rules (Decided)

### 4.1 Direction

```text
editor-core  ◄──  editor-react  ◄──  playground
                       ▲
                       └──────────  fumadocs
```

Packages MUST NOT depend on apps. Documentation and playground consume the public APIs only.

### 4.2 Allowed dependency matrix

| From ↓ / To →  |  editor-core  |   editor-react    | editor-vue |    React    |   Vue    |
| -------------- | :-----------: | :---------------: | :--------: | :---------: | :------: |
| `editor-core`  |       —       |         ❌         |     ❌      |      ❌      |    ❌     |
| `editor-react` |       ✅       |         —         |     ❌      |  ✅ (peer)   |    ❌     |
| `editor-vue`   |       ✅       |         ❌         |     —      |      ❌      | ✅ (peer) |
| `playground`   | via re-export |         ✅         |     —      |      ✅      |    —     |
| `fumadocs`     | via re-export | ✅ (devDependency) |   future   | as required |  future  |

### 4.3 Forbidden imports in `editor-core`

- `react`, `react-dom`, `vue`, `next`, `tailwindcss`
- Any application-specific module
- Browser globals evaluated at import time (see §12)

`next` and Tailwind are allowed in `apps/*`, never in `packages/*`.

### 4.4 Dependency policy for published packages

| Dependency kind      | Rule                                                                              |
| -------------------- | --------------------------------------------------------------------------------- |
| `react`, `react-dom` | `peerDependencies` of `editor-react` with a supported range. Never `dependencies` |
| `editor-core`        | `dependencies` of `editor-react`                                                  |
| `@tiptap/*`          | See §5.3                                                                          |
| Icon/UI libraries    | MUST NOT be added to published packages without an ADR. Icons are inline SVG      |
| Build/test tooling   | `devDependencies` only                                                            |

Each published package MUST declare `engines` (Node) and the supported React range in its `package.json`. The concrete values are recorded in §26.1 (OQ-1, OQ-2).

### 4.5 Re-exports

`editor-react` SHOULD re-export the public types and utilities from `editor-core` that a consumer needs (for example `ImageUploadHandler`, toolbar types), so consumers can install one package for the common case.

---

## 5. Editor Engine and the Tiptap Contract

### 5.1 Engine (Decided)

The engine is **Tiptap on ProseMirror**. The project MUST NOT reimplement document state, transactions, selection, schema, input rules, history, or the extension system.

### 5.2 Tiptap is part of the public API (Decided)

The public API exposes Tiptap types (`JSONContent`, `Editor`, `AnyExtension`). Tiptap is therefore an explicit part of the public contract, not a hidden implementation detail.

Consequences:

- Tiptap's **major version is pinned** and documented. A Tiptap major upgrade is a breaking change for this project's consumers.
- Public types SHOULD import from Tiptap directly instead of wrapping them in duplicate types.
- `editor-core` MUST NOT re-create Tiptap features (commands, events, JSON/HTML conversion). It adds value only through:
  - default extension presets,
  - RumahKodingku extensions,
  - typed configuration,
  - the upload contract,
  - framework-independent toolbar definitions,
  - content utilities (schema versioning, server-safe rendering).

### 5.3 Tiptap dependency placement (Decided)

- `editor-core` declares every Tiptap package that it imports or exposes as a `peerDependency`. This includes `@tiptap/core`, `@tiptap/pm`, and any extension packages used by the public core presets.
- `editor-react` declares `@tiptap/react` as a `peerDependency` and `editor-core` as a normal workspace/package dependency.
- The supported Tiptap major is **3.x**. The exact patch version is pinned in the repository lockfile and package manifests when implementation starts.
- The playground MUST verify that the resolved dependency graph contains one compatible Tiptap/ProseMirror installation and that the published tarball works in a clean consumer project.

This avoids hiding Tiptap behind the library while reducing the risk of duplicate engine instances.

---

## 6. Package Responsibilities

### 6.1 `editor-core`

Owns:

- editor configuration and creation helpers
- default extension presets and RK extensions
- content utilities (JSON/HTML helpers, schema versioning, server-safe render)
- upload interfaces and the image-upload extension
- toolbar item definitions (framework-independent)
- shared types
- framework-independent utilities

Must not own:

- React/Vue components, hooks, or composables
- routing or application state
- backend or storage implementations
- CSS that depends on a UI framework

`editor-core` requires a DOM at runtime to create an editor (Tiptap needs it). It is **UI-framework-agnostic**, not DOM-free. Importing it MUST still be safe in SSR (§12).

### 6.2 `editor-react`

Owns:

- `Editor` component and supporting hooks
- React lifecycle integration and controlled/uncontrolled behavior
- default toolbar rendering built from core toolbar definitions
- the published stylesheet (§10)

It MUST NOT duplicate core logic.

### 6.3 `editor-vue` (future)

MUST depend on `editor-core` and MUST NOT depend on `editor-react`. It is not started until the core API is stable.

---

## 7. Public API Contracts

Names below are the intended contract. Any change follows the public API rule in §24.

### 7.1 React `Editor` props (Proposed)

```ts
import type { AnyExtension, Editor, JSONContent } from '@tiptap/core'

type EditorProps = {
  value?: JSONContent                        // controlled
  defaultValue?: JSONContent                 // uncontrolled
  onChange?: (content: JSONContent) => void
  onReady?: (editor: Editor) => void
  placeholder?: string
  editable?: boolean                         // default true
  disabled?: boolean                         // default false
  extensions?: AnyExtension[]
  labels?: Partial<EditorLabels>             // i18n (§22)
  immediatelyRender?: boolean                // SSR (§12)
  className?: string
}
```

### 7.2 `editable` versus `disabled`

| State                        | Focus | Text selection / copy | Editing | Toolbar            | ARIA            |
| ---------------------------- | ----- | --------------------- | ------- | ------------------ | --------------- |
| `editable=true`              | yes   | yes                   | yes     | enabled            | —               |
| `editable=false` (read-only) | yes   | yes                   | no      | hidden or disabled | `aria-readonly` |
| `disabled=true`              | no    | no                    | no      | disabled           | `aria-disabled` |

### 7.3 Controlled mode rules

- `onChange` MUST fire at most once per transaction that changes the document, and MUST NOT fire for updates caused by the `value` prop.
- The document is serialized lazily. The component MUST NOT call `getJSON()` on unrelated renders.
- When `value` changes by reference, the component compares it with the current document before calling `setContent`, and applies it with `emitUpdate: false`. This prevents update loops and cursor jumps.
- Selection SHOULD be preserved when the incoming value is equivalent to the current document.
- A debounced change option MAY be added (`changeDebounceMs`) if measurement shows it is needed (§21).

### 7.4 Content formats

JSON is the canonical value type of the API. HTML is available as an output helper (`editor.getHTML()`), not as an input/output prop of the MVP. The MVP component does not accept HTML as `value` (§26.1, OQ-6). The component's `value` and `onChange` use plain `JSONContent`; applications that persist content wrap it in the `{ schemaVersion, content }` envelope at the storage boundary (§11.3).

### 7.5 Image upload contract (Proposed)

```ts
export type ImageUploadResult = {
  src: string
  alt?: string
  width?: number
  height?: number
}

export type ImageUploadHandler = (ctx: {
  file: File
  signal: AbortSignal
  onProgress?: (percent: number) => void
}) => Promise<ImageUploadResult>

export type ImageUploadOptions = {
  upload: ImageUploadHandler
  accept?: string[]                          // e.g. ['image/png', 'image/jpeg']
  maxSize?: number                           // bytes
  onError?: (error: EditorUploadError) => void
}
```

Rules:

- The upload is configured **through the image extension**, not as a top-level `createEditor` option:

  ```ts
  ImageUpload.configure({ upload, accept, maxSize, onError })
  ```

- Drag-and-drop, paste, and toolbar insertion all go through the same handler.
- The editor shows a placeholder while an upload is running and removes it on failure, reporting through `onError`.
- The returned `src` is validated before insertion (§23).
- The package MUST NOT depend on any storage provider (S3, Cloudinary, Supabase, Firebase, or a specific backend).

---

## 8. Extension Architecture

There are three kinds of extensions:

1. **Engine extensions** supplied by Tiptap.
2. **RumahKodingku extensions** shipped by `editor-core`.
3. **Consumer extensions** supplied through the `extensions` prop.

### 8.1 Presets

- `editor-core` exposes a default preset (for example `createDefaultExtensions(options)`) that assembles the standard set. Consumers MAY use it, extend it, or bypass it.
- Each RK extension is a separate named export so unused ones can be tree-shaken.
- Extensions MUST be composable and MUST NOT require modifying `editor-core`.
- Extension arrays MUST be stable between renders. Recreating them causes editor re-initialization (§21).
- History and collaboration extensions conflict. This must be handled explicitly when collaboration is introduced.

### 8.2 Schema stability

Extensions define the stored document schema. Rules for keeping stored content valid are in §11.3.

---

## 9. UI and Toolbar Architecture

### 9.1 Framework-independent toolbar model (Proposed)

`editor-core` defines toolbar items as data plus behavior:

```ts
type ToolbarItemDefinition = {
  id: string
  labelKey: keyof EditorLabels
  icon: string                               // id of an inline SVG icon
  shortcut?: string
  isActive: (editor: Editor) => boolean
  isDisabled: (editor: Editor) => boolean
  run: (editor: Editor) => void
}
```

Adapters only render these definitions. This keeps toolbar logic in one place when Vue is added.

### 9.2 Components

Components are composable, not monolithic. Candidates (not all needed in the first release):

`Editor`, `EditorContent`, `EditorToolbar`, `ToolbarButton`, `ToolbarGroup`, `BubbleMenu`, `FloatingMenu`, `LinkDialog`, `ImageDialog`.

- Consumers MUST be able to compose their own toolbar from definitions.
- Components are **headless-first** with default styling through CSS variables.
- Icons are inline SVG. No icon library is a runtime dependency.
- Floating UI dependencies (for bubble/floating menus) need an ADR before being added.

---

## 10. Styling and Theming (Decided)

- Published styling uses framework-agnostic CSS and CSS custom properties.
- Tailwind MUST NOT be required by consumers. Tailwind MAY be used in `apps/*`.
- The stylesheet is owned by `editor-react` (and later `editor-vue`). `editor-core` ships no UI stylesheet.
- All CSS variables use the `--rk-editor-` prefix. All class names use the `rk-` prefix.
- Dark mode is driven by overridable variables (strategy: `[data-theme="dark"]` plus `prefers-color-scheme` defaults; final wording in the docs).
- Consumers import the stylesheet explicitly (`@rumahkodingku/editor-react/styles.css`).

```css
:root {
  --rk-editor-background: ...;
  --rk-editor-foreground: ...;
  --rk-editor-border: ...;
  --rk-editor-muted: ...;
  --rk-editor-radius: ...;
}
```

---

## 11. Content and Serialization

### 11.1 Canonical representation (Decided)

**Tiptap/ProseMirror JSON is the canonical document representation.** JSON is used for persistence and structured manipulation. HTML is a serialization/output format for rendering, email, previews, and CMS delivery.

### 11.2 Server-safe rendering (Proposed)

`editor-core` exposes a helper that renders JSON to HTML **without an editor instance and without a browser DOM** (based on Tiptap's server-capable HTML generation), so applications can display stored content without loading the editor.

### 11.3 Schema versioning (Decided)

Persisted JSON outlives the code that produced it. Rules:

- Persisted content uses the envelope `{ schemaVersion, content }`, where `content` is Tiptap/ProseMirror JSON (§26.1, OQ-10).
- Node and mark types MAY be added. They MUST NOT be renamed, removed, or have attributes changed incompatibly without a migration.
- `editor-core` provides the envelope type and helpers to wrap and unwrap content. Migration helpers are introduced only when the first incompatible schema change requires one.
- Removing an extension is a breaking change and MUST be called out in the release notes.

### 11.4 Markdown

Future capability. It MUST NOT complicate the MVP architecture.

---

## 12. SSR and Hydration (Decided)

- `editor-core` and `editor-react` MUST be importable in a server environment without touching `window`, `document`, or other browser globals at import time.
- `editor-react` marks its entry as a client module (`"use client"`) where the build tool supports it.
- The `Editor` component supports `immediatelyRender: false` (default suitable for SSR frameworks) to avoid hydration mismatches.
- Rendering stored content on the server uses §11.2, not the editor.

---

## 13. State Management (Decided)

- The document lives in Tiptap/ProseMirror. It MUST NOT be stored in Zustand, Redux, Vuex, or similar as the primary state.
- Consumers use their preferred solution for application UI state (modals, tabs, workflow, upload dialogs).
- The packages keep global state to a minimum. Module-level mutable singletons are not allowed.
- Controlled and uncontrolled usage are both supported; internal editor state stays owned by the engine (§7.3).

---

## 14. Error Handling

- Errors MUST NOT be swallowed silently.
- Public configuration is validated with clear messages.
- Typed errors are used where consumers need to react (for example `EditorUploadError`, `EditorConfigError`). Upload errors, invalid configuration, and unsupported operations MUST be distinguishable.
- Underlying causes are preserved with `cause`.
- Errors MUST NOT expose sensitive infrastructure details.

---

## 15. TypeScript Conventions

- `strict` mode is enabled. Shared settings live in `packages/config`.
- Public types are explicit and exported from package entry points.
- `any` is avoided; when unavoidable it needs a comment stating why. Prefer `unknown` for unknown input.
- Private implementation types are not exported.
- Named exports only.
- Public API type behavior SHOULD be covered by type tests (§16).

---

## 16. Testing Architecture

| Level                 | Scope                                                                               | Tooling (Proposed)                       |
| --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------- |
| Unit                  | content utilities, config, toolbar definitions, upload contract, extension behavior | Vitest                                   |
| Component/integration | initialization, formatting, serialization, callbacks, React integration             | Vitest + React Testing Library           |
| Browser e2e           | typing, selection, paste, drag-drop upload, IME                                     | Playwright                               |
| Accessibility         | keyboard interaction, roles, labels                                                 | axe-core (in Playwright) + manual checks |
| Type tests            | public API types                                                                    | `expect-type` or `tsd`                   |
| Package validity      | `exports`, types resolution                                                         | `publint`, `@arethetypeswrong/cli`       |
| Size                  | bundle budget for each package                                                      | `size-limit`                             |

jsdom cannot model layout, selection, or IME reliably, so behavior that depends on them MUST be verified in a real browser. The playground is used for rapid visual validation.

---

## 17. Build and Package Architecture

### 17.1 Output

Each published package produces `dist/` with ES modules, type declarations, and (for adapters) a stylesheet.

```text
dist/
├── index.js
├── index.d.ts
└── styles.css        # adapters only
```

### 17.2 `package.json` requirements (Decided)

- `"type": "module"`.
- Explicit `exports`; only intended entry points are exposed.
- `files` restricts the published contents.
- `sideEffects` is `false`, with an exception for the stylesheet.
- `peerDependencies`, `engines`, and `repository` fields are set.

```json
{
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"]
}
```

The metadata MUST be validated with the tools in §16 before the first publish. The library bundler is **tsdown**. tsdown is selected because it is designed for TypeScript libraries, supports ESM output and declaration generation, and externalizes package dependencies by default.

### 17.3 Workspace consumption

Turborepo builds packages before their consumers (`dependsOn: ["^build"]`). Applications consume the package through its normal workspace package entry point rather than importing private source files. During development, library packages use **tsdown watch mode** so their `dist` output remains current; production builds always consume the generated package output. This keeps local development close to the published-package contract. tsdown supports watch mode and standard package exports.

In Turborepo, the `dev` task first builds workspace dependencies, then runs each library's `tsdown --watch` as a persistent task. An initial build MUST complete before applications start.

### 17.4 Published packages

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
@rumahkodingku/editor-vue        # future
```

The npm scope availability MUST be verified before the first publish (§26.4). The project is developed with pnpm; published packages MUST work for consumers using npm, pnpm, or Bun.

---

## 18. Versioning and Release

- Versioning follows semver.
- Before `1.0.0`, breaking changes bump the **minor** version. After `1.0.0`, they bump the major.
- A Tiptap major upgrade counts as a breaking change (§5.2).
- Release tooling uses **Changesets**. Package versions are **independent** so `editor-core` and `editor-react` can release at different versions when only one package changes. Changesets MUST still record dependency updates when a package consumes a new version of another workspace package. The repository already uses commitlint (Conventional Commits); Changesets handles release/version coordination and MUST NOT replace commitlint.
- Public API changes MUST include release notes describing the user-visible change.
- Release automation publishes only after all CI checks pass.

---

## 19. Tooling and CI

### 19.1 Current scripts

| Script                              | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| `pnpm run dev`                      | Start all applications in development mode       |
| `pnpm run build`                    | Build all workspaces                             |
| `pnpm run check-types`              | Type-check all workspaces                        |
| `pnpm run check-types:fumadocs`     | Type-check the Fumadocs app                      |
| `pnpm run check:packages`           | Validate published packages (publint + attw)     |
| `pnpm run check`                    | Biome formatting and linting                     |

`pnpm run test` is **planned** and is added together with Vitest. This document MUST use the real script names above.

### 19.2 Local tooling

Biome (lint/format), Husky, lint-staged, and commitlint are already configured. **pnpm is the official package manager** pinned through the `packageManager` field in `package.json`. Bun is not part of the required development, CI, or release toolchain; `bunfig.toml` was removed in Phase 00 because nothing depended on it.

### 19.3 Minimum CI checks

```text
pnpm install --frozen-lockfile
pnpm run check
pnpm run check-types
pnpm run test        # once available
pnpm run build
```

Turborepo executes these tasks across the workspace with caching.

---

## 20. Documentation and Playground

### 20.1 Documentation (Fumadocs)

Documentation is organized by user intent:

```text
Introduction · Installation · Quick Start · Editor · Content · Formatting ·
Toolbar · Extensions · Images · Theming · Read-only Mode · SSR ·
Advanced Usage · API Reference · React · Vue (future) · Migration / Changelog
```

Examples use the public API only. Documentation MAY depend on the packages; packages MUST NOT depend on documentation.

### 20.2 Playground

The playground is a Vite + React + TypeScript app used for development, manual testing, and visual validation. It is not a package dependency and MAY use Tailwind. It demonstrates: basic usage, toolbar, formatting, JSON/HTML output, read-only and disabled states, placeholder, image upload integration, and custom extensions.

**Fumadocs is the canonical public home for examples and live documentation demos.** The playground exists for internal development and rapid validation; examples should not be maintained independently in both places unless the playground needs a scenario that is intentionally not public.

---

## 21. Performance

- Editor engine state stays outside React state.
- Subscribe only to the editor changes a component needs; keep toolbar subscriptions focused.
- Serialize the document only when required (§7.3).
- Keep extension arrays and configuration objects referentially stable.
- Measure with realistic documents before adding optimizations; add `changeDebounceMs` only when measurement justifies it.
- Bundle size budgets are enforced with `size-limit` (§16).

---

## 22. Accessibility and Internationalization

### Accessibility

Accessibility is a first-class requirement. The target is **WCAG 2.2 AA** for the default UI.

- The toolbar follows the WAI-ARIA Authoring Practices toolbar pattern (`role="toolbar"`, roving tabindex, arrow-key navigation).
- The editing surface has an accessible name and exposes multiline text semantics.
- Buttons are semantic, have visible focus states, and expose pressed/disabled state (`aria-pressed`, `aria-disabled`).
- Color contrast meets AA in light and dark themes.
- Accessibility is tested during feature development, not at the end.

### Internationalization

- All user-facing strings (toolbar labels, dialog text, error messages) come from an `EditorLabels` object that consumers can override through the `labels` prop.
- Default locales: English, with Indonesian planned.
- Layout SHOULD not break for RTL text; full RTL support is out of scope for the MVP.

---

## 23. Security

Rich text is untrusted data whenever it crosses an application boundary.

- Editor HTML MUST NOT be assumed safe for direct injection. The docs explain when consumers need sanitization and recommend a sanitizer for rendered HTML.
- URL protocols are validated for links and images. `javascript:` and similar schemes are rejected. Allowed protocols are configurable with a safe default.
- HTML pasted from Word or the web passes through the schema, so unsupported nodes and attributes are dropped. Additional paste cleanup is documented where behavior is not obvious.
- The `src` returned by an upload handler is validated before insertion.
- File type and size are validated in the editor for user feedback (§7.5) and MUST also be validated by the consumer's storage layer.
- No secret credentials are embedded in packages. Uploads stay external.
- Content MUST NOT cause execution of arbitrary HTML/JS.
- Published releases SHOULD use npm provenance.

---

## 24. Change Control, ADRs, and Public API Rule

### 24.1 Architecture Decision Records

Significant decisions are recorded in `docs/adr/` (created with the first ADR). An ADR contains: context, decision, alternatives considered, consequences, and status. ADRs are not written for trivial details.

Initial ADRs to write:

```text
0001-layered-monorepo.md
0002-tiptap-prosemirror-and-public-api.md      # §5.2, §5.3
0003-framework-agnostic-core.md
0004-json-canonical-content.md
0005-build-tooling-and-release.md              # §17, §18
```

### 24.2 Public API rule

Any change to a public API MUST include:

1. type updates,
2. tests,
3. documentation updates,
4. release notes / changeset.

### 24.3 Conflicts

When a new requirement conflicts with this document, the conflict is reviewed explicitly (ADR or update to this document). It is not bypassed silently.

---

## 25. Definition of Architectural Compliance

An implementation is compliant when:

- `editor-core` imports no UI framework and is import-safe in SSR.
- React-specific code exists only in `editor-react` or application layers.
- Future Vue support depends on `editor-core`, never on React.
- Tiptap/ProseMirror remains the source of truth for document state.
- JSON is the canonical representation; HTML is an output format.
- Infrastructure is inverted through interfaces and callbacks.
- Consumers are not required to install Tailwind or any icon/UI library.
- Public APIs are explicitly exported, typed, tested, and documented.
- The controlled-mode and serialization rules in §7.3 are followed.
- Security, accessibility, and i18n requirements are considered.
- Architecture or public API changes are documented (ADR/docs/changeset).

---

## 26. Resolved Decisions and Gates

The architectural questions that previously blocked implementation are resolved below. These decisions are binding unless changed through the change-control process in §24.

### 26.1 Resolved decisions

| ID    | Decision                                                                                                                                 | Status                                         |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| OQ-1  | React **19.x** (peer range `^19`). Published packages declare `engines.node` `>=22`. Build and CI run on Node.js **22.18+**.             | Resolved                                       |
| OQ-2  | Tiptap **3.x** is the supported Tiptap major.                                                                                            | Resolved                                       |
| OQ-3  | Tiptap packages used by published packages are **peerDependencies**. No competing Tiptap/ProseMirror engine instances.                   | Resolved                                       |
| OQ-4  | **tsdown** is the library bundler. Apps consume generated `dist` through normal package entry points. Development uses `tsdown --watch`. | Resolved                                       |
| OQ-5  | **Changesets** for release and versioning, with **independent** package versions. commitlint remains responsible for commit conventions. | Resolved                                       |
| OQ-6  | The MVP does **not** accept HTML as `value` or as an input format. JSON is canonical. HTML is exposed through output helpers.            | Resolved                                       |
| OQ-7  | License is **MIT**. `@rumahkodingku` is the intended npm scope.                                                                          | Resolved (availability is a pre-publish check) |
| OQ-8  | **pnpm** is the official package manager. Bun is not part of the required toolchain.                                                     | Resolved                                       |
| OQ-9  | **Fumadocs** is the canonical home for public examples and live demos. `apps/playground` is for development and visual validation.       | Resolved                                       |
| OQ-10 | Persisted content uses the envelope `{ schemaVersion, content }`.                                                                        | Resolved                                       |

### 26.2 Notes and rationale

- **OQ-1.** Node.js 20 reached end-of-life in April 2026, so it is not supported. tsdown requires Node.js 22.18+ to run; this applies to the build environment only, and tsdown derives its default output target from `engines.node`. `@tiptap/react` 3.x permits React 17, 18, and 19 as peers, so the React 19-only range is a project decision, not an engine constraint. Starting narrow is deliberate: widening the peer range later (for example to `^18 || ^19`) is non-breaking, while narrowing it is breaking. Widen it when a target project needs React 18.
- **OQ-2.** The exact patch version is pinned through package manifests and `pnpm-lock.yaml` when Tiptap is added. React integration uses `@tiptap/react`, `@tiptap/pm`, and `@tiptap/starter-kit`.
- **OQ-3.** Peer ranges MUST match the supported Tiptap 3.x line. Tiptap packages are versioned together and may pin each other to matching versions, so the Installation documentation MUST provide one copy-paste install command that lists every required Tiptap peer with the supported version range. This mitigates the install burden that peer dependencies place on consumers.
- **OQ-4.** tsdown is designed for library bundling, supports ESM output and declaration generation, and externalizes dependencies declared in package manifests.
- **OQ-5.** Independent versions let `editor-core` and `editor-react` release separately. Changesets MUST record dependency updates when a package consumes a new version of another workspace package. The **decision** is approved; **implementation is deferred to Phase 09 (Release Engineering)**. Changesets MUST NOT be configured during Phases 00–08.
- **OQ-6.** One canonical structured representation avoids dual controlled-state semantics.
- **OQ-7.** The MIT `LICENSE` file was added to the repository root in Phase 01 (§26.3). `@rumahkodingku` is the intended npm scope (availability remains a pre-publish check).
- **OQ-8.** `bunfig.toml` was scaffold metadata and was removed in Phase 00 because nothing depended on it (§26.3). pnpm is the official package manager.
- **OQ-9.** Avoids maintaining duplicate public examples. The playground MAY hold scenarios that are intentionally not public.
- **OQ-10.** Makes schema migrations explicit and lets persisted content outlive individual package versions. The component itself works with plain `JSONContent` (§7.4).

### 26.3 Implementation gates

Completed during initial implementation. They do not block approval of this document.

Phase 01 (build and package infrastructure) ownership:

1. `packages/editor-core` exists and follows §4 and §6.1. — **done (Phase 01)**
2. `packages/editor-react` exists and follows §4 and §6.2. — **done (Phase 01)**
3. Tiptap 3.x is installed, and the dependency graph is verified to contain a single compatible Tiptap/ProseMirror installation. — **done (Phase 01)**
4. The first library build uses tsdown and produces valid ESM output and type declarations. — **done (Phase 01)**
5. The MIT `LICENSE` file is added to the repository root. — **done (Phase 01)**
6. `bunfig.toml` is removed, or a documented reason to keep it is added. — **done (Phase 00)**
7. `AGENTS.md` and `PRD.md` are created (Appendix A refers to them). — **done (Phase 00)**

Deferred to the phase roadmap (explicitly **not** Phase 01):

8. Vitest is wired so `pnpm run test` exists and CI runs it. — **Phase 02**
9. Changesets is configured (`.changeset/`, independent versions). — **Phase 09**

### 26.4 Pre-publish gates

Completed before the first public release.

1. Package metadata is validated with `publint` and `@arethetypeswrong/cli`.
2. The published tarball is installed and works in a clean consumer project.
3. Bundle size budgets are set with `size-limit`.
4. The npm scope `@rumahkodingku` and the package names are verified as available.
5. The Changesets release workflow is tested (dry run) before publishing.

### 26.5 Open questions

None at this version. New unresolved questions MUST be added here with an ID, and any question that blocks implementation moves the status back to Draft until resolved.

---

## Appendix A. AI Agent Rules (Summary)

Detailed operational rules live in `AGENTS.md` (to be created). Until then, agents MUST follow this summary.

**Before coding**

1. Read `ARCHITECTURE.md` (and `PRD.md` once it exists).
2. Inspect the repository structure and confirm what actually exists. This document distinguishes current state (§3.1) from target state (§3.2).
3. Identify affected packages and check whether the feature already exists.
4. Prefer extending existing abstractions over creating duplicates.

**During coding**

- Respect package boundaries (§4) and never add UI-framework imports to `editor-core`.
- Do not add a dependency without stating why. Do not add Tailwind, an icon library, or a UI library to a published package.
- Do not edit generated files (for example the generated env files from the scaffold).
- Treat §26.1 as the binding set of resolved decisions and §26.3-§26.4 as the required gates; do not reopen a resolved decision without the change-control process in §24.
- Preserve the public API unless the task explicitly changes it.

**After coding**

Run the relevant scripts and report failures instead of ignoring them:

```text
pnpm run check
pnpm run check-types
pnpm run test        # once available
pnpm run build
```

**Public API changes** require types, tests, docs, and release notes (§24.2).

---

## Appendix B. Revision History

| Version | Date       | Status   | Summary                                                                                                                                                     |
| ------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.2     | 2026-09-30 | Draft    | Reviewed rewrite: current vs target structure, Tiptap contract, API contracts, SSR, security, open questions                                                |
| 0.3     | 2026-09-30 | Draft    | Open questions resolved into decisions (OQ-1 to OQ-10)                                                                                                      |
| 1.0     | 2026-09-30 | Approved | Removed leaked citation artifacts, fixed §26 table, aligned stale references, separated approval from implementation and pre-publish gates, set Node `>=22` |
| 1.1     | 2026-09-30 | Approved | Phase 01: realigned §26.3 gates (Vitest → Phase 02, Changesets → Phase 09), refreshed §3.1/§3.2 current state, documented build/package infrastructure (tsdown, exports, peer contracts, CSS artifact, `LICENSE`) |
