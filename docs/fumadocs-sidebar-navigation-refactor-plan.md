# Fumadocs Sidebar Navigation Refactor Plan

## Project

**RumahKodingku Editor**

## Objective

Refactor the Fumadocs documentation sidebar so its information architecture is clear, non-redundant, consistent across English and Indonesian, and aligned with the actual documentation tree.

## Problem

The current navigation effectively contains two `Introduction` concepts:

```text
Documentation
├── Introduction          ← root index.mdx
├── Introduction          ← section/folder
│   ├── Installation
│   └── Quick Start
├── Fundamentals
├── Features
├── Guides
├── Accessibility
├── API Reference
└── Examples
```

There is also topic overlap between `Guides` and `Examples`, for example `Controlled`, `Custom Toolbar`, `Image Upload`, and `Theming`. These should remain separate but have clearly different purposes.

- **Guides:** conceptual/task-oriented implementation guidance.
- **Examples:** concrete or runnable implementation examples.

---

# 1. Goals

1. Remove duplicate `Introduction` navigation.
2. Keep `/docs` as the single canonical Introduction page.
3. Rename the current `introduction` section to `getting-started`.
4. Put Installation and Quick Start under Getting Started.
5. Preserve Fundamentals, Features, Guides, Accessibility, API Reference, and Examples.
6. Establish a clear sidebar hierarchy.
7. Keep English and Indonesian structures synchronized.
8. Use the installed Fumadocs version and repository conventions as the source of truth.
9. Update affected browser navigation tests.
10. Validate search, locale routing, generated LLM docs, links, and accessibility.
11. Avoid changing editor/package APIs or functionality.
12. Avoid custom sidebar code unless Fumadocs metadata cannot express the desired structure.

# 2. Non-Goals

- Redesigning the entire Fumadocs UI.
- Changing editor functionality or package APIs.
- Rewriting all documentation content.
- Replacing Fumadocs.
- Removing Guides or Examples.
- Adding Changesets/release infrastructure.
- Introducing a custom navigation component without first proving it is necessary.

# 3. Current Structure

```text
content/docs/{en,id}/
├── index.mdx
├── meta.json
├── introduction/
│   ├── installation.mdx
│   ├── quick-start.mdx
│   └── meta.json
├── fundamentals/
├── features/
├── guides/
├── accessibility/
├── api/
└── examples/
```

Current section metadata:

```text
Introduction: installation, quick-start
Fundamentals: editor, content, json, html
Features: formatting, links, images, toolbar
Guides: controlled, uncontrolled, read-only, disabled,
        custom-extensions, custom-toolbar, image-upload,
        theming, ssr, persistence, schema-versioning
Accessibility: overview
API Reference: core, react, components, hooks, types,
               extensions, toolbar, upload
Examples: basic-editor, controlled-editor, uncontrolled-editor,
          read-only-editor, disabled-editor, custom-toolbar,
          custom-extension, image-upload, theming
```

# 4. Target Information Architecture

```text
DOCUMENTATION

GET STARTED
├── Introduction
├── Installation
└── Quick Start

FUNDAMENTALS
├── Editor
├── Content
├── JSON
└── HTML

FEATURES
├── Formatting
├── Links
├── Images
└── Toolbar

GUIDES
├── Controlled Mode
├── Uncontrolled Mode
├── Read-only Mode
├── Disabled Mode
├── Custom Extensions
├── Custom Toolbar
├── Image Upload
├── Theming
├── SSR
├── Persistence
└── Schema Versioning

ACCESSIBILITY
└── Overview

API REFERENCE
├── Core
├── React
├── Components
├── Hooks
├── Types
├── Extensions
├── Toolbar
└── Upload

EXAMPLES
├── Basic Editor
├── Controlled Editor
├── Uncontrolled Editor
├── Read-only Editor
├── Disabled Editor
├── Custom Toolbar
├── Custom Extension
├── Image Upload
└── Theming
```

