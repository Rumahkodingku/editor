# RumahKodingku Editor — Product Requirements Document

> **Status:** Approved for implementation  
> **Version:** 1.0  
> **Last Updated:** 2026-09-30  
> **Applies to:** `Rumahkodingku/editor`  
> **Product:** RumahKodingku Editor  
> **License:** MIT  
> **Package Manager:** pnpm  
> **Repository:** `Rumahkodingku/editor`

## 1. Product Overview

RumahKodingku Editor is a reusable, typed, composable WYSIWYG rich-text editor ecosystem for modern web applications.

The product is a TypeScript monorepo built around Tiptap and ProseMirror. React is the first supported UI framework. The editor core remains framework-independent so additional adapters, including Vue, can be introduced later without duplicating editor logic.

Primary packages:

- `@rumahkodingku/editor-core`
- `@rumahkodingku/editor-react`
- `@rumahkodingku/editor-vue` — future

## 2. Problem Statement

Building a rich-text editor repeatedly across applications creates duplicated work around editor initialization, document state, formatting, extensions, controlled/uncontrolled behavior, serialization, image uploads, toolbar behavior, accessibility, theming, SSR compatibility, testing, and package distribution.

Application teams should be able to install a reusable editor package instead of rebuilding these concerns for every project.

The product must therefore provide a small, predictable public API while preserving enough extensibility for advanced consumers.

## 3. Product Vision

Create a production-minded rich-text editor package that is reusable, strongly typed, composable, extensible, accessible, SSR-aware, storage-provider agnostic, easy for developers and AI agents to understand, and suitable for modern TypeScript monorepos.

## 4. Goals

### 4.1 Primary Goals

1. Provide a reusable WYSIWYG editor for modern web applications.
2. Build a framework-independent `editor-core`.
3. Provide a React adapter as the first UI integration.
4. Use Tiptap + ProseMirror as the editor engine.
5. Keep the public API small and typed.
6. Use JSON as the canonical editor content format.
7. Support HTML as an output format.
8. Provide extension-based customization.
9. Provide framework-agnostic upload contracts.
10. Provide framework-agnostic toolbar definitions.
11. Support controlled and uncontrolled React usage.
12. Support editable, read-only, and disabled states.
13. Provide framework-agnostic CSS and CSS variables.
14. Support SSR-safe integration.
15. Provide automated testing and browser validation.
16. Provide public documentation through Fumadocs.
17. Publish independently versioned npm packages.
18. Keep the package ecosystem free from application-specific backend and storage dependencies.

### 4.2 Developer Experience Goals

A basic React integration should require minimal setup:

```tsx
import { Editor } from "@rumahkodingku/editor-react";

<Editor
  defaultValue={{
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hello world" }],
      },
    ],
  }}
/>;
```

Advanced consumers should be able to provide extensions and upload handlers without modifying library source.

## 5. Non-Goals

The following are outside the MVP:

- real-time collaboration;
- multiplayer editing;
- Markdown import/export;
- hosted storage;
- hosted backend;
- authentication;
- database persistence;
- application-specific API clients;
- application-specific state management;
- mandatory Tailwind CSS;
- mandatory UI component libraries;
- mandatory icon libraries;
- Vue adapter implementation;
- AI writing features;
- comments;
- document version history;
- tracked changes;
- enterprise collaboration features.

These may be considered later but must not shape the MVP architecture.

## 6. Target Users

### 6.1 Primary Users

**Application developers** building CMS applications, admin panels, SaaS products, blog systems, documentation systems, content management workflows, and internal tools.

**RumahKodingku projects** that require reusable rich-text editing.

### 6.2 Secondary Users

External TypeScript/React developers who need a configurable editor without adopting a large application framework.

### 6.3 Developer Personas

- **Basic Consumer:** needs a working editor quickly and uses defaults.
- **Advanced Consumer:** needs custom extensions, toolbar composition, upload handling, or theming.
- **Library Maintainer:** needs stable package boundaries, predictable builds, strong tests, and controlled API evolution.
- **AI Coding Agent:** needs explicit repository rules, architecture constraints, skills, acceptance criteria, and deterministic verification commands.

## 7. User Stories

### Basic Editing

- As a developer, I want to render an editor with minimal configuration.
- As a user, I want to type and edit rich text.
- As a user, I want common formatting controls.
- As a user, I want keyboard shortcuts for supported formatting.

### Content

