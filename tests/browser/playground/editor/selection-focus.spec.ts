import { expect, test } from "../fixtures";

/**
 * Selection preservation and the Editor -> Toolbar -> Dialog -> Editor focus
 * cycle, including visible keyboard focus.
 */
test.describe("selection and focus", () => {
	test("preserves the selection across consecutive formats @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();
		await page.keyboard.type("selected");
		await page.keyboard.press("ControlOrMeta+a");

		await editor.toolbar().getByRole("button", { name: "Bold" }).click();
		// The selection survives the first command, so the second applies to it.
		await editor.toolbar().getByRole("button", { name: "Italic" }).click();

		await expect(surface.locator("strong em")).toHaveText("selected");
	});

	test("moves focus Editor -> Toolbar -> Dialog -> Editor @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		const surface = editor.surface("content-inspector");
		const toolbar = editor.toolbar();

		await surface.click();
		await expect(surface).toBeFocused();

		const bold = toolbar.getByRole("button", { name: "Bold" });
		await bold.focus();
		await expect(bold).toBeFocused();

		await surface.press("ControlOrMeta+a");
		await toolbar.getByRole("button", { name: "Link" }).click();
		const dialog = page.getByRole("dialog", { name: "Link" });
		await expect(dialog.getByRole("textbox")).toBeFocused();

		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
		await expect(surface).toBeFocused();
	});

	test("shows a visible focus ring on keyboard focus @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");
		const surface = editor.surface("basic");

		// Keyboard focus (Shift+Tab) lands on the last enabled toolbar button.
		await surface.focus();
		await page.keyboard.press("Shift+Tab");

		const focusRing = await page.evaluate(() => {
			const element = document.activeElement;
			if (!element) {
				return null;
			}
			const style = getComputedStyle(element);
			return { style: style.outlineStyle, width: style.outlineWidth };
		});
		expect(focusRing).not.toBeNull();
		expect(focusRing?.style).not.toBe("none");
		expect(focusRing?.width).not.toBe("0px");
	});

	test("dialog inputs receive visible keyboard focus", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		await editor.surface("content-inspector").press("ControlOrMeta+a");
		await editor.toolbar().getByRole("button", { name: "Link" }).click();

		const dialog = page.getByRole("dialog", { name: "Link" });
		const input = dialog.getByRole("textbox");
		await expect(input).toBeFocused();

		const focusRing = await input.evaluate((element) => {
			const style = getComputedStyle(element);
			return { style: style.outlineStyle, width: style.outlineWidth };
		});
		expect(focusRing.style).not.toBe("none");
		expect(focusRing.width).not.toBe("0px");
	});
});
