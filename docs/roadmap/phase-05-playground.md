# Phase 05 — Playground

**Status:** Approved / Planned  
**Phase:** 05  
**Project:** RumahKodingku Editor  
**Scope:** Internal playground, consumer validation, manual testing, visual validation, and basic browser smoke testing

---

## 1. Phase Overview

Phase 05 establishes an internal **Playground application** for RumahKodingku Editor.

The Playground is a development and validation environment used to consume the public package APIs from the same monorepo and verify that the editor behaves correctly from a real consumer application's perspective.

The Playground is **not** the production editor, documentation site, or public demo application.

### Primary goals

- Provide a real consumer environment for `@rumahkodingku/editor-react`.
- Validate the Phase 04 React adapter through public APIs.
- Provide scenario-based manual and visual testing.
- Expose useful editor state and serialized output during development.
- Validate controlled and uncontrolled usage.
- Validate placeholder, editable, disabled, and read-only states.
- Validate extension composition.
- Validate the current toolbar contract without expanding Phase 06 scope.
- Provide mock image-upload scenarios without production storage infrastructure.
- Provide basic browser smoke and interaction coverage.
- Make future editor development easier to validate before release.

---

## 2. Phase Objectives

At the end of Phase 05, the repository must contain a working Playground application that can:

1. Start independently through the monorepo development workflow.
2. Consume `@rumahkodingku/editor-react` through its public package API.
3. Load the published editor stylesheet from the React package.
4. Render a basic editor.
5. Demonstrate initial content.
6. Demonstrate read-only behavior.
7. Demonstrate disabled behavior.
8. Demonstrate controlled and uncontrolled modes.
9. Demonstrate placeholder, editable, disabled, and labels configuration.
10. Demonstrate custom extension composition.
11. Inspect JSON and HTML output.
12. Reset editor content.
13. Inspect the current minimal toolbar state.
14. Validate the current toolbar composition contract.
15. Demonstrate image upload using a local/mock handler.
16. Demonstrate upload failure behavior.
17. Demonstrate URL/security behavior exposed by the current core API without implementing Phase 06 UI.
18. Organize scenarios in a maintainable architecture.
19. Provide basic development diagnostics.
20. Pass Playground type checking and build validation.
21. Pass basic browser smoke and interaction tests.
22. Keep the Playground isolated from published package implementation concerns.
23. Keep Fumadocs as the canonical public documentation/example environment.
24. Avoid introducing Phase 06, 07, 08, or 09 scope prematurely.

---

# 3. Architecture

## 3.1 Repository Relationship

The dependency direction must remain:

```text
editor-core
    ↓
editor-react
    ↓
playground
```

Fumadocs remains a separate consumer:

```text
editor-core
    ↓
editor-react
    ↓
fumadocs
```

The Playground must never become a dependency of either published package.

## 3.2 Target Structure

```text
apps/
├── fumadocs/
│
└── playground/
    ├── src/
    │   ├── components/
    │   ├── scenarios/
    │   ├── hooks/
    │   ├── lib/
    │   └── main.tsx
    │
    ├── tests/
    └── package.json

packages/
├── editor-core/
└── editor-react/

tests/
└── browser/
```

The exact internal file structure may evolve during implementation, but package boundaries must remain unchanged.

---

# 4. Scope

## 4.1 Included

Phase 05 includes:

- Playground application foundation.
- React integration.
- Package consumption through public APIs.
- Scenario-based editor examples.
- State inspection.
- Content inspection.
- Controlled/uncontrolled validation.
- Basic configuration controls.
- Custom extension validation.
- Current toolbar API validation.
- Mock image upload validation.
- Upload failure validation.
- Existing security helper validation.
- Development diagnostics.
- Type checking.
- Build verification.
- Basic browser smoke tests.
- Basic browser interaction tests.
- Phase/status documentation updates.

## 4.2 Explicitly Excluded

The following are **not** Phase 05 responsibilities:

