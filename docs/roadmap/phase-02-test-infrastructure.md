# Phase 02 — Test Infrastructure

**Status:** Approved  
**Phase:** 02  
**Previous Phase:** Phase 01 — Build Package Infrastructure  
**Next Phase:** Phase 03 — Core Editor Engine  
**Document Type:** Implementation Plan

---

## 1. Objective

Phase 02 establishes the testing foundation for the RumahKodingku Editor monorepo.

The goal is to provide a consistent and maintainable testing system covering:

- Unit testing
- Integration testing
- React component testing
- Type testing
- Browser/E2E testing
- Accessibility testing foundation
- Coverage
- Test utilities and mocking
- Turborepo integration
- CI verification
- AI-agent testing workflow

Phase 02 is an **infrastructure phase**. It does not implement comprehensive tests for editor features that have not yet been implemented.

---

## 2. Current Codebase State

Phase 01 has been completed. The repository currently contains package infrastructure for:

```text
packages/
├── editor-core/
└── editor-react/
```

The packages are currently skeleton implementations and do not yet contain the complete editor API or editor features.

Architectural constraints relevant to testing:

- `editor-core` is framework-agnostic.
- `editor-react` contains React-specific integration.
- Tiptap/ProseMirror owns editor document state.
- Tiptap/ProseMirror JSON is the canonical document representation.
- HTML is an output/serialization format.
- Published packages are ESM-first.
- Published packages must not require Tailwind or UI libraries.
- `pnpm` is the official package manager.
- Node.js `>=22` is required.
- `tsdown` is the package bundler.
- Changesets are deferred entirely to Phase 09.

The architecture defines the testing model as:

| Level | Scope | Tooling |
| --- | --- | --- |
| Unit | Core utilities, configuration, extensions, contracts | Vitest |
| Component / Integration | Initialization, serialization, callbacks, React integration | Vitest + React Testing Library |
| Browser E2E | Typing, selection, paste, drag/drop, IME | Playwright |
| Accessibility | Keyboard interaction, roles, labels | axe-core + Playwright |
| Type Tests | Public API types | Type-test tooling |
| Package Validity | Exports and type resolution | publint + `@arethetypeswrong/cli` |
| Size | Bundle budgets | size-limit |

`jsdom` must not be treated as a replacement for real-browser testing because it cannot reliably model layout, selection, or IME behavior.

---

## 3. Scope

### In Scope

- Vitest
- jsdom
- React Testing Library
- Test utilities
- Mocking strategy
- Type testing
- Coverage
- Turborepo test integration
- Root test commands
- Test conventions
- Playwright
- Browser smoke testing
- axe-core testing foundation
- SSR/import-safety testing
- CI integration
- AI-agent testing workflow
- Testing documentation
- Final regression verification

### Out of Scope

- Complete editor feature testing
- Complete toolbar testing
- Heading/list/blockquote feature testing
- Link feature testing
- Image upload feature testing
- Drag-and-drop upload testing
- Controlled/uncontrolled editor feature testing
- Complete undo/redo testing
- Full browser editor interaction suite
- Full WCAG audit
- Performance benchmark suite
- Security penetration testing
- `apps/playground` implementation
- `agent-browser` as a repository dependency
- Changesets configuration

---

# 4. Task Breakdown

## Task 01 — Audit Existing Test State

Analyze the current repository before introducing testing infrastructure.

Check:

- Existing test runners
- Existing test files
- Existing testing dependencies
- Existing test scripts
- Existing CI configuration
- Existing package-level test configuration
- Existing browser testing configuration

### Deliverables

- Confirmed baseline testing state.
- List of required additions.
- No unnecessary duplicate infrastructure.

---

## Task 02 — Install & Configure Vitest

Install Vitest as the primary unit/integration test runner.

Requirements:

- Add `vitest`.
- Configure ESM compatibility.
- Configure TypeScript compatibility.
- Configure test discovery.
- Configure reporters.
- Establish the initial test environment.

The root repository must eventually support:

```bash
pnpm run test
```

---

## Task 03 — Establish Test Configuration Architecture

Define how test configuration is organized across the monorepo.

Determine the appropriate balance between:

- Root/shared configuration.
- Package-specific configuration.
- Shared test setup.

The configuration must respect package boundaries and avoid unnecessary abstraction.

---

## Task 04 — Add jsdom & React Testing Library

Add the React component testing foundation.

Expected tooling:

- `jsdom`
- `@testing-library/react`
- `@testing-library/dom`
- `@testing-library/user-event`

Environment boundaries:

```text
editor-core
    ↓
Node-compatible testing

editor-react
    ↓
jsdom + React Testing Library
```