The key change is:

```text
Before:
Introduction
├── Installation
└── Quick Start

After:
Getting Started
├── Introduction
├── Installation
└── Quick Start
```

The root `index.mdx` remains the canonical Introduction page.

# 5. Recommended URLs

```text
/docs
/docs/getting-started/installation
/docs/getting-started/quick-start

/docs/fundamentals/editor
/docs/fundamentals/content
/docs/fundamentals/json
/docs/fundamentals/html

/docs/features/formatting
/docs/features/links
/docs/features/images
/docs/features/toolbar

/docs/guides/controlled
/docs/guides/uncontrolled
/docs/guides/read-only
/docs/guides/disabled
/docs/guides/custom-extensions
/docs/guides/custom-toolbar
/docs/guides/image-upload
/docs/guides/theming
/docs/guides/ssr
/docs/guides/persistence
/docs/guides/schema-versioning

/docs/accessibility/overview

/docs/api/core
/docs/api/react
/docs/api/components
/docs/api/hooks
/docs/api/types
/docs/api/extensions
/docs/api/toolbar
/docs/api/upload

/docs/examples/basic-editor
/docs/examples/controlled-editor
/docs/examples/uncontrolled-editor
/docs/examples/read-only-editor
/docs/examples/disabled-editor
/docs/examples/custom-toolbar
/docs/examples/custom-extension
/docs/examples/image-upload
/docs/examples/theming
```

The `introduction/*` → `getting-started/*` change is a public-route change and must be verified before implementation.

# 6. Execution Rules

Before changing files:

1. Read `AGENTS.md` and `ARCHITECTURE.md`.
2. Inspect the installed Fumadocs/Fumadocs UI versions.
3. Inspect current `meta.json` behavior.
4. Inspect `apps/fumadocs/src/lib/source.ts`.
5. Inspect `apps/fumadocs/src/lib/shared.ts`.
6. Inspect `apps/fumadocs/src/proxy.ts`.
7. Inspect Fumadocs browser navigation/smoke/accessibility tests.
8. Confirm the desired grouping is supported by the installed Fumadocs version.
9. Do not invent unsupported `meta.json` syntax.
10. Prefer metadata/content-tree changes over custom navigation code.

# 7. Task Plan

## A. Navigation Audit

### NAV-01 — Audit Root Metadata

Inspect:

```text
apps/fumadocs/content/docs/en/meta.json
apps/fumadocs/content/docs/id/meta.json
```

Document how `index` and child directories are rendered by the installed Fumadocs version.

**Acceptance:** root navigation behavior is understood and no metadata syntax is guessed.

### NAV-02 — Audit Section Metadata

Inspect every `meta.json` under English and Indonesian documentation. Confirm page order and structural parity.

### NAV-03 — Audit Fumadocs Source Configuration

Inspect `source.ts`, `shared.ts`, and `proxy.ts`. Confirm source loading, routing, locale behavior, and Markdown negotiation.

### NAV-04 — Audit Browser Navigation Tests

Inspect:

```text
tests/browser/fumadocs/navigation.spec.ts
tests/browser/fumadocs/smoke.spec.ts
tests/browser/fumadocs/a11y.spec.ts
```

Record assertions affected by the route/menu changes.

## B. Define the New Navigation

### NAV-05 — Establish Getting Started

Use `Getting Started` as the section grouping `Installation` and `Quick Start`.

### NAV-06 — Eliminate Duplicate Introduction

Ensure the sidebar contains exactly one visible Introduction page: the root `/docs` page.

### NAV-07 — Define Section Responsibilities

| Section         | Purpose                               |
| --------------- | ------------------------------------- |
| Getting Started | First-time setup and initial usage    |
| Fundamentals    | Core editor concepts                  |
| Features        | Built-in editor capabilities          |
| Guides          | Task-oriented implementation guidance |
| Accessibility   | Accessibility behavior and practices  |
| API Reference   | Exact public API documentation        |
| Examples        | Concrete/runnable implementations     |

