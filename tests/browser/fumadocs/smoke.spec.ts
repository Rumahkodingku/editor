import { expect, test } from "@playwright/test";

test("home page loads @cross-browser", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { level: 1, name: "RumahKodingku Editor" }),
	).toBeVisible();
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