- As a developer, I want to receive editor content as JSON.
- As a developer, I want to obtain HTML output from the editor.
- As a developer, I want persisted content to remain associated with a schema version.
- As a developer, I want to load existing JSON content into the editor.

### State

- As a developer, I want controlled editor state.
- As a developer, I want uncontrolled editor state.
- As a developer, I want document changes delivered through `onChange`.
- As a developer, I want read-only content without allowing edits.
- As a developer, I want a disabled editor that cannot receive interaction.

### Customization

- As a developer, I want to add Tiptap extensions.
- As a developer, I want to compose a custom toolbar.
- As a developer, I want to customize labels.
- As a developer, I want to customize editor styling using CSS variables.

### Images

- As a developer, I want to provide my own image upload implementation.
- As a user, I want to paste an image.
- As a user, I want to drag and drop an image.
- As a user, I want upload progress feedback.
- As a developer, I want upload failures reported without coupling the editor to a storage provider.

### Integration

- As a developer, I want the editor to work in SSR-capable applications.
- As a developer, I want package imports to be safe in SSR environments.
- As a developer, I want published packages to provide TypeScript declarations.
- As a developer, I want clean npm package installation.

## 8. Product Scope

The product is divided into layers:

```text
Application
    ↓
React Adapter
    ↓
Editor Core
    ↓
Tiptap / ProseMirror
```

The public product includes:

1. Core editor package.
2. React adapter.
3. Default extension preset.
4. Editor content utilities.
5. Toolbar definitions.
6. Image upload abstraction.
7. CSS/theme foundation.
8. Documentation.
9. Test infrastructure.
10. Release infrastructure.

## 9. Package Ecosystem

### 9.1 `@rumahkodingku/editor-core`

Framework-independent editor logic:

- editor configuration and creation helpers;
- default extensions;
- RumahKodingku extensions;
- content utilities;
- schema versioning utilities;
- upload interfaces;
- toolbar definitions;
- shared public types;
- framework-independent utilities.

It must not import React, React DOM, Vue, Next.js, Tailwind CSS, or application-specific modules.

### 9.2 `@rumahkodingku/editor-react`

React integration:

- `Editor` component;
- React lifecycle integration;
- controlled/uncontrolled behavior;
- React hooks where required;
- default toolbar rendering;
- published stylesheet;
- React-specific integration.

It depends on `editor-core` and must not duplicate core editor logic.

### 9.3 `@rumahkodingku/editor-vue`

Future package. It must depend on `editor-core`, not `editor-react`, and use Vue peer dependencies. It begins only after core API stabilization.

## 10. Technology Requirements

### 10.1 Required Technologies

- TypeScript;
- pnpm;
- Turborepo;
- Biome;
- Tiptap 3.x;
- ProseMirror through Tiptap;
- tsdown;
- Vitest;
- React Testing Library;
- Playwright;
- axe-core;
- Changesets;
- Fumadocs.

### 10.2 Framework

React 19.x is the initial supported UI framework. Supported React peer range: `^19`.

### 10.3 Runtime

Published packages target Node `>=22`. Build and CI should use Node 22.18+.

### 10.4 Package Format

Published packages are ESM-first and provide ESM JavaScript, TypeScript declarations, explicit package exports, and correct package metadata. CommonJS is added only for a concrete compatibility requirement.

## 11. Editor Engine

Tiptap + ProseMirror is the editor engine. The product must not reimplement document state, transactions, selections, schema, history, input rules, or the extension system.

Tiptap is part of the public API because the public API exposes `JSONContent`, `Editor`, and `AnyExtension`. The supported major version is Tiptap 3.x.

Tiptap packages used or exposed by published packages are peer dependencies according to the architecture contract. The dependency graph must be checked to prevent incompatible duplicate Tiptap/ProseMirror installations.

## 12. Functional Requirements

### 12.1 Editor Initialization

Support default configuration, custom extensions, initial JSON content, placeholder, editable state, disabled state, labels, and SSR-related rendering options.

### 12.2 Basic Text Editing

The MVP supports paragraphs, text insertion/deletion, selection, cursor movement, undo, redo, and common keyboard interactions.

### 12.3 Text Formatting

The MVP should support bold, italic, underline, headings, ordered lists, unordered lists, blockquote, code, and horizontal rule.

### 12.4 Links

Support inserting, editing, and removing links, with safe URL handling.

### 12.5 Images

Support an image extension with upload abstraction, insertion, alt text, optional dimensions, paste, drag/drop, progress, and failure handling. Storage is outside the package.

### 12.6 Placeholder

