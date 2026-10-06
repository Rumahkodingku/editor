# PHASE 09 — Release Engineering

**Status:** Planned  
**Phase:** 09  
**Previous Phase:** Phase 08 — Documentation  
**Primary Goal:** Prepare, validate, automate, and execute the first production release of the RumahKodingku Editor package ecosystem on npm.

---

## 1. Overview

Phase 09 establishes the release engineering foundation for the RumahKodingku Editor monorepo.

The goal is not simply to publish packages to npm. The goal is to create a **reproducible, validated, and maintainable release process** that can be reused for future versions.

```text
Source Code
    ↓
Release Readiness Audit
    ↓
Repository Cleanup
    ↓
Changesets
    ↓
Versioning Policy
    ↓
Package Metadata Validation
    ↓
Package Build
    ↓
Tarball Validation
    ↓
Clean Consumer Test
    ↓
Release Dry Run
    ↓
Human Release Approval
    ↓
npm Publish
    ↓
GitHub Release
    ↓
Documentation Synchronization
    ↓
Post-release Verification
```

Phase 09 must preserve the architectural principles established in previous phases:

- `editor-core` remains framework-agnostic.
- `editor-react` remains the React adapter.
- Package boundaries remain explicit.
- Tiptap/ProseMirror remains the document/editor state authority.
- Published packages remain ESM-first.
- Published packages must not require Tailwind.
- Package consumers must be able to install packages from npm independently of the monorepo.
- Release infrastructure must not introduce unnecessary runtime dependencies into published packages.

---

# 2. Phase Objectives

By the end of Phase 09:

- [ ] Changesets is configured.
- [ ] Package versioning policy is explicitly defined.
- [ ] npm package metadata is production-ready.
- [ ] Package tarballs are validated before publishing.
- [ ] `publint` and `@arethetypeswrong/cli` validation passes.
- [ ] Clean consumer installation is tested outside the workspace.
- [ ] Peer dependencies are validated.
- [ ] Release automation is implemented.
- [ ] A complete release dry-run succeeds.
- [ ] The first npm release is performed after explicit human approval.
- [ ] GitHub release/tagging is completed.
- [ ] Documentation is synchronized with the published package.
- [ ] A fresh consumer project can install and use the published packages.
- [ ] The release process is documented for future contributors and AI agents.

---

# 3. Package Scope