### NAV-08 — Define Guides vs Examples Boundary

Keep corresponding topics when useful, but make their purpose explicit. For example, `Guides → Controlled Mode` explains behavior and integration decisions, while `Examples → Controlled Editor` demonstrates implementation.

## C. Directory Refactor

### NAV-09 — Rename Introduction Directory

Rename:

```text
apps/fumadocs/content/docs/en/introduction
```

to:

```text
apps/fumadocs/content/docs/en/getting-started
```

Apply the same structural change to Indonesian documentation.

### NAV-10 — Rename Section Metadata

Create `getting-started/meta.json` with the correct localized title and the existing `installation` / `quick-start` order. Use only metadata syntax supported by the installed Fumadocs version.

### NAV-11 — Review Installation and Quick Start Titles

Ensure their frontmatter does not create another misleading Introduction hierarchy.

### NAV-12 — Update Internal Documentation Links

Search for old route references such as `/docs/introduction`, `introduction/installation`, and `introduction/quick-start`. Update only actual route references, not unrelated prose.

## D. Root Metadata

### NAV-13 — Update English Root Metadata

Update the English root `meta.json` to produce the target hierarchy.

### NAV-14 — Update Indonesian Root Metadata

Apply the same structure to Indonesian.

### NAV-15 — Preserve Top-level Order

Final order:

```text
Getting Started
Fundamentals
Features
Guides
Accessibility
API Reference
Examples
```

## E. Navigation Labels

### NAV-16 — Normalize English Labels

Use consistent labels: `Getting Started`, `Fundamentals`, `Features`, `Guides`, `Accessibility`, `API Reference`, `Examples`.

### NAV-17 — Normalize Indonesian Labels

Use consistent existing project terminology. Recommended equivalents are `Memulai`, `Dasar`, `Fitur`, `Panduan`, `Aksesibilitas`, `Referensi API`, `Contoh`, subject to the repository's established terminology.

### NAV-18 — Normalize Mode Names

Use consistent terminology such as `Controlled Mode`, `Uncontrolled Mode`, `Read-only Mode`, and `Disabled Mode` in Guides; use `... Editor` consistently for Example titles.

## F. Sidebar UX

### NAV-19 — Validate Section Hierarchy

The sidebar should visually communicate `SECTION → pages`, not make section labels look like ordinary documentation pages.

### NAV-20 — Avoid Unnecessary Parent Navigation

Do not create clickable parent pages merely to group children when Fumadocs metadata can express the grouping directly.

### NAV-21 — Validate Active State

On `/docs/getting-started/installation`, Installation is active and Introduction is not.

### NAV-22 — Validate Root State

On `/docs`, Introduction is highlighted exactly once.

## G. Guides and Examples

### NAV-23 — Audit Guide Titles

Review all Guide titles for consistency and task-oriented wording.

### NAV-24 — Audit Example Titles

Review all Example titles for consistency and implementation-oriented wording.

### NAV-25 — Keep Examples Public

Fumadocs remains the canonical public documentation/example home; do not move Examples back to the internal playground.

### NAV-26 — Clarify Guide Descriptions

Guide descriptions should describe the problem or task being solved.

### NAV-27 — Clarify Example Descriptions

Example descriptions should emphasize implementation or runnable behavior.

## H. Locale Synchronization

### NAV-28 — Synchronize English Tree

Ensure English has the complete target structure.

### NAV-29 — Synchronize Indonesian Tree

Ensure Indonesian uses the same page slugs and hierarchy; only localized titles/descriptions/content differ.

### NAV-30 — Validate Locale Switching

Verify the project's actual locale-aware routing for representative Getting Started, Guide, API, and Example pages.

## I. Browser Validation

### NAV-31 — Update Navigation Test URLs

Update `tests/browser/fumadocs/navigation.spec.ts` for the new Getting Started routes.