Support configurable placeholder text. Placeholder text must not become document content.

### 12.7 Read-only

Read-only mode prevents document mutation, permits focus/selection where appropriate, exposes correct ARIA semantics, and hides or disables active editing controls.

### 12.8 Disabled

Disabled mode prevents editing and interaction as appropriate, disables toolbar controls, and exposes correct ARIA semantics.

### 12.9 Controlled Mode

Support:

```tsx
<Editor value={content} onChange={setContent} />
```

Requirements:

- `onChange` fires at most once for each document-changing transaction;
- updates originating from `value` do not create an `onChange` loop;
- equivalent incoming content does not unnecessarily reset the editor;
- cursor/selection should be preserved where possible;
- unrelated React renders must not serialize the document unnecessarily.

### 12.10 Uncontrolled Mode

Support:

```tsx
<Editor defaultValue={content} />
```

The editor owns ongoing document state. Consumers can obtain the Tiptap editor instance through the supported API.

## 13. Public API Requirements

The intended React API is:

```ts
import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";

type EditorProps = {
  value?: JSONContent;
  defaultValue?: JSONContent;
  onChange?: (content: JSONContent) => void;
  onReady?: (editor: Editor) => void;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  extensions?: AnyExtension[];
  labels?: Partial<EditorLabels>;
  immediatelyRender?: boolean;
  className?: string;
};
```

Defaults: `editable: true`, `disabled: false`.

The public API must remain small. Advanced behavior should be provided through extensions and composable APIs rather than a continuously growing set of boolean props.

Any public API change requires updated types, tests, documentation, a Changeset, and review under the architecture change-control process.

## 14. Content Model

### 14.1 Canonical Format

