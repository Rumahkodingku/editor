# Phase 06 — Editor MVP

**Project:** RumahKodingku Editor  
**Phase:** 06  
**Status:** Approved  
**Scope:** Editor MVP — React UI, toolbar, formatting, links, images, interaction, styling, accessibility baseline, tests, playground integration, and MVP validation.

---

## 1. Phase Objective

Phase 06 transforms the existing editor foundation and React adapter into a usable **Editor MVP**.

The focus is not to introduce a new editor engine. The Tiptap/ProseMirror foundation and framework-agnostic core from previous phases remain the source of truth.

This phase focuses on completing the React-facing editor experience:

- composable editor surfaces;
- production-oriented toolbar MVP;
- common text formatting;
- links;
- images;
- upload UX;
- controlled and uncontrolled editing;
- read-only and disabled states;
- placeholder behavior;
- theming and CSS variables;
- accessibility baseline;
- React component tests;
- browser-level MVP validation;
- playground validation;
- public API and documentation updates required for the MVP.

### Phase 06 does not include

- Vue adapter implementation;
- collaboration or real-time editing;
- comments or tracked changes;
- version history;
- AI writing;
- Markdown import/export;
- hosted upload/storage infrastructure;
- application authentication/database/backend;
- mandatory Tailwind dependency;
- enterprise collaboration features;
- full release/versioning infrastructure;
- Changesets implementation;
- complete documentation overhaul;
- full accessibility/browser audit planned for later phases.

---

# 2. Architectural Direction

The editor should evolve toward:

```text
@rumahkodingku/editor-core
  ├── Extensions
  ├── Commands
  ├── Toolbar Definitions
  ├── Upload
  └── Security
          ↓
@rumahkodingku/editor-react
  ├── Editor
  ├── EditorContent
  ├── EditorToolbar
  ├── ToolbarButton
  ├── Link UI
  └── Image UI
          ↓
Consumer Application
  └── Playground / Fumadocs / Future Projects
```

## Architectural rules

1. `editor-core` remains framework-agnostic.
2. `editor-core` must not import React, Vue, DOM-specific UI code, or application code.
3. `editor-react` owns React-specific components and interaction.
4. Tiptap/ProseMirror remains the source of truth for editor/document state.
5. Zustand, Redux, or another application state library must not become the primary document state.
6. JSON remains the canonical document format.
7. HTML remains a serialization/output format.
8. Image upload continues to use the existing dependency-inversion contract.
9. Published packages must not require Tailwind CSS.
10. Public APIs must remain small, typed, and composable.
11. Avoid abstractions that do not provide a clear consumer benefit.
12. Public API changes must be reflected in types, tests, examples, and relevant documentation.
13. Changesets/release infrastructure belongs to Phase 09 and must not be implemented here.

---

# 3. Phase 06 Task List

## A. Phase Foundation & API Contract

### Task 01 — Audit Phase 05 Output

Review the current implementation before modifying the editor.

Verify:

- existing `Editor` behavior;
- `EditorToolbar`;
- `ToolbarButton`;
- toolbar definitions;
- extension composition;
- image upload pipeline;
- labels;
- CSS;
- controlled/uncontrolled behavior;
- playground scenarios;
- existing tests;
- existing public exports.

**Expected result:** Phase 06 starts from the actual Phase 05 implementation rather than recreating existing functionality.

### Task 02 — Define Editor MVP Scope

Translate the approved PRD requirements into explicit implementation scope.

Confirm:

- paragraphs;
- basic text formatting;
- headings;
- lists;
- blockquote;
- code;
- horizontal rule;
- links;
- images;
- placeholder;
- read-only;
- disabled;
- controlled mode;
- uncontrolled mode;
- toolbar interaction;
- image upload UX;
- extension customization.

Clarify ambiguous formatting behavior before implementation.

### Task 03 — Define Public Editor Composition Model

Finalize how consumers compose the React editor.

Support a clear separation between:

- editor instance;
- editor content;
- toolbar;
- toolbar controls;
- custom extensions.

Avoid forcing consumers into one monolithic component structure.

### Task 04 — Define Headless Editor Content Surface

Introduce the appropriate content-level React surface for composability.

The implementation may wrap or expose Tiptap's existing content surface where appropriate instead of creating an unnecessary abstraction.

The goal is to allow composition such as:

```tsx
<EditorContent />
<EditorToolbar />
```

or an equivalent supported API.

### Task 05 — Refactor Editor into Editor Shell

Refactor the existing `Editor` implementation if necessary so it behaves as an editor shell rather than a monolithic UI implementation.

