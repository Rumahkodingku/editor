# Phase 09 — Release Readiness Audit (Task 09.01)

> **Status:** Complete
> **Date:** 2026-10-06
> **Phase:** 09 — Release Engineering
> **Commit:** `67716ce`
> **Auditor:** AI agent (Phase 09 execution)

## 1. Objective

Determine whether the repository is technically ready to enter release
engineering, per `docs/roadmap/phase-09-release-engineering.md` §5.

## 2. Environment

| Item | Value |
| --- | --- |
| Local Node | `v26.9.0` (CI uses `22.18`) |
| pnpm | `10.34.5` (`packageManager`) |
| Package manager | pnpm only |
| OS | Linux |

The published packages declare `engines.node >= 22`; the build tool (tsdown)
requires Node `22.18+`. Local Node 26 is above the floor and is not part of the
supported-consumer contract.

## 3. Required validation results

Every mandatory command was run from the repository root on commit `67716ce`.

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm run check:ci` | ✅ PASS | 242 files checked; 3 warnings (`noUnusedVariables` in `apps/fumadocs/src/app/[lang]/(home)/layout.tsx`, `noImportantStyles` ×2 in `apps/fumadocs/src/app/global.css`); no errors. |
| `pnpm run check-types` | ✅ PASS | 3 tasks (`editor-core`, `editor-react`, `playground`). |
| `pnpm run check-types:fumadocs` | ✅ PASS | `next typegen && tsc --noEmit`; route types generated. |
| `pnpm run test` | ✅ PASS | `editor-core` 15 files / 77 tests; `editor-react` 16 files / 63 tests; type tests included. |
| `pnpm run test:coverage` | ✅ PASS | v8 coverage produced for both packages. |
| `pnpm run build` | ✅ PASS | 4 tasks; Fumadocs built 245 static pages. |
| `pnpm run check:packages` | ✅ PASS | `publint` "All good"; `attw --profile esm-only` green for `node16 (from ESM)` and `bundler`; `node10`/`node16 (from CJS)` ignored by profile. |
| `pnpm run test:browser` | ✅ PASS | 227 tests passed (7.8m) across `fumadocs-*`, `playground-chromium/firefox/webkit`, `integration-chromium`. |

**Gate A (technical readiness): PASS.**

## 4. Repository state audit

### 4.1 Published packages

| | `editor-core` | `editor-react` |
| --- | --- | --- |
| Name | `@rumahkodingku/editor-core` | `@rumahkodingku/editor-react` |
| Version | `0.0.0` | `0.0.0` |
| `type` | `module` | `module` |
| `exports` | `.` → types + import | `.` + `./styles.css` |
| `files` | `["dist"]` | `["dist"]` |
| `sideEffects` | `false` | `["**/*.css"]` |
| `engines` | `node >= 22` | `node >= 22` |
| Peer deps | Tiptap 3.x (`^3.31.4`, 6 pkgs) + optional `happy-dom` | `@tiptap/core`, `@tiptap/react`, `react ^19`, `react-dom ^19` |
| Dependency | — | `@rumahkodingku/editor-core` (`workspace:*`) |
| Bundler | tsdown (ESM + dts) | tsdown (ESM + dts + `styles.css` copy) |

Both packages are framework-agnostic/adapter-compliant and add no runtime
dependencies outside `editor-core → editor-react`.

### 4.2 Tooling and configuration

- TypeScript `strict` via the shared `@editor/config` tsconfig; `apps/fumadocs`
  has its own tsconfig and is intentionally not unified.
- Turborepo `2.11.5`; `build` `dependsOn: ["^build"]`.
- `.github/workflows/ci.yml` runs the full verification sequence on push/PR with
  Node `22.18`.
- Browser matrix in `playwright.config.ts` (Chromium/Firefox/WebKit + docs).
- Package validation: `publint` + `@arethetypeswrong/cli` (`esm-only`).

### 4.3 Release state

- `.changeset/` — **absent**.
- `CHANGELOG.md` — **absent** (root and per package).
- npm release — no prior release exists for either package (versions `0.0.0`).
- Git tags — **none**.
- `.github/workflows/release.yml` — **absent**.
- `size-limit` — **absent**.
- `docs/adr/0005-build-tooling-and-release.md` — **absent** (§24.1 lists it).

## 5. Blockers and gaps

| # | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| B1 | `editor-core` tarball has **no README**; neither package ships a **LICENSE** in its directory (npm only auto-includes files present in the package root). `editor-core` tarball = 3 files; `editor-react` = 5 files (README, no LICENSE). | High | Task 09.05 — add `README.md` to `editor-core` and `LICENSE` to both packages. |
| B2 | `size-limit` bundle budgets absent, but `ARCHITECTURE.md` §16/§21/§26.4.3 and `PRD.md` §22/§28.7 require them before publish. | High | Task 09.06 — add `size-limit` + budgets. |
| B3 | No Changesets configuration → no versioning/changelog foundation. | High | Task 09.03. |
| B4 | No release workflow; no publish automation or provenance. | High | Task 09.10. |
| B5 | npm metadata incomplete: no `homepage`, `bugs`, `keywords`, `publishConfig` on either package. | Medium | Task 09.05. |
| B6 | `@rumahkodingku` scope availability not verified (requires network). | Medium | Pre-publish check (09.09/09.12). |
| B7 | ADR `0005-build-tooling-and-release.md` missing though listed in §24.1. | Low | Task 09.04. |
| B8 | Stale docs: `docs/roadmap/README.md` says Phase 09 "does not have a phase document yet"; `README.md`/`AGENTS.md` still describe `.changeset/` as future work. | Low | Task 09.02. |
| B9 | Pre-release "not published yet" banners in Fumadocs (`en` installation + index, `id` installation) are accurate today and must remain until publish, then be replaced. | Info | Task 09.14 (post-release). |
| B10 | Trusted-publishing bootstrap for a never-published scoped package is unconfirmed; a one-time token may be required for the first publish. | Medium | Human decision at 09.12. |

## 6. Tarball and size findings (baseline)

Measured with `npm pack --dry-run` on commit `67716ce`:

| Package | Files | Packed | Unpacked | Contents |
| --- | --- | --- | --- | --- |
| `@rumahkodingku/editor-core` | 3 | 10.7 kB | 39.8 kB | `dist/index.d.ts`, `dist/index.js`, `package.json` (no README/LICENSE) |
| `@rumahkodingku/editor-react` | 5 | 16.8 kB | 65.3 kB | `README.md`, `dist/index.d.ts`, `dist/index.js`, `dist/styles.css`, `package.json` (no LICENSE) |

These measurements seed the `size-limit` budgets in task 09.06 (budgets are set
from real measurements, not guesses).

## 7. Non-blocking observations

- `check:ci` reports 3 warnings (unused variable, two `!important` styles) in
  the Fumadocs app. They do not fail CI and are outside the published packages.
- No source maps are emitted by the current tsdown config; the published source
  map policy is decided in task 09.04.
- Local Node is 26 while CI pins 22.18; no divergence was observed in results.

## 8. Exit criteria

- [x] All required checks pass.
- [x] Blockers identified and assigned to Phase 09 tasks.
- [x] Repository is ready for release engineering implementation.

**Conclusion:** technically ready. No blocker requires an architecture change;
all findings are handled within Phase 09 scope.

## 9. First release dry run (task 09.11)

Executed after tasks 09.02–09.08 were implemented. **No `npm publish` was run.**

| Step | Result |
| --- | --- |
| `.changeset/initial-release.md` (`minor` for both packages) | ✅ created |
| `pnpm changeset status --verbose` | ✅ both → `0.1.0` |
| `pnpm changeset version` (scratch, then reverted) | ✅ versions → `0.1.0`; per-package `CHANGELOG.md` generated; private apps untouched (`fumadocs` `0.0.37`, `playground` `0.0.0`) |
| `editor-react` → `editor-core` range | Stays `workspace:*`; `pnpm publish` (used by `changeset publish`, verified in the installed `@changesets/cli`) rewrites it to the released version at publish time |
| `pnpm run check:ci` | ✅ (3 warnings, 0 errors) |
| `pnpm run check-types` / `check-types:fumadocs` | ✅ |
| `pnpm run test` / `test:coverage` | ✅ |
| `pnpm run build` | ✅ |
| `pnpm run check:packages` (`publint` + `attw`) | ✅ |
| `pnpm run check:size` (`size-limit`) | ✅ core 5.88 kB / 7 kB, react 8.34 kB / 10 kB |
| `pnpm run check:consumer` | ✅ (see `consumer-verification.md`) |

The dry-run `changeset version` was reverted so the version bumps are applied by
the release workflow; the release changeset is retained for task 09.12.

