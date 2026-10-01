# Phase 03 — Editor Core

> **Status:** Approved  
> **Package:** `@rumahkodingku/editor-core`  
> **Phase:** 03  
> **Primary goal:** Build the framework-independent public contract and core implementation of RumahKodingku Editor on top of Tiptap + ProseMirror.

---

## 1. Objective

Phase 03 is responsible for turning `@rumahkodingku/editor-core` from a package skeleton into the actual framework-independent editor core.

The phase establishes the core API consumed by future adapters, especially `@rumahkodingku/editor-react`.

The implementation must remain:

- framework-independent;
- ESM-first;
- based on Tiptap + ProseMirror;
- JSON-first for canonical editor content;
- composable and tree-shakeable;
- free from application-specific runtime dependencies;
- free from React/Vue/UI-framework dependencies;
- compatible with the package architecture defined in `ARCHITECTURE.md`.

The objective is to establish the **core editor contract**, not to build the React UI.

---

## 2. Current Codebase State

Before Phase 03:

- `packages/editor-core` exists as a package skeleton.
- `@rumahkodingku/editor-core` is already configured as an ESM package.
- Tiptap core/PM dependencies are already declared.
- `tsdown` is configured for package builds.
- Vitest infrastructure exists.
- Package validation infrastructure exists.
- `editor-core/src/index.ts` currently contains only the Phase 01/02 placeholder export.
- `editor-react` exists as a skeleton and must consume the core API later.
- Browser smoke/accessibility infrastructure exists, but the full editor browser experience is outside this phase.
- Changesets/release infrastructure is intentionally deferred to Phase 09.

---

## 3. Scope

Phase 03 includes:

1. Core public types.
2. Editor configuration.
3. Editor creation helpers.
4. Default extension preset.
5. RumahKodingku extension layer.
6. Extension composition.
7. Content utilities.
8. Serialization utilities.
9. Persistence schema versioning.
10. Image upload contracts.
11. Image extension behavior that belongs in the core.
12. Toolbar definition model.
13. Editor labels.
14. Public export surface.
15. Unit/integration/type tests.
16. Package build and consumer verification.
17. Documentation/architecture synchronization.
18. Final phase verification.

---

## 4. Explicitly Out of Scope

The following must **not** be implemented in Phase 03:

- React `<Editor />` component.
- React hooks.
- React controlled/uncontrolled state API.
- React toolbar UI.
- React-specific event handling.
- React CSS/UI styling.
- Vue adapter.
- Playground implementation.
- Full visual editor/browser interaction suite.
- Full UI accessibility implementation.
- Collaboration/multiplayer editing.
- Markdown support.
- Backend/storage implementation.
- S3/Cloudinary/Supabase provider dependencies.
- Authentication/authorization.
- Application-specific API calls.
- Global Zustand/Redux editor document state.
- Changesets/release automation.
- npm publishing workflow.

Controlled/uncontrolled behavior belongs to the React adapter in Phase 04.

---

# 5. Architecture Constraints

All implementation in this phase must follow these rules.

## 5.1 Tiptap is the editor engine

Do not reimplement:

- document state;
- transactions;
- selections;
- schema;
- history;
- input rules;
- extension mechanisms.

Tiptap + ProseMirror remain the source of truth for editor state.

## 5.2 Framework independence

`editor-core` must not import:

- React;
- React DOM;
- Vue;
- Next.js;
- Tailwind CSS;
- application modules.

The package must expose framework-independent APIs.

## 5.3 No global editor state

Do not use Zustand, Redux, Redux Toolkit, or another global state library as the primary editor document state.

Each editor instance owns its own Tiptap state.

## 5.4 JSON is canonical

Tiptap/ProseMirror JSON is the canonical content representation.

HTML is an output/serialization format, not the canonical input model for the MVP.

## 5.5 Small public API

Only APIs required by the PRD and architecture should become public.

Avoid exporting internal implementation details merely because they exist.

## 5.6 ESM-first

The package must remain ESM-first and continue to expose generated declaration files and JavaScript through the package exports.

## 5.7 No provider lock-in