The shell should coordinate:

- editor creation;
- editor lifecycle;
- controlled/uncontrolled behavior;
- editor content;
- default toolbar;
- editor state;
- labels;
- extensions;
- configuration.

Avoid putting every future UI concern into `Editor.tsx`.

---

## B. Toolbar MVP

### Task 06 — Finalize Toolbar Architecture

Finalize the toolbar architecture using the existing core toolbar definition model.

Support:

- built-in controls;
- control ordering;
- active state;
- disabled state;
- labels;
- keyboard interaction;
- selection preservation;
- future custom controls.

### Task 07 — Implement Toolbar Groups

Introduce toolbar grouping only where it improves composition and accessibility.

Groups must remain independent of a particular visual design system.

### Task 08 — Implement Complete MVP Formatting Toolbar

Ensure the default toolbar exposes:

- bold;
- italic;
- underline;
- heading;
- unordered list;
- ordered list;
- blockquote;
- code;
- horizontal rule;
- link;
- image;
- undo;
- redo.

The toolbar must use the core command/definition layer.

### Task 09 — Implement Toolbar Active State

Controls representing contextual formatting must accurately reflect the current selection.

Examples:

- bold;
- italic;
- underline;
- heading;
- list type;
- blockquote;
- code;
- link state where applicable.

### Task 10 — Implement Toolbar Disabled State

Toolbar controls must become disabled when their command cannot be executed.

Correctly handle:

- disabled editor;
- read-only editor;
- unavailable commands;
- invalid selection/context.

### Task 11 — Implement Toolbar Keyboard Navigation

Implement accessible keyboard navigation with a predictable roving-tabindex/focus model.

Keyboard interaction must not create a keyboard trap.

### Task 12 — Implement Toolbar Selection Preservation

Ensure toolbar interactions do not unexpectedly destroy the editor selection.

Example:

1. select text;
2. move focus to toolbar;
3. activate formatting;
4. formatting is applied to the original selection.

---

## C. Text Formatting MVP

### Task 13 — Implement Basic Text Formatting

Validate and complete:

- bold;
- italic;
- underline.

Include toolbar commands, supported shortcuts, active states, disabled states, and selection behavior.

### Task 14 — Implement Heading Controls

Implement the MVP heading interaction and levels defined by the approved scope.

The toolbar should clearly indicate the current heading state.

### Task 15 — Implement List Controls

Implement:

- unordered lists;
- ordered lists.

Validate nested behavior supported by the selected extensions, active state, disabled state, keyboard behavior, and selection preservation.

### Task 16 — Implement Block Formatting

Implement and validate:

- blockquote;
- code;
- horizontal rule.

Clarify whether `code` represents inline code, code block, or both according to the final MVP interpretation before implementation.

### Task 17 — Validate Undo/Redo UX

Ensure undo/redo:

- works through toolbar controls;
- respects Tiptap history;
- updates disabled state correctly;
- does not create application-level document state;
- behaves correctly after formatting and content changes.

---

## D. Link MVP

### Task 18 — Design Link Interaction

Define the MVP interaction model for:

- inserting a link;
- editing a link;
- removing a link;
- opening/editing link UI from an existing linked selection.

Choose the appropriate popover/dialog interaction before implementation.

### Task 19 — Implement Link Dialog/Popover

Create the React UI required to enter or edit the URL and supported metadata.

Provide:

- clear labels;
- validation;
- cancel behavior;
- submit behavior;
- keyboard support.

### Task 20 — Integrate Link Security

Use the existing core URL security utilities.

The React UI must not bypass the core security layer.

Unsafe URL schemes must be rejected or handled according to the existing security contract.

### Task 21 — Implement Link Editing

Support:

- insert;
- edit;
- remove;
- linked-text selection;
- selection preservation when opening/closing the UI.

### Task 22 — Test Link Behavior

Cover:

- valid URLs;
- invalid URLs;
- unsafe schemes;
- insert;
- edit;
- remove;
- selection preservation;
- keyboard interaction;
- disabled/read-only behavior.

---

## E. Image MVP

### Task 23 — Design Image Insertion UX

Define the MVP image insertion experience, including:

- selecting an image;
- uploading;
- insertion;
- progress;
- failure;
- metadata;
- cancellation where supported.

### Task 24 — Implement Image Insert UI

Implement the React UI required to initiate image insertion.

Connect to the existing core image upload pipeline rather than creating a second upload mechanism.

### Task 25 — Integrate Existing ImageUpload Pipeline

