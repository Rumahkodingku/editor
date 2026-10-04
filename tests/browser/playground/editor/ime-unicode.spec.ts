import { expect, test } from "../fixtures";

/**
 * International text and IME composition.
 *
 * jsdom cannot model IME, so this is validated in a real browser. Composition
 * is driven through the CDP Input domain, which is Chromium-only.
 */
test.describe("IME and international text", () => {
	test("preserves Unicode input and JSON output @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();

		const sample = "Halo, café résumé 🎉 日本語";
		await page.keyboard.insertText(sample);

		await expect(surface).toContainText(sample);
		await expect(page.getByTestId("json-output")).toContainText(sample);
		await expect(page.getByTestId("html-output")).toContainText("日本語");
	});

	test("commits IME composition to the document @chromium-only", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();

		const client = await page.context().newCDPSession(page);
		await client.send("Input.imeSetComposition", {
			text: "こんにちは",
			selectionStart: 5,
			selectionEnd: 5,
		});
		await client.send("Input.insertText", { text: "こんにちは" });

		await expect(page.getByTestId("json-output")).toContainText("こんにちは");
		await expect(surface).toContainText("こんにちは");
	});
});