The primary packages covered by this phase are:

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
```

Future packages such as:

```text
@rumahkodingku/editor-vue
```

are not included unless they exist and are explicitly added to the release scope.

---

# 4. Agent Execution Policy

Phase 09 follows this rule:

> **AI Agent does the engineering; human owns irreversible release decisions.**

AI agents may perform repository inspection, configuration, implementation, testing, validation, documentation updates, and release preparation.

AI agents must **not** independently execute irreversible public release actions without explicit human approval.

## 4.1 AI Agent — Full Autonomy

The following task groups may be completed fully by an AI coding agent:

- 09.01 Release Readiness Audit
- 09.02 Repository Cleanup
- 09.03 Establish Changesets
- 09.05 Package Metadata & npm Configuration
- 09.06 Package Build & Tarball Validation
- 09.07 Clean Consumer Installation Test
- 09.08 Dependency & Peer Dependency Validation
- 09.10 Release Workflow
- 09.11 First Release Dry Run
- 09.14 Post-release Documentation Update
- 09.15 Documentation Verification
- 09.16 Post-release Consumer Verification
- 09.17 Release Health Check

## 4.2 AI Agent + Human Approval

The following require human review or decision:

- 09.04 Package Versioning Policy
- 09.09 npm Package Preview
- 09.13 GitHub Release
- 09.18 Phase Completion

## 4.3 Explicit Human Release Gate

The following task requires explicit human approval:

- 09.12 First npm Release

The AI agent may prepare everything required for the release but must stop before the actual public publish action.

No autonomous `npm publish` is permitted as part of the default Phase 09 workflow.

---

# 5. Task 09.01 — Release Readiness Audit

## Objective

Determine whether the repository is technically ready to enter release engineering.

## Tasks

- [ ] Audit Phase 00–08 completion state.
- [ ] Audit `PRD.md`.
- [ ] Audit `ARCHITECTURE.md`.
- [ ] Audit `AGENTS.md`.
- [ ] Audit root `README.md`.
- [ ] Audit Fumadocs documentation.
- [ ] Audit package metadata.
- [ ] Audit package exports.
- [ ] Audit `tsdown` configuration.
- [ ] Audit TypeScript configuration.
- [ ] Audit CI workflow.
- [ ] Audit browser testing configuration.
- [ ] Audit package validation tooling.
- [ ] Audit repository release state.
- [ ] Confirm no unexpected npm release already exists.
- [ ] Confirm `.changeset/` does not contain unintended release data.
- [ ] Identify all release blockers.
- [ ] Produce a release readiness report.

## Required Validation

```bash
pnpm run check:ci
pnpm run check-types
pnpm run check-types:fumadocs
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run check:packages
pnpm run test:browser
```

## Exit Criteria

- [ ] All required checks pass.
- [ ] Blockers are resolved or explicitly documented.
- [ ] Repository is ready for release engineering implementation.

---

# 6. Task 09.02 — Repository Cleanup

## Objective

Remove inconsistencies that could cause confusion during the release.

## Tasks

- [ ] Synchronize roadmap phase status.
- [ ] Update outdated Phase 08 references.
- [ ] Update root README if necessary.
- [ ] Remove obsolete "coming soon" wording.
- [ ] Remove outdated "not published" wording where appropriate.
- [ ] Review TODOs related to release engineering.
- [ ] Verify package names are consistent.
- [ ] Verify repository URLs.
- [ ] Verify documentation URLs.
- [ ] Verify installation commands.
- [ ] Remove accidental internal-only information from public documentation.
- [ ] Verify no placeholder npm links remain.

## Exit Criteria

- [ ] Repository documentation accurately represents the pre-release state.
- [ ] No known release-related documentation mismatch remains.

---

# 7. Task 09.03 — Establish Changesets

## Objective

Introduce Changesets as the package versioning and changelog foundation.

## Tasks

- [ ] Install Changesets.
- [ ] Initialize `.changeset/`.
- [ ] Create `.changeset/config.json`.
- [ ] Configure base branch.
- [ ] Configure access level.
- [ ] Configure changelog strategy.
- [ ] Configure internal dependency update behavior.
- [ ] Configure package versioning behavior.
- [ ] Add Changesets scripts where appropriate.
- [ ] Document Changesets usage.
- [ ] Validate Changesets configuration.
- [ ] Run Changesets status command.

## Expected Structure

```text
.changeset/
├── config.json
└── README.md
```

## Exit Criteria

- [ ] Changesets is installed.
- [ ] Configuration is valid.
- [ ] Changesets can detect workspace packages.
- [ ] No accidental release changeset exists unless intentionally created.

---

# 8. Task 09.04 — Define Package Versioning Policy

## Objective

Define explicit SemVer and package versioning rules.

## Decisions Required

### Initial Version

Determine whether the first public release should be:

```text
0.1.0
```

or:

```text
1.0.0
```

The decision must be explicitly approved before implementation.

### Versioning Model

Determine whether packages use:

- Independent versions, or
- Synchronized versions.

The existing architecture favors independent package versions, but the final release policy must be explicitly confirmed.

## Tasks

- [ ] Define initial release version.
- [ ] Define independent/synchronized versioning.
- [ ] Define MAJOR release policy.
- [ ] Define MINOR release policy.
- [ ] Define PATCH release policy.
- [ ] Define breaking change policy.
- [ ] Define public API change policy.
- [ ] Define dependency-only change policy.
- [ ] Define documentation-only change policy.
- [ ] Define experimental API policy.
- [ ] Document versioning policy.
- [ ] Obtain human approval.

## Example

```text
MAJOR → breaking public API
MINOR → backward-compatible feature
PATCH → backward-compatible fix
```

## Exit Criteria

- [ ] Versioning policy is documented.
- [ ] Initial version is approved.
- [ ] AI agent can determine the correct Changeset type from the policy.

---

# 9. Task 09.05 — Package Metadata & npm Configuration

## Objective

Ensure published packages contain correct and complete npm metadata.

## `editor-core` Audit

- [ ] `name`
- [ ] `version`
- [ ] `description`
- [ ] `license`
- [ ] `repository`
- [ ] `homepage`
- [ ] `bugs`
- [ ] `keywords`
- [ ] `engines`
- [ ] `files`
- [ ] `exports`
- [ ] `types`
- [ ] `peerDependencies`
- [ ] `dependencies`
- [ ] `publishConfig`

## `editor-react` Audit

Perform the same metadata audit.

Additionally verify:

- [ ] CSS export.
- [ ] React peer dependency.
- [ ] Tiptap peer dependency.
- [ ] `editor-core` dependency.
- [ ] Public package API.

## Exit Criteria

- [ ] Package metadata is complete.
- [ ] No accidental development dependency is required by consumers.
- [ ] Export configuration is valid.
- [ ] Package files are intentionally selected.

---

# 10. Task 09.06 — Package Build & Tarball Validation

## Objective

Verify that the exact package artifacts intended for npm publication are correct.

## Tasks

- [ ] Build `editor-core`.
- [ ] Build `editor-react`.
- [ ] Run `npm pack --dry-run`.
- [ ] Inspect package contents.
- [ ] Verify JavaScript output.
- [ ] Verify declaration files.
- [ ] Verify CSS output.
- [ ] Verify source maps according to project policy.
- [ ] Verify README inclusion.
- [ ] Verify LICENSE inclusion.
- [ ] Verify package metadata.
- [ ] Verify no tests are included unnecessarily.
- [ ] Verify no internal configuration is included unnecessarily.
- [ ] Verify package size.
- [ ] Run `publint`.
- [ ] Run `@arethetypeswrong/cli`.
- [ ] Validate package exports.

## Required Checks

```bash
pnpm run build
pnpm run check:packages
```

## Exit Criteria

- [ ] Tarballs contain only intended files.
- [ ] `publint` passes.
- [ ] `attw` passes.
- [ ] Package exports resolve correctly.

---

# 11. Task 09.07 — Clean Consumer Installation Test

## Objective

Prove that the packages work outside the monorepo.

## Tasks

Create a temporary consumer application.

Example:

```text
/tmp/rk-editor-consumer
```

The test must not depend on workspace package resolution.

## Test Flow

```text
Build package
    ↓
