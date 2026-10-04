import { expect, test } from "../fixtures";

/**
 * WAI-ARIA toolbar pattern: semantics, roving tabindex, keyboard navigation.
 */
test.describe("toolbar keyboard accessibility", () => {
	test("exposes toolbar and group semantics @cross-browser", async ({
		editor,
	}) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();

		await expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");
		await expect(toolbar).toHaveAttribute("aria-label", "Rich text editor");

		const groups = toolbar.getByRole("group");
		await expect(groups.first()).toBeVisible();
		for (const name of ["Text formatting", "Headings", "Lists", "Blocks"]) {
			await expect(toolbar.getByRole("group", { name })).toBeVisible();
		}
	});

	test("keeps a single roving tab stop @cross-browser", async ({ editor }) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();

		const tabStops = toolbar.locator('button[tabindex="0"]');
		await expect(tabStops).toHaveCount(1);
		await expect(tabStops.first()).toHaveAttribute("tabindex", "0");
		await expect(tabStops.first()).toHaveAccessibleName("Bold");
	});

	test("ArrowRight / ArrowLeft move focus between items @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();
		const bold = toolbar.getByRole("button", { name: "Bold" });
		const italic = toolbar.getByRole("button", { name: "Italic" });

		await bold.focus();
		await expect(bold).toBeFocused();
		await expect(bold).toHaveAttribute("tabindex", "0");

		await page.keyboard.press("ArrowRight");
		await expect(italic).toBeFocused();

		await page.keyboard.press("ArrowLeft");
		await expect(bold).toBeFocused();
	});

	test("Home and End jump to the first and last enabled controls @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();
		const bold = toolbar.getByRole("button", { name: "Bold" });
		const lastEnabled = toolbar.locator("button:not([disabled])").last();

		await bold.focus();
		await page.keyboard.press("End");
		await expect(lastEnabled).toBeFocused();

		await page.keyboard.press("Home");
		await expect(bold).toBeFocused();
	});

	test("arrow navigation wraps around @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();
		const first = toolbar.locator("button:not([disabled])").first();
		const last = toolbar.locator("button:not([disabled])").last();

		await last.focus();
		await page.keyboard.press("ArrowRight");
		await expect(first).toBeFocused();
	});

	test("Tab leaves the toolbar and Shift+Tab enters it @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();
		const bold = toolbar.getByRole("button", { name: "Bold" });

		await bold.focus();
		await page.keyboard.press("Tab");
		expect(
			await page.evaluate(
				() => document.activeElement?.closest('[role="toolbar"]') !== null,
			),
		).toBe(false);

		await editor.surface("basic").focus();
		await page.keyboard.press("Shift+Tab");
		expect(
			await page.evaluate(
				() => document.activeElement?.closest('[role="toolbar"]') !== null,
			),
		).toBe(true);
	});

	test("disabled toolbar controls are unreachable @cross-browser", async ({
		editor,
	}) => {
		await editor.goto("read-only");
		const toolbar = editor.toolbar();
		const bold = toolbar.getByRole("button", { name: "Bold" });

		await expect(bold).toBeDisabled();
		await expect(bold).toHaveAttribute("aria-disabled", "true");
		await expect(bold).toHaveAttribute("tabindex", "-1");
		await expect(toolbar.locator("button:not([disabled])")).toHaveCount(0);
	});
});
