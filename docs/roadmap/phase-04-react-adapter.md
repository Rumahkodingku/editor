# Phase 04 — React Adapter

**Project:** RumahKodingku Editor  
**Package:** `@rumahkodingku/editor-react`  
**Depends on:** Phase 03 — Editor Core  
**Status:** Planned / Approved  
**Execution target:** React 19 + Tiptap 3  
**Package format:** ESM-first  
**License:** MIT

---

> **Execution note (Phase 04).** Tasks 18–22, 23, and 24 are delivered at the **adapter level only**. The toolbar renders the core `ToolbarItemDefinition`s with active/disabled state, and link/image integration relies on the core security rules and the provider-independent `ImageUpload` contract. Full toolbar composition/hiding UX and link/image dialog UX are delivered in **Phase 06 (Editor MVP)**, consistent with `PRD.md` §31. This resolves the overlap between this document and the PRD's milestone split.

## 1. Phase Objective

Phase 04 implements the React adapter for RumahKodingku Editor.

The goal is to turn the framework-independent `@rumahkodingku/editor-core` API delivered in Phase 03 into a usable React integration without moving editor business logic into React.

The React adapter is responsible for:

- React component lifecycle.
- React-specific props.
- Controlled and uncontrolled content synchronization.
- Integration with `@tiptap/react`.
- React rendering of the Tiptap editor.
- React rendering of toolbar definitions from `editor-core`.
- React event callbacks.
- React labels integration.
- React-specific styling.
- SSR-safe rendering configuration.
- React-specific tests and package validation.

The adapter MUST consume the public API of `@rumahkodingku/editor-core` instead of duplicating core editor logic.

---

## 2. Phase Position

```text
Phase 00  Repository Foundation & Agent Readiness     DONE
Phase 01  Build & Package Infrastructure              DONE
Phase 02  Test Infrastructure                         DONE
Phase 03  Editor Core                                 DONE
Phase 04  React Adapter                               CURRENT
Phase 05  Playground                                  NEXT
Phase 06  Editor MVP                                   NEXT
Phase 07  Browser & Accessibility                      NEXT
Phase 08  Documentation                                NEXT
Phase 09  Release Engineering                          NEXT
```

Phase 04 must not silently absorb the responsibilities of Phase 05–09.

---

## 3. Source of Truth

Implementation must follow these project documents in this order:

1. `PRD.md`
2. `ARCHITECTURE.md`
3. `AGENTS.md`
4. Phase 04 execution tasks in this document.

The phase document defines execution order, implementation tasks, validation, and exit criteria. It must not override architectural constraints already approved by the project.

---

## 4. Existing Phase 03 Contract

Phase 04 starts from the Phase 03 core API.

The existing core provides, among other APIs:

- `createEditor()`
- `createDefaultExtensions()`
- `composeExtensions()`
- `createEmptyDocument()`
- `isValidJSONContent()`
- `isEmptyContent()`
- `normalizeContent()`
- `toJSON()`
- `toHTML()`
- `jsonToHTML()`
- persistence envelope/schema-version utilities
- image upload contracts and `ImageUpload`
- toolbar definitions
- labels
- URL/security utilities
- editor error types.

The React adapter MUST NOT recreate these features.

---

# 5. Architecture Rules

## 5.1 Dependency Direction

The dependency direction is:

```text
@rumahkodingku/editor-core
        ↑
        │
@rumahkodingku/editor-react
        ↑
        │
consumer application
```

`editor-core` MUST remain independent of React.

`editor-react` MAY depend on:

- `@rumahkodingku/editor-core`
- `@tiptap/react`
- `react`
- `react-dom`

It MUST NOT introduce:

- Vue dependencies.
- application state-management dependencies.
- Tailwind as a runtime requirement.
- backend providers.
- upload providers.
- database dependencies.
- authentication dependencies.

---

## 5.2 Tiptap Is the Editor State Owner

Tiptap/ProseMirror remains the source of truth for editor state.

React state MUST NOT become the primary document state.

React state is only responsible for React integration concerns such as:

- props.
- lifecycle.
- synchronization boundaries.
- rendering.
- callbacks.

The adapter must avoid unnecessary serialization and unnecessary editor recreation.

---

## 5.3 Core Owns Editor Logic

The React adapter must use core APIs for:

- editor creation/configuration.
- default extensions.
- extension composition.
- content normalization.
- serialization.
- image-upload contracts.
- toolbar definitions.
- labels.
- security helpers.

React-specific code must not duplicate these rules.

---