Create tarball
    ↓
Create fresh consumer
    ↓
Install tarball
    ↓
Install peer dependencies
    ↓
Import package
    ↓
Type-check
    ↓
Build
    ↓
Run browser test
```

## Test Cases

- [ ] Install `editor-core`.
- [ ] Install `editor-react`.
- [ ] Verify ESM import.
- [ ] Verify TypeScript declarations.
- [ ] Verify React integration.
- [ ] Verify CSS import.
- [ ] Initialize editor.
- [ ] Load JSON content.
- [ ] Edit content.
- [ ] Read JSON output.
- [ ] Build production application.
- [ ] Run browser validation.

## Exit Criteria

- [ ] Consumer works without workspace dependencies.
- [ ] No missing export errors.
- [ ] No missing declaration errors.
- [ ] No missing CSS errors.
- [ ] No runtime package resolution errors.

---

# 12. Task 09.08 — Dependency & Peer Dependency Validation

## Objective

Ensure the published dependency graph is correct and predictable.

## Tasks

- [ ] Audit React peer dependency.
- [ ] Audit Tiptap peer dependencies.
- [ ] Audit ProseMirror dependency graph.
- [ ] Audit `editor-core → editor-react`.
- [ ] Check for duplicate Tiptap installations.
- [ ] Check for duplicate ProseMirror installations.
- [ ] Check peer dependency warnings.
- [ ] Verify Node engine requirements.
- [ ] Test pnpm installation.
- [ ] Test npm installation.
- [ ] Validate clean consumer installation.
- [ ] Document supported environment.

## Exit Criteria

- [ ] No unexpected duplicate core editor dependencies.
- [ ] Peer dependency warnings are intentional or resolved.
- [ ] Package installation works with supported package managers.

---

# 13. Task 09.09 — npm Package Preview

## Objective

Review the package exactly as a public npm consumer will see it.

## Tasks

- [ ] Generate release tarballs.
- [ ] Inspect `package.json`.
- [ ] Verify package names.
- [ ] Verify package scope.
- [ ] Verify version.
- [ ] Verify package access configuration.
- [ ] Verify README.
- [ ] Verify license.
- [ ] Verify repository.
- [ ] Verify homepage.
- [ ] Verify keywords.
- [ ] Verify package size.
- [ ] Verify published files.
- [ ] Verify exports.
- [ ] Verify npm package naming strategy.

## Human Review

Human approval is required for:

- Package names.
- Initial public version.
- Public description.
- License.
- Package access.
- Public metadata.

## Exit Criteria

- [ ] npm preview is approved.
- [ ] No public-facing metadata issue remains.

---

# 14. Task 09.10 — Release Workflow

## Objective

Automate the repeatable release process while keeping irreversible actions protected.

## Tasks

- [ ] Design release workflow.
- [ ] Add Changesets validation.
- [ ] Add release PR workflow.
- [ ] Add package versioning automation.
- [ ] Add changelog generation.
- [ ] Add package build validation.
- [ ] Add package validation.
- [ ] Add npm publish workflow.
- [ ] Add GitHub release integration.
- [ ] Configure required GitHub Actions permissions.
- [ ] Configure npm authentication strategy.
- [ ] Document required secrets or trusted publishing configuration.
- [ ] Prevent accidental publishing from arbitrary branches.
- [ ] Ensure CI gates pass before publish.
- [ ] Document release workflow.

## Important Security Rule

Secrets must never be committed to the repository.

Examples:

```text
NPM_TOKEN
GitHub credentials
personal access tokens
private keys
```

must remain in the appropriate GitHub/npm credential mechanism.

## Exit Criteria

- [ ] Release workflow is implemented.
- [ ] Workflow has appropriate permissions.
- [ ] Workflow cannot accidentally publish from unintended branches.
- [ ] Authentication strategy is documented.

---

# 15. Task 09.11 — First Release Dry Run

## Objective

Execute the complete release pipeline without publishing to npm.

## Tasks

- [ ] Create temporary Changeset.
- [ ] Run Changesets status.
- [ ] Generate expected version.
- [ ] Generate expected changelog.
- [ ] Build packages.
- [ ] Generate tarballs.
- [ ] Run `publint`.
- [ ] Run `attw`.
- [ ] Run clean consumer test.
- [ ] Verify dependency graph.
- [ ] Verify package metadata.
- [ ] Verify release workflow.
- [ ] Verify generated package versions.
- [ ] Verify changelog.
- [ ] Verify documentation references.
- [ ] Remove or finalize temporary Changeset appropriately.

## Critical Rule

The dry run must not execute:

```bash
npm publish
```

## Exit Criteria

- [ ] Complete dry run succeeds.
- [ ] Expected package versions are correct.
- [ ] Expected changelog is correct.
- [ ] Consumer installation succeeds.
- [ ] No release blocker remains.

---

# 16. Task 09.12 — First npm Release

## Objective

Publish the first production release.

## Human Approval Gate

The AI agent must stop before the actual public publish action.

The release requires explicit human approval.

## Pre-release Checklist

- [ ] All CI checks pass.
- [ ] Changeset is correct.
- [ ] Version is approved.
- [ ] Package metadata is approved.
- [ ] Tarball validation passes.
- [ ] Consumer installation passes.
- [ ] Documentation is ready.
- [ ] Release notes are ready.
- [ ] npm authentication is configured.
- [ ] GitHub release configuration is ready.

## Release Actions

After explicit approval:

- [ ] Execute release versioning.
- [ ] Publish `@rumahkodingku/editor-core`.
- [ ] Publish `@rumahkodingku/editor-react`.
- [ ] Verify npm registry.
- [ ] Verify published package metadata.
- [ ] Verify published tarball.
- [ ] Verify package installation from npm.

## Exit Criteria

- [ ] Packages are publicly available.
- [ ] npm registry metadata is correct.
- [ ] Fresh installation succeeds.

---

# 17. Task 09.13 — GitHub Release

## Objective

Create the public GitHub release corresponding to the npm release.

## Tasks

- [ ] Verify Git tags.
- [ ] Verify package versions.
- [ ] Generate release notes.
- [ ] Create GitHub Release.
- [ ] Link release to npm packages.
- [ ] Document package versions.
- [ ] Document important changes.
- [ ] Document breaking changes if applicable.
- [ ] Document known limitations if applicable.

## Human Review

The release notes should receive human approval before public publication for the first release.

## Exit Criteria

- [ ] GitHub Release exists.
- [ ] Git tag matches package version.
- [ ] Release notes accurately represent the release.
- [ ] npm and GitHub versions are consistent.

---

# 18. Task 09.14 — Post-release Documentation Update

## Objective

Transition documentation from pre-release state to published-package state.

## Tasks

- [ ] Update installation guide.
- [ ] Replace workspace-oriented installation instructions where appropriate.
- [ ] Add npm installation instructions.
- [ ] Add npm package links.
- [ ] Update package versions.
- [ ] Update compatibility information.
- [ ] Update API documentation.
- [ ] Update examples.
- [ ] Update README.
- [ ] Update Fumadocs.
- [ ] Add release/changelog references.
- [ ] Remove outdated "coming soon" text.
- [ ] Remove outdated "not published" text.
- [ ] Verify GitHub links.
- [ ] Verify npm links.
- [ ] Verify code snippets.

## Principle

Documentation should describe the **published consumer experience**, not merely the internal monorepo implementation.

---

# 19. Task 09.15 — Documentation ↔ Published Package Verification

## Objective

Verify that public documentation matches the actual published package.

## Tasks

- [ ] Test every installation command.
- [ ] Test package import examples.
- [ ] Test CSS import examples.
- [ ] Test TypeScript examples.
- [ ] Test React examples.
- [ ] Test documented APIs.
- [ ] Test documented configuration.
- [ ] Test extension examples.
- [ ] Test upload examples.
- [ ] Test Playground links.
- [ ] Verify documented package versions.
- [ ] Verify examples against published packages.

## Exit Criteria

> Every documented public API must work against the published package, unless explicitly documented otherwise.

---

# 20. Task 09.16 — Post-release Consumer Verification

## Objective

Simulate a completely new developer consuming the library.

## Tasks

- [ ] Create a fresh project.
- [ ] Install packages from npm.
- [ ] Follow installation documentation.
- [ ] Initialize the editor.
- [ ] Render the editor.
- [ ] Load initial content.
- [ ] Edit content.
- [ ] Read JSON output.
- [ ] Configure toolbar.
- [ ] Configure extensions.
- [ ] Configure image upload handler.
- [ ] Build production application.
- [ ] Run application.
- [ ] Run browser test.
- [ ] Confirm no runtime errors.

## Exit Criteria

- [ ] Fresh consumer succeeds without repository-local dependencies.
- [ ] Documentation can be followed successfully.
- [ ] Published packages work in production build.

---

# 21. Task 09.17 — Release Health Check

## Objective

Perform the final verification after release.

## Tasks

- [ ] Check npm package availability.
- [ ] Check npm versions.
- [ ] Check npm metadata.
- [ ] Check package tarballs.
- [ ] Check GitHub release.
- [ ] Check Git tags.
- [ ] Check changelog.
- [ ] Check documentation.
- [ ] Check Playground.
- [ ] Check CI status.
- [ ] Check fresh consumer installation.
- [ ] Check package imports.
- [ ] Check CSS.
- [ ] Check browser runtime.
- [ ] Record release status.
- [ ] Record known issues if any.

## Suggested Report

```text
Release Health Report