### NAV-32 — Add Duplicate-Introduction Assertion

Add a browser-level assertion that the rendered sidebar does not contain duplicate Introduction entries.

### NAV-33 — Test Getting Started Navigation

Verify Introduction, Installation, and Quick Start.

### NAV-34 — Test Top-level Navigation

Verify every top-level section is present and ordered correctly.

### NAV-35 — Test Examples Navigation

Verify representative Example pages.

### NAV-36 — Test API Navigation

Verify representative API Reference pages.

### NAV-37 — Test Locale-aware Navigation

Verify navigation in English and Indonesian.

## J. Search Validation

### NAV-38 — Validate Search Index

Confirm Installation and Quick Start appear under their new routes.

### NAV-39 — Remove Stale Search Routes

Confirm obsolete `/introduction/*` paths are not indexed as current documentation unless deliberately retained for redirects.

### NAV-40 — Validate Search Titles

Ensure search results display useful page titles without ambiguous duplicated section names.

## K. LLM Documentation

### NAV-41 — Validate `/llms.txt`

Confirm the generated documentation reflects the new hierarchy. Do not manually edit generated output.

### NAV-42 — Validate `/llms-full.txt`

Confirm the full documentation tree contains the correct paths.

### NAV-43 — Validate Page-level Markdown

Verify representative generated Markdown for Getting Started pages.

### NAV-44 — Search for Stale Introduction Paths

Search generated/configured documentation references for obsolete route paths.

## L. Accessibility

### NAV-45 — Validate Keyboard Navigation

Verify sidebar navigation remains keyboard accessible.

### NAV-46 — Validate Focus State

Ensure navigation focus remains visible.

### NAV-47 — Validate Screen Reader Structure

Ensure section labels and links produce a sensible accessibility tree.

### NAV-48 — Run Documentation Accessibility Tests

Run the existing Fumadocs accessibility suite after the refactor.

## M. Documentation Consistency

### NAV-49 — Update Documentation References

Update `README.md`, `AGENTS.md`, docs, and tests only where they refer to the old navigation structure.

### NAV-50 — Verify No Duplicate IA Definitions

Search for custom navigation configuration that duplicates Fumadocs metadata. Keep one authoritative navigation model.

# 8. Expected File Changes

Primary expected changes:

```text
apps/fumadocs/content/docs/en/meta.json
apps/fumadocs/content/docs/en/index.mdx
apps/fumadocs/content/docs/en/getting-started/meta.json
apps/fumadocs/content/docs/en/getting-started/installation.mdx
apps/fumadocs/content/docs/en/getting-started/quick-start.mdx

apps/fumadocs/content/docs/id/meta.json
apps/fumadocs/content/docs/id/index.mdx
apps/fumadocs/content/docs/id/getting-started/meta.json
apps/fumadocs/content/docs/id/getting-started/installation.mdx
apps/fumadocs/content/docs/id/getting-started/quick-start.mdx

tests/browser/fumadocs/navigation.spec.ts
```

Potential files to modify only if the audit proves they need changes:

```text
README.md
AGENTS.md
tests/browser/fumadocs/smoke.spec.ts
tests/browser/fumadocs/a11y.spec.ts
apps/fumadocs/src/lib/source.ts
apps/fumadocs/src/lib/shared.ts
apps/fumadocs/src/proxy.ts
```

# 9. Implementation Constraints

1. Do not immediately modify `source.ts`, `shared.ts`, or custom Fumadocs components.
2. First solve the problem through the existing content tree and `meta.json` system.
3. If custom navigation is necessary, prove that Fumadocs metadata cannot represent the desired structure.
4. Do not invent unsupported Fumadocs metadata syntax.
5. Do not alter package APIs or editor behavior.
6. Do not manually edit generated `/llms*` output.
7. Keep English and Indonesian structures synchronized.

# 10. Route Migration

The recommended change is:

