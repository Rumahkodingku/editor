# Phase 07 — Browser & Accessibility Validation

**Project:** RumahKodingku Editor  
**Phase:** 07  
**Status:** Approved  
**Primary Tooling:** Playwright + axe-core + agent-browser  
**Prerequisite:** Phase 06 — Editor MVP

## Table of Contents

1. Phase Overview
2. Phase Goals
3. Non-Goals
4. Testing Strategy
5. Execution Order
6. Task List
   - A — Phase Preparation & Baseline
   - B — Core Editor Browser Testing
   - C — Formatting Browser Tests
   - D — Toolbar Keyboard Accessibility
   - E — Link Control Browser Tests
   - F — Image Browser Tests
   - G — Read-only & Disabled Browser Testing
   - H — Controlled / Uncontrolled Browser Validation
   - I — Selection & Focus Testing
   - J — Paste & Clipboard Browser Testing
   - K — Drag & Drop
   - L — IME & International Text
   - M — Accessibility with axe-core
   - N — agent-browser Exploratory Testing
   - O — Regression Test Conversion
   - P — Cross-browser Validation
   - Q — Responsive / Viewport Validation
   - R — Browser Test Infrastructure
   - S — CI Validation
   - T — Final Quality Audit
7. Phase 07 Deliverables
8. Definition of Done
9. Phase Boundary

---

## 1. Phase Overview

Phase 07 validates the Editor MVP in real browser environments.

The purpose of this phase is **not to introduce new editor features**. It verifies that functionality already implemented in Phase 06 behaves correctly in real browsers, including keyboard interaction, focus transitions, dialogs, selection, paste, upload flows, accessibility semantics, and browser-specific behavior.

Testing uses three complementary layers:

1. **Playwright** — primary formal browser E2E and regression suite.
2. **axe-core** — automated accessibility auditing through Playwright.
3. **agent-browser** — exploratory browser testing for UX, keyboard, focus, accessibility, and unusual interaction issues.

Operating principle:

```text
agent-browser exploratory testing
        ↓
discover issue / edge case
        ↓
fix implementation
        ↓
add permanent Playwright regression test
```

agent-browser must not duplicate the entire Playwright suite.

## 2. Phase Goals

By the end of Phase 07:

- reliable browser-level validation exists;
- critical Editor MVP behavior has formal Playwright coverage;
- axe-core accessibility scanning is integrated;
- keyboard and focus behavior are validated;
- read-only and disabled states are validated;
- controlled and uncontrolled usage are validated;
- paste/clipboard behavior is validated;
- drag-and-drop is validated where already supported;
- real-browser IME behavior is validated;
- exploratory testing is completed with agent-browser;
- valid exploratory findings become regression tests;
- Chromium baseline passes;
- critical Firefox and WebKit flows pass;
- responsive viewport behavior is validated;
- browser testing is deterministic and CI-ready.

## 3. Non-Goals

Explicitly out of scope:

- new editor features;
- Markdown support;
- Vue adapter implementation;
- npm publishing;
- Changesets implementation;
- release automation;
- release/version coordination;
- backend/database/authentication;
- new image-storage providers;
- new upload infrastructure;
- AI features;
- major toolbar redesign;
- major mobile redesign;
- new SSR capabilities.

Fixing a defect discovered during validation is in scope. Adding unrelated capabilities is not.

## 4. Testing Strategy

### 4.1 Playwright

Playwright is the **primary formal browser testing framework**.

Use it for:

- typing;
- selection;
- keyboard navigation;
- formatting;
- focus;
- dialogs;
- paste;
- clipboard;
- drag-and-drop;
- image upload;
- IME;
- controlled/uncontrolled behavior;
- read-only/disabled behavior;
- cross-browser validation.

Reuse and extend existing tests rather than duplicating them.

### 4.2 axe-core

axe-core runs through Playwright.

Target:

```text
critical = 0
serious = 0
```

