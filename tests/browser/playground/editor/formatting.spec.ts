import type { Page } from "@playwright/test";

import { type EditorHelpers, expect, test } from "../fixtures";

/**
 * Formatting commands driven from the real toolbar, plus the toolbar's
 * active/pressed state.
 */
test.describe("formatting", () => {
	async function typeText(page: Page, editor: EditorHelpers, text: string) {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();
		await page.keyboard.type(text);
		return surface;
	}

	test("bold applies to the selection @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await typeText(page, editor, "boldme");

		await page.keyboard.press("ControlOrMeta+a");
		const bold = editor.toolbar().getByRole("button", { name: "Bold" });
		await bold.click();

		await expect(surface.locator("strong")).toHaveText("boldme");
		await expect(page.getByTestId("json-output")).toContainText('"bold"');
		await expect(bold).toHaveAttribute("aria-pressed", "true");
	});

	test("bold shortcut works @cross-browser", async ({ page, editor }) => {
		const surface = await typeText(page, editor, "shortcut");

		await page.keyboard.press("ControlOrMeta+a");
		await page.keyboard.press("ControlOrMeta+b");

		await expect(surface.locator("strong")).toHaveText("shortcut");
	});

	test("italic applies to the selection @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await typeText(page, editor, "italicme");

		await page.keyboard.press("ControlOrMeta+a");
		await editor.toolbar().getByRole("button", { name: "Italic" }).click();

		await expect(surface.locator("em")).toHaveText("italicme");
		await expect(page.getByTestId("json-output")).toContainText('"italic"');
	});

	test("underline applies to the selection", async ({ page, editor }) => {
		const surface = await typeText(page, editor, "underlineme");

		await page.keyboard.press("ControlOrMeta+a");
		await editor.toolbar().getByRole("button", { name: "Underline" }).click();

		await expect(surface.locator("u")).toHaveText("underlineme");
	});

	test("heading transforms the current block @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await typeText(page, editor, "A heading");

		await editor.toolbar().getByRole("button", { name: "Heading 1" }).click();

		await expect(surface.locator("h1")).toHaveText("A heading");
		await expect(page.getByTestId("json-output")).toContainText('"level": 1');
		await expect(
			editor.toolbar().getByRole("button", { name: "Heading 1" }),
		).toHaveAttribute("aria-pressed", "true");
	});

	test("bullet list wraps the current block", async ({ page, editor }) => {
		const surface = await typeText(page, editor, "list item");

		await editor.toolbar().getByRole("button", { name: "Bullet list" }).click();

		await expect(surface.locator("ul li")).toHaveText("list item");
		await expect(page.getByTestId("json-output")).toContainText('"bulletList"');
	});

	test("ordered list wraps the current block", async ({ page, editor }) => {
		const surface = await typeText(page, editor, "numbered");

		await editor
			.toolbar()
			.getByRole("button", { name: "Numbered list" })
			.click();

		await expect(surface.locator("ol li")).toHaveText("numbered");
	});

	test("toolbar active state follows the selection @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await typeText(page, editor, "stateful");

		await page.keyboard.press("ControlOrMeta+a");
		const bold = editor.toolbar().getByRole("button", { name: "Bold" });
		await bold.click();
		await expect(bold).toHaveAttribute("aria-pressed", "true");
		await expect(surface.locator("strong")).toHaveText("stateful");

		// Toggling the same command off clears the pressed state.
		await bold.click();
		await expect(bold).toHaveAttribute("aria-pressed", "false");
		await expect(surface.locator("strong")).toHaveCount(0);
	});
});