```text
/docs/introduction/installation
        ↓
/docs/getting-started/installation

/docs/introduction/quick-start
        ↓
/docs/getting-started/quick-start
```

Before implementing the rename, determine whether the documentation is publicly deployed or externally linked. If the old URLs are public, inspect the existing Next.js/Fumadocs routing and implement an appropriate redirect strategy rather than silently breaking old URLs.

# 11. Validation

Use the repository's documented verification flow:

```bash
pnpm run check
pnpm run check-types
pnpm run check-types:fumadocs
pnpm run test
pnpm run build
pnpm run test:browser
```

For this task, documentation typechecking and browser validation are especially important:

```bash
pnpm run check-types:fumadocs
pnpm run test:browser
```

# 12. Acceptance Criteria

## Navigation

- [ ] `Introduction` is not duplicated in the sidebar.
- [ ] `/docs` is the canonical Introduction page.
- [ ] `Getting Started` contains Introduction, Installation, and Quick Start.
- [ ] Top-level sections appear in the intended order.
- [ ] Guides and Examples remain separate.
- [ ] API Reference remains separate.
- [ ] Accessibility remains separate.

## Structure

- [ ] English and Indonesian have identical navigation structure.
- [ ] Page slugs are consistent across locales.
- [ ] Navigation labels are consistent.
- [ ] No unnecessary custom navigation layer exists.

## Routing

- [ ] New Getting Started routes work.
- [ ] Internal links work.
- [ ] Locale-aware routes work.
- [ ] Existing public routes are preserved or intentionally redirected.
- [ ] No stale links remain.

## Search

- [ ] Installation is searchable.
- [ ] Quick Start is searchable.
- [ ] Search results use correct titles.
- [ ] Obsolete navigation paths do not appear as current results.

## LLM Documentation

- [ ] `/llms.txt` is valid.
- [ ] `/llms-full.txt` is valid.
- [ ] Page-level Markdown reflects the new structure.
- [ ] Generated outputs are not manually modified.

## Accessibility

- [ ] Sidebar remains keyboard accessible.
- [ ] Focus states remain visible.
- [ ] Navigation semantics remain correct.
- [ ] Documentation accessibility tests pass.

## Tests

- [ ] Navigation browser tests pass.
- [ ] Fumadocs smoke tests pass.
- [ ] Fumadocs accessibility tests pass.
- [ ] Fumadocs typecheck passes.
- [ ] Repository validation passes.

# 13. Definition of Done

The refactor is complete when:

1. The sidebar has no duplicated `Introduction`.
2. `Getting Started` clearly groups onboarding documentation.
3. `/docs` remains the canonical Introduction.
4. English and Indonesian structures are synchronized.
5. Guides and Examples have clearly differentiated purposes.
6. All affected routes and links are valid.
7. Search and generated LLM documentation reflect the new structure.
8. Browser and accessibility tests pass.
9. No unnecessary custom navigation implementation was introduced.
10. Repository documentation accurately describes the final navigation structure.

# 14. Final Target

```text
Documentation

Getting Started
  Introduction
  Installation
  Quick Start

Fundamentals
  Editor
  Content
  JSON
  HTML

Features
  Formatting
  Links
  Images
  Toolbar

Guides
  Controlled Mode
  Uncontrolled Mode
  Read-only Mode
  Disabled Mode
  Custom Extensions
  Custom Toolbar
  Image Upload
  Theming
  SSR
  Persistence
  Schema Versioning

Accessibility
  Overview

API Reference
  Core
  React
  Components
  Hooks
  Types
  Extensions
  Toolbar
  Upload

Examples
  Basic Editor
  Controlled Editor
  Uncontrolled Editor
  Read-only Editor
  Disabled Editor
  Custom Toolbar
  Custom Extension
  Image Upload
  Theming
```

The key UX result is:

```text
Before

Introduction
Introduction >
  Installation
  Quick Start

After

Getting Started
  Introduction
  Installation
  Quick Start
```