Moderate findings must be fixed or explicitly documented with a valid reason.

axe-core does not replace keyboard or exploratory accessibility testing.

### 4.3 agent-browser

agent-browser is for exploratory testing:

- unusual interaction failures;
- keyboard-only workflows;
- focus transitions;
- dialogs;
- toolbar navigation;
- error states;
- upload retry;
- unusual interaction sequences;
- visual/manual browser inspection.

Valid findings should become Playwright regression tests.

### 4.4 Playground

The Playground remains the environment for rapid visual/manual validation, responsive inspection, and debugging. It is not a replacement for formal Playwright tests.

## 5. Execution Order

```text
A. Preparation
↓
B. Core Browser
↓
C. Formatting
↓
D. Toolbar Accessibility
↓
E. Link
↓
F. Image
↓
G. Read-only / Disabled
↓
H. Controlled / Uncontrolled
↓
I. Selection / Focus
↓
J. Paste / Clipboard
↓
K. Drag & Drop
↓
L. IME / Unicode
↓
M. axe-core Accessibility
↓
N. agent-browser Exploratory
↓
O. Regression Conversion
↓
P. Cross-browser
↓
Q. Responsive
↓
R. Browser Infrastructure
↓
S. CI
↓
T. Final Audit
```

## 6. Task List

### A — Phase Preparation & Baseline
### 07.01 — Audit Current Testing Infrastructure

Inspect:

- `playwright.config.ts`;
- `tests/browser/`;
- existing Playwright projects;
- `@axe-core/playwright`;
- existing smoke/scenario tests;
- Playground;
- Fumadocs;
- Vitest/React Testing Library tests;
- root package scripts.

**Acceptance criteria**

- Existing browser infrastructure is understood.
- No duplicate testing infrastructure is introduced.
- Existing tests remain runnable.

### 07.02 — Audit Existing Browser Coverage

Inventory existing browser tests and classify each area as covered, partially covered, or missing.

Inspect at minimum:

```text
tests/browser/
├── fumadocs/
│   ├── smoke.spec.ts
│   └── a11y.spec.ts
└── playground/
    ├── smoke.spec.ts
    └── scenarios.spec.ts
```

**Acceptance criteria:** a clear coverage baseline exists before adding tests.

### 07.03 — Define Browser Test Conventions

Define conventions for naming, grouping, fixtures, selectors, accessibility locators, `data-testid`, isolation, cleanup, traces, screenshots, and failure artifacts.

Selector priority:

```text
role / accessible name
↓
label
↓
text
↓
stable semantic attribute
↓
data-testid
```

Avoid generated classes, DOM nesting, `nth-child`, and unstable implementation-specific selectors.

**Acceptance criteria:** browser tests use stable, user-facing selectors whenever possible.

### B — Core Editor Browser Testing
### 07.04 — Editor Rendering Test

Verify editor, editable area, toolbar, placeholder, and initial content render correctly.

**Acceptance criteria:** editor loads and exposes expected browser semantics.

### 07.05 — Basic Typing Test

Test:

```text
click editor
→ type text
→ verify content
```

Cover plain text, multiple words, multiline content, Enter, Backspace, and Delete.

**Acceptance criteria:** browser input produces the expected document state.

### 07.06 — Keyboard Editing Test

Validate Enter, Shift+Enter if supported, Backspace, Delete, arrow keys, Home, End, Ctrl/Cmd+A, and Ctrl/Cmd+C.

**Acceptance criteria:** basic keyboard editing works in a real browser without unexpected state loss.

### C — Formatting Browser Tests
### 07.07 — Bold Interaction

Select text and activate Bold. Test the supported keyboard shortcut if exposed.

**Acceptance criteria:** Bold applies to the intended selection.

### 07.08 — Italic Interaction

Test selection, toolbar interaction, and supported keyboard shortcut.

**Acceptance criteria:** Italic applies correctly.

### 07.09 — Underline Interaction

Test selection and toolbar interaction.

