# Phase 08 — Documentation

**Project:** RumahKodingku Editor  
**Phase:** 08  
**Status:** Approved  
**Scope:** Public documentation, API reference, guides, examples, documentation accessibility, documentation testing, SEO, and AI-readable documentation  
**Primary documentation system:** Fumadocs  
**Primary validation:** TypeScript, build, Playwright, axe-core  
**Prerequisite:** Phase 07 — Browser & Accessibility

---

## 1. Phase Overview

Phase 08 establishes the production-quality public documentation for RumahKodingku Editor.

Fumadocs is the canonical public documentation and example home. Documentation must describe the actual public package API and behavior implemented by the repository.

The goal is not merely to create Markdown/MDX pages. Phase 08 covers the complete documentation experience:

```text
Documentation Site
├── Documentation Architecture
├── Content
├── API Reference
├── Guides
├── Examples
├── Accessibility
├── Search / Navigation
├── SEO / Metadata
├── LLM Documentation
├── Documentation Testing
└── Final Documentation Audit
```

Documentation must remain synchronized with:

```text
PRD.md
ARCHITECTURE.md
AGENTS.md
public package exports
Playground
browser tests
actual implementation
```

Documentation must not describe APIs or behaviors that do not exist.

---

## 2. Phase Goals

By the end of Phase 08:

- Fumadocs contains the canonical public documentation.
- Installation documentation is complete.
- Quick Start documentation is complete.
- Editor fundamentals are documented.
- Content and serialization behavior are documented.
- Formatting is documented.
- Link behavior is documented.
- Image and upload behavior is documented.
- Toolbar behavior is documented.
- Controlled and uncontrolled modes are documented.
- Read-only and disabled modes are documented.
- Extensions and customization are documented.
- Image upload architecture is documented.
- Theming is documented.
- SSR behavior is documented.
- Persistence and schema versioning are documented.
- Accessibility behavior is documented.
- Public API reference is documented.
- Practical examples are available.
- Examples use public package APIs.
- Documentation navigation and search are validated.
- Documentation metadata and SEO are validated.
- LLM-readable documentation endpoints are validated.
- Documentation accessibility findings are resolved.
- Documentation browser tests are implemented or updated.
- README and repository documentation are synchronized.
- Full project validation passes.

---

## 3. Non-Goals

The following are explicitly outside Phase 08:

- Changesets implementation;
- npm publishing;
- release automation;
- release/version coordination;
- npm release verification;
- new editor features;
- Markdown editor support;
- Vue adapter implementation;
- backend implementation;
- database implementation;
- authentication;
- new image storage providers;
- new upload infrastructure;
- AI editor features;
- major UI redesign;
- major mobile redesign.

Release engineering remains deferred to Phase 09.

---

## 4. Documentation Principles

### 4.1 Fumadocs is the Canonical Public Documentation

Public documentation and examples must live in the Fumadocs documentation application.

The Playground remains primarily an internal/manual validation environment.

### 4.2 Documentation Must Follow the Actual Public API

Documentation must be derived from:

```text
actual exports
actual types
actual implementation
actual tests
actual Playground behavior
```

Do not document internal APIs as public APIs.

### 4.3 Documentation Examples Must Use Public APIs

