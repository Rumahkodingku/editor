import { expect, test } from "@playwright/test";

test("quick start page renders @cross-browser", async ({ page }) => {
	await page.goto("/docs/introduction/quick-start");

	await expect(
		page.getByRole("heading", { level: 1, name: "Quick Start" }),
	).toBeVisible();
});

test("API reference page renders", async ({ page }) => {
	await page.goto("/docs/api/react");

	await expect(
		page.getByRole("heading", { level: 1, name: "React API" }),
	).toBeVisible();
});

test("examples embed a live editor @cross-browser", async ({ page }) => {
	await page.goto("/docs/examples/basic-editor");

	await expect(page.locator(".rk-editor__surface").first()).toBeVisible();
});

test("internal links keep the active locale", async ({ page }) => {
	await page.goto("/id/docs");

	await page
		.locator('a[href="/id/docs/introduction/installation"]')
		.first()
		.click();

	await expect(page).toHaveURL(/\/id\/docs\/introduction\/installation/);
});

test("search index returns documentation results", async ({ request }) => {
	const response = await request.get(
		"/api/search?query=installation&locale=en",
	);

	expect(response.ok()).toBeTruthy();

	const results = await response.json();
	expect(Array.isArray(results)).toBeTruthy();
	expect(results.length).toBeGreaterThan(0);
});
