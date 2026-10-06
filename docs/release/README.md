# Release Engineering

Phase 09 release documentation for RumahKodingku Editor. These documents record
how the published packages are validated, versioned, and released. They are
maintained alongside `ARCHITECTURE.md`, `PRD.md`, and
`docs/roadmap/phase-09-release-engineering.md`.

## Documents

| Document | Purpose |
| --- | --- |
| [`readiness-audit.md`](./readiness-audit.md) | Task 09.01 — release readiness audit and blocker list (plus tarball/size findings). |
| [`versioning-policy.md`](./versioning-policy.md) | Task 09.04 — SemVer and package versioning policy. |
| [`release-process.md`](./release-process.md) | Tasks 09.03/09.10 — Changesets usage, release workflow, auth strategy, contributor steps. |
| [`npm-preview.md`](./npm-preview.md) | Task 09.09 — package preview for human review. |
| [`consumer-verification.md`](./consumer-verification.md) | Tasks 09.07/09.08/09.16 — clean consumer and dependency verification. |
| [`release-health-report.md`](./release-health-report.md) | Task 09.17 — post-release health report. |

## Release gates

The gates are defined in `docs/roadmap/phase-09-release-engineering.md` §23 and
`ARCHITECTURE.md` §26.4. The AI agent performs engineering and validation; a
human owns the irreversible public release decisions.

- **Gate A — Technical readiness:** check, types, tests, coverage, build, package
  validation, browser tests.
- **Gate B — Package readiness:** build, tarball, `publint`, `attw`, exports,
  consumer installation, `size-limit`.
- **Gate C — Release readiness:** changeset, version, changelog, metadata,
  documentation, dry run.
- **Gate D — Human approval:** explicit approval before any public publish.
- **Gate E — Post-release:** npm, GitHub, documentation, fresh consumer, release
  health.
