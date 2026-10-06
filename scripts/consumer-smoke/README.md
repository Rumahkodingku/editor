# Consumer smoke test

Proves the published packages install and work **outside** the monorepo
(Phase 09, task 09.07). This is an on-demand check, not part of CI or Turborepo:
it builds the packages, packs them with `pnpm pack` (which rewrites
`workspace:*` to a real version), then scaffolds a fresh consumer in a temp
directory and installs the tarballs with **npm**.

## Run

```bash
pnpm run check:consumer
```

Set `--keep` to keep the generated consumer and inspect it:

```bash
pnpm run check:consumer -- --keep
```

## What it verifies

1. `pnpm run build` produces the packages.
2. `pnpm pack` produces installable tarballs.
3. `npm install` resolves the tarballs **and** the documented peer dependencies
   (React 19 + Tiptap 3.x) with no workspace resolution.
4. Node ESM import of `@rumahkodingku/editor-core` and its non-DOM API.
5. TypeScript resolves the public type declarations (`tsc --noEmit`).
6. A production `vite build` renders `<Editor>` with the published stylesheet and
   a configured `ImageUpload` extension.

Real-browser behavior is covered separately by `pnpm run test:browser`, which runs
against the docs app and the playground — both consume the same public package
APIs that this consumer installs.

## Exit criteria

- No missing export, declaration, or CSS errors.
- No runtime package resolution errors.
- The production build succeeds.
