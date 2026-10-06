/**
 * Cross-app fixtures for the Documentation → Playground → Documentation journey.
 *
 * `baseURL` is the documentation app, so these are the only specs in the suite
 * that address an absolute origin. See `tests/browser/README.md`.
 */
export const FUMADOCS_ORIGIN = "http://localhost:4000";
export const PLAYGROUND_ORIGIN = "http://localhost:4100";

/** A documentation page and the Playground scenario its CTA must open. */
export const DEEP_LINK_CASES = [
	{ docsPath: "/docs", scenario: "basic" },
	{ docsPath: "/docs/guides/controlled", scenario: "controlled" },
	{ docsPath: "/docs/guides/read-only", scenario: "read-only" },
	{ docsPath: "/docs/examples/image-upload", scenario: "image-upload" },
	{ docsPath: "/id/docs/guides/custom-toolbar", scenario: "toolbar" },
] as const;
