import { expect, test } from "@playwright/test";

test("home page loads @cross-browser", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "A modern rich-text editor for the web.",
		}),
	).toBeVisible();
});

test("Indonesian home page loads", async ({ page }) => {
	await page.goto("/id");

	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Editor rich-text modern untuk web.",
		}),
	).toBeVisible();
});

/**
 * Landing sections must be painted, not just present.
 *
 * Playwright treats an element with `opacity: 0` as visible, so `toBeVisible()`
 * alone would pass while a reader sees a blank page. Asserting the effective
 * opacity catches content that is hidden by an entrance animation that never
 * ran (for example when hydration is delayed).
 */
test("landing sections are actually painted @cross-browser", async ({
	page,
}) => {
	await page.goto("/");

	const heading = page.getByRole("heading", {
		level: 1,
		name: "A modern rich-text editor for the web.",
	});
	const sections = page.locator(".rk-reveal");

	await expect(heading).toBeVisible();
	// `opacity` is not inherited, so the animated wrapper itself has to be
	// checked: a reader sees nothing when only the wrapper is transparent.
	await expect(sections.first()).toHaveCSS("opacity", "1");

	// Every animated section must end up painted, including those far below the
	// fold, so a hidden landing page cannot slip through again.
	await expect
		.poll(() =>
			sections.evaluateAll(
				(nodes) =>
					nodes.filter((node) => getComputedStyle(node).opacity === "0").length,
			),
		)
		.toBe(0);
});

test("docs landing page loads @cross-browser", async ({ page }) => {
	await page.goto("/docs");

	await expect(
		page.getByRole("heading", { level: 1, name: "Introduction" }),
	).toBeVisible();
});

test("Indonesian docs landing page loads", async ({ page }) => {
	await page.goto("/id/docs");

	await expect(
		page.getByRole("heading", { level: 1, name: "Pengantar" }),
	).toBeVisible();
});
