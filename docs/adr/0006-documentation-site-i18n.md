# ADR 0006 — Bilingual documentation site with live examples

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 08 (Documentation)
- **Source:** `ARCHITECTURE.md` §20, §22

## Context

Phase 08 publishes the public documentation in `apps/fumadocs`. Two product
questions had to be settled for the documentation application:

1. **Locale support.** `ARCHITECTURE.md` §22 defines English as the default
   locale with Indonesian "planned". The documentation had to decide whether to
   ship one language or both now.
2. **Examples.** `ARCHITECTURE.md` §20.2 and `PRD.md` §24 treat Fumadocs as the
   canonical home for public examples and live demos. A decision was needed on
   whether examples are static code blocks or runnable components.

## Decision

1. The documentation is **bilingual (English + Indonesian) now**. English is the
   default locale and its URL prefix is hidden; Indonesian is served under `/id`.
   Locales are configured with `defineI18n({ parser: "dir", hideLocale:
   "default-locale" })` and content lives under `content/docs/<lang>/`.
2. Examples are **live, runnable components** in
   `apps/fumadocs/src/components/demos/`. `apps/fumadocs` therefore consumes
   `@rumahkodingku/editor-core` and `@rumahkodingku/editor-react` (and their
   Tiptap peers) through their public package APIs only — never `packages/*/src`.
3. Image-upload examples stay **offline and deterministic** by using a mock
   handler with a `data:` URL, mirroring the playground.
4. The docs site renders on the server; live examples opt out of immediate
   rendering (`immediatelyRender={false}`) and are client components.

## Alternatives considered

- **English only, defer Indonesian.** Rejected: the product target includes an
  Indonesian audience, and `parser: "dir"` keeps the structure explicit.
- **Static code examples only.** Rejected: examples would drift from the public
  API, and the roadmap explicitly calls for executable examples where valuable.
- **`hideLocale: "never"` (always show `/en`).** Rejected in favor of cleaner
  default-locale URLs.

## Consequences

- The docs app is part of the Turborepo dependency graph; the Playwright
  `webServer` builds the workspace packages before the docs app.
- Internal documentation links are made locale-aware at render time (the docs
  page prefixes `/docs` links with the active locale), because Fumadocs' relative
  link resolution is based on a locale-prefixed page path.
- Live examples increase the docs bundle and must be verified in a real browser;
  they are covered by `tests/browser/fumadocs/`.
- Adding a third locale is a content + i18n-config change, not a new package.
  Full RTL support remains out of scope (§22).

## References

- `ARCHITECTURE.md` §20.1, §20.2, §22, §4.2
- `apps/fumadocs/src/lib/i18n.ts`
- `apps/fumadocs/src/lib/source.ts`
- `apps/fumadocs/src/proxy.ts`