- Full editor MVP implementation.
- Full toolbar UX.
- Advanced toolbar groups.
- Link dialog implementation.
- Image/media management UI.
- Production image storage.
- S3 integration.
- Cloudinary integration.
- Supabase Storage integration.
- File manager.
- Autosave.
- Database persistence.
- Authentication.
- Collaboration.
- Comments.
- Mentions.
- Slash commands.
- Advanced tables.
- AI writing features.
- Production upload service.
- Full accessibility audit.
- Full cross-browser matrix.
- Full documentation website implementation.
- npm publishing.
- Changesets implementation.
- Release automation.
- Package versioning workflow.

These belong to later phases.

---

# 5. Task Breakdown

## A. Playground Foundation

### Task 01 — Audit Phase 04 Output

Review the Phase 04 implementation before starting Playground work.

Verify:

- `@rumahkodingku/editor-react` public exports.
- `Editor` component.
- `EditorToolbar`.
- `ToolbarButton`.
- `ToolbarIcon`.
- `EditorProps`.
- Published stylesheet.
- Core extension composition API.
- Current toolbar definitions.
- Upload contracts.
- Serialization utilities.
- Security utilities.

**Acceptance criteria:**

- Phase 04 public APIs are clearly identified.
- Playground consumes only public APIs.
- No Playground requirement forces unnecessary Phase 04 changes.
- Any API gap is documented before implementation.

### Task 02 — Define Playground Responsibility

Document and enforce that the Playground is:

- an internal validation environment;
- a real consumer of the packages;
- scenario-driven;
- useful for manual and visual testing.

The Playground must not become:

- the production editor;
- the canonical public documentation site;
- a replacement for Fumadocs.

### Task 03 — Create `apps/playground`

Create the Playground application under:

```text
apps/playground
```

The application must participate in the existing pnpm workspace.

### Task 04 — Configure Playground React Environment

Configure the application with the repository's supported React/TypeScript tooling and existing monorepo conventions.

### Task 05 — Configure Playground Workspace Scripts

Provide scripts required for:

- development;
- build;
- type checking;
- testing where applicable.

Scripts must integrate cleanly with the root workspace.

### Task 06 — Integrate with Turborepo

Ensure the Playground participates correctly in the existing Turbo task graph.

The dependency graph must allow package builds to complete before Playground build/test operations when required.

### Task 07 — Configure Playground Styling

Create Playground-specific styling.

Rules:

- Do not require Tailwind in published packages.
- Playground styling may use the app's preferred styling approach.
- Keep editor package styles separate from Playground shell styles.
- Avoid leaking Playground-specific styles into `editor-react`.

### Task 08 — Create Playground Shell

Create a minimal application shell containing:

- application title;
- scenario navigation;
- active scenario;
- editor preview area;
- inspector/control area.

The shell should prioritize developer usability rather than production marketing design.

---

## B. Editor Integration

### Task 09 — Integrate `@rumahkodingku/editor-react`

Consume the package through:

```text
@rumahkodingku/editor-react
```

Do not import source files directly from:

```text
packages/editor-react/src
```

or equivalent internal paths.

### Task 10 — Load Editor CSS

Load:

```text
@rumahkodingku/editor-react/styles.css
```

Verify:

- editor styles are applied;
- toolbar styles are applied;
- CSS variables work;
- Playground styles do not unintentionally override package behavior.

### Task 11 — Create Basic Editor Scenario

Create the baseline scenario demonstrating:

- editor rendering;
- editing;
- toolbar rendering;
- normal editable behavior.

This becomes the primary smoke-test scenario.

### Task 12 — Create Initial Content Scenario

Demonstrate initial content through the supported public API.

Validate:

- JSON content rendering;
- initial document structure;
- editor initialization.

### Task 13 — Create Read-Only Scenario

Create a non-editable editor scenario.

Validate:

- content remains visible;
- editing is prevented;
- appropriate editor state is exposed.

### Task 14 — Create Disabled Scenario

Create a disabled editor scenario.

Validate:

- disabled state;
- interaction behavior;
- toolbar behavior;
- visual distinction where currently supported.

### Task 15 — Create Scenario Navigation

Implement scenario navigation.

Each scenario should have:

- stable identifier;
- display name;
- short description;
- render function/component;
- optional validation metadata.

