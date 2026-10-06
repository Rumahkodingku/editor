# Changesets

This folder is managed by [`@changesets/cli`](https://changesets.dev). It records
pending version changes for the published packages.

## Usage

Add a changeset for every change that affects a published package:

```bash
pnpm changeset
```

Choose the bump type (`patch` / `minor` / `major`) per package and describe the
change. See [`docs/release/versioning-policy.md`](../docs/release/versioning-policy.md)
for the rules this project follows.

The release workflow consumes these files: `pnpm changeset version` applies the
versions and generates changelogs, then `pnpm changeset publish` publishes the
packages.

## Scope

Only the published packages are versioned:

- `@rumahkodingku/editor-core`
- `@rumahkodingku/editor-react`

The private workspace packages (`fumadocs`, `playground`, `@editor/config`) are
not published and receive no changesets.