Image uploads must be defined through interfaces/handlers.

The core must not depend directly on:

- S3;
- Cloudinary;
- Supabase;
- Firebase;
- application APIs;
- other storage vendors.

## 5.8 No UI stylesheet in core

The core package must not ship editor UI styling.

Framework-agnostic editor CSS remains part of the React adapter/package architecture.

---

# 6. Task Breakdown

## Task 01 — Audit Phase 03 Boundary

### Goal

Confirm the current repository state and establish the exact implementation boundary before changing the package.

### Work

- Read `PRD.md`.
- Read `ARCHITECTURE.md`.
- Read `AGENTS.md`.
- Review `packages/editor-core`.
- Review current package/build/test configuration.
- Confirm Phase 01/02 infrastructure is passing.
- Confirm no Phase 04 UI implementation is introduced accidentally.

### Acceptance Criteria

- Current package structure is understood.
- Phase 03 scope is explicitly reflected in implementation.
- No React/Vue/UI responsibilities are moved into core.
- Existing Phase 02 infrastructure remains functional.

---

## Task 02 — Define Core Public Type System

### Goal

Establish the shared types required by the core API.

### Work

Define only the public types required by the PRD, including where applicable:

- editor configuration types;
- editor option types;
- persistence envelope types;
- toolbar types;
- label types;
- upload types;
- image upload result types;
- shared content types;
- extension-related public types.

Use Tiptap types where the architecture intentionally exposes them.

### Important Constraint

Do not duplicate Tiptap types unnecessarily.

If a public type is already correctly represented by a Tiptap type, prefer using/re-exporting the appropriate Tiptap type rather than creating a competing abstraction.

### Acceptance Criteria

- Public types are strongly typed.
- No unnecessary `any`.
- Types are framework-independent.
- Types accurately represent the PRD contracts.
- Internal-only types are not exported unnecessarily.

---

## Task 03 — Establish Editor Configuration Model

### Goal

Create the configuration model used to construct a core editor instance.

### Work

Support the configuration concepts required by the PRD, including:

- initial JSON content;
- extensions;
- placeholder;
- editable state;
- disabled/read-only behavior where appropriate to the core;
- labels/configuration where applicable;
- SSR-related rendering options required by Tiptap;
- editor-specific options required for safe initialization.

Keep configuration composable and avoid coupling it to React props.

### Acceptance Criteria

- Configuration has a clear public type.
- Configuration does not contain React-specific callbacks such as `onChange`.
- Defaults are deterministic.
- Custom extensions can be supplied.
- Configuration does not introduce unnecessary application-specific options.

---

## Task 04 — Implement Editor Creation API

### Goal

Provide the core API responsible for creating/configuring a Tiptap editor instance.

### Work

Implement the editor creation helper around Tiptap.

The implementation must:

- create a valid Tiptap editor;
- apply configured extensions;
- apply the default preset when requested;
- accept initial JSON content;
- respect editable/read-only configuration;
- support placeholder configuration;
- expose the Tiptap editor instance;
- avoid global mutable editor state.

### SSR/Import Constraint

Do not execute browser-dependent globals at module import time.

The package may require a DOM-capable runtime when actually creating an editor, but importing the package must not eagerly access browser globals.

### Acceptance Criteria

- Editor can be created successfully.
- Multiple editor instances can coexist.
- No singleton editor state exists.
- Tiptap remains the underlying editor engine.
- Importing the package does not eagerly execute browser-only initialization.

---

## Task 05 — Implement Default Extension Preset

### Goal

Create the default extension configuration representing the MVP editor capabilities.

### Required Capability Areas

The default preset must cover the capabilities defined in the PRD, including:

- paragraphs;
- text insertion/deletion;
- headings;
- bold;
- italic;
- underline;
- ordered lists;
- unordered lists;
- blockquote;
- code;
- horizontal rule;
- links;
- images;
- history/undo/redo;
- placeholder behavior where applicable.

Use official Tiptap extensions where appropriate.

### Acceptance Criteria