**Acceptance criteria:** Underline applies correctly.

### 07.10 — Heading Interaction

Test paragraph-to-heading transformation. Verify DOM semantics, toolbar state, and document representation.

### 07.11 — List Interaction

Where already supported, validate bullet list, ordered list, Enter behavior, and nested list behavior only if implemented.

### 07.12 — Toolbar Active-State Verification

Place the cursor/selection inside formatted content and verify `aria-pressed`, visual active state, and state changes when selection changes.

**Acceptance criteria:** toolbar state accurately reflects editor selection state.

### D — Toolbar Keyboard Accessibility
### 07.13 — Toolbar Semantics

Verify applicable `role="toolbar"` and `role="group"` semantics, accessible names, group labels, and button semantics.

### 07.14 — Roving Tabindex

Verify one enabled toolbar item has `tabindex="0"` and other navigable items have `tabindex="-1"`.

### 07.15 — Arrow Navigation

Test ArrowRight and ArrowLeft. Focus must move between toolbar items.

### 07.16 — Home / End Navigation

Test Home → first available control and End → last available control.

### 07.17 — Toolbar Tab Behavior

Verify Tab enters/leaves the toolbar while arrow keys navigate within it.

### 07.18 — Disabled Toolbar Behavior

Verify disabled controls cannot be activated, do not incorrectly receive focus, expose `aria-disabled`, and do not break roving tabindex.

### E — Link Control Browser Tests
### 07.19 — Open Link Control

Select text and activate link control. Verify dialog/popover, `role="dialog"` where applicable, input, and focus.

### 07.20 — Apply Link

Use a valid URL such as `https://example.com`. Verify link creation, correct href, dialog close, and continued editor usability.

### 07.21 — Remove Link

Open link control on linked content and remove the link. Verify the mark is removed without corrupting content.

### 07.22 — Escape Link Dialog

Open dialog, press Escape, and verify close and focus behavior.

### 07.23 — Unsafe URL Browser Validation

Test unsafe schemes including `javascript:` and other schemes rejected by existing URL validation.

**Acceptance criteria:** unsafe URLs are rejected and never become executable links.

### F — Image Browser Tests
### 07.24 — Image Upload Interaction

Open image control, choose a valid image, upload it, and verify the image appears.

### 07.25 — Upload Progress

Where progress is exposed, verify status, accessible announcement, progress changes, and completion.

### 07.26 — Upload Error

Simulate upload failure. Verify error feedback, alert semantics where applicable, and continued editor usability.

### 07.27 — Invalid Image File

Test invalid file type. Verify rejection, feedback, and unchanged document.

### 07.28 — Image Alt Text Flow

Insert image, open alt control, enter alt text, save, and verify persistence, dialog semantics, and focus.

### 07.29 — Image Dialog Escape / Focus

Open alt dialog, press Escape, close it, and verify focus restoration.

### G — Read-only & Disabled Browser Testing
### 07.30 — Read-only Mode

Verify readable content, focus behavior, selection/copy where specified, no editing, toolbar hidden/disabled according to contract, and correct `aria-readonly`.

### 07.31 — Disabled Mode

Verify no editing, correct focus behavior, selection/copy behavior according to contract, disabled toolbar, and `aria-disabled`.

### 07.32 — Read-only vs Disabled Regression Matrix

Validate:

| Behavior | Editable | Read-only | Disabled |
| --- | ---: | ---: | ---: |
| Focus | Yes | Yes | No |
| Type | Yes | No | No |
| Selection | Yes | Yes | No |
| Copy | Yes | Yes | No |
| Toolbar action | Yes | No / disabled | No |
| ARIA state | Normal | Read-only | Disabled |

Actual behavior must follow the established public contract.

### H — Controlled / Uncontrolled Browser Validation
### 07.33 — Uncontrolled Editor

Test `defaultValue → edit → verify internal content changes`.

### 07.34 — Controlled Editor