## 5.4 Styling Boundary

The React package owns React-facing editor CSS.

Rules:

- CSS must remain framework-agnostic.
- Tailwind is not required.
- Published package CSS must be consumable by normal React applications.
- CSS must use stable `rk-` namespaced selectors/custom properties.
- The core package must remain UI-style-free.
- Application-specific visual customization remains outside the package.

---

# 6. Intended React API

The Phase 04 public API is based on the approved React contract.

Conceptually:

```ts
import type {
  AnyExtension,
  Editor,
  JSONContent,
} from "@tiptap/core";

export type EditorProps = {
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

The final exported type names and component names must follow the approved public API implementation and type tests.

Do not add speculative public APIs merely because they could be useful.

---

# 7. Controlled and Uncontrolled Model

## 7.1 Uncontrolled

When `defaultValue` is provided without `value`:

- It initializes the editor document.
- Subsequent editor changes remain owned by Tiptap.
- `onChange` can notify the consumer.
- React must not recreate the editor for ordinary content updates.

Example:

```tsx
<Editor
  defaultValue={initialContent}
  onChange={(content) => {
    saveDraft(content);
  }}
/>
```

---

## 7.2 Controlled

When `value` is provided:

- The adapter synchronizes the editor document with the supplied value.
- Editor selection/history should not be unnecessarily destroyed.
- The editor instance should remain stable while normal props change.
- The adapter must avoid update loops.
- `onChange` must not create a React → editor → React infinite cycle.

Example:

```tsx
<Editor
  value={content}
  onChange={setContent}
