# Release Process

> **Status:** Active
> **Date:** 2026-10-06
> **Phase:** 09 (Release Engineering)
> **Source:** `ARCHITECTURE.md` §18, §19, §23; `PRD.md` §27, §28; `docs/roadmap/phase-09-release-engineering.md` §14–§16

This runbook describes how RumahKodingku Editor is versioned and released. It is
written for contributors and AI agents.

## 1. Roles

- **AI agent / contributor** — implement, validate, prepare the release, run the
  dry run.
- **Human** — approve and trigger the irreversible public actions (npm publish,
  GitHub Release, phase completion).

The agent MUST NOT run `npm publish` / `changeset publish` without explicit human
approval.

## 2. Authoring a change (contributors)

```bash
pnpm install
# make the change, add tests + docs
pnpm changeset        # pick patch/metric/major per package, describe the change
```

Rules for the bump type live in [`versioning-policy.md`](./versioning-policy.md).
Only `@rumahkodingku/editor-core` and `@rumahkodingku/editor-react` are
published; private workspace packages (`fumadocs`, `playground`,
`@editor/config`) receive no changesets.

Before pushing, run the full verification (see `AGENTS.md`), including the new
size check:

```bash
pnpm run check:ci
pnpm run check-types
pnpm run check-types:fumadocs
pnpm run test
pnpm run build
pnpm run check:packages
pnpm run check:size
```

## 3. Release workflow (automation)

`.github/workflows/release.yml` runs on pushes to `main`:

1. install with a frozen lockfile,
2. run the validation suite,
3. run [`changesets/action`](https://github.com/changesets/action):
   - while changesets exist, it opens/updates a **Release PR** that applies
     `pnpm changeset version` (version bumps + changelogs),
   - once the Release PR is merged, it runs `pnpm changeset publish` and creates
     GitHub Releases.

The workflow only runs from `main` (`on.push.branches` + an explicit `if`
guard), and a `concurrency` group prevents overlapping releases.

## 4. Authentication — npm Trusted Publishing (OIDC)

No `NPM_TOKEN` is used. The workflow authenticates through GitHub Actions OIDC
and publishes with provenance.

- Workflow permissions: `id-token: write` (OIDC), `contents: write` (tags and
  releases), `pull-requests: write` (Release PR).
- `publishConfig.provenance: true` is set in both packages.
- npm CLI must be `>= 11.5.1`; the workflow upgrades npm before publishing
  (Node 22.18 ships an older npm that cannot do trusted publishing).
- Requirements in the repository:

  | Item | Where |
  | --- | --- |
  | `id-token: write` | `.github/workflows/release.yml` `permissions` |
  | `registry-url` | `actions/setup-node` with `https://registry.npmjs.org` |
  | Trusted Publisher | npmjs.com → each package → Publishing → GitHub Actions |

**Never commit secrets.** `NPM_TOKEN`, personal access tokens, and private keys
must stay out of the repository (Phase 09 §25 Rule 1).

### Trusted Publisher setup (one-time, per package)

For `@rumahkodingku/editor-core` and `@rumahkodingku/editor-react`, configure on
npmjs.com:

- **Publisher:** GitHub Actions
- **Organization/user:** `RumahKodingku`
- **Repository:** `editor`
- **Workflow filename:** `release.yml`
- **Environment:** (none, unless one is introduced)

### Bootstrap fallback

Trusted publishing is configured on a package that already exists on the
registry. For the very first publish of a brand-new scoped package, if npm does
not allow configuring the Trusted Publisher beforehand, a one-time granular
access token (stored as a GitHub Actions secret) may be used for that single
publish, then removed in favor of OIDC. This is an explicit **human decision**
and is recorded in the release log.

## 5. Release checklist

Before the first publish (all must pass):

- [ ] `pnpm run check:ci`
- [ ] `pnpm run check-types`
- [ ] `pnpm run check-types:fumadocs`
- [ ] `pnpm run test`
- [ ] `pnpm run test:coverage`
- [ ] `pnpm run build`
- [ ] `pnpm run check:packages` (`publint` + `attw`)
- [ ] `pnpm run check:size` (`size-limit`)
- [ ] `pnpm run test:browser`
- [ ] `pnpm changeset status` shows the expected version (`0.1.0`)
- [ ] `pnpm run check:consumer` (clean consumer installation)

## 6. Dry run (task 09.11)

Perform the full pipeline without publishing:

```bash
pnpm changeset status
pnpm changeset version        # inspect version bumps + changelogs, then revert on a scratch branch
pnpm run build
pnpm run check:packages
pnpm run check:size
pnpm run check:consumer
```

Do **not** run `pnpm changeset publish` here.

## 7. Publishing (task 09.12, human gate)

After explicit human approval:

1. merge the Release PR (or run `pnpm changeset version` on `main`),
2. the workflow publishes the packages and creates GitHub Releases,
3. verify the npm registry metadata, tarballs, and a fresh installation.

## 8. Post-release

- Remove pre-release "not published yet" notes from the docs and add npm install
  information (task 09.14).
- Verify documentation against the published packages (09.15).
- Run a fresh consumer from npm (09.16).
- Record the release health report (09.17).