Test `value → render → user edits → onChange → parent updates value`.

**Acceptance criteria:** controlled updates do not produce duplicate or unstable behavior.

### 07.35 — Controlled External Update

Test content A → parent changes value to B → editor becomes B.

Verify no infinite loop, duplicate updates, or unwanted cursor reset where the contract does not require it.

### I — Selection & Focus Testing
### 07.36 — Selection Preservation

Select content, apply formatting, and verify selection/cursor behavior.

### 07.37 — Focus Transitions

Validate:

```text
Editor
↓
Toolbar
↓
Dialog
↓
Editor
```

**Acceptance criteria:** focus does not unintentionally fall back to the document body.

### 07.38 — Focus-visible Validation

Verify visible keyboard focus on toolbar buttons, dialog inputs, editor, and image controls.

### J — Paste & Clipboard Browser Testing
### 07.39 — Plain Text Paste

Paste plain text into the editor.

**Acceptance criteria:** text is inserted correctly.

### 07.40 — Rich Text Paste

Where supported by the environment, paste basic rich HTML and verify supported formatting is preserved and unsupported content does not corrupt the schema.

### 07.41 — Unsafe HTML Paste

Test HTML attempting unsafe execution.

Verify no script execution, unsupported content removal, and editor stability.

### K — Drag & Drop
### 07.42 — Image Drag & Drop

Where drag-and-drop upload is already supported:

```text
drag image
→ drop editor
→ upload
→ image appears
```

**Acceptance criteria:** dropped images follow the same safe upload pipeline.

### 07.43 — Invalid Drag & Drop

Test invalid files. Verify rejection, feedback, and editor stability.

### L — IME & International Text
### 07.44 — IME Input Validation

Validate a real-browser IME scenario covering composition start, update, end, and final text.

**Acceptance criteria:** IME input produces correct final content.

If a CI environment cannot reliably execute a specific IME scenario, document the limitation rather than introducing a permanently flaky test.

### 07.45 — Unicode Text

Validate Indonesian text, accented characters, emoji, and a CJK sample.

**Acceptance criteria:** Unicode is not corrupted and JSON output remains correct.

### M — Accessibility with axe-core
### 07.46 — Global Editor Accessibility Scan

Run axe against the editor page.

Required target:

```text
critical violations = 0
serious violations = 0
```

Moderate findings must be fixed or explicitly documented.

### 07.47 — Toolbar axe Audit

Audit accessible names, roles, states, focusability, and applicable contrast violations.

### 07.48 — Link Dialog axe Audit

When open, verify accessible dialog name, input label, buttons, and focus.

### 07.49 — Image Dialog axe Audit

When open, verify dialog name, input label, action buttons, and status/error semantics.

### 07.50 — Read-only Accessibility Scan

Run axe against read-only state.

### 07.51 — Disabled Accessibility Scan

Run axe against disabled state.

### N — agent-browser Exploratory Testing
agent-browser is exploratory, not the primary regression suite.

### 07.52 — Keyboard-only Exploratory Test

Perform:

```text
Tab
→ editor
→ toolbar
→ formatting
→ link
→ image
→ dialogs
→ exit
```

Look for focus traps, focus loss, unreachable controls, unexpected Tab stops, and keyboard dead ends.

### 07.53 — Screen-reader-oriented Semantics Review

Review accessible names, roles, states, live regions, dialogs, alerts, and editor semantics.

This is an exploratory semantics review, not complete screen-reader certification.

### 07.54 — Unusual Interaction Sequences

Explore:

```text
open dialog → Escape → reopen
```

```text
format → immediately change selection
```

```text
disable editor while dialog is open
```

```text
rapid toolbar navigation
```

```text
upload error → retry
```

**Acceptance criteria:** no reproducible state corruption, focus dead-end, or UI crash remains unresolved.

### 07.55 — Visual Interaction Review

Use agent-browser and Playground to inspect toolbar alignment, focus rings, dialogs, disabled/error/upload states, and responsive behavior.

