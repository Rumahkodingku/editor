# RumahKodingku Editor

A reusable, typed, composable WYSIWYG rich text editor ecosystem for modern web
applications, built on Tiptap and ProseMirror.

The project is a TypeScript monorepo. `editor-core` is designed to stay
framework-independent so adapters (React first, Vue later) remain thin. React
is the first supported UI framework.

> This repository is in **Phase 00 — Repository Foundation**. The editor
> packages do not exist yet; see the roadmap below.

## Repository Structure

Current state:

```text
editor/
├── .agents/skills/          # repo-local agent skills (pinned in skills-lock.json)
├── .husky/                  # git hooks (pre-commit, commit-msg)
├── apps/
│   └── fumadocs/            # documentation app (Next.js + Fumadocs)
├── docs/
│   └── roadmap/             # implementation roadmap
├── packages/
│   └── config/              # @editor/config — shared tsconfig (internal, not published)
├── AGENTS.md                # operational rules for AI agents and contributors
├── ARCHITECTURE.md          # architecture and constraints
├── PRD.md                   # product requirements
├── README.md
├── biome.json
├── bts.jsonc                # Better-T-Stack scaffold metadata
├── commitlint.config.mjs
├── lint-staged.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── skills-lock.json
├── tsconfig.json
└── turbo.json
```

The target structure (`editor-core`, `editor-react`, `playground`, `docs/adr/`,
`LICENSE`, `.changeset/`) is defined in `ARCHITECTURE.md` §3.2. Those packages
and files are created in later phases and do not exist yet.

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
pnpm run check                    # Biome formatting and linting (mutates files)
pnpm run check-types              # Turbo type-check across workspaces
pnpm run check-types:fumadocs     # Fumadocs type-check (next typegen && tsc --noEmit)
pnpm run build                    # Turbo build
```

Notes:

- `pnpm run check` runs `biome check --write .` and rewrites files; review the diff.
- `check-types` covers workspace packages that define a `check-types` script.
  The Fumadocs app names its script `types:check`, so it is verified separately
  with `check-types:fumadocs`.
- `pnpm run test` **does not exist yet**; Vitest is introduced in Phase 02.

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