Do not use jsdom for behavior that requires real browser layout, selection, or IME behavior.

---

## Task 05 — Define Testing Boundaries per Package

### `editor-core`

Test:

- Framework independence
- Core utilities
- Configuration
- Document transformation
- Serialization
- Public contracts
- Extension behavior

Must not depend on React, Vue, Next.js, Tailwind, or browser globals.

### `editor-react`

Test:

- React rendering
- Component behavior
- Props
- Lifecycle
- Editor integration
- React callbacks

### Browser Tests

Use Playwright for behavior requiring an actual browser.

---

## Task 06 — Create Initial Infrastructure Tests

Create minimal tests proving that the testing infrastructure itself works.

Examples:

```text
editor-core
└── package import test

editor-react
└── basic React render test
```

These tests validate:

```text
Vitest
  ↓
TypeScript
  ↓
Package
  ↓
React
  ↓
jsdom
```

Do not introduce feature-heavy editor tests at this stage.

---

## Task 07 — Establish Test Utilities

Create reusable test utilities only where real test requirements justify them.

Potential structure:

```text
test/
├── fixtures/
├── helpers/
├── mocks/
└── setup/
```

Rules:

- Avoid premature abstractions.
- Keep utilities test-specific.
- Do not place business logic inside test helpers.
- Reuse utilities only when multiple tests genuinely require them.

---

## Task 08 — Establish Mocking Strategy

Document and implement the mocking strategy for:

- Browser APIs
- Upload handlers
- External dependencies
- Tiptap dependencies when necessary
- Application callbacks

Avoid excessive mocking. Prefer real package behavior and mock external boundaries only when appropriate.

---

## Task 09 — Establish Type Testing

Create infrastructure for testing public TypeScript contracts.

Coverage should eventually include:

- Public exports
- Configuration types
- Editor props
- Callback types
- Interfaces
- Generic types
- Public utility types

A type-test tool such as `tsd` or an equivalent approach may be used after verifying compatibility with the project's TypeScript version.

---

## Task 10 — Establish Coverage Configuration

Configure Vitest coverage.

Requirements:

- Coverage provider.
- Local coverage output.
- CI-compatible reporter.
- Coverage exclusions.
- Initial threshold strategy.

Do not impose artificially high coverage thresholds before meaningful implementation exists.

---

## Task 11 — Integrate Vitest with Turborepo

Integrate test execution with the Turborepo task graph.

Expected conceptual structure:

```text
test
├── editor-core
└── editor-react
```

Tests should remain independently runnable where practical.

---

## Task 12 — Establish Root Test Commands

Define clear root commands for different test categories.

```bash
pnpm run test
```
Runs Vitest unit/integration/component tests.

```bash
pnpm run test:coverage
```
Runs Vitest with coverage.

```bash
pnpm run test:browser
```
Runs Playwright browser tests.

Do not make `pnpm run test` launch a browser by default.

---

## Task 13 — Define Test Naming & File Convention

Establish one consistent test file convention, for example:

```text
*.test.ts
*.test.tsx
```

Tests may remain close to implementation when that improves maintainability. Avoid inconsistent conventions between packages without a documented reason.

---

## Task 14 — Install & Configure Playwright

Playwright is part of Phase 02 as the foundation for real-browser testing.

Install:

```text
@playwright/test
```

Create:

```text
playwright.config.ts
```

Initial configuration should cover:

- Chromium
- Headless execution
- Test directory
- Reporter
- CI retries
- Artifact handling
- Web server integration
- Base URL

Do not enable a full multi-browser matrix yet unless required.

---

## Task 15 — Establish Browser Test Environment

Define how Playwright starts and accesses the application.

Because `apps/playground` is not yet implemented, the initial browser smoke test may target an existing application such as the Fumadocs application.

Define:

```text
Local development
CI
Browser binaries
Web server
Base URL
Artifacts
```

The smoke-test target is infrastructure validation, not editor feature validation.

---

## Task 16 — Create Playwright Smoke Test

Create one minimal browser smoke test.

The purpose is to validate:

```text
Application starts
        ↓
Browser launches
        ↓
Page loads
        ↓
Basic assertion succeeds
```

Do not implement full editor interaction tests in this phase.

---

## Task 17 — Establish Accessibility Testing Foundation

Add the accessibility testing foundation using `axe-core`.

The initial goal is to make accessibility testing available to feature tests. Do not attempt to complete the project's WCAG 2.2 AA audit during this phase.

---

## Task 18 — Establish Browser Accessibility Testing

Define how browser-level accessibility tests will be performed.

Expected flow:

```text
Playwright
    ↓
Render UI
    ↓
axe-core
    ↓
Accessibility assertions
```