This is manual visual validation, not pixel-perfect regression testing.

### O — Regression Test Conversion
### 07.56 — Convert Discovered Bugs to Playwright

For every valid defect:

```text
Exploration
↓
Bug
↓
Fix
↓
Permanent Playwright regression test
```

**Acceptance criteria:** important discovered regressions are permanently protected.

### 07.57 — Remove Duplicate / Fragile Tests

Review browser tests for duplication, implementation-specific selectors, unnecessary waits, flaky assumptions, and low-value coverage.

**Acceptance criteria:** the suite is maintainable and focused on user-visible behavior.

### P — Cross-browser Validation
### 07.58 — Chromium Baseline

Run the required Chromium browser suite.

**Acceptance criteria:** all required Chromium tests pass.

### 07.59 — Firefox Validation

Run critical scenarios for rendering, typing, toolbar, dialogs, link, image, read-only, and disabled behavior.

### 07.60 — WebKit Validation

Run the same critical-flow set.

### 07.61 — Cross-browser Issue Classification

For Chromium, Firefox, and WebKit differences, classify each as:

- actual product bug;
- browser-specific behavior;
- intentionally unsupported behavior;
- test flakiness.

### Q — Responsive / Viewport Validation
### 07.62 — Desktop Viewport

Validate normal editor workflow at desktop size.

### 07.63 — Tablet Viewport

Verify toolbar, dialogs, editor, and image controls.

### 07.64 — Mobile Viewport

Verify no severe toolbar overflow, usable dialogs, content within viewport, and reachable controls.

This validates existing UI; it does not authorize a major mobile redesign.

### R — Browser Test Infrastructure
### 07.65 — Test Fixtures

Introduce reusable fixtures only where duplication is demonstrated.

Potential fixtures:

- create editor page;
- create editor with options;
- open toolbar;
- open dialog.

**Acceptance criteria:** fixtures reduce duplication without hiding important behavior.

### 07.66 — Stable Test Selectors

Audit all selectors:

```text
ARIA role/name
→ semantic locator
→ stable attribute
→ data-testid
```

Avoid implementation-specific selectors.

### 07.67 — Trace / Screenshot / Video Strategy

Configure failure artifacts such as trace, screenshot, and video when useful.

Successful runs should not create unnecessarily large artifacts by default.

### S — CI Validation
### 07.68 — Playwright CI Execution

Ensure browser tests execute deterministically in CI.

### 07.69 — Accessibility CI Gate

Critical and serious accessibility violations must fail the appropriate CI check.

### 07.70 — Flaky Test Detection

Review retries, timeouts, waits, and race conditions.

Do not solve flaky tests merely by increasing timeouts.

**Acceptance criteria:** tests wait on meaningful browser state rather than arbitrary delays.

### T — Final Quality Audit
### 07.71 — Full Test Matrix

Run:

```text
Vitest
+
Playwright
+
axe-core
+
typecheck
+
lint
+
build
```

### 07.72 — Public API Regression

Verify Phase 07 has not accidentally changed the public API.

If a public API change is intentionally required, include:

```text
types
+
tests
+
documentation
+
release note / changeset
```

Release infrastructure remains deferred to Phase 09.

### 07.73 — Package Boundary Audit

Verify browser testing does not introduce forbidden dependencies:

```text
editor-core
→ React dependency       ❌
```

```text
published package
→ Playwright dependency  ❌
```

Browser-testing dependencies belong to the testing/application layer.

### 07.74 — Security Regression Review

Validate:

- unsafe links;
- unsafe image sources;
- unsafe pasted HTML;
- upload validation;
- arbitrary script execution prevention.

No browser interaction should allow untrusted content to execute arbitrary HTML/JavaScript.

### 07.75 — Final Phase 07 Acceptance

#### Functional