/>
```

---

## 7.3 Controlled/Uncontrolled Conflict

The implementation must define and test behavior when both `value` and `defaultValue` are provided.

The behavior must be:

- deterministic.
- documented in the API contract.
- covered by tests.

Do not silently create two competing sources of truth.

---

# 8. Task Execution Plan

## A. React API Foundation

### Task 01 — Audit Contract Phase 03 → Phase 04

Review the Phase 03 public API before implementation.

Verify:

- exported core types.
- editor creation contract.
- extension composition contract.
- toolbar contract.
- labels contract.
- upload contract.
- content contract.
- serialization contract.
- package boundaries.

**Acceptance criteria**

- Phase 04 implementation references only valid Phase 03 APIs.
- No duplicated core responsibility is introduced.
- Any required core change is identified before React implementation proceeds.

---

### Task 02 — Define React Public API

Create the canonical React-facing types and component contract.

Define:

- editor props.
- event callback types.
- labels type usage.
- extension configuration.
- rendering options.
- content input contract.
- controlled/uncontrolled behavior.

**Acceptance criteria**

- API is strongly typed.
- Public types do not expose unnecessary internal implementation details.
- API follows PRD terminology.
- Type tests can consume the API.

---

### Task 03 — Define React Package Export Surface

Define the package's public exports.

The package must have a minimal public surface.

Potential categories include:

- main editor component.
- public prop types.
- React-specific supporting types.
- approved toolbar components/types.
- stylesheet entry.

Do not export internal hooks/helpers unless they are intentionally part of the public contract.

**Acceptance criteria**

- `src/index.ts` exposes only intentional public APIs.
- Internal implementation modules remain private.
- Package exports resolve correctly after build.

---

# B. Editor Integration

### Task 04 — Implement Editor Instance Lifecycle

Implement React-safe creation and destruction of the Tiptap editor instance.

Requirements:

- Create one editor instance per mounted editor component.
- Destroy it when the component unmounts.
- Avoid recreation caused by ordinary render cycles.
- Handle changing props without destroying the editor unnecessarily.
- Preserve Tiptap as the state owner.

**Acceptance criteria**

- Editor is created exactly when required.
- Editor is destroyed on cleanup.
- React rerenders do not recreate the editor.
- Lifecycle behavior works under React StrictMode.

---

### Task 05 — Integrate `@tiptap/react`

Integrate the installed Tiptap React package according to its supported API.

The adapter must use Tiptap React for React rendering/lifecycle integration rather than implementing an independent ProseMirror DOM renderer.

**Acceptance criteria**

- `@tiptap/react` is a peer dependency.
- React rendering uses supported Tiptap React primitives.
- No duplicate editor rendering engine is introduced.

---

### Task 06 — Implement `EditorContent` Integration

Connect the editor instance to the React content renderer.

Requirements:

- Correct editor instance binding.
- Correct DOM mounting.
- Cleanup.
- className integration.
- compatibility with editor CSS.

**Acceptance criteria**

- Tiptap content renders inside the React component.
- Content updates are reflected in the DOM.
- Component unmount does not leak the editor instance.

---

### Task 07 — Implement Basic `Editor` Component

Implement the main React editor component.

The initial structure should separate:

```text
Editor
├── Editor root
├── Toolbar integration
└── EditorContent
```

The exact component hierarchy should remain implementation-private unless explicitly exported.

**Acceptance criteria**

- Component renders.
- Empty editor works.
- Initial content works.
- Editor instance is available to internal adapter components.
- No application-specific behavior is embedded.

---

### Task 08 — Implement Uncontrolled Mode

Implement `defaultValue`.

Requirements:

- Initial JSON content is loaded once.
- Subsequent edits remain Tiptap-owned.
- Parent rerenders do not reset content.
- `onChange` remains available.

**Acceptance criteria**

- Initial content renders correctly.
- Editing does not trigger editor recreation.
- Parent rerender does not reset document state.

---

### Task 09 — Implement Controlled Mode

Implement `value` synchronization.

Requirements:

- Detect meaningful external content changes.
- Avoid resetting the document on every render.
- Avoid infinite update loops.
- Preserve editor instance.
- Preserve selection/history whenever possible.

**Acceptance criteria**

- Parent-controlled content can update the editor.
- User edits propagate through `onChange`.
- External updates propagate into Tiptap.
- No infinite update loop exists.

---

### Task 10 — Define Controlled/Uncontrolled Conflict Rules

Define the exact behavior when both `value` and `defaultValue` are supplied.

The rule must be:

- deterministic.
- documented in the API contract.
- covered by tests.

If a development warning is chosen, it must be deterministic and testable.

**Acceptance criteria**

- Conflict behavior is explicitly defined.
- Test coverage exists.
- No ambiguous dual source of truth remains.

---

### Task 11 — Implement `onChange`

Map Tiptap document updates to the React callback.

Requirements:

- Listen to editor updates.
- Return canonical JSON content.
- Do not unnecessarily serialize HTML.
- Avoid firing an unwanted initial callback unless explicitly required by the API.
- Clean up listeners.

**Acceptance criteria**

- Callback receives `JSONContent`.
- Callback fires on actual document updates.
- Listener is removed during cleanup.
- No duplicate callback registration occurs.

---

### Task 12 — Implement `onReady`

Expose the editor instance after initialization.

Requirements:

- Callback receives the actual Tiptap editor.
- Callback fires once for each editor instance.
- It does not fire on every React render.

**Acceptance criteria**

- Consumer can access the editor instance.
- Callback lifecycle is deterministic.

---

### Task 13 — Implement Editable / Disabled State

Implement React handling for:

- `editable`
- `disabled`

The exact semantics must be defined before implementation and reflected consistently in:

- editor state.
- interaction behavior.
- toolbar state.
- accessibility attributes where applicable.

**Acceptance criteria**

- Editable state can be changed without recreating the editor.
- Disabled behavior is consistent.
- Toolbar controls reflect unavailable actions when appropriate.

---

### Task 14 — Implement Placeholder Integration

Connect the React `placeholder` prop to the core placeholder extension configuration.

The adapter must not create a second placeholder implementation.

**Acceptance criteria**

- Placeholder appears only when appropriate.
- Placeholder updates follow the approved prop behavior.
- Core remains responsible for placeholder behavior.

---

### Task 15 — Implement Custom Extensions

Allow consumers to provide additional Tiptap extensions through the approved React API.

Use the core extension composition mechanism.

Do not create a second extension-merging implementation in React.

**Acceptance criteria**

- Consumer extensions are recognized.
- Default extensions remain available according to the contract.
- Duplicate extension handling follows core behavior.
- Strict composition behavior remains available through core APIs where applicable.

---

### Task 16 — Stabilize Extension Configuration

Prevent unstable extension arrays/options from unnecessarily recreating the editor.

Consider:

- memoization.
- stable references.
- initialization boundaries.
- explicit configuration changes.

Do not use aggressive memoization that makes legitimate configuration updates impossible.

**Acceptance criteria**

- Normal parent rerenders do not recreate the editor.
- Extension configuration behavior is predictable.
- Tests verify editor instance stability.

---

### Task 17 — Implement Labels Integration

Connect React labels to the core label system.

Requirements:

- Partial label overrides.
- Default labels remain available.
- Toolbar and UI controls use resolved labels.
- No hard-coded duplicate labels where core labels already exist.

**Acceptance criteria**

- Consumer can override supported labels.
- Defaults remain intact.
- UI text is consistent with core labels.

---

# C. Toolbar

### Task 18 — Implement Toolbar React Adapter

Render the toolbar definitions supplied by `editor-core`.

The adapter is responsible for translating core definitions into React UI.

Core remains responsible for command definitions.

**Acceptance criteria**

- Default toolbar actions render.
- Actions call the correct editor commands.
- React UI does not contain duplicated command logic.

---

### Task 19 — Implement Toolbar State Synchronization

Synchronize toolbar state with the current editor state.

Support:

- active state.
- disabled state.
- command availability.

Toolbar state must update when selection or editor state changes.

**Acceptance criteria**

- Bold/italic/etc. active states update correctly.
- Undo/redo disabled state updates correctly.
- Toolbar does not require React global state.

---

### Task 20 — Implement Toolbar Composition API

Support the approved toolbar composition model.

Consumers should be able to:

- use default toolbar.
- hide supported controls.
- add custom controls.
- compose additional toolbar items.

The public API should remain minimal.

**Acceptance criteria**

- Default toolbar is usable.
- Composition does not mutate global toolbar definitions.
- Custom controls can access the editor safely.
- Core toolbar contracts remain reusable.

---

### Task 21 — Implement Toolbar Accessibility

Implement basic React toolbar semantics.

Requirements include:

- semantic buttons.
- accessible names.
- keyboard-operable controls.
- disabled state.
- appropriate `aria-` attributes where needed.

This task covers adapter-level semantics. Comprehensive browser accessibility validation remains part of Phase 07.

**Acceptance criteria**

- Toolbar controls are keyboard operable.
- Controls have accessible names.
- Disabled controls expose correct state.
- No obvious semantic violations remain.

---

### Task 22 — Implement Icon Rendering Strategy

Implement the approved icon strategy.

Rules:

- Inline SVG.
- No mandatory icon library.
- Icons must not become a core dependency.
- Icon rendering should be replaceable/composable where the public API requires it.

**Acceptance criteria**

- Default toolbar has icons.
- No external icon library is required.
- Icons have appropriate accessibility handling.

---

# D. Interactive Features

### Task 23 — Implement Link UI Integration

Integrate the existing core link functionality into React UI where required by the approved Phase 04 API.

Rules:

- Core owns link behavior/security.
- React owns interaction/UI.
- No unsafe URL protocol bypass.
- No direct HTML injection.

**Acceptance criteria**

- Link interaction works through the approved UI.
- Safe URL rules from core remain effective.
- Invalid/unsafe URLs are not accepted.

If full link UX is intentionally deferred to Phase 06, keep this integration minimal and do not introduce a large dialog/form system into Phase 04.

---

### Task 24 — Implement Image UI Integration

Integrate image insertion with the core image-upload contract.

Requirements:

- React provides UI.
- Core owns upload behavior.
- Consumer supplies the upload handler.
- No storage provider dependency.
- Upload progress/errors are represented through the approved contract.

**Acceptance criteria**

- Image insertion can invoke the core upload pipeline.
- Consumer-provided upload handlers work.
- Upload failures do not leave broken placeholder nodes.
- No S3/Cloudinary/Supabase/etc. dependency is introduced.

---

### Task 25 — Define Editor Ref / Imperative Access

Evaluate whether imperative editor access is required as part of the approved React public API.

If required:

- expose only the necessary editor instance access.
- avoid exposing internal adapter state.
- document lifecycle guarantees.

If not required:

- keep the editor instance internal and rely on `onReady`.

**Acceptance criteria**

- A deliberate public API decision is recorded.
- No unnecessary ref API is exposed.

---

### Task 26 — Evaluate React Hook API

Evaluate whether a public React hook is required.

A hook such as `useEditor` MUST NOT be exposed merely because Tiptap provides hooks internally.

If a project-specific public hook is needed, define:

- purpose.
- lifecycle.
- return type.
- stability guarantees.
- SSR behavior.
- test contract.

Otherwise keep hooks internal.

**Acceptance criteria**

- Public hook decision is explicit.
- Internal hooks remain private.
- Public API does not grow without a concrete use case.

---

# E. Runtime / Styling

### Task 27 — SSR & `immediatelyRender`

Implement SSR-safe behavior using the approved `immediatelyRender` option.

Requirements:

- Support SSR environments.
- Avoid browser-only assumptions during server rendering.
- Prevent hydration mismatch caused by premature editor rendering.
- Follow the installed Tiptap React API.

**Acceptance criteria**

- SSR-related configuration is passed correctly.
- No browser-only API is accessed during server render.
- Hydration behavior is deterministic.

---

### Task 28 — React StrictMode Compatibility

Validate the adapter under React StrictMode.

Pay special attention to:

- editor creation.
- editor destruction.
- event subscriptions.
- `onReady`.
- `onChange`.
- upload listeners.
- toolbar listeners.

**Acceptance criteria**

- No duplicated listeners.
- No leaked editor instances.
- No duplicate externally visible callbacks caused by lifecycle mistakes.

---

### Task 29 — Implement React Package CSS Contract

Complete the React package stylesheet.

Requirements:

- framework agnostic.
- CSS variables.
- namespaced selectors.
- editor surface.
- toolbar foundation.
- disabled/read-only states.
- focus states.
- basic typography.
- content spacing.
- image states.
- upload placeholder states where applicable.

Do not turn this into the final visual design system.

**Acceptance criteria**

- CSS ships from `@rumahkodingku/editor-react/styles.css`.
- CSS does not require Tailwind.
- Styles do not leak broadly into the host application.
- CSS variables can be overridden by consumers.

---

### Task 30 — Define CSS Class Naming

Establish stable `rk-editor-` / `rk-` namespaced class conventions.

Examples may include:

```text
.rk-editor
.rk-editor__toolbar
.rk-editor__content
.rk-editor__button
.rk-editor__button--active
.rk-editor__button--disabled
```

The exact naming scheme must be implemented consistently.

**Acceptance criteria**

- No generic global selectors such as `.toolbar` or `.editor`.
- Class naming is predictable.
- CSS selectors match component output.

---

# F. Testing

### Task 31 — React Component Unit Tests

Add component tests covering:

- render.
- mount/unmount.
- initial content.
- empty content.
- editor lifecycle.
- basic editing.
- callback registration.

Use the established Vitest + React Testing Library infrastructure.

**Acceptance criteria**

- Core React component behavior is covered.
- Tests run deterministically.

---

### Task 32 — Controlled Mode Tests

Test:

- initial controlled value.
- parent update.
- user update.
- no infinite loops.
- stable editor instance.
- external document replacement.
- selection preservation where applicable.

**Acceptance criteria**

- Controlled mode behavior is fully deterministic.
- Regression coverage exists for update-loop scenarios.

---

### Task 33 — Uncontrolled Mode Tests

Test:

- `defaultValue`.
- user editing.
- parent rerender.
- no content reset.
- `onChange`.

**Acceptance criteria**

- Uncontrolled behavior remains Tiptap-owned.
- Parent rerenders do not reset the document.

---

### Task 34 — Toolbar Tests

Test:

- command execution.
- active state.
- disabled state.
- undo/redo.
- toolbar composition.
- label overrides.
- icon rendering.

**Acceptance criteria**

- Toolbar behavior is covered independently from browser E2E tests.

---

### Task 35 — Image Upload UI Tests

Test the React integration with the core upload contract.

Cover:

- successful upload.
- progress callback.
- rejected file.
- upload error.
- cancellation/abort where supported.
- placeholder cleanup.

Do not test a real external storage provider.

**Acceptance criteria**

- React correctly connects to the provider-independent upload contract.
- Errors are represented without breaking the editor.

---

### Task 36 — Accessibility Tests

Add adapter-level accessibility tests using the existing test infrastructure and `axe-core` where appropriate.

Minimum coverage:

- editor root.
- toolbar.
- buttons.
- labels.
- focus states.
- disabled controls.

This is not the full Phase 07 browser/accessibility program.

**Acceptance criteria**

- No known critical accessibility violations in the tested component states.
- Accessibility regressions are captured by automated tests.

---

### Task 37 — Type Contract Tests

Verify TypeScript behavior for:

- `EditorProps`.
- controlled mode.
- uncontrolled mode.
- extensions.
- labels.
- callbacks.
- public exports.
- editor instance types.

**Acceptance criteria**

- Public types compile correctly.
- Invalid API usage is rejected where intended.
- Internal implementation types are not accidentally exported.

---

### Task 38 — Public API Import Tests

Verify that consumers can import the supported API from:

```ts
@rumahkodingku/editor-react
```

and stylesheet from:

```ts
@rumahkodingku/editor-react/styles.css
```

**Acceptance criteria**

- Public exports resolve from package root.
- No deep internal imports are required.
- CSS export resolves.

---

### Task 39 — Package Build Verification

Run the React package build and package validation.

Required checks include the repository's established commands, including:

```bash
pnpm check
pnpm check-types
pnpm test
pnpm build
```

For package validation, run the configured:

```bash
pnpm check:package
```

or the equivalent package-level command when applicable.

**Acceptance criteria**

- TypeScript passes.
- Tests pass.
- Build passes.
- Package validation passes.
- Generated declarations are valid.

---

### Task 40 — Package Consumer Verification

Verify the built package from a consumer perspective.

Test:

- package root import.
- stylesheet import.
- TypeScript declarations.
- ESM runtime.
- peer dependency behavior.

**Acceptance criteria**

- Package can be consumed without repository-internal paths.
- No accidental workspace-only import remains.

---

### Task 41 — Cross-Package Integration Test

Verify:

```text
editor-core
    ↓