editor-core              PASS
editor-react             PASS
npm metadata             PASS
ESM exports              PASS
TypeScript declarations  PASS
CSS exports              PASS
Peer dependencies        PASS
Consumer installation    PASS
Documentation            PASS
GitHub Release           PASS
CI                       PASS
Browser runtime          PASS
```

---

# 22. Task 09.18 — Phase Completion

## Objective

Formally close Phase 09 after all release engineering requirements are satisfied.

## Definition of Done

### Release Infrastructure

- [ ] Changesets configured.
- [ ] Versioning policy documented.
- [ ] Release workflow documented.
- [ ] Release automation implemented.

### Package Validation

- [ ] Package build passes.
- [ ] Tarball validation passes.
- [ ] `publint` passes.
- [ ] `@arethetypeswrong/cli` passes.
- [ ] Package exports are valid.
- [ ] Peer dependencies are valid.

### Consumer Validation

- [ ] Clean consumer installation passes.
- [ ] npm installation passes.
- [ ] TypeScript integration passes.
- [ ] React integration passes.
- [ ] CSS integration passes.
- [ ] Production build passes.
- [ ] Browser runtime passes.

### Release

- [ ] First npm release completed.
- [ ] Git tag created.
- [ ] GitHub Release created.
- [ ] Release notes published.

### Documentation

- [ ] Installation documentation updated.
- [ ] API documentation verified.
- [ ] Examples verified.
- [ ] npm links verified.
- [ ] Documentation reflects published package.

### Final

- [ ] Release health check passes.
- [ ] No critical release blocker remains.
- [ ] Phase 09 completion is approved.

---

# 23. Required Release Gates

Phase 09 must use explicit gates.

## Gate A — Technical Readiness

```text
Code
 ↓