- [ ] Editor works in a real browser.
- [ ] Typing works.
- [ ] Formatting works.
- [ ] Toolbar works.
- [ ] Link flow works.
- [ ] Image flow works.
- [ ] Read-only mode works.
- [ ] Disabled mode works.
- [ ] Controlled mode is validated.
- [ ] Uncontrolled mode is validated.
- [ ] Paste is validated.
- [ ] Drag/drop is validated where supported.
- [ ] IME is validated.
- [ ] Unicode input is validated.

#### Accessibility

- [ ] No critical axe violations.
- [ ] No serious axe violations.
- [ ] Toolbar keyboard navigation works.
- [ ] Roving tabindex works.
- [ ] Dialog focus works.
- [ ] Escape behavior works.
- [ ] Focus restoration works.
- [ ] Accessible names are present.
- [ ] `aria-pressed` is correct.
- [ ] `aria-disabled` is correct.
- [ ] `aria-readonly` is correct.
- [ ] Live regions/errors are accessible.
- [ ] Keyboard-only workflow is usable.

#### Browser

- [ ] Chromium passes.
- [ ] Firefox critical flows pass.
- [ ] WebKit critical flows pass.

#### Regression

- [ ] Existing browser tests remain passing.
- [ ] Valid agent-browser findings are converted to Playwright regression tests.
- [ ] Duplicate browser tests are removed.
- [ ] Flaky browser tests are resolved.

#### Quality

- [ ] `pnpm run check` passes.
- [ ] `pnpm run check-types` passes.
- [ ] `pnpm run test` passes.
- [ ] `pnpm run build` passes.
- [ ] Playwright tests pass.
- [ ] axe-core accessibility tests pass.

## 7. Phase 07 Deliverables
At the end of the phase, the repository should contain or have updated the relevant browser-testing artifacts.

Example structure:

```text
tests/browser/
├── fumadocs/
│   ├── smoke.spec.ts
│   └── a11y.spec.ts
└── playground/
    ├── smoke.spec.ts
    ├── scenarios.spec.ts
    └── ...
```

The exact split may differ if the existing repository provides a better organization. Do not create files solely to satisfy this example.

Potentially updated infrastructure:

```text
playwright.config.ts
package.json
pnpm-lock.yaml
```

Only necessary changes should be made.

Accessibility validation must remain integrated into the existing Playwright architecture rather than introducing an unrelated accessibility framework.

If behavior or public API changes as a result of fixing Phase 07 findings, update the relevant documentation.

## 8. Definition of Done
Phase 07 is **DONE** when:

1. Browser behavior is validated using Playwright.
2. Accessibility is audited using axe-core through Playwright.
3. Keyboard behavior is tested.
4. Focus behavior is tested.
5. Dialog behavior is tested.
6. Editor interaction is tested in a real browser.
7. Link behavior is tested.
8. Image behavior is tested.
9. Read-only and disabled behavior are tested.
10. Controlled and uncontrolled behavior are tested.
11. Paste behavior is tested.
12. Drag-and-drop behavior is tested where supported.
13. IME behavior is tested.
14. Unicode behavior is tested.
15. agent-browser exploratory testing is completed.
16. Important exploratory findings become Playwright regression tests.
17. Chromium baseline passes.
18. Firefox critical flows pass.
19. WebKit critical flows pass.
20. Responsive browser validation is complete.
21. Browser test infrastructure is deterministic.
22. CI browser execution is validated.
23. Security-related browser regressions are checked.
24. Existing unit/component tests continue to pass.
25. Type checking, linting, and builds pass.
26. No unrelated feature scope has been introduced.

## 9. Phase Boundary
The final output of Phase 07 is a **validated and regression-protected Editor MVP**.

Phase 07 does not proceed into release engineering.

Explicitly deferred:

```text
Phase 08
↓
Next approved product/development scope

Phase 09
↓
Release / versioning infrastructure
↓
Changesets
↓
Package publishing
↓
Release automation
```

The scope of later phases must be approved separately.