Connect the React editor to:

- upload handler;
- validation;
- `AbortSignal`;
- progress callback;
- placeholder;
- cleanup;
- safe source validation.

No storage provider dependency should be added.

### Task 26 — Implement Image Upload Progress UI

Display progress where the current upload contract provides it.

The UI must remain provider-agnostic.

### Task 27 — Implement Image Upload Error UI

Provide a clear failure state showing that the upload failed and the image was not successfully inserted.

The editor must remain usable after failure.

### Task 28 — Implement Image Metadata UX

Support the MVP image metadata requirements.

At minimum, provide a path for setting or preserving alt text.

If dimensions are exposed by the upload result, ensure they can be represented correctly.

### Task 29 — Validate Paste & Drag/Drop Image

Validate the existing core image pipeline through the React editor:

- paste;
- drag/drop;
- validation;
- progress;
- failure;
- cleanup;
- safe source enforcement.

Do not reimplement functionality already owned by `editor-core`.

---

## F. Editor State & Interaction

### Task 30 — Finalize Read-only UX

Read-only mode must:

- allow focus where appropriate;
- allow selection;
- allow copying;
- prevent document editing;
- communicate read-only state semantically;
- prevent misleading editing controls.

### Task 31 — Finalize Disabled UX

Disabled mode must:

- prevent editing;
- prevent inappropriate interaction;
- disable relevant controls;
- expose the disabled state semantically;
- remain distinct from read-only behavior.

### Task 32 — Validate Placeholder Behavior

Validate placeholder behavior for:

- empty document;
- focused editor;
- unfocused editor;
- read-only;
- disabled;
- initial content;
- controlled mode;
- uncontrolled mode.

### Task 33 — Validate Controlled Mode Under Full Editing

Validate:

```tsx
<Editor
  value={content}
  onChange={setContent}
/>
```

Ensure:

- document changes emit `onChange`;
- no update loop occurs;
- equivalent incoming content does not cause unnecessary resets;
- cursor/selection is preserved where possible;
- formatting works;
- links work;
- images work.

### Task 34 — Validate Uncontrolled Mode Under Full Editing

Validate:

```tsx
<Editor defaultValue={content} />
```

Ensure:

- initial content loads;
- editing works normally;
- no unnecessary external state is required;
- formatting, links, and images work.

### Task 35 — Validate Selection Preservation

Validate selection preservation across:

- toolbar clicks;
- link UI;
- image UI;
- formatting commands;
- controlled updates where applicable.

---

## G. Styling & Theming

### Task 36 — Finalize Editor MVP CSS

Complete namespaced editor styles for:

- editor content;
- toolbar;
- buttons;
- dialogs/popovers;
- links;
- images;
- upload states;
- disabled state;
- read-only state;
- focus states.

### Task 37 — Implement MVP Dark Mode

Ensure the editor stylesheet supports the existing dark-mode direction through the package styling contract, without requiring Tailwind.

### Task 38 — Validate CSS Variable Contract

Validate consumer customization through documented `--rk-editor-*` variables.

Do not introduce application-specific public variables.

---

## H. Accessibility

### Task 39 — Accessibility Audit Toolbar

Validate:

- semantic toolbar;
- accessible names;
- keyboard navigation;
- focus visibility;
- disabled state;
- active state;
- no keyboard trap.

### Task 40 — Accessibility Audit Link UI

Validate:

- labels;
- focus order;
- keyboard interaction;
- error messaging;
- dialog/popover semantics;
- escape/cancel behavior.

### Task 41 — Accessibility Audit Image UI

Validate:

- accessible file/image controls;
- progress state;
- error state;
- metadata inputs;
- focus behavior.

### Task 42 — Add axe-core MVP Coverage

Add targeted axe-core coverage for editor MVP surfaces.

This is baseline validation only; comprehensive accessibility auditing remains a later phase.

---

## I. React Package API & Tests

### Task 43 — Update React Public Exports

Review and update public exports for the completed MVP.

Only intentionally public APIs should be exported. Avoid exposing internal modules.

### Task 44 — Add React Component Tests

Add component-level tests covering:

- editor rendering;
- content;
- toolbar;
- formatting;
- read-only;
- disabled;
- controlled;
- uncontrolled;
- placeholder.

### Task 45 — Add Link UI Tests

Test:

- open;
- close;
- insert;
- edit;
- remove;
- validation;
- unsafe URLs;
- keyboard interaction;
- selection preservation.

### Task 46 — Add Image UI Tests

Test:

- image insertion;
- upload progress;
- upload success;
- upload failure;
- alt text;
- paste/drop integration;
- disabled/read-only behavior.

### Task 47 — Add Public API Type Tests

Validate the public TypeScript API.

Ensure documented props and exports resolve correctly and invalid usage fails appropriately.

---

## J. Playground Integration

### Task 48 — Upgrade Playground for Editor MVP

Update `apps/playground` to exercise the completed MVP through published package APIs.

The playground remains an internal validation and visual QA environment and must not import `packages/*/src`.

### Task 49 — Add Full Formatting Scenario

Create a scenario covering:

- text formatting;
- headings;
- lists;
- blockquote;
- code;
- horizontal rule;
- undo/redo.

### Task 50 — Add Link Scenario

Add a scenario covering:

- insert;
- edit;
- remove;
- safe URL behavior;
- invalid URL behavior.

### Task 51 — Add Image Scenario

Add a scenario covering:

- image selection;
- mock upload;
- progress;
- success;
- error;
- alt text;
- paste/drop where practical.

### Task 52 — Update Existing Playground Scenarios

Revalidate existing scenarios:

- Basic;
- Initial content;
- Read-only;
- Disabled;
- Controlled;
- Uncontrolled;
- controlled/uncontrolled conflict;
- Placeholder/editable/disabled;
- Labels;
- Custom extensions;
- Content inspector;
- Toolbar composition;
- Image upload mock;
- Upload error;
- Link security.

---

## K. Browser Validation

### Task 53 — Add Editor MVP Browser Tests

Add basic Playwright validation for completed MVP behavior.

Browser tests should focus on real user interaction rather than duplicating every unit/component test.

### Task 54 — Test Real Selection Behavior

Use browser interaction to validate:

- selecting text;
- formatting selected text;
- preserving selection through toolbar interaction;
- editing links.

### Task 55 — Test Keyboard Interaction

Validate:

- typing;
- supported keyboard formatting;
- toolbar keyboard navigation;
- link UI keyboard interaction;
- undo/redo.

### Task 56 — Test Image Paste / Drop

Validate browser-level image interaction where practical:

- paste;
- drag/drop;
- upload state;
- success;
- failure.

Keep this at MVP coverage level rather than implementing the complete browser/a11y matrix planned for later phases.

---

## L. Performance & Stability

### Task 57 — Check Editor Recreation

Verify React rendering does not unnecessarily recreate the Tiptap editor instance.

Pay particular attention to props, extensions, labels, controlled values, and toolbar state.

### Task 58 — Check Extension Stability

Verify custom extensions do not cause unnecessary editor recreation or state loss.

### Task 59 — Check Controlled Serialization

Ensure controlled mode does not unnecessarily serialize and re-apply the document on every render.

### Task 60 — Check Toolbar State Updates

Ensure toolbar state updates are responsive without unnecessary React rendering or editor recreation.

---

## M. Documentation & Developer Experience

### Task 61 — Update Public API Documentation

Update documentation needed to explain:

- `Editor`;
- `EditorContent`;
- `EditorToolbar`;
- toolbar composition;
- editor props;
- controlled/uncontrolled usage;
- read-only;
- disabled;
- extensions.

### Task 62 — Add Editor MVP Examples to Fumadocs

Add practical examples for:

- basic editor;
- controlled editor;
- read-only;
- disabled;
- custom extensions;
- custom toolbar composition.

Fumadocs remains the canonical public documentation/example surface.

### Task 63 — Document Image Upload Contract

Document:

- `File`;
- `AbortSignal`;
- progress;
- result;
- error handling;
- safe source behavior.

Do not prescribe a specific storage provider.

### Task 64 — Document Link Security

Document:

- safe URL behavior;
- rejected/unsafe schemes;
- consumer responsibilities when rendering exported HTML;
- distinction between editor security utilities and application-level HTML sanitization.

---

## N. Final Validation & Phase Gate

### Task 65 — Run Package Type Checks

Run type checking for:

- `editor-core`;
- `editor-react`;
- playground where applicable.

Resolve relevant TypeScript errors.

### Task 66 — Run Unit & React Tests

Run the complete unit/component suite relevant to Phase 06.

### Task 67 — Run Coverage

Review coverage for new Phase 06 functionality, focusing on behavior rather than an arbitrary percentage.

### Task 68 — Run Package Validation

Validate package artifacts and exports:

- package builds;
- public exports resolve;
- internal modules are not unintentionally exposed;
- styles are included;
- declarations are valid.