- Default extensions are composable.
- Consumers can provide additional extensions.
- Consumers can replace/override the default extension configuration where the API allows it.
- Extensions are not hidden inside large conditional branches.
- The preset remains tree-shakeable where practical.

---

## Task 06 — Implement RumahKodingku Extension Layer

### Goal

Create the architectural layer for extensions owned by RumahKodingku.

### Work

- Establish a clear location for RumahKodingku-owned extensions.
- Implement only extensions required by the current PRD.
- Keep each extension independently exportable.
- Avoid creating speculative extensions for future features.

### Acceptance Criteria

- RumahKodingku extensions are separated from third-party Tiptap extensions.
- Each public extension has a clear responsibility.
- Extensions can be composed by consumers.
- No unnecessary monolithic extension is created.

---

## Task 07 — Define Extension Composition Rules

### Goal

Make extension composition predictable and safe.

### Work

Define and implement the rules for:

- default extensions;
- custom consumer extensions;
- extension ordering;
- duplicate/conflicting extensions;
- optional feature extensions;
- extension replacement/augmentation where supported.

Avoid silently creating ambiguous behavior when two extensions conflict.

### Acceptance Criteria

- Composition behavior is deterministic.
- Extension arrays do not mutate unexpectedly.
- Custom extensions can be added without modifying internal package source.
- Relevant edge cases are covered by tests.

---

## Task 08 — Implement Content Utilities

### Goal

Provide small, framework-independent helpers for working with canonical editor content.

### Work

Implement only content utilities justified by the PRD, such as:

- content validation/type-safe handling;
- empty-content handling;
- content-related helpers required by editor initialization;
- utilities required by serialization/persistence boundaries.

Do not create a large utility library.

### Acceptance Criteria

- Utilities operate on Tiptap/ProseMirror JSON.
- No React dependency exists.
- Utilities do not mutate caller-owned content unexpectedly.
- Empty/invalid content behavior is deterministic.
- Public helpers have tests.

---

## Task 09 — Implement Serialization Utilities

### Goal

Provide serialization/output utilities for editor content.

### Work

Support the required output formats, primarily:

- JSON output;
- HTML serialization/output.

The implementation must respect the architecture rule that JSON remains canonical.

### Important Constraint

HTML must not become a second canonical state representation.

The MVP must not introduce an HTML-controlled-value API.

### Acceptance Criteria

- JSON can be obtained from the editor.
- HTML can be generated as output.
- Serialization is deterministic for equivalent editor state.
- Serialization utilities do not introduce unnecessary editor recreation.
- Security-sensitive HTML handling is covered by appropriate tests.

---

## Task 10 — Implement Persistence Schema Versioning

### Goal

Implement the persistence boundary required by the PRD.

### Canonical Envelope

Use the documented persistence structure:

```ts
{
  schemaVersion: 1,
  content: JSONContent
}
```

### Work

Implement utilities/types for:

- creating the persistence envelope;
- reading the envelope;
- validating schema version;
- handling unsupported schema versions;
- keeping schema version ownership outside the editor component itself.

### Acceptance Criteria

- Current schema version is explicit.
- Persisted content is distinguishable from raw editor JSON.
- Unsupported versions fail predictably.
- Schema versioning is independent from Tiptap's internal version.
- Tests cover valid and invalid envelopes.

---

## Task 11 — Define Image Upload Contract

### Goal

Establish the provider-independent upload abstraction.

### Required Contract

The core must support the documented contract:

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

### Work

Implement contracts for:

- upload handler;
- upload result;
- upload validation options;
- accepted file types;
- maximum file size;
- cancellation;
- progress;
- error handling.

### Acceptance Criteria

- No storage provider dependency exists.
- Upload can be cancelled through `AbortSignal`.
- Progress can be reported.
- File validation rules are configurable.
- Upload failures can be surfaced predictably.
- Public upload types are exported.

---

## Task 12 — Implement Image Extension/Core Behavior

### Goal

Implement the image functionality that belongs in the core layer.

### Work

Support the PRD requirements that belong to the editor engine/extension layer:

- image nodes;
- uploaded image source;
- alt text;
- optional dimensions;
- safe image source handling;
- integration with the upload contract;
- upload failure behavior;
- cleanup of failed temporary state where applicable.

Paste/drag-drop behavior must only be implemented in core when it genuinely belongs to the Tiptap/editor-engine layer. React-specific UI rendering and visual progress components remain outside this phase.

### Security

Image source URLs are untrusted input and must be validated according to the security requirements defined by the project.

### Acceptance Criteria

- Image extension is composable.
- Upload handler is injected rather than hard-coded.
- Image metadata is represented correctly.
- Unsafe image sources are rejected/handled safely.
- Upload errors do not leave invalid editor state.
- Relevant behavior is covered by tests.

---

## Task 13 — Implement Toolbar Definition Model

### Goal

Define the framework-independent toolbar command model.

### Public Model

Implement the documented conceptual structure:

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

### Work

Define toolbar items for the MVP formatting capabilities.

Toolbar definitions must describe behavior, not render UI.

### Acceptance Criteria

- Toolbar definitions contain no React components.
- Toolbar commands operate on a supplied editor instance.
- Active/disabled state is derived from the editor.
- Toolbar definitions are composable.
- Consumers can add/remove toolbar items.
- No icon package becomes a required core dependency.

---

## Task 14 — Implement Editor Labels

### Goal

Create the localization-ready label model used by toolbar/editor consumers.

### Work

Define:

- `EditorLabels`;
- default labels;
- partial label overrides;
- stable label keys.

Labels must remain framework-independent.

### Acceptance Criteria

- Default labels are available.
- Consumers can override individual labels.
- Label keys are strongly typed.
- No UI framework dependency exists.

---

## Task 15 — Define Public Export Surface

### Goal

Make the package API explicit and controlled.

### Work

Update `packages/editor-core/src/index.ts` and related export files so only intended public APIs are exported.

Organize exports by responsibility where useful, for example:

- editor;
- extensions;
- content;
- serialization;
- persistence;
- toolbar;
- upload;
- types.

### Acceptance Criteria

- Internal implementation modules are not accidentally public.
- Public exports have stable names.
- Package declarations expose the intended API.
- No React/Vue APIs are exported from core.
- Package consumers can import the documented public API.

---

# 7. Testing Tasks

## Task 16 — Build Comprehensive Core Test Suite

### Goal

Verify the actual behavior of the core implementation.

### Test Areas

At minimum, cover:

### Editor

- editor creation;
- default configuration;
- custom configuration;
- multiple editor instances;
- editable/read-only behavior;
- initial JSON content.

### Extensions

- default extension preset;
- custom extensions;
- composition behavior;
- extension ordering/conflicts where relevant.

### Content

- valid content;
- empty content;
- invalid content;
- non-mutating behavior.

### Serialization

- JSON output;
- HTML output;
- deterministic serialization;
- relevant security cases.

### Persistence

- envelope creation;
- envelope parsing;
- schema version;
- unsupported schema versions;
- invalid persisted data.

### Upload

- file validation;
- successful upload;
- progress;
- cancellation;
- failure handling;
- image metadata.

### Toolbar

- command execution;
- active state;
- disabled state;
- default definitions.

### Security

Include tests for relevant untrusted URL/image/content scenarios defined by the PRD.

### Acceptance Criteria

- Tests are deterministic.
- Tests do not rely on network access.
- Tests cover meaningful behavior rather than implementation details.
- Existing Phase 02 tests continue passing.

---

## Task 17 — Add Public API Type Tests

### Goal

Protect the TypeScript contract of the package.

### Work

Add type-level tests for:

- editor configuration;
- editor creation;
- JSON content;
- persistence envelope;
- toolbar definitions;
- upload handler;
- upload result;
- labels;
- public exports.

Verify both valid and intentionally invalid usage where appropriate.

### Acceptance Criteria

- Public API type regressions are detectable.
- No public API relies on accidental inference.
- Type tests remain framework-independent.

---

# 8. Package Verification

## Task 18 — Build & Consumer Verification

### Goal

Verify that the package can actually be built and consumed as a published package.