The system should make future scenarios straightforward to add.

---

## C. Playground Controls

### Task 16 — Create Editor State Panel

Create a development inspector showing relevant editor state, such as:

- editable state;
- disabled state;
- focused state where practical;
- current content availability;
- current document size where useful.

The inspector is for development validation, not production UI.

### Task 17 — Create Controlled Mode Playground

Create a controlled editor scenario.

Validate:

```text
value
onChange
```

behavior.

Verify that changes propagate correctly from editor to parent state.

### Task 18 — Create Uncontrolled Mode Playground

Create an uncontrolled scenario using:

```text
defaultValue
```

Validate that editor state is internally maintained by Tiptap.

### Task 19 — Create Controlled/Uncontrolled Conflict Scenario

Create a development scenario demonstrating behavior when both:

```text
value
defaultValue
```

are supplied.

Validate the documented warning behavior from the React adapter.

This scenario must not introduce new runtime behavior into the package.

### Task 20 — Create Placeholder Control

Create a Playground control for changing the editor placeholder.

Validate that the public `placeholder` API behaves correctly.

### Task 21 — Create Editable Control

Create a control that changes the editor's editable state.

Validate transitions between editable and read-only behavior.

### Task 22 — Create Disabled Control

Create a control that changes the disabled state.

Validate that the adapter responds correctly to runtime changes.

### Task 23 — Create Labels Playground

Demonstrate custom labels through the public labels API.

Validate:

- custom labels;
- fallback labels;
- toolbar accessibility labels where applicable.

---

## D. Content & Feature Scenarios

### Task 24 — Create Custom Extension Scenario

Demonstrate custom extension composition through the public core API.

The scenario should prove that consumers can compose additional extensions without changing package implementation.

Do not build a large extension ecosystem in Phase 05.

### Task 25 — Create JSON Inspector

Create a JSON output panel showing the current Tiptap/ProseMirror JSON document.

Requirements:

- readable formatting;
- live updates;
- copy-friendly output;
- safe handling of empty content.

### Task 26 — Create HTML Output Inspector

Create an HTML serialization panel.

Validate the current serialization API.

The inspector should make it easy to compare:

```text
Editor Document
        ↓
JSON
        ↓
HTML
```

### Task 27 — Create Content Reset Control

Add a development control for resetting the editor to a known fixture.

Provide at least:

- default fixture;
- empty content.

Reset behavior must use supported editor APIs.

### Task 28 — Create Toolbar State Inspector

Expose useful toolbar state information, such as:

- active formatting state;
- disabled state;
- available toolbar items.

This is for validation only.

Do not implement the complete Phase 06 toolbar UX.

### Task 29 — Create Toolbar Composition Scenario

Validate the existing minimal toolbar composition contract.

The scenario may demonstrate:

- default toolbar items;
- custom toolbar items;
- labels;
- enabled/disabled state.

Do not introduce:

- advanced toolbar grouping;
- dropdown systems;
- floating toolbars;
- link dialogs;
- image dialogs;
- advanced command menus.

Those remain Phase 06 scope.

### Task 30 — Create Image Upload Mock Scenario

Create a development-only mock upload handler.

The mock should:

- accept a valid image;
- simulate asynchronous upload;
- optionally expose progress;
- return a predictable URL;
- not require external infrastructure.

No production storage provider should be introduced.

### Task 31 — Create Upload Error Scenario

Create a scenario that intentionally fails an upload.

Validate:

- error handling;
- placeholder cleanup;
- editor stability;
- useful failure state.

Do not introduce a production notification system.

### Task 32 — Create Link Security Scenario

Validate existing core URL/security behavior through a small development scenario or inspector.

The scenario may demonstrate:

- accepted safe URLs;
- rejected unsafe schemes;
- normalized URL behavior where exposed by the core API.

Do not implement a full link editor/dialog.

---

## E. Playground Architecture & Developer Experience

### Task 33 — Create Scenario-Based Playground Architecture

Organize the Playground around reusable scenario definitions/components.

Avoid putting all logic into a single `App.tsx`.

Recommended conceptual structure:

