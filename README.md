# RumahKodingku Editor

A reusable, typed, composable WYSIWYG rich text editor ecosystem for modern web
applications, built on Tiptap and ProseMirror.

The project is a TypeScript monorepo. `editor-core` is designed to stay
framework-independent so adapters (React first, Vue later) remain thin. React
is the first supported UI framework.

> This repository is in **Phase 03 — Editor Core**. `editor-core` now exposes the
> framework-independent editor API; the React adapter (Phase 04) and the
> playground are not implemented yet. See the roadmap below.

## Repository Structure

Current state:

```text
editor/
├── .agents/skills/          # repo-local agent skills (pinned in skills-lock.json)
├── .github/workflows/       # CI (check, types, tests, build, packages, browser)
├── .husky/                  # git hooks (pre-commit, commit-msg)
├── apps/
│   └── fumadocs/            # documentation app (Next.js + Fumadocs)
├── docs/
│   ├── adr/                 # architecture decision records (ADRs 0002–0004)
│   └── roadmap/             # implementation roadmap
├── packages/
│   ├── config/              # @editor/config — shared tsconfig (internal, not published)
│   ├── editor-core/         # @rumahkodingku/editor-core — core API implemented (Phase 03)
│   └── editor-react/        # @rumahkodingku/editor-react — tsdown build, no features yet
├── tests/
│   └── browser/             # Playwright browser + accessibility tests
├── AGENTS.md                # operational rules for AI agents and contributors
├── ARCHITECTURE.md          # architecture and constraints
├── LICENSE                  # MIT
├── PRD.md                   # product requirements
├── README.md
├── biome.json
├── bts.jsonc                # Better-T-Stack scaffold metadata
├── commitlint.config.mjs
├── lint-staged.config.mjs
├── package.json
├── playwright.config.ts     # Playwright configuration (Chromium, fumadocs on :4000)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── skills-lock.json
├── tsconfig.json
└── turbo.json
```

`editor-core` implements the framework-independent core API (Phase 03): editor
creation, the default extension preset, the RumahKodingku image-upload
extension, content utilities, JSON/HTML serialization, persistence schema
versioning, the upload contract, toolbar definitions, and editor labels. It
builds to ESM with type declarations and declares its Tiptap peer contracts.
`editor-react` is still a Phase 01 skeleton. Phase 02 added the test foundation
(Vitest, React Testing Library, Playwright, axe-core). `apps/playground` and
`.changeset/` are defined in `ARCHITECTURE.md` §3.2 and are created in later
phases.

## Development

- **Package manager:** pnpm (`pnpm@10.34.5`) — the only supported package manager.
- **Runtime baseline:** Node `>=22`. Build tooling (tsdown, Phase 01+) requires Node `22.18+`.
- **Node 20 is not supported.**

Install dependencies:

```bash
pnpm install
```

Start all applications in development mode:

```bash
pnpm run dev
```

The documentation app (Fumadocs) is served on http://localhost:4000.

## Verification

Run from the repository root:

```bash
pnpm install                      # Install and regenerate the lockfile
pnpm run check                    # Biome formatting and linting (mutates files)
pnpm run check:ci                 # Read-only Biome check (used by CI)
pnpm run check-types              # Turbo type-check (editor-core, editor-react)
pnpm run check-types:fumadocs     # Fumadocs type-check (next typegen && tsc --noEmit)
pnpm run test                     # Vitest (unit, component, type tests)
pnpm run test:coverage            # Vitest with v8 coverage
pnpm run build                    # Turbo build
pnpm run check:packages           # publint + attw for the published packages
pnpm run test:browser             # Playwright + axe (Chromium)
```

Notes:

- `pnpm run check` runs `biome check --write .` and rewrites files; review the diff.
  CI uses `check:ci` (`biome ci .`), which never writes.
- `check-types` covers workspace packages that define a `check-types` script
  (`editor-core`, `editor-react`). The Fumadocs app names its script
  `types:check`, so it is verified separately with `check-types:fumadocs`.
- `pnpm run build` builds the package graph in dependency order
  (`editor-core` before `editor-react`) and then the docs app.

## Testing

- **Vitest** runs unit, integration, and type tests per package.
  `editor-core` tests run in a **node** environment; `editor-react` tests run in
  **jsdom** with React Testing Library.
- **Playwright** runs real-browser tests from `tests/browser/` against the
  production build of the Fumadocs app on http://localhost:4000. It builds and
  starts the app automatically; the dev server is not used (it compiles on
  demand and is not deterministic).
- **axe-core** (`@axe-core/playwright`) provides accessibility checks and runs as
  part of `pnpm run test:browser`.
- Install the browser before the first browser run: `pnpm exec playwright install chromium`.
- Unit test files are co-located with source (`src/**/*.test.ts`, `src/**/*.test.tsx`);
  type tests use `*.test-d.ts`; browser tests live in `tests/browser/`.
- `pnpm run test` never launches a browser. Details and agent rules live in `AGENTS.md`.

## Documentation

Public documentation and live examples live in `apps/fumadocs` (Fumadocs on
Next.js, port 4000). Content pages are `apps/fumadocs/content/docs/**/*.mdx` and
require `title` and `description` frontmatter. Full product documentation is
built in Phase 08.

## Project Documents

- `PRD.md` — product requirements: what and why.
- `ARCHITECTURE.md` — architecture and constraints: how. Binding source of truth.
- `AGENTS.md` — operational rules for AI agents and contributors.
- `docs/roadmap/` — implementation roadmap and phase documents.

## Roadmap

| Phase | Name                                    |
| ----- | --------------------------------------- |
| 00    | Repository Foundation & Agent Readiness |
| 01    | Build & Package Infrastructure          |
| 02    | Test Infrastructure                     |
| 03    | Editor Core                             |
| 04    | React Adapter                           |
| 05    | Playground                              |
| 06    | Editor MVP                              |
| 07    | Browser & Accessibility                 |
| 08    | Documentation                          |
| 09    | Release Engineering                     |

See `docs/roadmap/README.md` for the current phase and phase documents.

## Contributing

- **Formatter/linter:** Biome only (`pnpm run check`). Do not add ESLint or Prettier.
- **Style:** tab indentation, double quotes, organized imports.
- **Commits:** Conventional Commits, enforced by commitlint. The type must be one
  of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore`, `revert`, and the header must be at most 100 characters.
- **Hooks:** Husky runs `lint-staged` (Biome on staged files) on pre-commit and
  commitlint on commit-msg.

Read `ARCHITECTURE.md` and `AGENTS.md` before making changes.
