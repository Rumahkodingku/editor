import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { level: 1, name: "RumahKodingku Editor" }),
	).toBeVisible();
});

test("documentation page loads", async ({ page }) => {
	await page.goto("/docs");

	await expect(
		page.getByRole("heading", { level: 1, name: "RumahKodingku Editor" }),
	).toBeVisible();
});