```text
src/
├── components/
├── scenarios/
├── hooks/
├── lib/
└── main.tsx
```

### Task 34 — Create Playground Navigation Metadata

Define metadata for each scenario.

Recommended conceptual shape:

```ts
type PlaygroundScenario = {
  id: string
  title: string
  description: string
  component: React.ComponentType
}
```

The exact type may differ according to implementation.

### Task 35 — Create Error Boundary

Add an application-level error boundary appropriate for development.

Requirements:

- prevent a single scenario crash from making the entire Playground unusable;
- show enough information for local debugging;
- avoid introducing a production error-reporting service.

### Task 36 — Add Development Diagnostics

Add lightweight development diagnostics where they materially help validation.

Possible diagnostics:

- current scenario;
- current editor state;
- JSON document size;
- serialized HTML length;
- upload status.

Avoid excessive logging.

---

## F. Validation & Testing

### Task 37 — Add Playground Type Tests

Verify Playground TypeScript correctness.

At minimum:

```text
pnpm run check-types
```

must include the Playground successfully.

### Task 38 — Add Playground Build Verification

Verify that the Playground production build succeeds.

The build must consume package outputs through supported workspace/package boundaries.

### Task 39 — Add Browser Smoke Test

Add basic browser smoke coverage for the Playground.

At minimum verify:

- Playground loads;
- editor renders;
- scenario navigation works;
- no fatal runtime error occurs.

This is basic validation only.

Full cross-browser and accessibility auditing remains Phase 07.

### Task 40 — Add Browser Scenario Tests

Add a small set of meaningful browser interactions.

Recommended coverage:

- type into editor;
- switch scenario;
- change editor state;
- inspect serialized content;
- reset content;
- trigger mock upload where practical.

Do not attempt full editor behavior coverage in Phase 05.

---

## G. Documentation & Phase Gate

### Task 41 — Add Playground README

Create a concise README explaining:

- purpose;
- how to run it;
- available scenarios;
- relationship to `editor-react`;
- relationship to Fumadocs.

Do not turn it into the complete project documentation.

### Task 42 — Update `AGENTS.md`

Update repository agent instructions to reflect:

- Playground existence;
- Playground responsibility;
- public API consumption;
- Fumadocs as canonical public example environment;
- Phase 05 scope boundaries.

### Task 43 — Update Fumadocs Status

Update stale Fumadocs status information where it incorrectly describes the repository as being in an earlier phase.

Do not redesign the Fumadocs documentation site in Phase 05.

### Task 44 — Update Root README Status

Update repository status information so it reflects the current implementation phase.

Keep the change focused on status/architecture accuracy.

### Task 45 — Update Roadmap

Update:

```text
docs/roadmap/README.md
```

to reflect:

- Phase 05 status;
- completed Phase 04;
- Playground existence;
- current next phase.

Do not mark future phases complete.

### Task 46 — Playground Package Validation

Validate the package/app using repository package validation tooling.

Confirm:

- package boundaries are correct;
- dependencies are correctly declared;
- no accidental production dependency leaks into published packages;
- TypeScript resolves correctly;
- build output is valid.

### Task 47 — Full Repository Verification

Run the established repository verification sequence:

```bash
pnpm run check
pnpm run check-types
pnpm run check-types:fumadocs
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run check:packages
pnpm run test:browser
```

Resolve regressions introduced by Phase 05.

### Task 48 — Phase 05 Final Review

Perform a final Phase 05 review.

Confirm:

- all approved tasks are complete;
- Playground is usable;
- package boundaries remain intact;
- public APIs are consumed correctly;
- no Phase 06 feature creep exists;
- no release engineering has been introduced;
- no production upload provider has been introduced;
- tests and builds pass;
- documentation/status reflects reality.

---

# 6. Definition of Done

## Playground Foundation

- [ ] `apps/playground` exists.
- [ ] Playground is part of the pnpm workspace.
- [ ] Playground integrates with Turborepo.
- [ ] Playground starts successfully.
- [ ] Playground builds successfully.
- [ ] Playground has appropriate TypeScript configuration.
- [ ] Playground styling is isolated from published package styling.

## Editor Integration

