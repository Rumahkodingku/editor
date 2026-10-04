import { expect, test } from "../fixtures";

/**
 * Controlled and uncontrolled content, including external controlled updates.
 */
test.describe("controlled and uncontrolled content", () => {
	test("uncontrolled mode owns its document @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("uncontrolled");
		const surface = editor.surface("uncontrolled");

		await surface.click();
		await page.keyboard.type("XYZ");
		await expect(surface).toContainText("XYZ");
	});

	test("uncontrolled mode resets through the editor API", async ({
		page,
		editor,
	}) => {
		await editor.goto("uncontrolled");
		const surface = editor.surface("uncontrolled");

		await page.getByTestId("uncontrolled-clear").click();
		await expect(surface).not.toContainText("Playground fixture");

		await page.getByTestId("uncontrolled-reset").click();
		await expect(surface).toContainText("Playground fixture");
	});

	test("controlled mode propagates edits to the parent @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("controlled");
		const surface = editor.surface("controlled");

		await surface.click();
		await page.keyboard.type("XYZ");

		await expect(page.getByTestId("json-output")).toContainText("XYZ");
	});

	test("controlled external update replaces the content without loops", async ({
		page,
		editor,
	}) => {
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));

		await editor.goto("controlled");
		const surface = editor.surface("controlled");

		await page.getByTestId("controlled-alternate").click();
		await expect(surface).toContainText("Alternate content");
		await expect(page.getByTestId("json-output")).toContainText(
			"Alternate content",
		);
		// Exactly one heading: the value was replaced, not appended.
		await expect(surface.locator("h2")).toHaveCount(1);

		await page.getByTestId("controlled-reset").click();
		await expect(surface).toContainText("Playground fixture");
		await expect(surface.locator("h2")).toHaveCount(1);
		await expect(surface.locator("h2")).toHaveText("Playground fixture");

		expect(errors).toEqual([]);
	});
});
