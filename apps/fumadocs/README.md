# RumahKodingku Editor — Documentation

Fumadocs (Next.js) documentation site for **RumahKodingku Editor**. This app is
the canonical public home for documentation and live examples.

## Development

pnpm is the package manager. Run from the repository root:

```bash
pnpm run dev
```

The docs site is served on http://localhost:4000.

To run only this app:

```bash
pnpm --filter fumadocs run dev
```

## Typecheck

```bash
pnpm --filter fumadocs run types:check
```

From the repository root, the same check is available as
`pnpm run check-types:fumadocs`.

## Structure

- `content/docs/` — MDX documentation pages (require `title` and `description` frontmatter)
- `src/lib/source.ts` — content source adapter and collections
- `src/lib/shared.ts` — route paths, app name, and GitHub config
- `src/lib/layout.shared.tsx` — shared layout options
- `src/app/` — routes (home, docs, search, llms, og)

Full documentation content is built in Phase 08.