- [ ] Playground consumes `@rumahkodingku/editor-react`.
- [ ] Playground does not import editor-react source files directly.
- [ ] Published editor CSS is loaded.
- [ ] Basic editor scenario works.
- [ ] Initial content scenario works.
- [ ] Read-only scenario works.
- [ ] Disabled scenario works.
- [ ] Scenario navigation works.

## State & Configuration

- [ ] Controlled mode works.
- [ ] Uncontrolled mode works.
- [ ] Controlled/uncontrolled conflict behavior is demonstrable.
- [ ] Placeholder configuration works.
- [ ] Editable configuration works.
- [ ] Disabled configuration works.
- [ ] Custom labels work.
- [ ] Editor state can be inspected.

## Content & Feature Validation

- [ ] Custom extension composition can be demonstrated.
- [ ] JSON output can be inspected.
- [ ] HTML output can be inspected.
- [ ] Content can be reset.
- [ ] Toolbar state can be inspected.
- [ ] Current toolbar composition contract can be demonstrated.
- [ ] Mock image upload works.
- [ ] Upload failure behavior can be demonstrated.
- [ ] Existing URL/security behavior can be validated.

## Testing

- [ ] Playground type checking passes.
- [ ] Playground build passes.
- [ ] Browser smoke test passes.
- [ ] Basic browser scenario tests pass.
- [ ] Full repository validation passes.

## Documentation

- [ ] Playground README exists.
- [ ] `AGENTS.md` reflects Playground architecture.
- [ ] Fumadocs status is accurate.
- [ ] Root README status is accurate.
- [ ] Roadmap status is accurate.

## Scope

- [ ] No Phase 06 feature has been prematurely implemented.
- [ ] No Phase 07 full browser/accessibility audit has been introduced.
- [ ] No Phase 08 documentation expansion has been introduced.
- [ ] No Phase 09 release/Changesets implementation has been introduced.
- [ ] No production storage/upload provider has been introduced.

---

# 7. Verification Strategy

Phase 05 uses layered verification.

## Layer 1 — Static Validation

```bash
pnpm run check
pnpm run check-types
pnpm run check-types:fumadocs
```

Purpose:

- formatting;
- linting;
- TypeScript;
- documentation application type checking.

## Layer 2 — Unit/Component Validation

```bash
pnpm run test
pnpm run test:coverage
```

Purpose:

- editor adapter regression testing;
- Playground-related test validation;
- coverage regression detection.

## Layer 3 — Build Validation

```bash
pnpm run build
pnpm run check:packages
```

Purpose:

- verify package builds;
- verify Playground builds;
- verify package metadata and outputs.

## Layer 4 — Browser Validation

```bash
pnpm run test:browser
```

Phase 05 browser testing is intentionally limited to:

- application startup;
- basic editor interaction;
- scenario navigation;
- representative state changes;
- representative content inspection.

Comprehensive browser/accessibility validation belongs to Phase 07.

---

# 8. Package Boundary Rules

### Rule 1 — Core remains framework-agnostic

`@rumahkodingku/editor-core` must not import:

- React;
- React DOM;
- Vue;
- browser-specific UI framework code.

### Rule 2 — React adapter owns React integration

`@rumahkodingku/editor-react` owns:

- React components;
- React hooks;
- React lifecycle integration;
- React rendering.

### Rule 3 — Playground consumes packages

The Playground must consume:

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
```

through their public exports.

It must not reach into:

```text
packages/editor-core/src
packages/editor-react/src
```

### Rule 4 — Playground-specific code stays in Playground

Scenario components, inspectors, controls, diagnostics, and development fixtures must remain inside:

```text
apps/playground
```

unless they represent a genuine reusable package API.

### Rule 5 — Do not move Playground concerns into published packages

Do not add Playground-only:

- debug panels;
- scenario registries;
- fixtures;
- development controls;
- test-only UI;
- mock services

to published packages.

---

# 9. Content Model Validation

The Playground should demonstrate the canonical editor document format:

```text
Tiptap / ProseMirror JSON
```

The Playground may also show:

```text
HTML
```

as serialized output.

The Playground must not establish a second editor document format.

Persisted application content continues to use the project envelope:

```ts
{
  schemaVersion,
  content
}
```

where applicable.

---

# 10. Image Upload Validation

Phase 05 uses dependency inversion.

The Playground provides a local mock implementation of the upload contract.

Conceptually:

```text
Editor
  ↓
