# Phase 01 — Build & Package Infrastructure

**Status:** ⬜ Planned  
**Phase:** 01  
**Depends on:** Phase 00 — Repository Foundation & Agent Readiness  
**Next phase:** Phase 02 — Test Infrastructure  
**Primary objective:** Establish the production-ready build and package foundation for the RumahKodingku Editor package ecosystem without implementing editor features or release/versioning automation.

---

## 1. Purpose

Phase 01 establishes the technical infrastructure required to build and consume the RumahKodingku Editor packages as real npm packages.

The phase converts the current repository foundation into a package-oriented monorepo capable of building:

- `@rumahkodingku/editor-core`
- `@rumahkodingku/editor-react`

The implementation must preserve the architecture already approved in `ARCHITECTURE.md`:

```text
editor-core
     ▲
     │
editor-react
     ▲
     │
apps/playground

apps/fumadocs
     │
     └── uses editor-react
```

Phase 01 is infrastructure only. It does **not** implement the editor engine, toolbar, extensions, image upload behavior, tests, playground features, documentation content, or release automation.

---

# 2. Source of Truth

Implementation must be based on these repository documents, in this order:

1. `PRD.md`
2. `ARCHITECTURE.md`
3. `AGENTS.md`
4. `docs/roadmap/README.md`
5. `docs/roadmap/phase-01-build-package-infrastructure.md`

If these documents conflict, stop and surface the conflict before making architectural assumptions.

The actual repository state must always take precedence over assumptions about what has already been implemented.

---

# 3. Current Codebase State

At the beginning of Phase 01, the repository is still primarily foundation/scaffolding.

Known repository structure:

```text
.
├── apps/
│   └── fumadocs/
├── packages/
│   └── config/
├── docs/
│   ├── adr/
│   └── roadmap/
├── AGENTS.md
├── ARCHITECTURE.md
├── PRD.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json
```

The following package/application infrastructure is not yet implemented as production packages:

```text
packages/editor-core/
packages/editor-react/
apps/playground/
```

The repository currently uses:

- pnpm `10.34.5`
- Node.js `>=22`
- Turborepo
- TypeScript
- Biome
- Fumadocs
- Next.js in the Fumadocs application

Phase 00 established the repository baseline and intentionally left editor implementation and package build infrastructure for this phase.

---

# 4. Phase Objective

By the end of Phase 01, the repository must be able to:

1. Build `@rumahkodingku/editor-core`.
2. Build `@rumahkodingku/editor-react`.
3. Produce ESM package artifacts.
4. Produce declaration files.
5. Expose packages through explicit `exports`.
6. Define correct package metadata.
7. Define package boundaries and dependency direction.
8. Establish Tiptap and React peer-dependency contracts.
9. Package adapter CSS where required.
10. Integrate package builds with Turborepo.
11. Validate package metadata and exports.
12. Verify that the generated packages can be consumed by a clean consumer.
13. Keep release/versioning infrastructure completely outside this phase.

---

# 5. Scope

## 5.1 In Scope

Phase 01 includes:

- tsdown installation and configuration.
- Package source directory creation.
- `editor-core` package skeleton.
- `editor-react` package skeleton.
- Package metadata.
- Package exports.
- ESM build output.
- Type declaration output.
- Package `files` configuration.
- `sideEffects` configuration.
- Node engine metadata.
- React peer dependencies.
- Tiptap peer dependencies.
- Package dependency relationships.
- TypeScript package configurations.
- Turborepo build integration.
- CSS packaging foundation.
- Package validation tooling.
- Consumer smoke verification.
- Documentation updates required to keep architecture and agent instructions consistent with the implemented infrastructure.

## 5.2 Explicitly Out of Scope

The following must **not** be implemented in Phase 01:

### Editor functionality

- Tiptap editor instance implementation.
- ProseMirror schema implementation.
- Toolbar.
- Bubble menu.
- Floating menu.
- Slash command.
- Placeholder behavior.
- Image upload behavior.
- Link behavior.
- Text formatting.
- Tables.
- Mentions.
- Custom extensions.
- Editor commands.
- Serialization helpers.
- Persistence implementation.

### Testing infrastructure

Do not implement the full testing system in this phase:

- Vitest setup.
- React Testing Library setup.
- Playwright setup.
- axe-core setup.
- Type tests.
- Integration test suites.
- Accessibility test suites.

These belong to Phase 02.

### Application development

