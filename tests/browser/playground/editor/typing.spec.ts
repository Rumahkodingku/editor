import type { Page } from "@playwright/test";

import { type EditorHelpers, expect, test } from "../fixtures";

/**
 * Typing and keyboard editing.
 *
 * Uses the content inspector so the resulting document can be asserted through
 * the JSON and HTML output panels.
 */
test.describe("typing and keyboard editing", () => {
	async function startEmpty(page: Page, editor: EditorHelpers) {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();
		return surface;
	}

	test("typing updates the document and the serialized output @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("Hello browser");

		await expect(surface).toContainText("Hello browser");
		await expect(page.getByTestId("json-output")).toContainText(
			"Hello browser",
		);
		await expect(page.getByTestId("html-output")).toContainText(
			"Hello browser",
		);
	});

	test("Enter creates a new paragraph @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("first");
		await page.keyboard.press("Enter");
		await page.keyboard.type("second");

		await expect(surface.locator("p")).toHaveCount(2);
		await expect(page.getByTestId("json-output")).toContainText("first");
		await expect(page.getByTestId("json-output")).toContainText("second");
	});

	test("Shift+Enter inserts a hard break when supported", async ({
		page,
		editor,
	}) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("line");
		await page.keyboard.press("Shift+Enter");
		await page.keyboard.type("break");

		await expect(surface.locator("br")).toHaveCount(1);
		await expect(page.getByTestId("html-output")).toContainText("break");
	});

	test("Backspace removes the previous character", async ({ page, editor }) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("abc");
		await page.keyboard.press("Backspace");

		await expect(surface.locator("p")).toHaveText("ab");
		await expect(page.getByTestId("json-output")).not.toContainText("abc");
	});

	test("Delete removes the next character", async ({ page, editor }) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("abc");
		await page.keyboard.press("Home");
		await page.waitForFunction(() => window.getSelection()?.anchorOffset === 0);
		await page.keyboard.press("Delete");

		await expect(surface.locator("p")).toHaveText("bc");
	});

	test("arrow keys, Home, and End move the caret @cross-browser", async ({
		page,
		editor,
	}) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("abcd");
		await page.keyboard.press("Home");
		await page.keyboard.press("ArrowRight");
		await page.keyboard.press("ArrowRight");
		await page.keyboard.type("X");

		// Caret moved two characters in from the start.
		await expect(surface.locator("p")).toHaveText("abXcd");
	});

	test("select-all then typing replaces the document", async ({
		page,
		editor,
	}) => {
		const surface = await startEmpty(page, editor);

		await page.keyboard.type("abcdef");
		await page.keyboard.press("ControlOrMeta+a");
		await page.keyboard.type("z");

		await expect(surface.locator("p")).toHaveText("z");
		await expect(page.getByTestId("json-output")).not.toContainText("abcdef");
	});

	test("copy does not crash the editor", async ({ page, editor }) => {
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));

		const surface = await startEmpty(page, editor);
		await page.keyboard.type("copy me");
		await page.keyboard.press("ControlOrMeta+a");
		await page.keyboard.press("ControlOrMeta+c");

		await expect(surface).toContainText("copy me");
		expect(errors).toEqual([]);
	});
});