ImageUpload extension
  ↓
Upload handler
  ↓
Playground mock
  ↓
Predictable local result
```

The Playground must not introduce:

- cloud credentials;
- production storage;
- real customer uploads;
- external media infrastructure.

The purpose is to validate the editor upload pipeline, not production infrastructure.

---

# 11. Toolbar Scope

The Playground may validate the Phase 04 toolbar API.

It must not expand the toolbar into the complete Phase 06 system.

Phase 05 validation may include:

- default toolbar items;
- custom toolbar items;
- toolbar state;
- labels;
- enabled/disabled state;
- command execution.

Phase 05 must not introduce:

- complex menus;
- dropdown architecture;
- floating toolbars;
- advanced formatting controls;
- link dialogs;
- image dialogs;
- full responsive toolbar UX.

---

# 12. Browser Test Scope

Phase 05 browser testing is intentionally pragmatic.

The objective is to prove that the Playground can consume the editor package in a real browser environment.

Representative coverage:

```text
Load Playground
      ↓
Render Editor
      ↓
Interact with Editor
      ↓
Switch Scenario
      ↓
Change State
      ↓
Inspect Output
```

It is not intended to replace comprehensive browser and accessibility testing planned for Phase 07.

---

# 13. Documentation Responsibility

Phase 05 documentation is limited to describing the Playground and correcting repository status.

The following remain later responsibilities:

- complete API documentation;
- comprehensive guides;
- recipes;
- migration guides;
- release documentation;
- advanced usage documentation.

Fumadocs remains the canonical public documentation and example environment.

The Playground exists primarily for internal development and validation.

---

# 14. Phase Dependencies

Phase 05 depends on:

```text
Phase 00 — Repository Foundation
Phase 01 — Architecture & Planning
Phase 02 — Package Foundation
Phase 03 — Core Editor Engine
Phase 04 — React Adapter
```

Phase 05 enables better validation for:

```text
Phase 06 — Editor UX / Toolbar / Dialogs
Phase 07 — Browser & Accessibility
Phase 08 — Documentation
Phase 09 — Release Engineering
```

---

# 15. Phase 05 Exit Criteria

Phase 05 can be marked complete when:

1. `apps/playground` exists and runs.
2. The Playground consumes the public editor package APIs.
3. Core editor scenarios work.
4. Controlled/uncontrolled behavior is demonstrable.
5. Editor configuration is demonstrable.
6. JSON and HTML outputs are inspectable.
7. Toolbar behavior can be validated without expanding Phase 06.
8. Mock upload behavior works.
9. Upload failure behavior works.
10. Basic browser validation passes.
11. Full repository validation passes.
12. Documentation/status is synchronized with the implementation.
13. No future-phase scope has been prematurely implemented.

---

# 16. Expected Phase Result

After Phase 05, the repository should conceptually look like:

```text
RumahKodingku Editor
│
├── apps/
│   ├── fumadocs/
│   │   └── Public documentation & examples
│   │
│   └── playground/
│       └── Internal validation environment
│
├── packages/
│   ├── editor-core/
│   │   └── Framework-agnostic editor engine
│   │
│   └── editor-react/
│       └── React adapter
│
├── tests/
│   └── browser/
│
└── docs/
    └── roadmap/
```

The resulting architecture preserves the intended separation:

```text
Core
  ↓
React Adapter
  ↓
Consumer Applications

Fumadocs = Public Examples / Documentation
Playground = Internal Validation
```

---

# 17. Next Phase

After Phase 05 is completed and verified, the project proceeds to:

**Phase 06 — Editor UX / Toolbar / Dialogs**

Phase 06 may expand the current editor experience with the planned production-oriented editor UX while preserving the package boundaries and contracts validated through the Playground.

Release engineering and Changesets remain deferred to **Phase 09**.