editor-react
    ↓
consumer
```

The test should verify that:

- core editor configuration reaches React.
- core extensions work in React.
- core toolbar definitions work in React.
- core labels work in React.
- core upload contracts work through React.

**Acceptance criteria**

- Cross-package public API works.
- React does not depend on unpublished/internal core modules.

---

### Task 42 — React Import Safety Test

Verify package boundary safety.

Requirements:

- `editor-core` remains React-free.
- `editor-react` may depend on React.
- Core package does not accidentally import React modules.
- No reverse dependency exists.

**Acceptance criteria**

- Import safety tests pass.
- Dependency direction remains compliant with architecture.

---

# G. Documentation & Release Gate

### Task 43 — React API Documentation

Document the Phase 04 API at the level required for implementation and package consumption.

Document:

- package purpose.
- installation.
- basic usage.
- controlled mode.
- uncontrolled mode.
- callbacks.
- extensions.
- labels.
- styling.
- SSR configuration.
- upload integration.
- toolbar usage.

Comprehensive product documentation remains Phase 08.

**Acceptance criteria**

- Public React API is understandable.
- Examples match the actual implementation.
- No undocumented public API is introduced.

---

### Task 44 — Update AGENTS / Architecture Contract

Update project agent/architecture guidance only where Phase 04 introduces durable rules.

Potential topics:

- React adapter boundary.
- public API conventions.
- controlled/uncontrolled rules.
- editor lifecycle.
- CSS boundary.
- toolbar adapter responsibility.
- testing requirements.

Do not rewrite unrelated project rules.

**Acceptance criteria**

- AI agents can understand the new React package contract.
- Future implementation cannot accidentally move React dependencies into core.

---

### Task 45 — Phase 04 Final Verification

Perform the final phase gate.

### Architecture

- [ ] `editor-core` remains framework agnostic.
- [ ] `editor-react` depends on core.
- [ ] No reverse dependency exists.
- [ ] No application runtime has entered the packages.
- [ ] Tiptap remains the document-state owner.

### React

- [ ] Main editor component works.
- [ ] Controlled mode works.
- [ ] Uncontrolled mode works.
- [ ] `onChange` works.
- [ ] `onReady` works.
- [ ] editable/disabled behavior works.
- [ ] custom extensions work.
- [ ] labels work.
- [ ] SSR configuration works.
- [ ] StrictMode works.

### Toolbar

- [ ] Default toolbar works.
- [ ] Active state works.
- [ ] Disabled state works.
- [ ] Composition works.
- [ ] Icons work.
- [ ] Accessibility semantics exist.

### Interactive Features

- [ ] Link integration follows core security rules.
- [ ] Image upload integration uses the core upload contract.
- [ ] No provider-specific storage dependency exists.

### Styling

- [ ] CSS is framework agnostic.
- [ ] CSS is namespaced.
- [ ] CSS variables are available.
- [ ] Tailwind is not required.
- [ ] Stylesheet export works.

### Testing

- [ ] Unit tests pass.
- [ ] Controlled tests pass.
- [ ] Uncontrolled tests pass.
- [ ] Toolbar tests pass.
- [ ] Upload tests pass.
- [ ] Accessibility tests pass.
- [ ] Type tests pass.
- [ ] Import safety tests pass.
- [ ] Package validation passes.
- [ ] Consumer verification passes.
- [ ] Cross-package integration passes.

### Documentation

- [ ] React API is documented.
- [ ] Durable architecture rules are updated.
- [ ] No undocumented public API remains.

---

# 9. Phase 04 Scope

## In Scope

- React adapter package implementation.
- React editor lifecycle.
- Tiptap React integration.
- Controlled/uncontrolled content.
- React callbacks.
- Extension configuration.
- Labels integration.
- Toolbar rendering.
- Toolbar state synchronization.
- React-level link/image interaction.
- SSR-safe rendering configuration.
- StrictMode compatibility.
- React package CSS.
- React unit/integration/type tests.
- Package consumer validation.
- Adapter-level accessibility validation.
- Minimal API documentation required to consume the adapter.

---

# 10. Explicitly Out of Scope

The following must NOT be expanded into Phase 04 unless the approved roadmap is explicitly changed.

## Phase 05 — Playground

Do not implement:

- full showcase application.
- dedicated playground application.
- interactive example catalog.
- visual demo environment.

---

## Phase 06 — Editor MVP

Do not turn Phase 04 into the complete editor product.

Avoid introducing large feature systems such as:

- complete advanced formatting UX.
- complex modal systems.
- full document management.
- autosave infrastructure.
- collaboration.
- comments.
- mentions.
- tables unless already part of the approved core contract.
- advanced slash commands.
- full media management UI.

---

## Phase 07 — Browser & Accessibility

Phase 04 only provides adapter-level automated coverage.

Do not attempt to complete the entire:

- browser matrix.
- cross-browser compatibility program.
- mobile browser validation.
- full keyboard interaction audit.
- complete screen-reader test matrix.
- visual regression system.

Those belong to Phase 07.

---

## Phase 08 — Documentation

Do not create the complete documentation site/content system in Phase 04.

Phase 04 only documents enough of the React API for implementation and package consumption.

---

## Phase 09 — Release Engineering

Do NOT implement release engineering in Phase 04.

In particular:

- Changesets implementation remains deferred to Phase 09.
- release workflow remains deferred.
- npm publishing workflow remains deferred.
- automated release automation remains deferred.
- package versioning workflow remains deferred.

The architectural decision to use Changesets may already be documented, but implementation belongs entirely to Phase 09.

---

# 11. Technical Constraints

## 11.1 No React in Core

Never add:

```text
react
react-dom
@tiptap/react
```

to `@rumahkodingku/editor-core`.

---

## 11.2 No Global Editor Singleton

Do not create a module-level singleton editor.

Every React editor component owns its own editor instance.

---

## 11.3 No Global Document Store

Do not use:

- Zustand.
- Redux.
- Context as the primary document store.

Tiptap owns the document state.

React context may be used internally for adapter composition if necessary, but it must not become the document-state authority.

---

## 11.4 No Provider-Specific Upload Logic

Do not add:

- S3 SDK.
- Cloudinary SDK.
- Supabase storage SDK.
- Firebase storage SDK.
- custom backend upload implementation.

The adapter consumes the core upload contract.

---

## 11.5 No Tailwind Runtime Dependency

The published package must work without Tailwind.

Tailwind can remain an application/playground development concern.

---

## 11.6 No Direct HTML Injection API

Do not introduce APIs that encourage unsafe HTML injection.

Use:

- JSON content.
- Tiptap serialization.
- core security utilities.

---

## 11.7 No Unnecessary Editor Recreation

React rerenders must not cause:

```text
destroy editor
→ create editor
→ lose selection
→ lose history
→ rebind listeners
```

unless an explicit configuration change requires recreation.

---

# 12. Expected Package Structure

The exact implementation may evolve, but the package should remain organized around React adapter responsibilities.

A possible structure:

```text
packages/editor-react/
├── src/
│   ├── components/
│   │   ├── Editor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── ToolbarButton.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useEditorInstance.ts
│   │   ├── useEditorChange.ts
│   │   └── ...
│   ├── icons/
│   │   └── ...
│   ├── types/
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   ├── index.ts
│   └── styles.css
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── toolbar/
│   ├── integration/
│   └── types/
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