Full release/versioning infrastructure remains Phase 09.

### Task 69 — Run Browser Tests

Run Phase 06 Playwright MVP tests and confirm the playground and Fumadocs-related browser projects remain functional.

### Task 70 — Run Full Repository Check

Run the repository's standard validation commands:

```bash
pnpm check
pnpm check-types
pnpm test
pnpm build
```

Resolve regressions before completing the phase.

### Task 71 — Verify Public Package Boundary

Verify:

```text
editor-core
    ↓
editor-react
    ↓
consumer
```

Confirm:

- core has no React dependency;
- React adapter does not import application code;
- playground does not import package source files;
- Tailwind is not required by published packages.

### Task 72 — Review Public API

Perform a final API review:

- every public export is intentional;
- API remains small;
- names are consistent;
- props are understandable;
- internals remain hidden;
- consumers can compose the editor without hacks.

### Task 73 — Review MVP Scope

Confirm Phase 06 does not accidentally introduce:

- collaboration;
- backend/storage;
- authentication;
- AI features;
- Vue adapter;
- Markdown;
- comments;
- version history;
- enterprise functionality;
- release infrastructure.

### Task 74 — Update AGENTS.md

Update agent instructions with finalized Phase 06 architecture and implementation rules covering:

- package boundaries;
- public API;
- editor state ownership;
- extension rules;
- testing;
- styling;
- security;
- Phase 09 release/versioning boundary.

### Task 75 — Update Roadmap

Update the roadmap only after Phase 06 implementation and validation are complete.

Do not prematurely mark later phases as complete.

### Task 76 — Phase 06 Final Review

Perform a final human review of:

- editor UX;
- API;
- formatting;
- links;
- images;
- controlled/uncontrolled behavior;
- read-only/disabled behavior;
- accessibility baseline;
- package boundaries;
- tests;
- playground;
- documentation.

Phase 06 is complete only when the editor can reasonably be consumed as an MVP by a future project without requiring access to internal package source files.

---

# 4. Definition of Done

Phase 06 is complete when:

- [ ] Editor MVP functionality is implemented.
- [ ] React editor composition is clean and composable.
- [ ] `EditorContent` or the finalized equivalent is publicly usable.
- [ ] Default toolbar exposes required MVP controls.
- [ ] Formatting controls work correctly.
- [ ] Links can be inserted, edited, and removed.
- [ ] Link security rules are enforced.
- [ ] Images can be inserted through the existing upload abstraction.
- [ ] Upload progress and failure states are represented.
- [ ] Alt text can be handled.
- [ ] Paste/drop image behavior works.
- [ ] Controlled mode works without update loops.
- [ ] Uncontrolled mode works.
- [ ] Read-only mode works.
- [ ] Disabled mode works.
- [ ] Placeholder behavior works.
- [ ] CSS variables remain the supported theming mechanism.
- [ ] Published packages do not require Tailwind.
- [ ] Accessibility baseline is validated.
- [ ] React component tests pass.
- [ ] Type tests pass.
- [ ] Browser MVP tests pass.
- [ ] Playground validates the MVP through package exports.
- [ ] Fumadocs contains required MVP examples.
- [ ] Public API has been reviewed.
- [ ] Package boundaries remain intact.
- [ ] `AGENTS.md` is updated.
- [ ] Roadmap is updated after implementation.
- [ ] No Phase 09 release/versioning infrastructure is introduced.

---

# 5. Expected Deliverables

At the end of Phase 06, the repository should contain:

1. A composable React editor surface.
2. A complete MVP toolbar.
3. Basic formatting support.
4. Link interaction.
5. Image insertion/upload UX.
6. Controlled and uncontrolled React usage.
7. Read-only and disabled states.
8. Placeholder support.
9. CSS variable-based styling and dark mode.
10. Accessibility baseline.
11. React/component tests.
12. Browser MVP tests.
13. Updated playground scenarios.
14. Fumadocs MVP examples.
15. Updated public API exports.
16. Updated agent instructions.
17. Updated roadmap.

---

# 6. Phase Boundary

Phase 06 is an **Editor MVP implementation phase**, not a final production-hardening phase.

The goal is to establish a complete, reusable, composable editor experience that later phases can harden through:

- deeper browser testing;
- comprehensive accessibility testing;
- broader documentation;
- performance work;
- package validation;
- release/versioning infrastructure.

> **Do not solve Phase 07, Phase 08, or Phase 09 prematurely.**

Keep Phase 06 focused on making the editor itself complete and usable while preserving the architecture required for later phases.