Type Check
 ↓
Unit Tests
 ↓
Coverage
 ↓
Build
 ↓
Package Validation
 ↓
Browser Tests
```

All must pass.

## Gate B — Package Readiness

```text
Build
 ↓
Tarball
 ↓
publint
 ↓
attw
 ↓
Exports
 ↓
Consumer Installation
```

All must pass.

## Gate C — Release Readiness

```text
Changeset
 ↓
Version
 ↓
Changelog
 ↓
Metadata
 ↓
Documentation
 ↓
Dry Run
```

All must pass.

## Gate D — Human Approval

```text
Release Candidate
       ↓
Human Review
       ↓
Explicit Approval
       ↓
Public Release
```

The AI agent must not bypass this gate.

## Gate E — Post-release

```text
npm
 ↓
GitHub
 ↓
Documentation
 ↓
Fresh Consumer
 ↓
Release Health
```

All must pass.

---

# 24. Required Existing Validation Commands

The following commands remain mandatory before release:

```bash
pnpm run check:ci
pnpm run check-types
pnpm run check-types:fumadocs
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run check:packages
pnpm run test:browser
```

Additional release-specific validation may include:

```bash
pnpm changeset status
pnpm changeset version
pnpm changeset publish
```

The actual publish command must only be executed after the human release gate has been approved.

---

# 25. Release Safety Rules

## Rule 1 — No secrets in source control

Never commit:

```text
NPM_TOKEN
GitHub PAT
private keys
credentials
```

## Rule 2 — No accidental publish

AI agents must not automatically execute public publishing commands unless explicitly authorized.

## Rule 3 — Validate tarballs, not only source

The actual npm artifact must be tested.

## Rule 4 — Test outside the monorepo

A workspace build is not sufficient proof that npm consumers will succeed.

## Rule 5 — Documentation follows the published API

Documentation must not claim support for functionality that is not present in the published package.

## Rule 6 — Public API changes require release metadata

Any public API change must have an appropriate Changeset.

## Rule 7 — Preserve package boundaries

Release engineering must not introduce framework dependencies into `editor-core`.

---

# 26. AI Agent Instructions

When executing Phase 09, the AI agent must:

1. Read `PRD.md`.
2. Read `ARCHITECTURE.md`.
3. Read `AGENTS.md`.
4. Read this Phase 09 document.
5. Inspect the current repository state before making changes.
6. Do not assume the repository state matches this document.
7. Reuse existing scripts and infrastructure where possible.
8. Avoid unnecessary architectural changes.
9. Preserve package boundaries.
10. Preserve ESM-first packaging.
11. Keep `editor-core` framework-agnostic.
12. Keep Tailwind out of published package requirements.
13. Validate package artifacts rather than only source files.
14. Test packages from a clean consumer environment.
15. Update documentation when public behavior changes.
16. Add or update tests for release-related behavior.
17. Never commit credentials or secrets.
18. Never execute public npm publishing without explicit human approval.
19. Never bypass required release gates.
20. Report blockers instead of silently working around them.

---

# 27. Release Artifact Expectations

The release process should produce:

```text
.changeset/
.github/workflows/
CHANGELOG.md
package tarballs
Git tags
GitHub Release
npm packages
updated Fumadocs documentation
updated README
release verification report
```

Exact files may differ depending on the final implementation.

---

# 28. Phase 09 Final Outcome

At the end of this phase, RumahKodingku Editor should transition from:

```text
Development Repository
```

into:

```text
Published Open Source Package Ecosystem
```

with a release pipeline that supports:

```text
Feature
   ↓
Changeset
   ↓
CI
   ↓
Release PR
   ↓
Version
   ↓
Package Validation
   ↓
Consumer Verification
   ↓
Human Approval
   ↓
npm Publish
   ↓
GitHub Release
   ↓
Documentation
```

The release process created in this phase becomes the foundation for all subsequent RumahKodingku Editor releases.

---

# 29. Definition of Phase 09 Complete

Phase 09 is complete only when:

```text
[✓] Release readiness audit passed
[✓] Repository cleanup completed
[✓] Changesets configured
[✓] Versioning policy approved
[✓] Package metadata validated
[✓] Tarballs validated
[✓] publint passed
[✓] attw passed
[✓] Clean consumer test passed
[✓] Dependency validation passed
[✓] Release workflow implemented
[✓] Release dry run passed
[✓] Human release approval obtained
[✓] npm packages published
[✓] GitHub Release created
[✓] Documentation updated
[✓] Documentation verified
[✓] Fresh consumer verification passed
[✓] Release health check passed
[✓] Phase 09 approved
```

**Next phase:** determined by the post-release roadmap and maintenance requirements.