This is an implementation guideline, not a requirement to create every file.

Avoid creating files merely to match this tree.

---

# 13. Implementation Order

The recommended execution sequence is:

```text
01. Contract audit
        ↓
02. Public API
        ↓
03. Export surface
        ↓
04. Editor lifecycle
        ↓
05. Tiptap React integration
        ↓
06. EditorContent
        ↓
07. Basic Editor
        ↓
08. Uncontrolled
        ↓
09. Controlled
        ↓
10. Conflict rules
        ↓
11. onChange
        ↓
12. onReady
        ↓
13. editable/disabled
        ↓
14. placeholder
        ↓
15. extensions
        ↓
16. extension stability
        ↓
17. labels
        ↓
18–22. Toolbar
        ↓
23–26. Interactive/API decisions
        ↓
27–30. Runtime & CSS
        ↓
31–42. Tests & package verification
        ↓
43–44. Documentation/agent contract
        ↓
45. Final verification
```

---

# 14. Definition of Done

Phase 04 is complete only when all of the following are true:

1. `@rumahkodingku/editor-react` contains a working React adapter.
2. The adapter consumes `@rumahkodingku/editor-core`.
3. Core remains framework agnostic.
4. React editor lifecycle is stable.
5. Controlled mode works.
6. Uncontrolled mode works.
7. `onChange` works.
8. `onReady` works.
9. Extension composition works.
10. Labels work.
11. Toolbar integration works.
12. Image upload integration uses the core upload contract.
13. Link behavior respects core security rules.
14. SSR configuration is supported.
15. React StrictMode does not introduce lifecycle bugs.
16. React CSS is framework agnostic.
17. Public exports are intentional and tested.
18. Type tests pass.
19. Unit/integration tests pass.
20. Package validation passes.
21. Consumer verification passes.
22. Cross-package integration passes.
23. Adapter-level accessibility tests pass.
24. Required API documentation exists.
25. Phase 04 scope has not absorbed Phase 05–09 responsibilities.
26. No Changesets/release implementation is introduced.
27. Final project checks pass.

