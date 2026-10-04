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