JSON is the canonical content format.

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Hello world"
        }
      ]
    }
  ]
}
```

### 14.2 HTML

HTML is an output format. The MVP does not accept HTML as controlled `value`. Consumers can use Tiptap HTML serialization through the editor instance/output helpers.

### 14.3 Persistence Envelope

Persisted content should use:

```json
{
  "schemaVersion": 1,
  "content": {
    "type": "doc",
    "content": []
  }
}
```

The schema version is owned by the persistence boundary rather than the editor component itself.

### 14.4 Schema Evolution

Future schema changes must be explicitly versioned, provide migration logic when necessary, avoid silently corrupting persisted content, and document migration requirements.

## 15. Extension System

The editor supports:

1. Tiptap engine extensions.
2. RumahKodingku extensions.
3. Consumer-provided extensions.

The default extension preset should be exposed through a composable API such as `createDefaultExtensions(options)`.

Each RumahKodingku extension should be a named export so unused functionality can be tree-shaken. Extensions should be stable between React renders. Feature behavior should be implemented through extensions rather than large conditional branches in core.

## 16. Toolbar Requirements

The toolbar model is framework-independent:

```ts
type ToolbarItemDefinition = {
  id: string;
  labelKey: keyof EditorLabels;
  icon: string;
  shortcut?: string;
  isActive: (editor: Editor) => boolean;
  isDisabled: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
};
```

The React adapter renders toolbar definitions. Consumers should be able to use the default toolbar, compose their own toolbar, hide controls, and add consumer-specific controls.

Icons should be inline SVG. Published packages must not require an icon library.

Potential components include `Editor`, `EditorContent`, `EditorToolbar`, `ToolbarButton`, `ToolbarGroup`, `BubbleMenu`, `FloatingMenu`, `LinkDialog`, and `ImageDialog`. Not every candidate component is required for the first release.

## 17. Image Upload Requirements

Image uploading is dependency-inverted.

```ts
export type ImageUploadResult = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ImageUploadHandler = (ctx: {
  file: File;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
}) => Promise<ImageUploadResult>;
```

Configuration:

```ts
ImageUpload.configure({
  upload,
  accept,
  maxSize,
  onError,
});
```

Requirements:

- one upload pipeline for toolbar, paste, and drag/drop;
- cancellation support;
- progress reporting;
- file type validation;
- file size validation;
- failure handling;
- safe source URL validation;
- placeholder while uploading;
- cleanup on failure.

The package must not depend on S3, Cloudinary, Supabase, Firebase, a specific backend, or a specific HTTP client.

## 18. Styling and Theming

Published packages use framework-agnostic CSS. Tailwind is optional for applications but must not be a required dependency of published packages.

CSS variables use `--rk-editor-*`. CSS classes use `rk-*`.

The React package owns the published editor stylesheet. The core package ships no UI stylesheet.

Theme requirements:

- light theme;
- dark theme;
- consumer overrides;
- CSS variable customization;
- system preference defaults.

The implementation may use `[data-theme="dark"]` and `prefers-color-scheme`.

## 19. Accessibility

Accessibility is a product requirement.

Requirements include semantic editor structure, correct ARIA state, keyboard-accessible toolbar controls, visible focus states, logical tab order, accessible labels, accessible dialogs, read-only semantics, disabled semantics, accessible link controls, accessible image metadata, no keyboard trap, and reasonable screen-reader behavior.

Automated accessibility testing should use axe-core. Keyboard and interaction behavior must also be verified in a real browser.

## 20. SSR and Runtime Requirements

The editor must be compatible with SSR-capable React applications.

Requirements:

- imports must not execute browser-only globals at module initialization;
- React adapter must be compatible with client component boundaries;
- consumers can disable immediate browser rendering when required for SSR;
- `immediatelyRender={false}` is supported where required by Tiptap integration;
- browser-dependent behavior is isolated from import-time execution.

The core is framework-independent but not DOM-free. Tiptap editor creation requires a browser/DOM-capable runtime.

## 21. Security Requirements

The editor must treat user-generated content as untrusted.

Requirements:

- safe link handling;
- safe image source validation;
- no unsafe storage provider assumptions;
- no direct HTML injection API in the MVP component;
- safe rendering guidance in documentation;
- dependency security review;
- XSS-focused tests for relevant serialization and URL handling.

The library should not claim to make arbitrary HTML safe merely by serializing editor content. Consumers remain responsible for safely rendering content in application-specific contexts.

## 22. Performance Requirements

The editor should avoid unnecessary editor recreation and document serialization.

Requirements:

- editor instance is not recreated on ordinary React renders;
- extension arrays remain stable;
- controlled mode avoids unnecessary `setContent`;
- serialization occurs only when required;
- toolbar state updates based on editor events rather than unrelated renders;
- packages remain reasonably tree-shakeable.

Performance budgets should be measured before release. Bundle-size limits should be introduced through `size-limit` during release preparation.

## 23. Testing Requirements

Testing is part of implementation, not only a final phase.

### 23.1 Unit Tests

Vitest covers editor configuration, default extensions, content utilities, serialization helpers, toolbar definitions, upload contracts, and utility behavior.

### 23.2 React Tests

React Testing Library covers mounting, controlled mode, uncontrolled mode, `onChange`, `onReady`, editable/read-only/disabled states, placeholder, extension injection, and toolbar interaction.

### 23.3 Type Tests

Type tests verify public API types, expected accepted props, expected exports, and useful invalid API cases.

### 23.4 Browser Tests

Playwright covers behavior not reliably modeled in jsdom, including cursor behavior, selection, keyboard interaction, paste, drag/drop, toolbar interaction, SSR/application integration, and visual/manual validation scenarios.

### 23.5 Accessibility Tests

axe-core is integrated into browser testing for relevant editor states.

### 23.6 Package Tests

Before publishing: package build, declaration generation, package metadata, clean consumer installation, tarball installation, runtime import, and type import must be verified.

## 24. Documentation Requirements

Fumadocs is the canonical public documentation system.

Documentation must include:

### Installation

- package installation;
- peer dependencies;
- Tiptap installation requirements;
- CSS import.

### Quick Start

- basic React editor;
- initial JSON content;
- `onChange`.

### API Reference

- Editor props;
- exported types;
- core utilities;
- extension APIs;
- toolbar APIs;
- upload APIs.

### Guides

- controlled mode;
- uncontrolled mode;
- read-only mode;
- disabled mode;
- custom extensions;
- custom toolbar;
- image upload;
- theming;
- SSR;
- persistence;
- schema versioning.

### Examples

Examples should be executable where appropriate. Fumadocs is the canonical public home for examples and live demos. The playground is primarily for internal/manual/visual validation.

## 25. Developer Experience

The repository must be understandable by humans and AI agents.

Required guidance:

- `ARCHITECTURE.md`;
- `AGENTS.md`;
- `PRD.md`;
- ADRs for significant architectural changes.

AI agents must read the architecture, read the PRD, inspect the actual repository, identify affected packages, use repository skills when relevant, preserve package boundaries, avoid speculative abstractions, and run verification commands after changes.

Repo-local skills currently include Tiptap integration, web application testing, code review, writing plans, and executing plans. Agents must prefer repository skill instructions over invented framework/library APIs.

## 26. Repository Development Workflow

### Package Manager

pnpm is the official package manager (`pnpm@10.34.5`). Bun is not required by the product. `bunfig.toml` is scaffold metadata and should be removed if no remaining dependency requires it.

### Formatting and Linting

Biome is the repository formatter/linter. Do not add ESLint or Prettier unless an explicit architecture decision changes this rule.

### Git Hooks

Husky is used for repository hooks. Commit messages use Conventional Commits.

### Verification

Normal verification sequence:

```bash
pnpm run check
pnpm run check-types
pnpm run test
pnpm run build
```

The current repository may not have all commands available until their implementation phase is complete.

For Fumadocs:

```bash
pnpm --filter fumadocs run types:check
```

must be used because its script is named `types:check`.

## 27. Build and Packaging Requirements

Published packages must use ESM, expose explicit exports, provide `.d.ts`, declare runtime engines, correctly declare peer dependencies, avoid bundling peer dependencies, include only required package files, avoid application-specific dependencies, and pass package metadata validation.

Library bundling uses tsdown. Development builds should support `tsdown --watch`.

Applications should consume package entry points rather than reaching into package source internals.

## 28. Versioning and Release

Changesets is the release/versioning mechanism. Packages use independent versions.

A change affecting a public package should include a Changeset when appropriate. Changesets must correctly account for workspace package dependency changes.

Before first publication:

1. validate package metadata;
2. run publint;
3. run `@arethetypeswrong/cli`;
4. build packages;
5. create/install tarballs;
6. verify a clean consumer project;
7. establish bundle-size budgets;
8. verify npm scope/package availability;
9. run a Changesets dry run.

## 29. MVP Feature Definition

### Core

- Tiptap 3.x;
- editor creation;
- default extensions;
- content utilities;
- JSON canonical content;
- HTML output;
- schema versioning support;
- toolbar definitions;
- image upload contracts.

### React

- `Editor`;
- controlled mode;
- uncontrolled mode;
- `onChange`;
- `onReady`;
- editable;
- read-only;
- disabled;
- placeholder;
- custom extensions;
- labels;
- SSR-safe integration.

### Formatting

- paragraph;
- headings;
- bold;
- italic;
- underline;
- ordered list;
- unordered list;
- blockquote;
- code;
- horizontal rule.

### Links

- create;
- edit;
- remove;
- safe URL handling.

### Images

- image insertion;
- upload abstraction;
- paste;
- drag/drop;
- progress;
- errors;
- alt text.

### UI

- toolbar;
- CSS variables;
- dark mode;
- focus states;
- accessibility.

### Quality

- unit tests;
- React tests;
- type tests;
- browser tests;
- accessibility tests;
- package validation.

## 30. Explicitly Deferred Features

Do not implement these as MVP unless scope is formally changed:

- Vue adapter;
- real-time collaboration;
- Yjs integration;
- comments;
- tracked changes;
- document history;
- Markdown import/export;
- slash commands;
- mentions;
- tables;
- AI writing;
- AI autocomplete;
- document templates;
- advanced floating menus;
- advanced drag-and-drop block manipulation;
- cloud storage integrations;
- authentication;
- backend APIs.

A deferred feature must not introduce unnecessary dependencies or architecture into the MVP.

## 31. Implementation Milestones

### Phase 0 — Repository Foundation & Agent Readiness

Complete Better-T-Stack, pnpm, Turborepo, Biome, Husky, Commitlint, Fumadocs, `ARCHITECTURE.md`, `AGENTS.md`, repo-local skills, and `PRD.md`.

Remaining cleanup:

- synchronize README;
- remove obsolete scaffold configuration;
- verify package scripts;
- verify Node/pnpm baseline;
- remove `bunfig.toml` if unused.

### Phase 1 — Build & Package Infrastructure

- install Tiptap 3;
- configure tsdown;
- establish package conventions;
- establish exports;
- establish ESM;
- establish declarations;
- establish package metadata;
- create package scaffolding.

### Phase 2 — Test Infrastructure

- Vitest;
- React Testing Library;
- type tests;
- test conventions;
- package smoke tests.

### Phase 3 — Editor Core

- `editor-core`;
- editor creation;
- default extensions;
- public types;
- content utilities;
- schema versioning;
- toolbar definitions;
- upload contracts.

### Phase 4 — React Adapter

- `editor-react`;
- React editor component;
- controlled/uncontrolled behavior;
- lifecycle integration;
- SSR;
- CSS;
- themes.

### Phase 5 — Playground

- Vite + React;
- basic editor;
- JSON/HTML output;
- read-only;
- disabled;
- controlled mode;
- extension experiments;
- upload experiments.

### Phase 6 — Editor MVP

- toolbar;
- formatting;
- links;
- placeholder;
- images;
- paste;
- drag/drop;
- keyboard shortcuts.

### Phase 7 — Browser and Accessibility Validation

- Playwright;
- real-browser tests;
- selection;
- keyboard;
- paste/drop;
- SSR;
- axe-core;
- accessibility.

### Phase 8 — Documentation

- Fumadocs integration;
- installation;
- quick start;
- API reference;
- guides;
- examples;
- SSR;
- theming;
- uploads.

### Phase 9 — Release Engineering

- Changesets;
- package validation;
- tarball testing;
- bundle size;
- npm verification;
- dry run;
- first release.

## 32. Definition of Done

A feature is complete only when applicable requirements are satisfied.

### Code

- implementation follows architecture;
- package boundaries are preserved;
- no unnecessary dependencies;
- public API is typed.

### Tests

- relevant unit tests exist;
- relevant React tests exist;
- browser tests exist where jsdom is insufficient;
- accessibility tests exist where applicable.

### Documentation

- public API is documented;
- examples are updated;
- architecture changes are documented;
- ADR exists when required.

### Release

- Changeset exists for public package changes;
- package builds successfully;
- declarations are generated;
- metadata is valid.

### Verification

At minimum, relevant checks must pass:

```bash
pnpm run check
pnpm run check-types
pnpm run test
pnpm run build
```

Failures must be reported rather than ignored.

## 33. Success Criteria

The MVP is successful when:

1. A React developer can install the package and render an editor with minimal configuration.
2. JSON content can be loaded and emitted reliably.
3. HTML can be generated as output.
4. Controlled and uncontrolled modes work predictably.
5. Read-only and disabled states behave distinctly.
6. Custom Tiptap extensions can be supplied.
7. Image uploads can be integrated without a specific storage provider.
8. Consumers can customize the toolbar.
9. Consumers can theme the editor without Tailwind.
10. SSR-capable React applications can integrate the package safely.
11. Accessibility requirements are covered by automated and browser validation.
12. Packages can be installed cleanly from npm/tarballs.
13. The public API is documented.
14. AI agents can implement features without violating package boundaries.
15. The package ecosystem is maintainable as future adapters and extensions are added.

## 34. Architectural Alignment

This PRD must remain consistent with `ARCHITECTURE.md v1.0` and `AGENTS.md`.

The documents serve different purposes:

- **PRD:** what and why;
- **Architecture:** how and architectural constraints;
- **AGENTS:** operational rules for contributors and AI agents.

Resolved architectural decisions in `ARCHITECTURE.md §26.1` remain binding.

If a product requirement conflicts with a resolved architectural decision, implementation must not silently override the architecture. The conflict must be explicitly reviewed and resolved.

## 35. Change Management

Product requirements may evolve.

Changes to MVP scope should:

1. identify the affected requirement;
2. explain the reason;
3. identify affected packages;
4. identify architectural impact;
5. update this PRD;
6. update `ARCHITECTURE.md` when architectural decisions change;
7. update tests and documentation.

Architectural decisions marked Decided in `ARCHITECTURE.md` require the architecture change-control process.

## 36. Final Product Principles

1. **Small API over large API.**
2. **Composition over configuration explosion.**
3. **Extensions over conditional feature branches.**
4. **Tiptap/ProseMirror owns document state.**
5. **Framework adapters remain thin.**
6. **Storage and infrastructure remain consumer-controlled.**
7. **JSON is the canonical editor value.**
8. **HTML is an output format in the MVP.**
9. **Accessibility is part of the product.**
10. **Documentation is part of the API.**
11. **Tests are part of implementation.**
12. **Package quality matters as much as editor features.**
13. **No premature abstraction.**
14. **AI agents must follow repository contracts rather than inventing architecture.**
15. **The editor should remain useful without forcing an application stack on the consumer.**

## 37. PRD Approval

This PRD establishes the product requirements for the implementation roadmap.

Before entering Phase 1, the repository should contain:

- `ARCHITECTURE.md`;
- `AGENTS.md`;
- `PRD.md`.

Phase 1 may begin after Phase 0 repository cleanup and verification are complete.

**Status:** Approved for implementation.