Feature-specific accessibility requirements will be tested when the relevant editor UI is implemented.

---

## Task 19 — Establish Test Environment Safety

Ensure tests are isolated and deterministic.

Tests must not:

- Call production APIs.
- Upload to real storage.
- Write to external databases.
- Require production credentials.
- Depend unnecessarily on the public internet.
- Modify developer environments.
- Depend on another developer's local state.

External integrations must be mocked or replaced with test fixtures where appropriate.

---

## Task 20 — Add SSR / Import Safety Tests

Verify that package imports are safe in a server/Node environment.

At minimum:

```text
import editor-core
        ↓
Node environment
        ↓
SUCCESS
```

The tests must help detect accidental access to `window`, `document`, `navigator`, or `localStorage` at module import time.

---

## Task 21 — Integrate Testing into CI

Update CI verification to include testing.

Minimum pipeline:

```bash
pnpm install --frozen-lockfile
pnpm run check
pnpm run check-types
pnpm run test
pnpm run build
```

Browser tests should be included according to the final CI strategy established during this phase.

---

## Task 22 — Define AI-Agent Testing Strategy

Document the responsibilities of the testing tools:

| Tool | Responsibility |
| --- | --- |
| Vitest | Unit and integration testing |
| React Testing Library | React component testing |
| Playwright | Real-browser / E2E testing |
| axe-core | Accessibility testing |
| Type tests | Public API type contracts |
| `webapp-testing` skill | AI-agent browser testing workflow |
| `agent-browser` | Optional AI browser interaction/exploration |

### `agent-browser`

`agent-browser` is **not required as a repository dependency** in Phase 02.

It is an optional AI-agent browser automation tool rather than the project's primary test runner.

Playwright remains the repository's automated browser testing framework.

---

## Task 23 — Define Test Documentation & Agent Rules

Update project documentation and AI-agent instructions to explain:

- When to use Vitest.
- When to use React Testing Library.
- When to use Playwright.
- When to use axe-core.
- When to use type tests.
- How to run tests.
- Test naming conventions.
- Mocking rules.
- Fixture rules.
- Package boundaries.
- Browser testing limitations.
- SSR/import safety requirements.

Public API changes must include appropriate tests.

---

## Task 24 — Full Verification & Regression

Run the complete verification pipeline:

```bash
pnpm run check
pnpm run check-types
pnpm run test
pnpm run test:coverage
pnpm run test:browser
pnpm run build
pnpm run check:packages
```

Verify that unit tests, integration tests, React tests, type tests, coverage, browser smoke tests, accessibility infrastructure, type checking, build, and package validation all pass without Phase 01 regression.

---

# 5. Recommended Implementation Order

```text
01 Audit Existing Test State
        ↓
02 Install & Configure Vitest
        ↓
03 Test Configuration Architecture
        ↓
04 jsdom + React Testing Library
        ↓
05 Testing Boundaries
        ↓
06 Initial Infrastructure Tests
        ↓
07 Test Utilities
        ↓
08 Mocking Strategy
        ↓
09 Type Testing
        ↓
10 Coverage
        ↓
11 Turborepo Integration
        ↓
12 Root Test Commands
        ↓
13 Test Conventions
        ↓
14 Playwright Installation & Configuration
        ↓
15 Browser Test Environment
        ↓
16 Playwright Smoke Test
        ↓
17 Accessibility Foundation
        ↓
18 Browser Accessibility Foundation
        ↓
19 Test Environment Safety
        ↓
20 SSR / Import Safety
        ↓
21 CI Integration
        ↓
22 AI-Agent Testing Strategy
        ↓
23 Documentation & Agent Rules
        ↓
24 Full Verification
```

---

# 6. Expected Dependency Changes

The exact versions must be resolved against the current repository lockfile and compatibility requirements during implementation.

Expected testing dependencies:

```text
vitest
jsdom
@testing-library/react
@testing-library/dom
@testing-library/user-event
@playwright/test
axe-core
```

Potential tooling:

```text
tsd
@vitest/coverage-v8
```

Potential dependencies are not mandatory until compatibility and necessity are verified.

Testing and build tooling must remain development dependencies and must not leak into published package runtime dependencies.

---

# 7. Architecture Constraints

All implementation MUST respect `ARCHITECTURE.md`.

## Package boundaries

```text
editor-react
    ↓
editor-core
    ↓
Tiptap / ProseMirror
```

`editor-core` must never import React, Vue, Next.js, Tailwind, or application-specific modules.

## State ownership

Tiptap/ProseMirror remains the source of truth for editor document state. Do not introduce Zustand, Redux, or Vuex as primary document state merely to simplify tests.

## Browser isolation