---

# 15. Validation Commands

At minimum, use the repository's established validation commands.

```bash
pnpm check
pnpm check-types
pnpm test
pnpm build
```

For package validation:

```bash
pnpm check:package
```

Where the repository provides package-level filtering, validate the affected package explicitly as well.

Example:

```bash
pnpm --filter @rumahkodingku/editor-react check-types
pnpm --filter @rumahkodingku/editor-react test
pnpm --filter @rumahkodingku/editor-react build
pnpm --filter @rumahkodingku/editor-react check:package
```

Use the scripts actually defined by the repository; do not invent replacement commands when an existing project script provides the same validation.

---

# 16. AI Agent Execution Rules

Any AI agent implementing Phase 04 must:

1. Read `PRD.md`.
2. Read `ARCHITECTURE.md`.
3. Read `AGENTS.md`.
4. Read this phase document.
5. Inspect the current `editor-core` public API before modifying React code.
6. Respect package boundaries.
7. Never import React into `editor-core`.
8. Prefer existing core APIs over duplicated React logic.
9. Avoid unnecessary public API additions.
10. Add tests with implementation changes.
11. Update public types when API changes.
12. Update documentation for public API changes.
13. Do not implement Changesets during Phase 04.
14. Do not silently move Phase 05–09 work into Phase 04.
15. Run the relevant checks after implementation.
16. Investigate failures rather than weakening tests.
17. Do not remove existing tests merely to make Phase 04 pass.
18. Keep changes focused on the current task.
19. Preserve ESM-first package behavior.
20. Preserve MIT licensing.
21. Do not introduce application-specific infrastructure into the package.
22. Do not introduce provider-specific upload dependencies.
23. Do not introduce a global editor state store.
24. Do not expose internal implementation details as public API without explicit justification.

