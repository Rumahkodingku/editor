import { expect, test } from "./fixtures";

test("playground loads and renders the editor", async ({ page, editor }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { level: 1, name: /Playground/i }),
	).toBeVisible();
	await expect(page.getByTestId("scenario-basic")).toBeVisible();
	await expect(editor.surface("basic")).toBeVisible();
});

test("scenario navigation switches scenarios", async ({ page }) => {
	await page.goto("/");

	await page.getByTestId("scenario-nav-content-inspector").click();

	await expect(page.getByTestId("scenario-content-inspector")).toBeVisible();
	await expect(page.getByTestId("scenario-basic")).toHaveCount(0);
});

test("deep link selects a scenario without a fatal runtime error", async ({
	page,
	editor,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));

	await editor.goto("controlled");

	await expect(page.getByTestId("scenario-controlled")).toBeVisible();
	expect(errors).toEqual([]);
});