- `apps/playground`.
- Demo application.
- Playground routes.
- Playground editor UI.

### Documentation implementation

- Full Fumadocs documentation.
- API reference.
- Editor usage guides.
- Extension guides.
- Image upload documentation.

Documentation updates needed to explain Phase 01 infrastructure are allowed, but feature documentation is deferred.

### Release/versioning infrastructure

All release/versioning infrastructure is explicitly deferred to Phase 09.

Do **not** implement:

- Changesets configuration.
- Changeset files.
- Version automation.
- Changelog automation.
- Release workflow.
- npm publishing automation.
- npm provenance configuration.
- Release CI/CD.
- Automated release notes.
- Publish scripts.
- Release dry-run workflow.

This decision supersedes any earlier assumption that Changesets must be introduced during Phase 01.

---

# 6. Architectural Constraints

## 6.1 Package Dependency Direction

The dependency graph must remain:

```text
@rumahkodingku/editor-core
            ▲
            │
@rumahkodingku/editor-react
            ▲
            │
       applications
```

Published packages must never depend on application code.

Forbidden:

```text
editor-core → editor-react
editor-core → playground
editor-core → fumadocs

editor-react → playground
editor-react → fumadocs
```

Allowed:

```text
editor-react → editor-core
playground → editor-react
fumadocs → editor-react
```

---

# 7. `editor-core` Requirements

Create:

```text
packages/editor-core/
```

Expected foundation:

```text
packages/editor-core/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

The exact final file set may differ if the implementation has a justified architectural reason.

## 7.1 Framework Independence

`editor-core` must remain framework agnostic.

It must not import:

```text
react
react-dom
vue
next
tailwindcss
application modules
browser-only globals at import time
```

The package must be usable independently from React.

## 7.2 Tiptap Contract

Tiptap is part of the public architecture.

When Tiptap packages are imported by `editor-core`, the corresponding Tiptap packages must be represented correctly in package metadata according to the approved architecture.

The implementation must not silently bundle duplicate Tiptap runtime dependencies when the architecture requires them to be peer dependencies.

The exact Tiptap version range must follow the approved architecture and current implementation decision for Tiptap 3.x.

## 7.3 Public API

Phase 01 only establishes the package entry point.

It must not prematurely design the complete editor API.

The package should expose only the minimum placeholder/foundation required to verify:

- source compilation;
- declaration generation;
- package exports;
- package consumption.

Any actual editor API belongs to Phase 03.

---

# 8. `editor-react` Requirements

Create:

```text
packages/editor-react/
```

Expected foundation:

```text
packages/editor-react/
├── src/
│   ├── index.ts
│   └── styles.css
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

The exact file set may differ if justified.

## 8.1 React Contract

`editor-react` may depend on:

- `react`
- `react-dom`
- `@rumahkodingku/editor-core`
- Tiptap React packages required by the eventual adapter

React must be declared according to the approved architecture.

Current architectural requirement:

```text
react: ^19
react-dom: ^19
```

The exact peer dependency ranges must remain aligned with `ARCHITECTURE.md`.

## 8.2 Client Boundary

The React adapter is expected to become the framework-facing package.

Phase 01 should establish the package boundary, but should not implement the actual editor React component.

The actual editor component belongs to Phase 04.

---

# 9. Build System

## 9.1 Bundler

Use:

```text
tsdown
```

as the package bundler.

Do not introduce another package bundler unless the architecture is explicitly revised.

## 9.2 Build Goals

Each published package should produce:

```text
dist/
├── index.js
├── index.d.ts
└── ...
```

`editor-react` should also provide its stylesheet artifact according to the approved architecture.

Expected conceptual output:

```text
dist/
├── index.js
├── index.d.ts
└── styles.css
```

The exact generated filenames may differ if the package exports remain explicit and stable.

## 9.3 ESM

Published packages must be ESM-first.

Package metadata must contain:

```json
{
  "type": "module"
}
```

Build output must be compatible with the Node >=22 baseline.

---

# 10. Package Metadata

Each publishable package must have appropriate metadata.

Minimum conceptual requirements:

```json
{
  "name": "@rumahkodingku/editor-core",
  "version": "0.0.0",
  "type": "module",
  "files": [
    "dist"
  ],
  "engines": {
    "node": ">=22"
  }
}
```

The React package follows the same principles.

The exact initial version may remain the repository's implementation convention, but Phase 01 must not introduce release automation.

---

