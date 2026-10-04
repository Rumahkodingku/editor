import { expect, test } from "../fixtures";

/**
 * Read-only and disabled states, plus the editable/read-only/disabled matrix.
 */
test.describe("read-only and disabled states", () => {
	test("read-only shows content and blocks typing @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("read-only");
		const surface = editor.surface("read-only");
		const root = page.locator('[data-testid="scenario-read-only"] .rk-editor');

		await expect(surface).toHaveAttribute("aria-readonly", "true");
		await expect(surface).not.toHaveAttribute("aria-disabled", "true");
		await expect(root).toHaveAttribute("data-readonly", "true");
		await expect(surface).toContainText("Playground fixture");

		await surface.click();
		await page.keyboard.type("nope");
		await expect(surface).not.toContainText("nope");
	});

	test("read-only keeps the toolbar disabled @cross-browser", async ({
		editor,
	}) => {
		await editor.goto("read-only");
		const toolbar = editor.toolbar();
		await expect(toolbar.getByRole("button", { name: "Bold" })).toBeDisabled();
		await expect(toolbar.getByRole("button", { name: "Image" })).toBeDisabled();
		await expect(toolbar.getByRole("button", { name: "Link" })).toBeDisabled();
	});

	test("disabled blocks interaction and marks ARIA @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("disabled");
		const surface = editor.surface("disabled");
		const root = page.locator('[data-testid="scenario-disabled"] .rk-editor');

		await expect(surface).toHaveAttribute("aria-disabled", "true");
		await expect(surface).not.toHaveAttribute("aria-readonly", "true");
		await expect(root).toHaveAttribute("data-disabled", "true");

		// A disabled surface cannot take focus or input; force the click so the
		// attempt is made and the editor still ignores it.
		await surface.click({ force: true });
		await page.keyboard.type("nope");
		await expect(surface).not.toContainText("nope");
	});

	test("disabled keeps the toolbar disabled", async ({ editor }) => {
		await editor.goto("disabled");
		const toolbar = editor.toolbar();
		await expect(toolbar.getByRole("button", { name: "Bold" })).toBeDisabled();
		await expect(toolbar.getByRole("button", { name: "Undo" })).toBeDisabled();
	});

	test("editable state has no read-only/disabled ARIA", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");
		const surface = editor.surface("basic");
		const root = page.locator('[data-testid="scenario-basic"] .rk-editor');

		await expect(surface).not.toHaveAttribute("aria-readonly", "true");
		await expect(surface).not.toHaveAttribute("aria-disabled", "true");
		await expect(root).not.toHaveAttribute("data-readonly", "true");
		await expect(root).not.toHaveAttribute("data-disabled", "true");
	});

	test("configuration toggles the disabled state at runtime", async ({
		page,
		editor,
	}) => {
		await editor.goto("configuration");
		await page.getByTestId("config-disabled").check();

		await expect(page.getByTestId("state-disabled")).toHaveText("true");
		await expect(
			page.locator('[data-testid="scenario-configuration"] .rk-editor'),
		).toHaveAttribute("data-disabled", "true");
	});
});
