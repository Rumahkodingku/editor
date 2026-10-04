import type { Page } from "@playwright/test";

import { type EditorHelpers, expect, test } from "../fixtures";

/**
 * Link control: open, apply, remove, Escape, and unsafe-URL rejection.
 */
test.describe("link control", () => {
	/** Start from a clean, small document and select all of it. */
	async function selectText(page: Page, editor: EditorHelpers) {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();
		await page.keyboard.type("linkme");
		await page.keyboard.press("ControlOrMeta+a");
		return surface;
	}

	test("opens with the input focused @cross-browser", async ({
		page,
		editor,
	}) => {
		await selectText(page, editor);
		await editor.toolbar().getByRole("button", { name: "Link" }).click();

		const dialog = page.getByRole("dialog", { name: "Link" });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole("textbox")).toBeFocused();
		await expect(dialog.getByRole("button", { name: "Apply" })).toBeVisible();
		await expect(dialog.getByRole("button", { name: "Cancel" })).toBeVisible();
	});

	test("applies a safe link @cross-browser", async ({ page, editor }) => {
		const surface = await selectText(page, editor);
		await editor.toolbar().getByRole("button", { name: "Link" }).click();

		const dialog = page.getByRole("dialog", { name: "Link" });
		await dialog.getByRole("textbox").fill("https://example.com");
		await dialog.getByRole("button", { name: "Apply" }).click();

		await expect(dialog).toBeHidden();
		await expect(surface.locator('a[href="https://example.com"]')).toHaveText(
			"linkme",
		);
	});

	test("removes an existing link", async ({ page, editor }) => {
		const surface = await selectText(page, editor);
		await editor.toolbar().getByRole("button", { name: "Link" }).click();
		let dialog = page.getByRole("dialog", { name: "Link" });
		await dialog.getByRole("textbox").fill("https://example.com");
		await dialog.getByRole("button", { name: "Apply" }).click();
		await expect(surface.locator('a[href="https://example.com"]')).toHaveText(
			"linkme",
		);

		// Place the caret inside the link, then open the control.
		await surface.locator('a[href="https://example.com"]').click();
		await editor
			.toolbar()
			.getByRole("button", { name: "Remove link" })
			.first()
			.click();

		dialog = page.getByRole("dialog", { name: "Link" });
		await expect(dialog).toBeVisible();
		await dialog.getByRole("button", { name: "Remove link" }).click();

		await expect(dialog).toBeHidden();
		await expect(surface.locator('a[href="https://example.com"]')).toHaveCount(
			0,
		);
	});

	test("Escape closes and restores focus to the editor @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await selectText(page, editor);
		await editor.toolbar().getByRole("button", { name: "Link" }).click();

		const dialog = page.getByRole("dialog", { name: "Link" });
		await expect(dialog).toBeVisible();
		await page.keyboard.press("Escape");

		await expect(dialog).toBeHidden();
		await expect(surface).toBeFocused();
	});

	test("rejects unsafe URL schemes @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await selectText(page, editor);
		await editor.toolbar().getByRole("button", { name: "Link" }).click();

		const dialog = page.getByRole("dialog", { name: "Link" });
		await dialog.getByRole("textbox").fill("javascript:alert(1)");
		await dialog.getByRole("button", { name: "Apply" }).click();

		await expect(dialog.getByRole("alert")).toHaveText(/valid, safe URL/);
		await expect(dialog).toBeVisible();
		await expect(surface.locator('a[href^="javascript"]')).toHaveCount(0);
	});
});
