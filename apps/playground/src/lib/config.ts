/**
 * External URLs the Playground links to.
 *
 * `VITE_DOCS_URL` points back at the public documentation, which is the
 * canonical home for examples (`ARCHITECTURE.md` §20.2). The default matches the
 * Fumadocs dev port documented in `apps/playground/README.md`; a shared or
 * deployed environment sets the variable instead of editing this file.
 */
const DEFAULT_DOCS_URL = "http://localhost:4000/docs";

/** Absolute URL of the public documentation, without a trailing slash. */
export const docsUrl = (
	import.meta.env.VITE_DOCS_URL ?? DEFAULT_DOCS_URL
).replace(/\/+$/, "");
