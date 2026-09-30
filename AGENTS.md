<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

## RumahKodingku Editor — agent notes

`ARCHITECTURE.md` (Approved, v1.0) is the binding source of truth. Read it before coding. This file only holds operational shortcuts; where the two disagree, `ARCHITECTURE.md` wins.

## What actually exists today

- `apps/fumadocs` (Next.js 16 + Fumadocs docs site) and `packages/config` (`@editor/config`, shared tsconfig only).
- `packages/editor-core`, `packages/editor-react`, `apps/playground`, `PRD.md`, `docs/adr/`, `LICENSE` **do not exist yet** — `ARCHITECTURE.md` §3.2 is a target, not reality. Don't import from or assume them.
- Root `README.md` is stale: it documents Varlock (`env:generate`, `.env.schema`, `src/env.ts`) and a port-3000 dev server. No Varlock env schema exists in this repo and the dev server is on **port 4000**. Trust `package.json` / `apps/fumadocs/package.json` over the README.

## Commands

pnpm only (`packageManager: pnpm@10.34.5`), Node >= 22.

| Command                                  | Notes                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `pnpm run dev`                           | turbo dev; fumadocs on `http://localhost:4000`                        |
| `pnpm run check`                         | `biome check --write .` — **mutates files**, run it before committing |
| `pnpm run check-types`                   | turbo `check-types` — does **not** cover `apps/fumadocs`              |
| `pnpm --filter fumadocs run types:check` | the real app typecheck (`next typegen && tsc --noEmit`); use this     |
| `pnpm run build`                         | turbo build, `dependsOn: ["^build"]`                                  |
| `pnpm run test`                          | **does not exist yet** (Vitest is an open implementation gate, §26.3) |

Trap: the fumadocs package names its script `types:check`, not `check-types`, so the root script type-checks only `@editor/config`. If you add a library package, name its script `check-types` so turbo picks it up.

Verification order: `pnpm run check` → `pnpm --filter fumadocs run types:check` → `pnpm run build`.

## Style / commit conventions

- Biome: **tabs**, double quotes, organize-imports assist on. No ESLint/Prettier — never add them.
- Husky pre-commit runs lint-staged (`biome check --write` on staged files); commit-msg runs commitlint (Conventional Commits, type must be one of feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert, header <= 100 chars).
- `apps/fumadocs` has its own `tsconfig.json` and does **not** extend `@editor/config`; it also pins a different TypeScript major than the root. Don't "unify" these without an explicit task.

## Non-negotiable architecture rules (details in ARCHITECTURE.md)

- `editor-core` must stay framework-free: no `react`, `react-dom`, `vue`, `next`, `tailwindcss`, no app modules, no browser globals at import time (§4.3, §12). React only in `editor-react`/apps.
- Published packages: `"type": "module"`, explicit `exports`, `files`, `sideEffects: false` (except the adapter stylesheet), `engines.node >= 22`, React `^19` and Tiptap `3.x` as **peerDependencies** only, so only one engine instance exists (§4.4, §5.3, §17.2, §26.1).
- No Tailwind, icon library, or UI library in a published package — icons are inline SVG. Adding a dependency needs a stated reason; anything significant needs an ADR in `docs/adr/` (§4.4, §24.1).
- JSON is the canonical content format; HTML is output-only. Persisted content uses the envelope `{ schemaVersion, content }` (§11, §26.1 OQ-6/OQ-10).
- Document state lives in Tiptap/ProseMirror, never in Zustand/Redux/Vuex; no module-level mutable singletons (§13).
- Do not reimplement ProseMirror state, transactions, schema, history, or the extension system (§5.1). Feature behavior belongs in extensions, not `if` branches in core (§2.9).
- Libraries build with **tsdown** (not tsup/rollup), ESM + `.d.ts`; dev uses `tsdown --watch` (§26.1 OQ-4, §17.3).
- Any public API change ships types + tests + docs + a changeset (§24.2). Changing a **Decided** item requires the §24 change-control process; do not silently reopen §26.1.
- jsdom can't model selection/layout/IME — anything depending on those must be verified in a real browser (`apps/playground`, planned; Playwright per §16).

## Fumadocs specifics

- Docs pages are `apps/fumadocs/content/docs/**/*.mdx` and require `title` + `description` frontmatter (validated by `pageSchema` in `src/lib/source.ts`).
- Route paths (`docsRoute`, `docsImageRoute`, `docsContentRoute`, `appName`) live in `src/lib/shared.ts`; collections are declared in `src/lib/source.ts`; `src/proxy.ts` handles `Accept`-based markdown negotiation. Change routes there, not inline in pages.
- `fumadocs-ui` is aliased to `npm:@fumadocs/base-ui` — imports use `fumadocs-ui/...`.
- Fumadocs is the canonical home for public examples and live demos; the playground is for internal validation only (§20.2, §26.1 OQ-9).
- `src/app/llms*.txt` and `src/app/og/**` routes are generated scaffolds, not hand-edited docs.

## Repo-local skills

`.agents/skills/` (pinned in `skills-lock.json`): `tiptap` (Tiptap integration API), `webapp-testing` (Playwright against a local server), `code-review`, `writing-plans`, `executing-plans`. Load them with the skill tool instead of guessing APIs.
