# Playground

Internal validation environment for **RumahKodingku Editor**.

The Playground is a real consumer application that exercises
`@rumahkodingku/editor-react` (and `@rumahkodingku/editor-core`) through their
**public package APIs only**. It is used for development, manual/visual
validation, and a small set of browser tests.

It is **not** the production editor, the public documentation site, or a
published package. Public examples and live documentation live in
`apps/fumadocs`; the Playground intentionally holds internal scenarios that may
never be public.

## Running

The Playground is part of the pnpm workspace and consumes built workspace
packages, so build them first.

```bash
# From the repository root — builds packages, then starts every app.
pnpm run dev

# Playground only (after workspace packages are built):
pnpm --filter playground run dev
```

- Playground: <http://localhost:4100>
- Fumadocs (separate app): <http://localhost:4000>

```bash
pnpm --filter playground run build      # production build (Vite)
pnpm --filter playground run preview    # serve the production build on :4100
pnpm run check-types                    # includes the Playground via Turborepo
```

## Dependency boundaries

```text
editor-core  →  editor-react  →  playground
```

- The Playground consumes `@rumahkodingku/editor-core` and
  `@rumahkodingku/editor-react` through their `exports`; it never imports from
  `packages/*/src`.
- The Playground is never a dependency of a published package.
- Playground-only concerns (scenario registry, inspectors, fixtures, mock
  upload) stay inside this app and are not added to the packages.

Tailwind CSS is used for the Playground shell only. The editor's own styling is
the published `@rumahkodingku/editor-react/styles.css`; the shell never overrides
package behaviour, only the public `--rk-editor-*` variables.

## Scenarios

| Scenario                           | Validates                                              |
| ---------------------------------- | ------------------------------------------------------ |
| Basic                              | Rendering, editing, default toolbar                    |
| Initial content                    | Loading a known JSON document                          |
| Read-only                          | `editable={false}`                                     |
| Disabled                           | `disabled={true}`                                      |
| Controlled                         | `value` + `onChange` propagation                       |
| Uncontrolled                       | `defaultValue` with editor-owned state                 |
| Controlled/uncontrolled conflict   | `value` + `defaultValue` together (dev warning)        |
| Placeholder / editable / disabled  | Runtime configuration changes                          |
| Labels                             | Partial label overrides with core fallbacks            |
| Custom extensions                  | Composing a consumer extension via the public API      |
| Content inspector                  | JSON/HTML output and content reset                     |
| Toolbar composition                | Toolbar contract and live item state                   |
| Image upload (mock)                | Injection of an upload handler, with progress          |
| Upload error                       | Failure handling and placeholder cleanup               |
| Link security                      | Core URL safety checks (`isSafeUrl`)                   |

Each scenario is a component in `src/scenarios/` registered in
`src/scenarios/index.ts`; the active scenario is reflected in the URL hash
(`#/<id>`), so scenarios are deep-linkable.

## Browser tests

Playwright tests live in `tests/browser/playground/` and run as part of
`pnpm run test:browser` (the `playground` project). The configuration builds the
workspace packages and serves the production build on port 4100.

Phase 07 completed the full browser and accessibility audit here: Chromium runs
the entire suite, and Firefox/WebKit run the flows tagged `@cross-browser`.

## Notes and known gaps

- **Custom toolbar composition.** The all-in-one `Editor` always renders its
  default toolbar and has no prop to replace it. The composable surfaces
  (`EditorProvider`, `EditorToolbar` with caller-provided
  `ToolbarItemDefinition`s, and `EditorContent`) are exported and can replace it;
  the Toolbar scenario renders its own `EditorToolbar` beside the `Editor` to
  validate the toolbar contract against a live editor instance.
- **Mock upload source.** The mock handler returns a local `data:` SVG URL and
  configures the image extension with `allowedProtocols: ["data:"]`. This keeps
  the Playground offline and deterministic while exercising the public URL
  validation option. It is not a production storage integration.