---

# 17. Public API Change Gate

Whenever Phase 04 changes a public API, verify:

```text
Implementation
    ↓
Type contract
    ↓
Tests
    ↓
Documentation
    ↓
Package export verification
```

Release/versioning artifacts are intentionally excluded from this phase and will be handled in Phase 09.

---

# 18. Phase 04 Exit Gate

Before marking Phase 04 as **Done**, the implementation must satisfy:

```text
┌───────────────────────────────────────────────┐
│              PHASE 04 EXIT GATE               │
├───────────────────────────────────────────────┤
│ React Adapter implemented                     │
│ Controlled + uncontrolled modes stable        │
│ Tiptap lifecycle stable                       │
│ Toolbar adapter implemented                   │
│ Upload/link integration respects core         │
│ SSR + StrictMode validated                    │
│ CSS contract implemented                      │
│ Unit + integration + type tests passing       │
│ Package validation passing                    │
│ Consumer import validated                     │
│ Core/React dependency boundary preserved      │
│ Required API documentation complete           │
│ No Phase 05–09 scope creep                    │
└───────────────────────────────────────────────┘
```

When every exit condition is satisfied, Phase 04 can be marked **Done** and implementation may proceed to:

**Phase 05 — Playground.**

---

## Final Principle

> **`@rumahkodingku/editor-core` owns editor behavior; `@rumahkodingku/editor-react` owns React integration; the consuming application owns application state and product-specific UI.**

This boundary must remain intact throughout Phase 04 and all subsequent phases.
