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

## Shell

The Playground is a developer workbench rather than a dashboard. Its visual
tokens live in one place, `src/app.css`, and mirror the brand tokens in
`apps/fumadocs/src/app/global.css` so the internal tool and the public
documentation read as one product. Both apps are built and deployed
independently, so the token block is duplicated rather than imported. The
Playground additionally maps the published `--rk-editor-*` variables onto the
brand palette, which themes the editor through its public API without touching
the package.

| Concern           | Behaviour                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Theme             | Three states — System, Light, Dark — on a cycling header control.                                             |
| Storage           | The preference is stored in `localStorage` under `rk-playground-theme`.                                       |
| Applied as        | `<html data-theme="light\|dark">`, which the published editor stylesheet also reads, so shell and editor agree. |
| First paint       | `index.html` resolves the theme inline before the bundle loads, so there is no flash of the wrong theme.      |
| Dark strategy     | `@custom-variant dark` keys off that attribute; `useTheme` resolves `system` before writing it.               |

The cycle is the fixed rotation `system → dark → light → system`. An
"opposite of what is shown" rule was rejected: it makes `light` unreachable for
anyone whose OS is already light, and `dark` unreachable for anyone whose OS is
already dark.

### Responsive navigation

The scenario navigation exists exactly once in the document. At `lg` and above
it lives in a persistent `<aside>`; below that the same list is hosted by a
native `<dialog>`. The container is chosen in JS (`useMediaQuery`) rather than
rendering both, because rendering both would duplicate every navigation test id
and give assistive technology two identical lists. The dialog supplies the focus
trap, Escape handling, and top-layer stacking without a dependency.

### Environment

| Variable                  | Default                     | Purpose                                     |
| ------------------------- | --------------------------- | ------------------------------------------- |
| `VITE_DOCS_URL`           | `http://localhost:4000/docs` | Target of the header "Documentation" link. |

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

Scenarios are grouped in the navigation by what they validate. The group a
scenario belongs to is part of its registry entry (`src/scenarios/index.ts`),
and the groups are declared alongside it, so adding a scenario means adding it
to an existing group rather than inventing one:

| Group        | Scenarios                                                       |
| ------------ | --------------------------------------------------------------- |
| `editor`     | Basic, Initial content, Controlled, Uncontrolled, Conflict, Configuration |
| `states`     | Read-only, Disabled, Labels                                     |
| `content`    | Content inspector, Link security                                |
| `toolbar`    | Toolbar composition                                             |
| `extensions` | Custom extensions                                               |
| `uploads`    | Image upload (mock), Upload error                               |

Each scenario is a component in `src/scenarios/` registered in
`src/scenarios/index.ts`; the active scenario is reflected in the URL hash
(`#/<id>`), so scenarios are deep-linkable. Navigation entries are links rather
than buttons for the same reason.

## Documentation round trip

The documentation is the canonical home for examples (`ARCHITECTURE.md` §20.2),
and the Playground links back to it from the header. The return leg — a
documentation page offering a Playground scenario — is **environment-gated** and
lives in the docs app, not here:

| Variable                    | Effect                                                          |
| --------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_PLAYGROUND_URL` | Unset → no documentation page renders a Playground CTA. Set → the mapped pages link to `#/<scenario>`. |

The gate exists because the Playground is internal and has no public URL: an
unconditional link on a published documentation site would send readers to their
own `localhost`. `NEXT_PUBLIC_*` is inlined at build time, so it must be set for
the build being served — including the build Playwright uses, which sets it in
`playwright.config.ts`. The slug-to-scenario map is
`apps/fumadocs/src/lib/playground.ts`; it is sparse by design, so pages without
a matching scenario simply have no CTA.

## Browser tests

Playwright tests live in `tests/browser/playground/` and run as part of
`pnpm run test:browser` (the `playground` project). The configuration builds the
workspace packages and serves the production build on port 4100.

Phase 07 completed the full browser and accessibility audit here: Chromium runs
the entire suite, and Firefox/WebKit run the flows tagged `@cross-browser`.
`tests/browser/playground/theme.spec.ts` covers the three-state theme,
`editor/responsive.spec.ts` covers the sidebar/drawer switch and horizontal
overflow at eight viewports, and `editor/a11y.spec.ts` additionally audits the
application shell, which is app code this repository owns.

The Documentation → Playground → Documentation journey is covered separately by
the `integration-chromium` project in `tests/browser/integration/`.

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
- **Inspector subscriptions do not use `useEditorState`.** Tiptap's
  `EditorStateManager.watch()` rebinds to a new editor instance without
  invalidating its memoized snapshot, so a value derived while the editor was
  still `null` is never recomputed. The inspectors subscribe to the editor's own
  `transaction`/`update` events through `useEditorRevision` and derive from the
  live instance instead; see the hook for the full note.