# 11. Package `exports`

Every published package must use explicit exports.

Avoid relying on implicit package-root file resolution.

Conceptual shape:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

For the React adapter, stylesheet exports may be provided where required.

Example conceptual shape:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

The exact final export map must reflect actual generated files.

---

# 12. `files` Configuration

Published package tarballs must contain only required runtime artifacts.

Prefer:

```json
{
  "files": [
    "dist"
  ]
}
```

Do not accidentally publish:

- source development files;
- local configuration;
- tests;
- internal notes;
- repository tooling;
- playground code;
- unrelated project files.

---

# 13. `sideEffects`

Package metadata must explicitly define side effects where appropriate.

For packages without side-effectful modules:

```json
{
  "sideEffects": false
}
```

If CSS is exposed as a package artifact, the metadata must account for stylesheet side effects correctly.

Do not mark CSS as tree-shakeable JavaScript side-effect-free code if doing so would cause consumers to lose required styles.

---

# 14. TypeScript Configuration

Each package must have a package-level TypeScript configuration.

The configuration must:

- inherit appropriate repository TypeScript settings;
- compile source correctly;
- resolve workspace dependencies;
- support declaration generation through the build tool;
- preserve ESM semantics;
- avoid unnecessary application-specific configuration.

Do not modify the Fumadocs TypeScript configuration simply to make package infrastructure convenient.

The existing Fumadocs application has its own TypeScript requirements and must remain isolated unless a separate architectural decision is approved.

---

# 15. Turborepo Integration

The package build commands must integrate with the existing Turborepo pipeline.

The existing root configuration:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$"],
      "outputs": ["dist/**"]
    }
  }
}
```

must continue to work.

After Phase 01:

```bash
pnpm build
```

must be capable of building the relevant package graph.

For example:

```text
editor-core
    ↓
editor-react
```

Turborepo should understand the dependency ordering through workspace package dependencies rather than through manual shell ordering.

---

# 16. Workspace Dependencies

The package relationship should be represented through pnpm workspace dependencies.

Conceptually:

```json
{
  "dependencies": {
    "@rumahkodingku/editor-core": "workspace:*"
  }
}
```

Use the workspace protocol for internal package dependencies during development.

Do not introduce application-level shortcuts or path aliases as a substitute for real package dependencies.

---

# 17. Tiptap Dependency Strategy

Tiptap is part of the public package contract.

The implementation must follow the architecture's peer dependency strategy.

The goal is to prevent consumers from receiving multiple incompatible Tiptap installations.

Before adding individual Tiptap packages, inspect the actual source imports and expose only the packages that are genuinely required by the package.

Do not add the entire Tiptap ecosystem indiscriminately.

The dependency strategy must be documented in the package metadata and, if necessary, a short package comment/documentation note.

---

# 18. CSS Packaging

The React package will eventually need framework-agnostic editor styles.

Phase 01 establishes the packaging mechanism for those styles.

Requirements:

- CSS must be importable by consumers.
- CSS must not require Tailwind.
- CSS must not depend on the application's Tailwind configuration.
- CSS should be compatible with the package's future CSS-variable design system.
- CSS must be emitted as a package artifact.
- Package exports must expose the stylesheet through an explicit path.

Do not implement the final editor design system in this phase.

---

# 19. Framework Independence

Published packages must not require:

- Tailwind CSS;
- shadcn/ui;
- HeroUI;
- Flowbite;
- application-specific component libraries;
- Next.js;
- Vite;
- Fumadocs.

These may exist in development applications, but published package runtime behavior must remain independent of them.

---

# 20. Source vs Distribution Consumption

Phase 01 must make an explicit implementation decision for workspace consumption.

The recommended architecture is:

```text
development source
        ↓
package build
        ↓
dist
        ↓
consumer
```

The package metadata must accurately represent the package's published behavior.

Do not create a setup where the package works only because internal TypeScript path aliases bypass package exports.

The clean consumer verification in this phase must consume the built package artifacts.

---

# 21. Package Validation

Introduce package validation tooling required to verify npm package correctness.

At minimum, validate:

- package metadata;
- exports;
- declaration entry points;
- generated files;
- ESM compatibility;
- package tarball contents.

Recommended tools from the approved architecture:

```text
publint
@arethetypeswrong/cli
```

These tools are validation infrastructure only.

They are not release tooling.

---

# 22. Consumer Smoke Verification

A clean consumer must be able to install and consume the built packages.

The verification should simulate:

```text
RumahKodingku Editor package
          ↓