Examples must consume packages through public package exports:

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
```

Examples must not import implementation files directly from `packages/*/src/*`.

### 4.4 Documentation Is Part of the API

Public behavior, configuration, types, and supported usage must be documented clearly enough for developers to build against the package without reading internal implementation.

### 4.5 Documentation Must Be AI-readable

Documentation must be usable by:

- human developers;
- coding agents;
- documentation retrieval systems;
- LLM-based development assistants.

Use explicit terminology, accurate types, defaults, limitations, and clear distinction between public and internal APIs.

---

## 5. Recommended Documentation Information Architecture

```text
Documentation
│
├── Introduction
│   ├── Overview
│   ├── Installation
│   └── Quick Start
│
├── Fundamentals
│   ├── Editor
│   ├── Content
│   ├── JSON
│   └── HTML
│
├── Features
│   ├── Formatting
│   ├── Links
│   ├── Images
│   └── Toolbar
│
├── Guides
│   ├── Controlled Mode
│   ├── Uncontrolled Mode
│   ├── Read-only Mode
│   ├── Disabled Mode
│   ├── Custom Extensions
│   ├── Custom Toolbar
│   ├── Image Upload
│   ├── Theming
│   ├── SSR
│   ├── Persistence
│   └── Schema Versioning
│
├── Accessibility
│
├── API Reference
│   ├── React
│   ├── Core
│   ├── Components
│   ├── Hooks
│   ├── Types
│   ├── Extensions
│   ├── Toolbar
│   └── Upload
│
└── Examples
    ├── Basic Editor
    ├── Controlled Editor
    ├── Read-only Editor
    ├── Custom Toolbar
    ├── Custom Extension
    ├── Image Upload
    └── Theming
```

The final navigation may be adjusted to fit the existing Fumadocs structure while preserving clear discoverability.

---

## 6. Execution Order

```text
A. Documentation Baseline & Audit
↓
B. Documentation Cleanup
↓
C. Documentation Information Architecture
↓
D. Installation
↓
E. Quick Start
↓
F. Content
↓
G. Features
↓
H. State & Behavior Guides
↓
I. Extension & Customization
↓
J. Image Upload
↓
K. Theming
↓
L. SSR
↓
M. Accessibility
↓
N. API Reference
↓
O. Examples
↓
P. Executable Examples
↓
Q. Search / Navigation / UX
↓
R. SEO / Metadata
↓
S. LLM Documentation
↓
T. Documentation Testing
↓
U. Documentation Quality Audit
↓
V. Repository Documentation Synchronization
↓
W. Final Validation
```

---

# 7. Task List

# A — Documentation Baseline & Audit

## 08.01 — Audit Existing Documentation Infrastructure

Inspect:

- `apps/fumadocs`;
- MDX configuration;
- Fumadocs source loader;
- documentation routing;
- metadata generation;
- GitHub links;
- Markdown copy functionality;
- LLM routes;
- documentation image/OG routes;
- navigation configuration;
- global styling.

### Acceptance Criteria

- Existing documentation infrastructure is understood.
- No duplicate documentation infrastructure is introduced.
- Phase 08 uses the existing Fumadocs foundation.

### Dependencies

None.

### Verification

Inspect and build the Fumadocs application.

---

## 08.02 — Audit Public Package API

Audit actual public exports from:

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
```

Identify:

- components;
- hooks;
- types;
- utilities;
- extensions;
- toolbar APIs;
- upload APIs;
- content APIs;
- labels;
- public Tiptap types;
- CSS entry point.

### Acceptance Criteria

- API documentation only describes actual public exports.
- No speculative API is documented.
- Internal-only APIs are excluded.

### Dependencies

08.01.

### Verification

Compare documentation inventory against package index files and package exports.

---

## 08.03 — Audit Playground as Documentation Source

Inspect Playground scenarios for:

- basic editor;
- formatting;
- links;
- images;
- uploads;
- controlled mode;
- uncontrolled mode;
- read-only mode;
- disabled mode;
- custom extensions;
- theming;
- JSON/HTML output;
- accessibility behavior.

### Acceptance Criteria

Every documented feature has an implementation or example that can be verified from the repository.

### Dependencies

08.02.

### Verification

Cross-reference examples against Playground source.

---

## 08.04 — Audit Existing Repository Documentation

Audit:

```text
README.md
PRD.md
ARCHITECTURE.md
AGENTS.md
docs/adr/
docs/roadmap/
tests/browser/README.md
```

Identify:

- stale information;
- conflicting information;
- duplicated information;
- canonical source for each topic.

### Acceptance Criteria

A documentation source-of-truth map exists for Phase 08.

### Dependencies

08.01.

---

# B — Documentation Cleanup

## 08.05 — Update Stale Repository Status

Update stale Phase 05 references in:

```text
README.md
apps/fumadocs/content/docs/index.mdx
```

The repository status must reflect:

```text
Phase 07 — Browser & Accessibility
completed

Phase 08 — Documentation
current
```

### Acceptance Criteria

No public-facing documentation incorrectly claims that the project is still in Phase 05.

### Dependencies

08.04.

---

## 08.06 — Update Documentation Landing Page

Create a useful documentation introduction covering:

- what RumahKodingku Editor is;
- package ecosystem;
- supported framework;
- underlying editor engine;
- canonical content format;
- installation;
- Quick Start;
- API Reference;
- Guides;
- Examples.

### Acceptance Criteria

A new developer can understand the product and choose the next documentation page without reading repository source code.

### Dependencies

08.05, 08.08.

---

## 08.07 — Resolve Known Fumadocs Accessibility Findings

Address known documentation-site findings, including:

```text
color-contrast
document-title
svg-img-alt
```

### Acceptance Criteria

- Known severe/critical documentation accessibility issues are resolved.
- Rules are not disabled merely to hide findings.
- Editor accessibility and documentation-site accessibility remain separate concerns.

### Dependencies

08.01.

### Verification

Run the Fumadocs accessibility test.

---

# C — Documentation Information Architecture

## 08.08 — Define Final Documentation Navigation

Implement the approved documentation structure.

### Acceptance Criteria

- Major sections are discoverable.
- No important page is orphaned.
- Navigation hierarchy matches the product mental model.
- API reference is clearly separated from guides.
- Examples are easy to locate.

### Dependencies

08.02, 08.03, 08.04.

---

# D — Installation Documentation

## 08.09 — Document Package Installation

Document the actual package installation command, including the official package manager:

```bash
pnpm add @rumahkodingku/editor-react
```

Use the exact package/API contract present in the repository.

### Acceptance Criteria

A developer can install the package using the documented command.

### Dependencies

08.02.

---

## 08.10 — Document Peer Dependencies

Document actual peer dependencies, including:

- React;
- React DOM;
- Tiptap;
- supported runtime requirements where applicable.

### Acceptance Criteria

Peer dependency documentation matches package metadata.

---

## 08.11 — Document CSS Installation

Document the public CSS entry:

```ts
import "@rumahkodingku/editor-react/styles.css";
```

Explain when the CSS is required.

### Acceptance Criteria

A developer can render the editor with the intended package styles.

---

## 08.12 — Create Installation Verification Example

Create a minimal example covering:

```text
install
↓
import
↓
render
↓
styles
↓
working editor
```

### Acceptance Criteria

The example uses only public package APIs.

---

# E — Quick Start

## 08.13 — Create Quick Start

Create a minimal path:

```text
Install
↓
Import
↓
Render Editor
↓
Provide JSON
↓
Receive onChange
```

### Acceptance Criteria

A new developer can reach a working editor from a single documentation flow.

---

## 08.14 — Document Basic Editor

Document the minimal Editor usage and actual default behavior.

### Acceptance Criteria

The snippet is copyable and type-valid.

---

## 08.15 — Document Initial Content

Document the actual initial-content API, such as:

```tsx
<Editor defaultValue={content} />
```

only if it matches the public implementation.

### Acceptance Criteria

Initial content behavior is described accurately.

---

## 08.16 — Document onChange

Explain how consumers receive editor JSON content.

Emphasize:

```text
JSON = canonical content format
HTML = serialized output format
```

### Acceptance Criteria

The documentation does not incorrectly position HTML as the primary controlled value.

---

# F — Content Documentation

## 08.17 — Document JSON Content Model

Explain the Tiptap/ProseMirror JSON structure.

Example:

```json
{
  "type": "doc",
  "content": []
}
```

### Acceptance Criteria

The documentation accurately describes the canonical content representation.

---

## 08.18 — Document HTML Output

Explain HTML serialization/output and how it differs from the canonical JSON content model.

### Acceptance Criteria

The documentation clearly distinguishes content state from serialized output.

---

## 08.19 — Document Persistence Envelope

Document:

```json
{
  "schemaVersion": 1,
  "content": {}
}
```

### Acceptance Criteria

The persistence envelope matches the architecture contract.

---

## 08.20 — Document Schema Versioning

Explain:

- schema ownership;
- migration;
- compatibility;
- future schema changes;
- rationale for versioning.

### Acceptance Criteria

A developer understands how persisted editor content should be versioned.

---

# G — Feature Documentation

## 08.21 — Formatting Documentation

Document implemented formatting capabilities, including where supported:

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

### Acceptance Criteria

Only formatting features actually exposed by the current implementation are documented.

---

## 08.22 — Link Documentation

Document:

- create;
- edit;
- remove;
- safe URL behavior;
- Link dialog;
- keyboard behavior where relevant.

### Acceptance Criteria

Unsafe URL handling is accurately described without claiming unsupported security guarantees.

---

## 08.23 — Image Documentation

Document:

- image insertion;
- upload;
- alt text;
- progress;
- errors;
- validation;
- paste;
- drag-and-drop where supported.

### Acceptance Criteria

Image documentation matches the existing upload pipeline.

---

## 08.24 — Toolbar Documentation

Document:

- default toolbar;
- toolbar groups;
- toolbar buttons;
- active state;
- disabled state;
- keyboard navigation;
- custom toolbar behavior.

### Acceptance Criteria

Toolbar documentation matches actual public components and accessibility behavior.

---

# H — State & Behavior Guides

## 08.25 — Controlled Mode Guide

Document the actual controlled API, including:

```tsx
<Editor
  value={content}
  onChange={setContent}
/>
```

where supported.

Explain update behavior and parent-controlled state.

### Acceptance Criteria

Controlled behavior matches implementation and tests.

---

## 08.26 — Uncontrolled Mode Guide

Document:

```tsx
<Editor defaultValue={content} />
```

and the supported mechanism for accessing editor state/instance.

### Acceptance Criteria

The guide does not expose internal state APIs.

---

## 08.27 — Read-only Mode Guide

Explain read-only behavior, including:

- editing disabled;
- focus behavior;
- selection/copy behavior;
- toolbar behavior;
- accessibility semantics.

---

## 08.28 — Disabled Mode Guide

Document:

- focus;
- interaction;
- toolbar;
- accessibility semantics.

---

## 08.29 — Editable State Guide

Clearly explain the relationship between:

```text
editable
disabled
read-only
```

### Acceptance Criteria

Developers can select the correct state for their use case without confusing read-only and disabled semantics.

---

# I — Extension & Customization Guides

## 08.30 — Custom Extensions Guide

Document the public extension configuration API:

```tsx
<Editor extensions={[...]} />
```

using an actual compatible example.

---

## 08.31 — Extension Composition Guide

Explain the relationship between:

```text
default extensions
+
consumer extensions
```

### Acceptance Criteria

Documentation does not imply that internal extension implementation must be modified.

---

## 08.32 — Custom Toolbar Guide

Provide an example of creating a custom toolbar using public APIs.

### Acceptance Criteria

The example does not import private implementation modules.

---

## 08.33 — Labels Customization Guide

Document the public labels API where supported:

```tsx
<Editor
  labels={{
    ...
  }}
/>
```

### Acceptance Criteria

Only actual label keys are documented.

---

# J — Image Upload Guide

## 08.34 — Document Image Upload Architecture

Explain:

```text
Editor
  ↓
ImageUpload
  ↓
ImageUploadHandler
  ↓
Consumer storage/backend
```

### Acceptance Criteria

The documentation clearly explains dependency inversion.

---

## 08.35 — Implement Upload Example

Document the actual handler contract, including:

```ts
const upload = async ({
  file,
  signal,
  onProgress,
}) => {
  // consumer implementation
};
```

### Acceptance Criteria

Example matches the public type definitions.

---

## 08.36 — Document Upload Progress & Errors

Document:

- progress;
- cancellation;
- validation;
- errors;
- cleanup.

### Acceptance Criteria

Documentation does not promise behavior absent from the actual implementation.

---

## 08.37 — Document Storage-provider Agnosticism

Explain that the package does not require a specific provider such as:

- S3;
- Cloudinary;
- Supabase;
- Firebase;
- a specific backend.

### Acceptance Criteria

The documentation explains that storage implementation belongs to the consumer.

---

# K — Theming

## 08.38 — Theming Guide

Document the actual CSS variable contract, including existing `--rk-editor-*` variables where applicable.

---

## 08.39 — Light / Dark Theme

Document supported light/dark theming behavior and actual consumer customization points.

---

## 08.40 — Custom CSS Guide

Explain how consumers customize editor styling without making Tailwind a published-package requirement.

### Acceptance Criteria

Theming documentation reflects the framework-agnostic CSS architecture.

---

# L — SSR

## 08.41 — SSR Integration Guide

Document integration with SSR-capable React applications based on actual implementation behavior.

---

## 08.42 — immediatelyRender Guide

Document:

```tsx
<Editor immediatelyRender={false} />
```

where applicable.

Explain when this configuration is needed.

---

## 08.43 — Browser Boundary Guidance

Explain client/browser-only behavior and appropriate component boundaries.

### Acceptance Criteria

SSR guidance does not claim universal SSR behavior that has not been tested.

---

# M — Accessibility Documentation

## 08.44 — Accessibility Overview

Document accessibility as a first-class requirement.

Explain target behavior without claiming formal certification unless the project actually has such certification.

---

## 08.45 — Keyboard Navigation

Document:

- Tab;
- toolbar roving tabindex;
- ArrowLeft/ArrowRight;
- Home/End;
- Escape;
- editor keyboard interaction.

---

## 08.46 — Screen-reader-oriented Semantics

Document:

- accessible names;
- roles;
- states;
- dialogs;
- status;
- alerts.

Avoid claiming that documentation alone provides screen-reader certification.

---

## 08.47 — Read-only / Disabled Accessibility

Document the semantic difference between:

```text
aria-readonly
aria-disabled
```

and their corresponding behavior.

---

## 08.48 — Accessibility Testing Documentation

Document the actual validation strategy:

```text
axe-core
+
Playwright
+
real-browser testing
```

### Acceptance Criteria

Accessibility documentation matches the actual Phase 07 testing infrastructure.

---

# N — API Reference

## 08.49 — Core API Reference

Document public exports from:

```text
@rumahkodingku/editor-core
```

### Acceptance Criteria

Only public exports are documented.

---

## 08.50 — React API Reference

Document public exports from:

```text
@rumahkodingku/editor-react
```

---

## 08.51 — Editor Props Reference

Document all actual public Editor props, including where applicable:

```text
value
defaultValue
onChange
onReady
placeholder
editable
disabled
extensions
labels
immediatelyRender
className
```

For each prop document:

- type;
- default;
- behavior;
- constraints;
- relevant examples.

### Acceptance Criteria

Documentation matches the actual TypeScript API.

---

## 08.52 — Components Reference

Document public components exported by `editor-react`.

Internal components must not be presented as public API.

---

## 08.53 — Hooks Reference

Document only public hooks.

Internal hooks are excluded from the public API reference.

---

## 08.54 — Types Reference

Document public types for:

- content;
- upload;
- toolbar;
- labels;
- configuration;
- editor-related public contracts.

---

## 08.55 — Extension API Reference

Document public RumahKodingku extensions.

For each public extension, document:

- purpose;
- configuration;
- input;
- output/behavior;
- example.

---

## 08.56 — Toolbar API Reference

Document actual public toolbar APIs, including `ToolbarItemDefinition` where exported.

---

## 08.57 — Upload API Reference

Document:

```text
ImageUploadHandler
ImageUploadResult
```

and related public configuration.

### Acceptance Criteria

Upload API reference matches package type definitions.

---

# O — Examples

## 08.58 — Basic Editor Example

Create a minimal copyable example.

---

## 08.59 — Controlled Editor Example

Create a complete controlled state example.

---

## 08.60 — Uncontrolled Editor Example

Create an uncontrolled example.

---

## 08.61 — Read-only Editor Example

Create a read-only example.

---

## 08.62 — Disabled Editor Example

Create a disabled example.

---

## 08.63 — Custom Toolbar Example

Create an example using the public toolbar API.

---

## 08.64 — Custom Extension Example

Create an example injecting a custom extension.

---

## 08.65 — Image Upload Example

Create an example using a consumer-provided upload handler.

---

## 08.66 — Theming Example

Create an example showing CSS variable customization.

### Acceptance Criteria

Examples use public package APIs and match current implementation behavior.

---

# P — Executable / Live Examples

## 08.67 — Define Example Strategy

Classify examples as:

```text
static code example
```

or:

```text
interactive example
```

based on actual value to the developer.

### Acceptance Criteria

The documentation does not turn every code block into an unnecessary interactive application.

---

## 08.68 — Connect Examples to Actual Implementation

Examples must use:

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
```

rather than internal source imports.

---

## 08.69 — Prevent Documentation Example Drift

Where practical, connect example code to TypeScript/build/test validation.

### Acceptance Criteria

Documentation examples cannot silently diverge from the public API.

---

# Q — Search, Navigation & Documentation UX

## 08.70 — Documentation Navigation Validation

Verify every important documentation page is:

- reachable;
- correctly nested;
- represented in navigation where appropriate;
- not orphaned.

---

## 08.71 — Search Validation

Verify public documentation content is discoverable through the existing Fumadocs search system.

---

## 08.72 — Heading Hierarchy Validation

Verify heading structure:

```text
H1
 ├── H2
 │    └── H3
```

does not contain invalid hierarchy patterns.

---

## 08.73 — Copy Markdown Validation

Verify the existing Markdown-copy functionality produces correct content.

---

## 08.74 — GitHub Source Links

Verify source/edit links point to the correct repository paths after documentation files are created.

---

# R — SEO & Metadata

## 08.75 — Documentation Metadata

Every documentation page must have appropriate:

```yaml
title:
description:
```

---

## 08.76 — Open Graph Metadata

Validate:

- OG title;
- OG description;
- OG image;
- generated metadata.

---

## 08.77 — Site-level Metadata

Review:

- site title;
- site description;
- favicon;
- language;
- social metadata.

### Acceptance Criteria

Metadata accurately represents RumahKodingku Editor.

---

# S — LLM / AI Documentation

## 08.78 — Validate `/llms.txt`

Verify the endpoint provides useful AI-readable documentation.

### Acceptance Criteria

Content is generated from current documentation and does not contain stale Phase information.

---

## 08.79 — Validate `/llms-full.txt`

Verify the full documentation endpoint:

- exists;
- is valid;
- includes current pages;
- does not contain stale content.

---

## 08.80 — Validate Page-level LLM Markdown

Validate processed Markdown output for documentation pages.

---

## 08.81 — Define AI-readable Documentation Conventions

Documentation should:

- use explicit terminology;
- provide actual types;
- identify defaults;
- identify limitations;
- distinguish public/internal APIs;
- avoid ambiguous descriptions;
- use consistent package names.

### Acceptance Criteria

Documentation can be consumed reliably by coding agents without requiring source-code inference for basic usage.

---

# T — Documentation Testing

## 08.82 — Fumadocs Build Validation

Ensure the documentation application builds successfully.

### Acceptance Criteria

Production Fumadocs build completes successfully.

---

## 08.83 — Fumadocs Type Validation

Run:

```bash
pnpm run check-types:fumadocs
```

### Acceptance Criteria

No documentation type errors remain.

---

## 08.84 — Documentation Link Validation

Validate internal documentation links such as:

```text
/docs/...
```

### Acceptance Criteria

No broken internal documentation links remain.

---

## 08.85 — Documentation Browser Smoke Tests

Update or add Playwright coverage for:

- documentation homepage;
- docs landing page;
- Quick Start;
- API Reference;
- Guides;
- Examples;
- navigation.

---

## 08.86 — Documentation Accessibility Tests

Use axe-core to validate:

- docs landing;
- documentation pages;
- navigation;
- search;
- code examples;
- dialogs/popovers where applicable.

### Acceptance Criteria

No critical/serious accessibility violations remain.

---

## 08.87 — Cross-browser Documentation Validation

Run critical documentation flows against the browser matrix appropriate for the project.

### Acceptance Criteria

Documentation navigation and interactive elements remain usable across supported browsers.

---

# U — Documentation Quality Audit

## 08.88 — API Accuracy Audit

Compare:

```text
documentation
vs
actual public exports
```

### Acceptance Criteria

No phantom APIs exist in public documentation.

---

## 08.89 — Example Accuracy Audit

Compare:

```text
documentation examples
vs
actual implementation
```

### Acceptance Criteria

Examples compile or are otherwise validated through the agreed example strategy.

---

## 08.90 — Terminology Consistency Audit

Verify consistent use of:

```text
editor-core
editor-react
Tiptap
ProseMirror
JSON
HTML
controlled
uncontrolled
read-only
disabled
ImageUploadHandler
```

---

## 08.91 — Security Documentation Audit

Verify documentation accurately explains:

- user-generated content;
- safe URLs;
- image source validation;
- HTML rendering responsibility;
- XSS considerations.

### Acceptance Criteria

Documentation does not imply that the editor automatically makes arbitrary application HTML safe in every context.

---

## 08.92 — Accessibility Documentation Audit

Verify accessibility claims match actual implementation and Phase 07 test coverage.

### Acceptance Criteria

No unsupported accessibility certification or guarantee is claimed.

---

# V — Repository Documentation Synchronization

## 08.93 — Synchronize README

README remains high-level repository documentation and points developers toward Fumadocs for detailed public documentation.

---

## 08.94 — Synchronize Roadmap

Update roadmap status to reflect:

```text
Phase 07 — Complete
Phase 08 — Current / Complete
Phase 09 — Next
```

Only mark Phase 08 complete after all Definition of Done requirements pass.

---

## 08.95 — Synchronize Documentation References

Ensure the following do not contradict each other:

```text
README
PRD
ARCHITECTURE
AGENTS
Fumadocs
roadmap
browser testing documentation
```

### Acceptance Criteria

There is no contradictory current-state information across repository documentation.

---

# W — Final Validation

## 08.96 — Run Repository Checks

Run:

```bash
pnpm run check
pnpm run check-types
pnpm run test
pnpm run build
```

### Acceptance Criteria

All repository checks pass.

---

## 08.97 — Run Fumadocs Validation

Run documentation type checking and production build.

At minimum:

```bash
pnpm run check-types:fumadocs
```

plus the Fumadocs production build command defined by the repository.

---

## 08.98 — Run Documentation Browser Tests

Run:

- Playwright documentation tests;
- axe-core documentation accessibility tests.

---

## 08.99 — Verify Generated LLM Endpoints

Validate:

```text
/llms.txt
/llms-full.txt
/llms.mdx/docs/*
```

### Acceptance Criteria

Generated content reflects the current documentation tree.

---

## 08.100 — Final Documentation Audit

Final checklist:

```text
[ ] Installation
[ ] Quick Start
[ ] Content
[ ] JSON
[ ] HTML
[ ] Formatting
[ ] Links
[ ] Images
[ ] Toolbar
[ ] Controlled
[ ] Uncontrolled
[ ] Read-only
[ ] Disabled
[ ] Extensions
[ ] Custom Toolbar
[ ] Upload
[ ] Theming
[ ] SSR
[ ] Persistence
[ ] Schema Versioning
[ ] Accessibility
[ ] API Reference
[ ] Examples
[ ] Search
[ ] Navigation
[ ] SEO
[ ] LLM documentation
[ ] Documentation browser tests
[ ] Documentation accessibility tests
[ ] README synchronization
[ ] Roadmap synchronization
[ ] Repository checks
[ ] Fumadocs build
```

---

# 8. Documentation File Organization

The exact file names may follow existing Fumadocs conventions, but documentation should map conceptually to:

```text
apps/fumadocs/content/docs/
├── index.mdx
│
├── introduction/
│   ├── overview.mdx
│   ├── installation.mdx
│   └── quick-start.mdx
│
├── fundamentals/
│   ├── editor.mdx
│   ├── content.mdx
│   ├── json.mdx
│   └── html.mdx
│
├── features/
│   ├── formatting.mdx
│   ├── links.mdx
│   ├── images.mdx
│   └── toolbar.mdx
│
├── guides/
│   ├── controlled.mdx
│   ├── uncontrolled.mdx
│   ├── read-only.mdx
│   ├── disabled.mdx
│   ├── custom-extensions.mdx
│   ├── custom-toolbar.mdx
│   ├── image-upload.mdx
│   ├── theming.mdx
│   ├── ssr.mdx
│   ├── persistence.mdx
│   └── schema-versioning.mdx
│
├── accessibility/
│   └── overview.mdx
│
├── api/
│   ├── core.mdx
│   ├── react.mdx
│   ├── components.mdx
│   ├── hooks.mdx
│   ├── types.mdx
│   ├── extensions.mdx
│   ├── toolbar.mdx
│   └── upload.mdx
│
└── examples/
    ├── basic-editor.mdx
    ├── controlled-editor.mdx
    ├── read-only-editor.mdx
    ├── custom-toolbar.mdx
    ├── custom-extension.mdx
    ├── image-upload.mdx
    └── theming.mdx
```

This is a conceptual target. Do not create files solely to satisfy this example if the final Fumadocs information architecture can represent the same content more effectively.

---

# 9. Definition of Done

## Documentation Content

- [ ] Installation is documented.
- [ ] Quick Start is documented.
- [ ] Editor fundamentals are documented.
- [ ] JSON content model is documented.
- [ ] HTML serialization/output is documented.
- [ ] Formatting is documented.
- [ ] Links are documented.
- [ ] Images are documented.
- [ ] Toolbar is documented.
- [ ] Controlled mode is documented.
- [ ] Uncontrolled mode is documented.
- [ ] Read-only mode is documented.
- [ ] Disabled mode is documented.
- [ ] Extensions are documented.
- [ ] Custom toolbar is documented.
- [ ] Image upload is documented.
- [ ] Theming is documented.
- [ ] SSR is documented.
- [ ] Persistence is documented.
- [ ] Schema versioning is documented.
- [ ] Accessibility is documented.

## API Reference

- [ ] Core API is documented.
- [ ] React API is documented.
- [ ] Public components are documented.
- [ ] Public hooks are documented.
- [ ] Public types are documented.
- [ ] Public extensions are documented.
- [ ] Toolbar APIs are documented.
- [ ] Upload APIs are documented.
- [ ] No internal APIs are presented as public.

## Examples

- [ ] Basic editor example exists.
- [ ] Controlled example exists.
- [ ] Uncontrolled example exists.
- [ ] Read-only example exists.
- [ ] Disabled example exists.
- [ ] Custom toolbar example exists.
- [ ] Custom extension example exists.
- [ ] Image upload example exists.
- [ ] Theming example exists.
- [ ] Examples use public package APIs.
- [ ] Examples are validated against actual implementation.

## Documentation UX

- [ ] Navigation is complete.
- [ ] No important page is orphaned.
- [ ] Search works.
- [ ] Heading hierarchy is valid.
- [ ] Markdown copy works.
- [ ] GitHub source links work.

## Accessibility

- [ ] Known Fumadocs accessibility findings are resolved.
- [ ] No critical axe violations remain.
- [ ] No serious axe violations remain.
- [ ] Keyboard navigation works.
- [ ] Documentation dialogs/popovers are accessible.
- [ ] Documentation semantics are correct.

## SEO / Metadata

- [ ] Page titles are correct.
- [ ] Page descriptions are correct.
- [ ] Open Graph metadata is correct.
- [ ] Site metadata is correct.
- [ ] Favicon/site identity is correct.

## AI / LLM Documentation

- [ ] `/llms.txt` works.
- [ ] `/llms-full.txt` works.
- [ ] Page-level LLM Markdown works.
- [ ] Generated content is current.
- [ ] Documentation uses explicit AI-readable terminology.
- [ ] Public/internal API boundaries are clear.

## Testing

- [ ] Fumadocs type check passes.
- [ ] Fumadocs production build passes.
- [ ] Documentation link validation passes.
- [ ] Documentation Playwright tests pass.
- [ ] Documentation axe-core tests pass.
- [ ] Cross-browser critical flows pass.
- [ ] Repository check passes.
- [ ] Repository type check passes.
- [ ] Unit/component tests pass.
- [ ] Repository build passes.

## Repository Synchronization

- [ ] README is synchronized.
- [ ] Roadmap is synchronized.
- [ ] PRD references are consistent.
- [ ] Architecture references are consistent.
- [ ] AGENTS references are consistent.
- [ ] Browser testing documentation is consistent.
- [ ] No stale Phase 05 status remains.

---

# 10. Phase Boundary

The final output of Phase 08 is:

```text
A production-quality public documentation system
+
complete developer documentation
+
accurate API reference
+
verified examples
+
accessible documentation site
+
AI-readable documentation
+
automated documentation validation
```

Phase 08 does **not** release packages to npm.

The next release-engineering scope remains:

```text
Phase 09
│
├── Changesets
├── Independent package versioning
├── Release workflow
├── npm publishing
├── Package verification
└── Release automation
```

Phase 09 must be planned and approved separately.

---

# 11. Phase 08 Completion Statement

When all Definition of Done requirements pass, the repository should be able to present RumahKodingku Editor as a developer-facing software package with:

```text
Implementation
      +
Tests
      +
Browser Validation
      +
Accessibility
      +
Documentation
      +
API Reference
      +
Examples
      +
AI-readable Documentation
```

At that point the project can proceed to release engineering without requiring the documentation architecture to be rebuilt.
