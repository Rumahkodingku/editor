import { expect, test } from "@playwright/test";

test("playground loads and renders the editor", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { level: 1, name: /Playground/i }),
	).toBeVisible();
	await expect(page.getByTestId("scenario-basic")).toBeVisible();
	await expect(page.locator(".rk-editor__surface")).toBeVisible();
});

test("scenario navigation switches scenarios", async ({ page }) => {
	await page.goto("/");

	await page.getByTestId("scenario-nav-content-inspector").click();

	await expect(page.getByTestId("scenario-content-inspector")).toBeVisible();
	await expect(page.getByTestId("scenario-basic")).toHaveCount(0);
});

test("deep link selects a scenario without a fatal runtime error", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));

	await page.goto("/#/controlled");

	await expect(page.getByTestId("scenario-controlled")).toBeVisible();
	expect(errors).toEqual([]);
});