fresh consumer project
          ↓
pnpm install
          ↓
import package
          ↓
TypeScript resolves declarations
          ↓
Node/build tool resolves ESM entry
```

The verification must catch:

- broken `exports`;
- incorrect `types`;
- missing `dist` files;
- undeclared dependencies;
- workspace-only resolution;
- incorrect ESM metadata;
- missing CSS export;
- accidental source imports.

The consumer verification should not become a full application or editor test.

---

# 23. Expected Package Structure

The expected target after Phase 01 is approximately:

```text
packages/
├── config/
├── editor-core/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── tsdown.config.ts
└── editor-react/
    ├── src/
    │   ├── index.ts
    │   └── styles.css
    ├── package.json
    ├── tsconfig.json
    └── tsdown.config.ts
```

Generated artifacts:

```text
packages/editor-core/dist/
packages/editor-react/dist/
```

`dist` directories must be build outputs and must not become source-of-truth files.

---

# 24. Implementation Task Breakdown

## Task 01 — Re-read Architecture and Verify Phase Boundary

### Objective

Ensure the implementation starts from the approved architecture.

### Actions

1. Read `PRD.md`.
2. Read `ARCHITECTURE.md`.
3. Read `AGENTS.md`.
4. Read this phase document.
5. Inspect actual repository state.
6. Verify no existing package implementation conflicts with this plan.

### Acceptance

- Architecture constraints are understood.
- No feature work is started.
- Any contradiction is reported before implementation.

---

## Task 02 — Introduce tsdown

### Objective

Add the approved package bundler.

### Actions

1. Add `tsdown` at the appropriate workspace level.
2. Confirm its version is compatible with the repository's Node/TypeScript baseline.
3. Establish a reusable package build configuration pattern.
4. Avoid introducing unnecessary bundler abstractions.

### Acceptance

- `tsdown` is installed.
- A package can invoke a build through tsdown.
- Build output is ESM.
- Declaration generation works.

---

## Task 03 — Create `editor-core`

### Objective

Create the framework-independent package boundary.

### Actions

1. Create `packages/editor-core`.
2. Add package metadata.
3. Add source entry point.
4. Add package-level TypeScript configuration.
5. Add tsdown configuration.
6. Establish minimal public entry.
7. Configure exports.
8. Configure `files`.
9. Configure `sideEffects`.
10. Configure Node engine.

### Acceptance

```bash
pnpm --filter @rumahkodingku/editor-core build
```

completes successfully.

The generated package contains valid JavaScript and declarations.

---

## Task 04 — Create `editor-react`

### Objective

Create the React adapter package boundary.

### Actions

1. Create `packages/editor-react`.
2. Add package metadata.
3. Add source entry point.
4. Add stylesheet entry/artifact.
5. Add TypeScript configuration.
6. Add tsdown configuration.
7. Configure exports.
8. Configure React peer dependencies.
9. Configure Tiptap React peer dependencies as required.
10. Configure dependency on `editor-core`.
11. Configure `files`.
12. Configure `sideEffects`.
13. Configure Node engine.

### Acceptance

```bash
pnpm --filter @rumahkodingku/editor-react build
```

completes successfully.

---

## Task 05 — Establish Tiptap Peer Dependency Contract

### Objective

Prepare package metadata for the approved Tiptap architecture.

### Actions

1. Inspect actual Tiptap imports.
2. Identify required Tiptap packages.
3. Declare them according to the architecture.
4. Avoid bundling duplicate Tiptap runtime dependencies.
5. Verify package metadata after build.

### Acceptance

- Tiptap dependency strategy matches `ARCHITECTURE.md`.
- No accidental runtime duplication is introduced.

---

## Task 06 — Establish React Peer Dependency Contract

### Objective

Ensure React packages are consumer-owned dependencies.

### Actions

1. Configure React peer dependencies.
2. Configure React DOM peer dependencies where required.
3. Ensure package build does not bundle React.
4. Verify generated package metadata.

### Acceptance

- React is not bundled into the React adapter.
- Peer dependency metadata is correct.

---

## Task 07 — Configure Package Exports

### Objective

Create stable public package entry points.

### Actions

1. Define root exports.
2. Define type entry.
3. Define import entry.
4. Define stylesheet export for React package if applicable.
5. Verify all export targets exist.
6. Verify no undeclared internal path is exposed.

### Acceptance

A consumer can use package imports without reaching into:

```text
/src
/dist/internal-file
```

---

## Task 08 — Configure Package Metadata

### Objective

Make packages npm-consumer ready at the metadata level.

### Actions

Configure:

- `name`
- `version`
- `description`
- `type`
- `exports`
- `files`
- `sideEffects`
- `engines`
- `repository`
- `license`
- `peerDependencies`
- `dependencies` where necessary

Do not add release automation.

### Acceptance

Package metadata is internally consistent and validated by package tooling.

---

## Task 09 — Configure CSS Packaging

### Objective

Make React adapter styles consumable independently of Tailwind.

### Actions

1. Create the initial stylesheet artifact.
2. Configure tsdown/build copying or generation as appropriate.
3. Expose stylesheet through package exports.
4. Verify the stylesheet exists in the built package.
5. Verify consumer import.

### Acceptance

A consumer can import the package stylesheet through its documented package path.

---

## Task 10 — Integrate with Turborepo

### Objective

Make package builds part of the monorepo build graph.

### Actions

1. Confirm package scripts expose `build`.
2. Confirm workspace dependencies represent package dependency direction.
3. Run root build.
4. Confirm dependency ordering.
5. Confirm `dist/**` is recognized as build output.

### Acceptance

```bash
pnpm build
```

builds the package graph successfully.

---

## Task 11 — Add Package Validation

### Objective

Detect packaging errors before publishing.

### Actions

1. Add `publint`.
2. Add `@arethetypeswrong/cli`.
3. Add package-level or root validation scripts.
4. Validate both packages.

### Acceptance

Validation passes without unresolved export/type/package issues.

---

## Task 12 — Clean Consumer Verification

### Objective

Verify the packages outside the monorepo assumptions.

### Actions

1. Build packages.
2. Create a temporary consumer environment.
3. Install/consume built package artifacts.
4. Verify ESM import.
5. Verify TypeScript declarations.
6. Verify React package metadata.
7. Verify CSS package export.
8. Confirm no source-path leakage.

### Acceptance

The packages behave as real distributable packages.

---

## Task 13 — Synchronize Documentation

### Objective

Keep repository instructions aligned with implementation.

### Actions

Update only documents that are materially affected by Phase 01.

Potential files:

```text
AGENTS.md
ARCHITECTURE.md
docs/roadmap/README.md
```

If architecture wording conflicts with the explicit Phase 09 release decision, document the conflict and resolve it before implementation proceeds.

Do not silently modify architecture decisions.

---

# 25. Important Architecture Consistency Check

There is one known documentation consistency point that must be reviewed before implementation.

`ARCHITECTURE.md` currently records Changesets as a resolved architectural decision and includes release infrastructure in its implementation gates.

The current project decision is:

> All release/versioning infrastructure is deferred completely to Phase 09.

Therefore, before final implementation, verify that the architecture wording does not imply that Changesets must be implemented during Phase 01.

If a contradiction remains, update the architecture document through an explicit documentation change before proceeding.

The intended final interpretation is:

```text
Changesets:
    Architecture decision → approved
    Implementation phase → Phase 09
```

This does **not** mean Changesets should be installed or configured during Phase 01.

---

# 26. Root Scripts

Phase 01 may introduce or adjust root scripts needed for package infrastructure.

Possible scripts include:

```json
{
  "build": "turbo run build",
  "check": "biome check --write .",
  "check-types": "turbo run check-types"
}
```

Package validation scripts may also be introduced if justified.

Do not introduce:

```text
release
version
publish
changeset
changelog
```

scripts in this phase.

---

# 27. Dependency Change Policy

Every new dependency must have a clear reason.

Expected Phase 01 infrastructure dependencies may include:

- `tsdown`
- `publint`
- `@arethetypeswrong/cli`

Tiptap packages may be introduced only as required by the actual package implementation and architecture.

Do not install:

- editor feature extensions without implementation need;
- UI libraries;
- Tailwind into published packages;
- testing libraries;
- release tooling;
- cloud services;
- upload SDKs.

---

# 28. Verification Matrix

| Area                   | Verification                                      | Expected Result      |
| ---------------------- | ------------------------------------------------- | -------------------- |
| Workspace              | `pnpm install`                                    | Pass                 |
| Core build             | `pnpm --filter @rumahkodingku/editor-core build`  | Pass                 |
| React build            | `pnpm --filter @rumahkodingku/editor-react build` | Pass                 |
| Root build             | `pnpm build`                                      | Pass                 |
| Type checking          | `pnpm check-types`                                | Pass                 |
| Package metadata       | `publint`                                         | Pass                 |
| Type package shape     | `attw`                                            | Pass                 |
| ESM                    | Consumer import                                   | Pass                 |
| Types                  | Consumer TypeScript resolution                    | Pass                 |
| CSS                    | React stylesheet import                           | Pass                 |
| Dependency graph       | Turborepo                                         | Correct ordering     |
| Package boundaries     | Source inspection                                 | No forbidden imports |
| Release infrastructure | Repository inspection                             | None introduced      |

---

# 29. Architecture Verification Checklist

## `editor-core`

- [ ] Framework agnostic.
- [ ] No React import.
- [ ] No Vue import.
- [ ] No Next.js import.
- [ ] No Tailwind import.
- [ ] No application import.
- [ ] ESM package.
- [ ] Type declarations generated.
- [ ] Explicit exports.
- [ ] Correct package metadata.
- [ ] Node >=22.
- [ ] Correct Tiptap peer dependency strategy.

## `editor-react`

- [ ] React adapter boundary exists.
- [ ] Depends on `editor-core`.
- [ ] React is peer dependency.
- [ ] React DOM is peer dependency when required.
- [ ] Tiptap React dependency strategy is correct.
- [ ] ESM package.
- [ ] Type declarations generated.
- [ ] Explicit exports.
- [ ] CSS artifact generated.
- [ ] CSS export works.
- [ ] Node >=22.

## Repository

- [ ] pnpm remains official package manager.
- [ ] Turborepo build graph works.
- [ ] tsdown is the package bundler.
- [ ] Published packages do not require Tailwind.
- [ ] No release tooling added.
- [ ] No Changesets configuration added.
- [ ] No npm publish automation added.

---

# 30. Risks

## Risk 01 — Tiptap Duplicate Installation

### Problem

Tiptap may accidentally be bundled or installed multiple times.

### Mitigation

Use the approved peer dependency strategy and verify package output.

---

## Risk 02 — Broken Package Exports

### Problem

Package works inside the monorepo but fails in a real consumer.

### Mitigation

Perform clean consumer verification against built artifacts.

---

## Risk 03 — Source Path Leakage

### Problem

Workspace aliases make development appear successful while published packages are broken.

### Mitigation

Validate generated package exports and test from a clean consumer.

---

## Risk 04 — CSS Not Included in Package

### Problem

The package builds JavaScript but consumers cannot import required styles.

### Mitigation

Verify `dist/styles.css`, `exports`, and consumer stylesheet import.

---

## Risk 05 — Fumadocs TypeScript Coupling

### Problem

Package infrastructure changes break the existing Fumadocs application.

### Mitigation

Keep Fumadocs TypeScript configuration isolated and verify it independently.

---

## Risk 06 — Premature Editor API

### Problem

Phase 01 begins defining APIs that should be designed during Phase 03/04.

### Mitigation

Keep package entry points minimal and infrastructure-focused.

---

## Risk 07 — Premature Release Infrastructure

### Problem

Changesets or publishing infrastructure enters the repository before Phase 09.

### Mitigation

Treat all release/versioning work as explicitly out of scope.

---

# 31. AI Agent Implementation Rules

Any AI agent working on Phase 01 must follow these rules.

## Before coding

1. Read `AGENTS.md`.
2. Read `PRD.md`.
3. Read `ARCHITECTURE.md`.
4. Read this phase document.
5. Inspect the actual repository.
6. Confirm the requested task belongs to Phase 01.

## During coding

- Do not implement editor features.
- Do not implement tests.
- Do not implement playground.
- Do not implement release infrastructure.
- Do not introduce framework dependencies into `editor-core`.
- Do not introduce Tailwind into published packages.
- Do not bypass workspace package boundaries with arbitrary aliases.
- Do not silently change architectural decisions.
- Do not install dependencies without explaining why they are needed.

## After coding

Run the relevant verification commands.

At minimum, when applicable:

```bash
pnpm install
pnpm build
pnpm check-types
```

Also run package validation and consumer verification.

If a check fails because of a pre-existing unrelated issue, identify it clearly instead of masking it.

---

# 32. Suggested Implementation Order

Execute tasks in this order:

```text
01. Verify architecture and phase boundary
        ↓
02. Introduce tsdown
        ↓
03. Create editor-core package
        ↓
04. Create editor-react package
        ↓
05. Establish Tiptap peer dependency contract
        ↓
06. Establish React peer dependency contract
        ↓
07. Configure exports
        ↓
08. Configure package metadata
        ↓
09. Configure CSS packaging
        ↓
10. Integrate Turborepo
        ↓
11. Add package validation
        ↓
12. Run clean consumer verification
        ↓
13. Synchronize documentation
        ↓
14. Final verification
```

Do not move to Phase 02 until the exit criteria are satisfied.

---

# 33. Definition of Done

Phase 01 is complete only when all of the following are true:

### Build

- [ ] `editor-core` builds.
- [ ] `editor-react` builds.
- [ ] Root Turborepo build succeeds.
- [ ] ESM artifacts are generated.
- [ ] Type declarations are generated.

### Packaging

- [ ] Package names are correct.
- [ ] Package exports are explicit.
- [ ] `files` configuration is correct.
- [ ] `sideEffects` configuration is correct.
- [ ] Node engine is defined.
- [ ] Repository/license metadata is present as required.
- [ ] Peer dependencies are correct.

### Dependency architecture

- [ ] `editor-react` depends on `editor-core`.
- [ ] `editor-core` does not depend on framework packages.
- [ ] Tiptap dependency strategy is correct.
- [ ] React dependency strategy is correct.

### CSS

- [ ] React CSS artifact is generated.
- [ ] CSS can be imported through the package export.
- [ ] CSS does not require Tailwind.

### Validation

- [ ] `publint` passes.
- [ ] `@arethetypeswrong/cli` passes.
- [ ] Clean consumer verification passes.

### Repository

- [ ] Turborepo understands package dependency order.
- [ ] Existing Fumadocs app remains healthy.
- [ ] `pnpm check-types` passes.
- [ ] No release/versioning infrastructure was introduced.

### Documentation

- [ ] Documentation reflects the actual implementation.
- [ ] Any architecture conflict concerning Phase 09 release infrastructure is resolved explicitly.
- [ ] Phase 01 status can be marked complete.

---

# 34. Exit Criteria

Phase 01 may be marked complete when:

```text
Repository
    │
    ├── editor-core builds
    │
    ├── editor-react builds
    │
    ├── packages expose correct ESM/types
    │
    ├── CSS is distributable
    │
    ├── package metadata validates
    │
    ├── clean consumer works
    │
    └── no release infrastructure exists
```

At this point the repository is ready for:

```text
Phase 02 — Test Infrastructure
```

Phase 03 and later may then implement the actual editor engine and public API.

---

# 35. Phase Boundary Summary

Phase 01 answers:

> **“Can RumahKodingku Editor exist as correctly structured, buildable, distributable npm packages?”**

It does **not** answer:

> “Does the editor have all of its features?”

Feature implementation belongs to later phases.

The final responsibility split is:

```text
Phase 00
Repository foundation
        ↓
Phase 01
Build + package infrastructure
        ↓
Phase 02
Testing infrastructure
        ↓
Phase 03
Editor core
        ↓
Phase 04
React adapter
        ↓
Phase 05
Playground
        ↓
Phase 06
Editor MVP
        ↓
Phase 07
Browser + accessibility
        ↓
Phase 08
Documentation
        ↓
Phase 09
Release engineering
```

---

# 36. Final Agent Instruction

When an AI agent is assigned Phase 01:

1. Read the repository documentation first.
2. Inspect the actual codebase.
3. Confirm the current state.
4. Implement only build/package infrastructure.
5. Preserve package boundaries.
6. Keep `editor-core` framework-free.
7. Keep React/Tiptap as consumer-owned peer dependencies where required.
8. Use tsdown for package builds.
9. Validate actual package artifacts.
10. Test from a clean consumer environment.
11. Do not introduce editor features.
12. Do not introduce testing infrastructure.
13. Do not introduce playground work.
14. Do not introduce release/versioning infrastructure.
15. Do not configure Changesets.
16. Do not publish packages.
17. Do not silently change architecture.
18. Report blockers and architectural contradictions explicitly.
19. Stop after Phase 01 exit criteria are satisfied.
20. Do not begin Phase 02 without an explicit phase transition.

**Phase 01 success means the package infrastructure is production-oriented and consumer-verifiable, while feature implementation and release engineering remain deliberately deferred to their designated phases.**
