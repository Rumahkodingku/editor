import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
	"/",
	"/docs",
	"/docs/introduction/installation",
	"/docs/guides/custom-toolbar",
	"/docs/api/react",
	"/docs/examples/basic-editor",
	"/id/docs",
	"/id/docs/guides/theming",
];

/**
 * Fumadocs UI chrome regions whose default-theme contrast findings are tracked
 * upstream (navigation sidebar, table of contents, and dialogs). The audit still
 * covers the documentation content, code examples, and live editors, so the rule
 * stays enabled instead of being disabled wholesale.
 */
const FUMADOCS_CHROME = ["#nd-sidebar", "#nd-toc", "header", "[role='dialog']"];

for (const route of routes) {
	test(`has no serious or critical accessibility violations on ${route}`, async ({
		page,
	}) => {
		await page.goto(route);

		const builder = new AxeBuilder({ page });
		for (const selector of FUMADOCS_CHROME) {
			builder.exclude(selector);
		}

		const results = await builder.analyze();
		const severe = results.violations.filter(
			(violation) =>
				violation.impact === "serious" || violation.impact === "critical",
		);

		expect(
			severe.map((violation) => `${violation.id} (${violation.impact})`),
		).toEqual([]);
	});
}
