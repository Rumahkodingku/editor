<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

## RumahKodingku Editor — agent notes

`ARCHITECTURE.md` (Approved, v1.2) is the binding source of truth. Read it before coding. This file only holds operational shortcuts; where the two disagree, `ARCHITECTURE.md` wins.

## What actually exists today

- `apps/fumadocs` (Next.js 16 + Fumadocs docs site) and `packages/config` (`@editor/config`, shared tsconfig only).
- `packages/editor-core` (`@rumahkodingku/editor-core`) now implements the **Phase 03 core API**: editor creation, the default extension preset (`StarterKit` + `Placeholder` + the RK `ImageUpload` extension), extension composition, content utilities, JSON/HTML serialization (including server-safe `jsonToHTML`), persistence schema versioning, the image-upload contract, toolbar definitions, and editor labels. `packages/editor-react` (`@rumahkodingku/editor-react`) now implements the **Phase 04 React adapter**: the `Editor` component (`@tiptap/react`'s `useEditor` + `EditorContent`), controlled/uncontrolled content with `value`/`defaultValue`, `onChange`/`onReady`, editable/disabled state, placeholder, custom extension composition through core `composeExtensions`, labels, a minimal toolbar adapter (`EditorToolbar`, `ToolbarButton`, inline-SVG `ToolbarIcon`), SSR support (`immediatelyRender` + `"use client"`), and the published `styles.css`. It consumes `editor-core` and declares `@tiptap/core`, `@tiptap/react`, `react`, and `react-dom` as peer dependencies. Full toolbar composition/UX and link/image dialogs remain Phase 06.
- `apps/playground` (`playground`, Vite + React + TypeScript + Tailwind) now exists as the **internal validation environment** (Phase 05). It is a real consumer of `@rumahkodingku/editor-core` and `@rumahkodingku/editor-react` **through their public package exports only** — never `packages/*/src` — and it is never a dependency of a published package. Scenario surfaces, inspectors, fixtures, and the mock upload handler stay inside the app. It runs on port 4100 (`pnpm --filter playground run dev`). Fumadocs remains the canonical public documentation/example home; the playground is internal only. `.changeset/` still **does not exist yet** (Phase 09) — don't assume it.
- `docs/adr/` contains ADRs `0002`–`0004` (Tiptap public API, framework-agnostic core, JSON-canonical content).
- `LICENSE` (MIT) and root `README.md` (RumahKodingku Editor, pnpm, Node >=22, docs on port 4000) exist. The scaffold Varlock workflow and `bunfig.toml` were removed in Phase 00. `packages/config` (`@editor/config`) still provides the shared tsconfig only.
- Testing infrastructure exists (Phase 02): Vitest (+ jsdom, React Testing Library) per package, Playwright browser tests in `tests/browser/`, and GitHub Actions CI in `.github/workflows/ci.yml`. See the Testing section below.

## Commands

pnpm only (`packageManager: pnpm@10.34.5`), Node >= 22.

| Command                                  | Notes                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `pnpm run dev`                           | turbo dev; fumadocs on `http://localhost:4000`, playground on `http://localhost:4100`                        |
| `pnpm run check`                         | `biome check --write .` — **mutates files**, run it before committing |
| `pnpm run check-types`                   | turbo `check-types`; covers `editor-core`/`editor-react`/`playground`, not fumadocs |
| `pnpm run check-types:fumadocs`          | wrapper for `pnpm --filter fumadocs run types:check`                  |
| `pnpm --filter fumadocs run types:check` | the real app typecheck (`next typegen && tsc --noEmit`); use this     |
| `pnpm run build`                         | turbo build, `dependsOn: ["^build"]`                                  |
| `pnpm run check:packages`                | `publint` + `attw` for `packages/*` (esm-only profile)                |
| `pnpm run test`                          | Vitest unit + component + type tests (`turbo run test`)               |
| `pnpm run test:coverage`                 | Vitest with v8 coverage (`turbo run test:coverage`)                   |
| `pnpm run test:browser`                  | Playwright + axe (Chromium; targets fumadocs on port 4000)            |
| `pnpm run check:ci`                      | `biome ci .` — read-only variant of `check`, used by CI               |

Trap: the fumadocs package names its script `types:check`, not `check-types`, so turbo's `check-types` task does not cover `apps/fumadocs`. The published packages define `check-types`, so `pnpm run check-types` does cover them. Run both `pnpm run check-types` and `pnpm run check-types:fumadocs` for full coverage, and name any new package's script `check-types`.

Verification order: `pnpm run check` → `pnpm run check-types` → `pnpm run check-types:fumadocs` → `pnpm run test` → `pnpm run test:coverage` → `pnpm run build` → `pnpm run check:packages` → `pnpm run test:browser`.

## Testing

Tooling and responsibilities:

| Tool                                | Responsibility                                                            |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Vitest                              | Unit, integration, and type tests (`*.test.ts`, `*.test-d.ts`)            |
| React Testing Library + jsdom       | React component tests in `editor-react`                                   |
| Playwright                          | Real-browser tests in `tests/browser/*.spec.ts`                           |
| axe-core (`@axe-core/playwright`)   | Accessibility checks in the browser                                        |
| `webapp-testing` skill              | AI-agent browser testing workflow against a local server                  |
| `agent-browser`                     | Optional AI-agent browser interaction — **not** a repository dependency   |

Rules:

- Unit tests are co-located with source (`src/**/*.test.ts`, `src/**/*.test.tsx`); type tests are `src/**/*.test-d.ts`; browser tests live in `tests/browser/` (`fumadocs/` and `playground/` subdirectories). `playwright.config.ts` defines one project per app: `fumadocs` on `:4000` and `playground` on `:4100`.
- The playground has no Vitest suite in Phase 05 — it is validated by `check-types`, `vite build`, and the Playwright `playground` project. Do not add Vitest to it without a stated reason.
- `editor-core` tests default to a **node** environment and must not touch React or browser globals. Tests that actually create an editor (editor creation, toolbar commands, image upload) opt in per file with `// @vitest-environment jsdom`; keep that annotation limited to those files. `editor-react` tests run in **jsdom**.
- `editor-core` declares its Tiptap packages (`@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extensions`, `@tiptap/html`) as `peerDependencies`; `happy-dom` is an **optional** peer required only for server-side `jsonToHTML`. Keep them on one Tiptap version line.
- `pnpm run test` must never launch a browser; browser behavior uses `pnpm run test:browser`.
- Browser tests run against the docs app's **production build** (`next build` + `next start`, started automatically by `playwright.config.ts`); the dev server is not used because it is not deterministic under parallel workers.
- jsdom cannot model selection, layout, or IME — verify that behavior with Playwright, never with jsdom.
- Mock only external boundaries. Prefer real package behavior; do not mock Tiptap/ProseMirror internals.
- Tests must be deterministic and offline: no production APIs, real uploads, external databases, or credentials.
- `packages/editor-react/vitest.config.ts` forces `NODE_ENV=test` because `React.act` (used by RTL) only exists in React's development build.
- Coverage artifacts (`coverage/`, `playwright-report/`, `test-results/`) are excluded from Biome and git.
- Public API changes must ship tests (§24.2).
- Known accessibility findings in the Fumadocs scaffold are listed explicitly in `tests/browser/a11y.spec.ts`; the WCAG 2.2 AA audit is Phase 07.

## Style / commit conventions

- Biome: **tabs**, double quotes, organize-imports assist on. No ESLint/Prettier — never add them.
- Husky pre-commit runs lint-staged (`biome check --write` on staged files); commit-msg runs commitlint (Conventional Commits, type must be one of feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert, header <= 100 chars).
- `apps/fumadocs` has its own `tsconfig.json` and does **not** extend `@editor/config`; it also pins a different TypeScript major than the root. Don't "unify" these without an explicit task.

## Non-negotiable architecture rules (details in ARCHITECTURE.md)

- `editor-core` must stay framework-free: no `react`, `react-dom`, `vue`, `next`, `tailwindcss`, no app modules, no browser globals at import time (§4.3, §12). React only in `editor-react`/apps.
- `editor-react` is the only place React may live outside apps. It must consume the `editor-core` public API (never duplicate core logic), keep Tiptap/ProseMirror as the document owner, and add no global document store, provider-specific upload dependency, or Tailwind/icon-library runtime dependency (§4.2, §6.2, §11, §12). Controlled updates use `setContent(..., { emitUpdate: false })` (§7.3).
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
