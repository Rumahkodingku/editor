# Browser tests

Phase 07 browser and accessibility validation for the Editor MVP, extended in
Phase 08 with documentation coverage. This folder documents the conventions the
Playwright suite follows and records the coverage baseline.

## Projects

`playwright.config.ts` defines the testing matrix:

| Project               | App        | Browser        | Scope                               |
| --------------------- | ---------- | -------------- | ----------------------------------- |
| `fumadocs-chromium`   | fumadocs   | Chromium       | Documentation smoke, navigation, examples, axe |
| `fumadocs-firefox`    | fumadocs   | Firefox        | Documentation flows (`@cross-browser`) |
| `fumadocs-webkit`     | fumadocs   | WebKit         | Documentation flows (`@cross-browser`) |
| `playground-chromium` | playground | Chromium       | All editor browser tests            |
| `playground-firefox`  | playground | Firefox        | Critical editor flows (`@cross-browser`) |
| `playground-webkit`   | playground | WebKit         | Critical editor flows (`@cross-browser`) |

The editor only renders in `apps/playground` and in the live documentation
examples in `apps/fumadocs`. The fumadocs project covers the documentation site
(`/`, `/docs`, guides, API reference, examples, locale-aware links, and the
search index) plus axe-core audits of the documentation pages.

Run a subset:

```bash
pnpm exec playwright test --project=fumadocs-chromium
pnpm exec playwright test --project=fumadocs-firefox
pnpm exec playwright test --project=fumadocs-webkit
pnpm exec playwright test --project=playground-chromium
pnpm exec playwright test --project=playground-firefox
pnpm exec playwright test --project=playground-webkit
```

## Selector policy

Prefer, in order:

1. ARIA role + accessible name (`getByRole("button", { name: "Bold" })`).
2. Associated label / text.
3. Stable semantic attribute (`[data-readonly="true"]`, `[data-disabled="true"]`,
   `[data-placeholder]`, `[data-rk-upload-id]`).
4. Published package class (`rk-editor__surface`, `rk-editor__popover`, …).
5. Application-level `data-testid` (scenario roots, nav, inspectors only).

Avoid `nth-child`, generated utility classes, DOM-nesting assumptions, and
`page.waitForTimeout`. Wait on browser state with web-first assertions instead.

The published `@rumahkodingku/editor-react` package ships **no** `data-testid`:
the suite must keep working through the public semantics above.

## Tags

- `@cross-browser` — critical flows that also run on Firefox and WebKit
  (rendering, typing, formatting, toolbar keyboard, link dialog, image insert,
  read-only/disabled, focus).
- `@chromium-only` — behavior that is not portable to assert across engines:
  synthetic rich-text/clipboard paste, file drag-and-drop, CDP-driven IME input,
  and viewport math. Each use states the reason inline.

## Isolation, artifacts, and cleanup

- Each test deep-links to exactly one scenario (`#/<id>`); no shared mutable
  state between tests.
- Failure artifacts: `trace: on-first-retry`, `screenshot: only-on-failure`.
  Video is intentionally off to keep successful runs light.
- Uploads use the playground's offline mock handler — no network, no storage
  provider.

## Coverage baseline (before Phase 07)

| Area                             | Status before | Phase 07 spec                              |
| -------------------------------- | ------------- | ------------------------------------------ |
| Editor rendering                 | partial       | `editor/rendering.spec.ts`                 |
| Typing / keyboard editing        | partial       | `editor/typing.spec.ts`                    |
| Formatting + active state        | missing       | `editor/formatting.spec.ts`                |
| Toolbar keyboard / roving        | missing       | `editor/toolbar-keyboard.spec.ts`          |
| Link control dialog              | missing       | `editor/link.spec.ts`                      |
| Image control / alt / error      | partial       | `editor/image.spec.ts`                     |
| Read-only / disabled             | partial       | `editor/states.spec.ts`                    |
| Controlled / uncontrolled        | partial       | `editor/controlled.spec.ts`                |
| Selection / focus transitions    | missing       | `editor/selection-focus.spec.ts`           |
| Paste / clipboard                | missing       | `editor/paste.spec.ts` (`@chromium-only`)  |
| Drag & drop                      | missing       | `editor/drag-drop.spec.ts` (`@chromium-only`) |
| IME / Unicode                    | missing       | `editor/ime-unicode.spec.ts`               |
| axe-core (editor)                | missing       | `editor/a11y.spec.ts`                      |
| Responsive viewports             | missing       | `editor/responsive.spec.ts` (`@chromium-only`) |

## Documentation coverage (Phase 08)

| Area                              | Spec                                    |
| --------------------------------- | --------------------------------------- |
| Home and docs landing             | `fumadocs/smoke.spec.ts`                |
| Quick Start, API reference, live examples, locale links, search index | `fumadocs/navigation.spec.ts` |
| Documentation axe-core audit      | `fumadocs/a11y.spec.ts`                 |

The a11y spec audits the documentation pages with the Fumadocs chrome regions
(`#nd-sidebar`, `#nd-toc`, `header`, dialogs) excluded and gates critical/serious
violations. No rules are disabled. The high-contrast Shiki theme
(`apps/fumadocs/source.config.ts`) keeps code examples AA-compliant.

## Known limitations

- **IME.** Synthetic composition is environment-sensitive. The suite drives
  Chromium through the CDP `Input.imeSetComposition` sequence; a permanent,
  deterministic IME assertion is intentionally scoped to Chromium. Other engines
  are covered by the keyboard/Unicode flows and exploratory testing.
- **Rich paste and file drag-and-drop.** Synthetic `DataTransfer` behavior
  differs per engine, so those specs are Chromium-only.

## Cross-browser results

The critical flows run unchanged on all engines:

- Chromium (`playground-chromium`): the full editor suite plus the fumadocs
  scaffold checks (`fumadocs-chromium`).
- Firefox (`playground-firefox`): the `@cross-browser` editor flows pass.
- WebKit (`playground-webkit`): the same `@cross-browser` editor flows pass.

No product bug or engine-specific divergence was found in the critical flows.
Paste, file drag-and-drop, CDP-driven IME, and viewport math are intentionally
Chromium-only (see the limitations above). WebKit requires its host system
libraries to launch (`playwright install --with-deps webkit`); CI installs them.

## Flakiness

- No `page.waitForTimeout` is used. Waits target meaningful browser state via
  web-first assertions; the one ordering-sensitive case (Home + Delete) waits on
  the caret reaching offset 0.
- CI keeps `retries: 2`; retries are not used to mask arbitrary delays.