### Work

Run and validate:

- type checking;
- unit tests;
- coverage where applicable;
- package build;
- declaration generation;
- `publint`;
- `@arethetypeswrong/cli`;
- package exports;
- ESM consumption;
- consumer-style import tests.

### Important Constraint

Verification must test the package from its built output where practical, not only source imports.

### Acceptance Criteria

- `dist` is generated correctly.
- `.d.ts` files are generated.
- package exports resolve correctly.
- no accidental private modules are required by consumers.
- package validation passes.

---

# 9. Documentation & Architecture

## Task 19 — Architecture & Agent Documentation Update

### Goal

Keep project documentation synchronized with the implemented core API.

### Work

Update relevant documentation to reflect:

- implemented core API;
- package boundaries;
- public exports;
- extension model;
- content model;
- persistence envelope;
- upload contract;
- toolbar model;
- testing expectations;
- implementation constraints.

Update `AGENTS.md` only where repository rules or current implementation state have materially changed.

Documentation must not describe unimplemented Phase 04/09 features as already available.

### Acceptance Criteria

- Documentation matches actual implementation.
- Public APIs are documented.
- Examples compile conceptually with the actual API.
- Future features are clearly identified as future.

---

# 10. Final Verification

## Task 20 — Final Phase 03 Verification

### Goal

Confirm that Phase 03 is complete without leaking responsibilities into later phases.

### Required Verification

Run the repository's applicable validation commands, including:

- lint/check;
- type checking;
- package type checking;
- unit tests;
- coverage where required;
- package build;
- package validation;
- browser tests only where the existing Phase 02 smoke infrastructure is relevant.

Review the final diff for:

- accidental React/Vue imports;
- accidental UI implementation;
- unnecessary dependencies;
- public API leakage;
- global mutable state;
- provider-specific upload code;
- changes to unrelated packages;
- premature Changesets/release infrastructure.

### Acceptance Criteria

Phase 03 is complete only when:

- `editor-core` contains the intended functional core API;
- public exports are stable and intentional;
- default/custom extension composition works;
- JSON is canonical;
- HTML is output-only;
- persistence versioning works;
- image upload abstraction works;
- toolbar definitions work;
- security-sensitive URL/image behavior is tested;
- package build and declarations work;
- package validation passes;
- documentation matches implementation;
- no Phase 04 React UI work has leaked into core;
- no Phase 09 release infrastructure has been introduced.

---

# 11. Suggested Implementation Order

Implement the tasks in this order:

```text
01. Audit Phase 03 Boundary
        ↓
02. Core Public Type System
        ↓
03. Editor Configuration Model
        ↓
04. Editor Creation API
        ↓
05. Default Extension Preset
        ↓
06. RumahKodingku Extension Layer
        ↓
07. Extension Composition Rules
        ↓
08. Content Utilities
        ↓
09. Serialization Utilities
        ↓
10. Persistence Schema Versioning
        ↓
11. Image Upload Contract
        ↓
12. Image Extension/Core Behavior
        ↓
13. Toolbar Definition Model
        ↓
14. Editor Labels
        ↓
15. Public Export Surface
        ↓
16. Comprehensive Core Tests
        ↓
17. Public API Type Tests
        ↓
18. Build & Consumer Verification
        ↓
19. Architecture & Agent Documentation
        ↓
20. Final Phase Verification
```

Do not implement later tasks in a way that forces premature React/UI responsibilities into `editor-core`.

---

# 12. Expected Conceptual Package Structure

The following structure is a guide, not a requirement to create every directory mechanically:

```text
packages/editor-core/
├── src/
│   ├── index.ts
│   ├── editor/
│   ├── extensions/
│   ├── content/
│   ├── serialization/
│   ├── persistence/
│   ├── toolbar/
│   ├── upload/
│   └── types/
├── test/
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

Use the smallest structure that keeps responsibilities clear.

Do not introduce abstractions merely to match this tree.

---

# 13. Dependency Rules

New dependencies must be justified by an actual Phase 03 requirement.

Prefer existing dependencies already established by the repository.

Do not add:

- React;
- Vue;
- UI component libraries;
- icon libraries;
- state management libraries;
- upload/storage providers;
- backend clients;
- authentication libraries.

Tiptap/ProseMirror remain the editor foundation.

---

# 14. Security Requirements

Editor content must be treated as untrusted.

The implementation must consider:

- unsafe link URLs;
- unsafe image URLs;
- malformed content;
- unexpected persisted content;
- HTML serialization concerns;
- upload validation;
- upload cancellation;
- upload failure;
- temporary upload state.

Do not introduce a public API that directly encourages arbitrary unsanitized HTML injection.

Security behavior must be covered by tests where the core owns the behavior.

---

# 15. Performance Requirements

The implementation should avoid unnecessary work.

In particular:

- do not recreate editor instances unnecessarily;
- do not introduce global mutable state;
- avoid unnecessary content transformations;
- avoid serializing content unless requested;
- keep extension definitions stable;
- avoid large abstraction layers for simple operations.

React-specific editor lifecycle optimization is handled in Phase 04.

---

# 16. Public API Governance

Any public API introduced during Phase 03 must be treated as a deliberate contract.

For each new public API:

1. Define the TypeScript type.
2. Implement the behavior.
3. Add tests.
4. Export it intentionally.
5. Document it.
6. Verify package declarations/build output.

Do not export internal helpers simply because another internal module needs them.

Changesets are **not** required in Phase 03 because release/versioning infrastructure is explicitly deferred to Phase 09.

---

# 17. Definition of Done

Phase 03 is considered done when all of the following are true:

### Core

- [ ] `@rumahkodingku/editor-core` has a functional public API.
- [ ] Editor creation works.
- [ ] Default extensions work.
- [ ] Custom extensions work.
- [ ] Extension composition is deterministic.
- [ ] JSON is the canonical content representation.
- [ ] HTML serialization works as output.
- [ ] Persistence envelope and schema versioning work.
- [ ] Image upload contract is implemented.
- [ ] Image core behavior is implemented.
- [ ] Toolbar definitions are implemented.
- [ ] Editor labels are implemented.

### Architecture

- [ ] No React/Vue dependency in core.
- [ ] No global editor state.
- [ ] No provider-specific upload dependency.
- [ ] No UI implementation in core.
- [ ] No unnecessary abstraction.
- [ ] No premature release infrastructure.

### Quality

- [ ] Unit/integration tests pass.
- [ ] Type tests pass.
- [ ] Security-sensitive cases are tested.
- [ ] Package builds successfully.
- [ ] Declarations are generated.
- [ ] Package validation passes.
- [ ] Consumer-style imports work.

### Documentation

- [ ] Public API is documented.
- [ ] Architecture documentation matches implementation.
- [ ] Agent instructions remain accurate.
- [ ] Future-phase responsibilities are not presented as implemented.

---

# 18. Phase Exit Criteria

The phase may be marked complete only after the repository can demonstrate:

```text
Consumer
   │
   ▼
@rumahkodingku/editor-core
   │
   ├── Editor Creation
   ├── Default Extensions
   ├── Custom Extensions
   ├── Content Utilities
   ├── JSON / HTML Serialization
   ├── Persistence Schema Versioning
   ├── Image Upload Contract
   ├── Image Extension
   ├── Toolbar Definitions
   └── Editor Labels
            │
            ▼
     Tiptap + ProseMirror
```

The resulting core package becomes the stable foundation for **Phase 04 — React Adapter & Editor UI**.

---

# 19. Next Phase Boundary

After Phase 03:

### Phase 04 may consume:

- editor creation API;
- editor configuration;
- default extensions;
- content utilities;
- serialization utilities;
- persistence utilities;
- upload contracts;
- toolbar definitions;
- editor labels.

### Phase 04 must implement:

- React `<Editor />`;
- React lifecycle;
- controlled/uncontrolled behavior;
- `onChange`;
- `onReady`;
- React toolbar rendering;
- React-specific UI state;
- editor UI styling;
- browser interaction behavior owned by the React layer.

The core package must remain independent from these concerns.
