# Versioning Policy

> **Status:** Approved
> **Date:** 2026-10-06
> **Phase:** 09 (Release Engineering)
> **Source:** `ARCHITECTURE.md` §5.2, §18, §26.1 (OQ-5); `PRD.md` §28

This document defines how the published RumahKodingku Editor packages are
versioned. It is the policy an agent or contributor follows when creating a
Changeset.

## 1. Scope

Only the published packages are versioned:

- `@rumahkodingku/editor-core`
- `@rumahkodingku/editor-react`

Private workspace packages (`fumadocs`, `playground`, `@editor/config`) are not
published and are never versioned.

## 2. Versioning model — independent versions

The packages use **independent versions** (`ARCHITECTURE.md` §18, OQ-5). Each
package moves at its own pace so that, for example, `editor-react` can release a
React fix without forcing an `editor-core` release.

Changesets still records internal dependency updates: when `editor-react`
consumes a new `editor-core` version, the `@rumahkodingku/editor-core`
dependency range is updated in the same release
(`updateInternalDependencies: "patch"`).

## 3. Initial public version

The first public release of **both** packages is **`0.1.0`**.

Rationale: the MVP is feature-complete but the public API is pre-stable, so the
project follows the SemVer convention for `0.x` releases where the minor position
carries breaking changes (`ARCHITECTURE.md` §18).

## 4. Bump rules

| Change | Before `1.0.0` | From `1.0.0` |
| --- | --- | --- |
| Breaking public API change | **minor** | **major** |
| Backward-compatible feature | **minor** | **minor** |
| Backward-compatible fix | **patch** | **patch** |
| Dependency-only or internal change with no public effect | **patch** (or none if truly no package change) | same |
| Documentation-only change, no package change | **none** (no changeset) | same |
| Removing an extension from a preset | **minor** (breaking) and called out in release notes | **major** |

Notes:

- Before `1.0.0`, a breaking change bumps the **minor** version; the `major`
  position stays `0`. The `major` row applies only from `1.0.0` onward.
- A **Tiptap major upgrade** counts as a breaking change (`ARCHITECTURE.md`
  §5.2) and follows the breaking-change row.

## 5. Change-type policies

### 5.1 Public API change

Any change to a public API MUST include, in the same change
(`ARCHITECTURE.md` §24.2, `PRD.md` §13):

1. type updates,
2. tests,
3. documentation updates,
4. a Changeset (release notes).

The Changeset description MUST state the user-visible change.

### 5.2 Breaking changes

A breaking change MUST:

- be described explicitly in the Changeset and release notes,
- document the migration path when one exists,
- bump the version per §4.

Removing a node/mark type, renaming a public export, changing a prop signature,
or narrowing a peer range are breaking changes.

### 5.3 Dependency-only changes

A change that only moves a workspace dependency range keeps the dependent
package version moving with a **patch** Changeset when it is part of the same
release; Changesets records the internal dependency update automatically.

### 5.4 Documentation-only changes

Documentation, comments, and internal refactors with no effect on a published
package's runtime or types do **not** require a Changeset.

### 5.5 Experimental APIs

An API marked experimental MAY change in a **minor** or **patch** release as long
as the change is called out in the release notes. Experimental APIs MUST be
explicitly labelled in the TypeScript documentation (`@experimental`) and in the
docs. Promoting an experimental API to stable is not itself a version bump.

## 6. Peer-dependency ranges

- React peer range: `^19` (`ARCHITECTURE.md` §26.1, OQ-1). **Widening** the range
  is non-breaking; **narrowing** it is breaking.
- Tiptap peer range: `^3.x` on one line (`ARCHITECTURE.md` §5.3, §26.1 OQ-2/OQ-3).

## 7. Source map policy

Published packages do **not** ship source maps. The current tsdown configuration
emits none, and this is intentional: the shipped `dist` is small, the source is
public on GitHub, and maps would inflate the tarball without consumer benefit.

## 8. Applying the policy

```bash
pnpm changeset          # choose patch/minor/major per package and describe the change
pnpm changeset status   # verify what will be released
```

The release workflow then runs `pnpm changeset version` and
`pnpm changeset publish`. See [`release-process.md`](./release-process.md).
