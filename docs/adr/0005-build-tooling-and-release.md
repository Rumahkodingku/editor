# ADR 0005 — Build tooling and release process

- **Status:** Accepted
- **Date:** 2026-10-06
- **Phase:** 09 (Release Engineering)
- **Source:** `ARCHITECTURE.md` §16, §17, §18, §21, §23, §24.1, §26.1 (OQ-4, OQ-5), §26.4

## Context

`ARCHITECTURE.md` lists `0005-build-tooling-and-release.md` as an initial ADR
(§24.1), and §26.4 defines the pre-publish gates. Phases 01–08 built the library
and its tests but deliberately deferred release engineering to Phase 09 (OQ-5:
"implementation is deferred to Phase 09"). Phase 09 must settle how the packages
are bundled, versioned, size-budgeted, and published.

## Decision

1. **Bundler: tsdown.** Published packages build to ESM with generated type
   declarations; the React adapter additionally copies its stylesheet. tsdown
   externalizes declared dependencies by default and matches the ESM-first
   contract (§17.2). No CommonJS output in the MVP.
2. **Versioning: Changesets with independent package versions.** `@changesets/cli`
   drives versioning and changelogs. The repository's Conventional Commits
   (commitlint) remain the commit convention and are not replaced (§18, OQ-5).
3. **Initial public version: `0.1.0`** for both `@rumahkodingku/editor-core` and
   `@rumahkodingku/editor-react`, with pre-1.0 SemVer rules (breaking changes
   bump the minor). See [`../release/versioning-policy.md`](../release/versioning-policy.md).
4. **Bundle-size budgets: `size-limit`.** Each published package has a budget
   measured from the real build, satisfying §16, §21, and the pre-publish gate
   §26.4.3.
5. **Publication: npm Trusted Publishing (OIDC) with provenance.** The release
   workflow authenticates through GitHub Actions OIDC (`id-token: write`) and sets
   `publishConfig.provenance: true`. No long-lived `NPM_TOKEN` is committed or
   stored. Docker-style long-lived tokens are avoided; secrets are never committed
   (§23 recommends provenance; Phase 09 §25 Rule 1).
6. **Release gate.** The AI agent prepares and validates everything up to the dry
   run; a human explicitly approves the first `npm publish` and the GitHub
   Release (Phase 09 §4.2/§4.3).

## Alternatives considered

- **tsup / rollup.** Rejected: tsdown is the selected library bundler (§26.1
  OQ-4) and externalizes dependencies with less configuration.
- **Synchronized versions.** Rejected: independent versions let the adapter and
  core release separately (§18, OQ-5).
- **Starting at `1.0.0`.** Rejected: the public API is pre-stable; `0.1.0` with
  minor-carrying breaking changes is the honest signal.
- **`NPM_TOKEN` granular access token.** Rejected as the default in favor of OIDC
  and provenance; a one-time token may be used to bootstrap the very first publish
  of a scoped package that does not yet exist on the registry (documented as a
  bootstrap fallback, subject to explicit human approval).
- **`@changesets/changelog-github`.** Deferred: the default changelog generator
  keeps `changeset version` deterministic and offline. It can be adopted later
  without changing the versioning model.
- **Shipping source maps.** Rejected: maps would inflate the tarball; the source
  is public on GitHub. See the versioning policy §7.

## Consequences

- `pnpm run check:packages` (`publint` + `attw --profile esm-only`) and
  `pnpm run check:size` (`size-limit`) become part of the release gates and CI.
- The release workflow lives in `.github/workflows/release.yml` and publishes only
  from `main`.
- Package metadata carries `repository`, `homepage`, `bugs`, `keywords`, and
  `publishConfig` (`access: public`, `provenance: true`).
- Trusted publishing must be configured per package on npmjs.com; until then a
  bootstrap publish is a human decision.
- `docs/release/` documents the process for contributors and agents; the ADR
  index (§24.1) is complete with 0005.

## References

- `ARCHITECTURE.md` §16, §17, §18, §21, §23, §24.1, §26.1 (OQ-4, OQ-5), §26.4
- `PRD.md` §10, §22, §27, §28
- `docs/roadmap/phase-09-release-engineering.md`
- `docs/release/versioning-policy.md`, `docs/release/release-process.md`
- `.changeset/config.json`, `.github/workflows/release.yml`, `.size-limit.json`