Browser-specific behavior belongs in browser tests. `jsdom` must not be used as evidence for selection, layout, IME, or other browser-specific editing behavior.

## Published packages

Testing infrastructure must not become runtime dependencies of `@rumahkodingku/editor-core` or `@rumahkodingku/editor-react`.

---

# 8. CI Verification Matrix

| Verification | Local | CI |
| --- | :-: | :-: |
| Biome check | ✓ | ✓ |
| Type check | ✓ | ✓ |
| Vitest | ✓ | ✓ |
| Coverage | ✓ | ✓ |
| Playwright | ✓ | ✓ |
| Accessibility tests | ✓ | ✓ |
| Build | ✓ | ✓ |
| Package validation | ✓ | ✓ |

The exact CI execution optimization may be refined during implementation without changing the testing architecture.

---

# 9. Acceptance Criteria

### Vitest

- [ ] Vitest is installed.
- [ ] Vitest configuration exists.
- [ ] `pnpm run test` works.
- [ ] Unit/integration test infrastructure works.

### React Testing Library

- [ ] React Testing Library is installed.
- [ ] jsdom is configured.
- [ ] React test infrastructure works.

### Type Testing

- [ ] Public API type testing infrastructure exists.
- [ ] Public package types can be validated.

### Coverage

- [ ] Coverage can be generated.
- [ ] Coverage output works locally and in CI.

### Playwright

- [ ] Playwright is installed.
- [ ] Playwright configuration exists.
- [ ] Chromium can run.
- [ ] Browser smoke test passes.
- [ ] Browser artifacts are configured appropriately.

### Accessibility

- [ ] axe-core infrastructure exists.
- [ ] Browser accessibility testing can be executed.

### SSR / Import Safety

- [ ] `editor-core` can be imported in Node.
- [ ] Browser globals are not accessed at import time.

### Turborepo

- [ ] Test tasks integrate correctly with the monorepo.
- [ ] Package boundaries remain intact.

### CI

- [ ] Unit/integration tests run in CI.
- [ ] Browser test strategy is documented and executable.
- [ ] Test failures fail CI.

### AI Agent

- [ ] Testing workflow is documented.
- [ ] Tool responsibilities are clear.
- [ ] `agent-browser` is documented as optional rather than a required test dependency.

---

# 10. Risks

## Risk 1 — Overengineering the Test Infrastructure

**Mitigation:** Keep Phase 02 focused on infrastructure and smoke tests. Feature-specific tests belong to later phases.

## Risk 2 — Excessive Mocking

**Mitigation:** Prefer real package behavior and mock external boundaries only when appropriate.

## Risk 3 — Treating jsdom as a Real Browser

**Mitigation:** Use Playwright for selection, layout, IME, and browser-specific behavior.

## Risk 4 — Browser Tests Making Normal Test Runs Slow

**Mitigation:** Keep `pnpm run test` for Vitest and use `pnpm run test:browser` for Playwright.

## Risk 5 — Testing Dependencies Leaking into Published Packages

**Mitigation:** Keep testing tools at workspace/root development scope and validate package manifests.

## Risk 6 — AI-Agent Confusion Between Playwright and agent-browser

**Mitigation:** Explicitly document:

```text
Playwright
= repository browser testing

agent-browser
= optional AI-agent browser interaction
```

---

# 11. Definition of Done

Phase 02 is complete when the repository has a working, documented, and CI-compatible testing foundation.

The expected final structure is conceptually:

```text
editor/
├── apps/
│   └── fumadocs/
├── packages/
│   ├── editor-core/
│   └── editor-react/
├── tests/
│   └── browser/
├── playwright.config.ts
├── vitest.config.ts
├── package.json
├── turbo.json
└── ...
```

The exact directory structure may differ if implementation provides a cleaner package-local architecture.

The final verification must be reproducible with:

```bash
pnpm run check
pnpm run check-types
pnpm run test
pnpm run test:coverage
pnpm run test:browser
pnpm run build
pnpm run check:packages
```

---

# 12. Phase 02 Exit Criteria

Phase 02 can be marked **Completed** only after:

1. Vitest infrastructure works.
2. React Testing Library infrastructure works.
3. Type testing infrastructure works.
4. Coverage works.
5. Playwright infrastructure works.
6. Browser smoke test passes.
7. Accessibility testing foundation works.
8. SSR/import safety is verified.
9. Turborepo integration works.
10. CI executes the required test pipeline.
11. AI-agent testing rules are documented.
12. Full verification passes.
13. No Phase 01 regression is introduced.

**Status after implementation:** `🟡 In Progress`

Once all exit criteria are satisfied, update the roadmap status to:

**`🟢 Completed`**
