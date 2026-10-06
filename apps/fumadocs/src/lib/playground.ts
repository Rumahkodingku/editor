/**
 * Optional link from the documentation to the internal Playground.
 *
 * `ARCHITECTURE.md` §20.2 (OQ-9) keeps `apps/playground` internal: it exists for
 * development and rapid validation, while the documentation stays the canonical
 * public home for examples and live demos. Because the Playground has no public
 * URL and the repository has no deployment configuration, a hard-coded link
 * would point readers of a published documentation site at their own
 * `localhost`.
 *
 * The CTA is therefore opt-in: it renders only when `NEXT_PUBLIC_PLAYGROUND_URL`
 * is set at build time, which is how a maintainer running both apps locally opts
 * in. Unset (the default, and the case in a published build) the component
 * renders nothing, so the documentation carries no broken link.
 */
export const playgroundUrl = process.env.NEXT_PUBLIC_PLAYGROUND_URL?.replace(
	/\/+$/,
	"",
);

/** Deep link into a single Playground scenario, e.g. `#/controlled`. */
export function playgroundScenarioUrl(scenario: string): string | null {
	return playgroundUrl ? `${playgroundUrl}/#/${scenario}` : null;
}

/**
 * Documentation slugs that have a matching Playground scenario.
 *
 * Keys are the slug of a page below `/docs`, without a locale prefix and
 * without a leading slash; `""` is the documentation index. Slugs are identical
 * in `content/docs/en` and `content/docs/id`, so one map serves both locales.
 *
 * Only pages whose subject maps directly onto a scenario are listed. The
 * documentation has many pages and the Playground has 15 scenarios, so a sparse
 * map is deliberate: pages with no scenario simply have no CTA.
 */
export const PLAYGROUND_SCENARIOS: Readonly<Record<string, string>> = {
	"": "basic",
	"getting-started/quick-start": "basic",
	"fundamentals/content": "content-inspector",
	"features/images": "image-upload",
	"features/toolbar": "toolbar",
	"guides/controlled": "controlled",
	"guides/uncontrolled": "uncontrolled",
	"guides/read-only": "read-only",
	"guides/disabled": "disabled",
	"guides/custom-extensions": "custom-extensions",
	"guides/custom-toolbar": "toolbar",
	"guides/image-upload": "image-upload",
	"examples/basic-editor": "basic",
	"examples/controlled-editor": "controlled",
	"examples/uncontrolled-editor": "uncontrolled",
	"examples/read-only-editor": "read-only",
	"examples/disabled-editor": "disabled",
	"examples/custom-toolbar": "toolbar",
	"examples/custom-extension": "custom-extensions",
	"examples/image-upload": "image-upload",
};

/** The scenario a documentation slug maps to, if any. */
export function scenarioForSlug(slug: string): string | undefined {
	return PLAYGROUND_SCENARIOS[slug];
}

const CTA_LABEL: Record<string, string> = {
	en: "Try in Playground",
	id: "Coba di Playground",
};

/**
 * Localized CTA label, falling back to the default documentation locale.
 *
 * The documentation nav itself keeps hard-coded English labels
 * (`src/lib/layout.shared.tsx`); the CTA is localized because it sits inside the
 * page body, where the rest of the content already switches by locale.
 */
export function playgroundCtaLabel(lang: string): string {
	return CTA_LABEL[lang] ?? CTA_LABEL.en ?? "Try in Playground";
}
