# Browser tests

Phase 07 browser and accessibility validation for the Editor MVP, extended in
Phase 08 with documentation coverage and in the Playground UI modernization with
shell, theme, responsive-navigation, and cross-app coverage. This folder
documents the conventions the Playwright suite follows and records the coverage
baseline.

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
| `integration-chromium`| both       | Chromium       | Documentation ↔ Playground journey        |

The editor only renders in `apps/playground` and in the live documentation
examples in `apps/fumadocs`. The fumadocs project covers the documentation site
(`/`, `/docs`, guides, API reference, examples, locale-aware links, and the
search index) plus axe-core audits of the documentation pages.

The `integration-chromium` project is the exception to the one-app-per-project
rule. A Documentation → Playground → Documentation journey cannot be asserted
from inside either app, so it gets its own directory and its own project. Its
`baseURL` is the documentation app and it is the only place in the suite that
addresses an absolute origin (see **Absolute URLs** below).

Run a subset:

```bash
pnpm exec playwright test --project=fumadocs-chromium
pnpm exec playwright test --project=fumadocs-firefox
pnpm exec playwright test --project=fumadocs-webkit
pnpm exec playwright test --project=playground-chromium
pnpm exec playwright test --project=playground-firefox
pnpm exec playwright test --project=playground-webkit
pnpm exec playwright test --project=integration-chromium
```

## Absolute URLs

Every spec navigates with a path relative to its project's `baseURL`, so no
origin is duplicated and no port is hardcoded. `tests/browser/integration/` is
the single documented exception: `fixtures.ts` exports `FUMADOCS_ORIGIN` and
`PLAYGROUND_ORIGIN` as constants, and specs use those instead of literals.

The documentation app is built with `NEXT_PUBLIC_PLAYGROUND_URL` set to the
playground origin (see the `webServer` entry in `playwright.config.ts`). That
variable is inlined at build time and gates the Playground CTA, so without it
the integration specs would assert against a CTA-less build.

`reuseExistingServer` is enabled outside CI. A dev server already listening on
either port is reused, which means a `next dev` on `:4000` would be served
instead of the production build; stop it first for a faithful run.

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

The scenario navigation renders **once** per document — a persistent `<aside>`
above Tailwind's `lg`, a `<dialog>` drawer below it, chosen in JS. Duplicating it
would duplicate every `scenario-nav-<id>` id and make `getByTestId` ambiguous, so
the shell asserts that only one exists.

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
- **New-tab waiters.** `integration/journey.spec.ts` clicks links that open a
  new tab, so it registers `waitForEvent("page")` *before* the click inside a
  `Promise.all`. Awaiting the click first misses the event when the popup opens
  quickly, which showed up as an intermittent failure on a cold server.
- **Media emulation and re-navigation.** Flipping `prefers-color-scheme` and then
  navigating to the *same* URL races Playwright's emulation re-application
  against document parse, which can make a pre-paint inline script read a stale
  value. `theme.spec.ts` therefore gives each first-visit case its own test (one
  emulation, one navigation) instead of flipping mid-test. A visible-until-stable
  `waitForTimeout` is also avoided there: the theme assertion is a web-first
  `toHaveAttribute`.

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
| Landing page                      | `fumadocs/landing.spec.ts`              |

The a11y spec audits the documentation pages with the Fumadocs chrome regions
(`#nd-sidebar`, `#nd-toc`, `header`, dialogs) excluded and gates critical/serious
violations. No rules are disabled. The high-contrast Shiki theme
(`apps/fumadocs/source.config.ts`) keeps code examples AA-compliant.

`smoke.spec.ts` also asserts the **effective opacity** of the landing sections.
Playwright treats `opacity: 0` elements as visible, so a landing page whose
entrance animation never ran would pass `toBeVisible()` while showing nothing to
a reader. See `.rk-reveal` in `apps/fumadocs/src/app/global.css`.

## Application shell coverage (Playground UI modernization)

| Area                                   | Spec                                        |
| -------------------------------------- | ------------------------------------------- |
| App shell smoke and scenario routing   | `playground/smoke.spec.ts`, `playground/scenarios.spec.ts` |
| Three-state theme, persistence, shell/editor agreement | `playground/theme.spec.ts` |
| Sidebar vs. drawer, overflow at eight viewports | `playground/editor/responsive.spec.ts` |
| axe-core audit of the shell, header, nav, and panels | `playground/editor/a11y.spec.ts` |
| Documentation CTA deep links, Playground → Documentation | `integration/journey.spec.ts` |

The editor audits in `a11y.spec.ts` are scoped to `.rk-editor*` so a shell
violation cannot mask — or be masked by — an editor one. The shell therefore has
its own whole-page scans with **nothing excluded and no rules disabled**, because
the shell is app code this repository owns. Those scans are what caught
`scrollable-region-focusable` on the shell's scroll containers.

The theme spec asserts an already-correct `data-theme` on load rather than the
value during the pre-paint window: an init script runs before the inline
resolver and a navigation only resolves once the document has parsed, so the
pre-paint moment is not observable from a test. The resolver's presence is
asserted against the served HTML instead.

## Known limitations

- **IME.** Synthetic composition is environment-sensitive. The suite drives
  Chromium through the CDP `Input.imeSetComposition` sequence; a permanent,
  deterministic IME assertion is intentionally scoped to Chromium. Other engines
  are covered by the keyboard/Unicode flows and exploratory testing.
- **Rich paste and file drag-and-drop.** Synthetic `DataTransfer` behavior
  differs per engine, so those specs are Chromium-only.

## Cross-browser results

The critical flows run unchanged on all engines:

- Chromium (`playground-chromium`): the full editor suite, the shell, theme, and
  responsive specs, the fumadocs scaffold checks (`fumadocs-chromium`), and the
  cross-app journey (`integration-chromium`).
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
