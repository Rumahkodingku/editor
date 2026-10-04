import type { Page } from "@playwright/test";

import { expect, test } from "../fixtures";

/**
 * Clipboard paste. Synthetic `DataTransfer` behavior is engine-specific, so
 * these run on Chromium only (see tests/browser/README.md).
 */
test.describe("paste and clipboard", () => {
	async function paste(
		page: Page,
		scenarioId: string,
		data: Record<string, string>,
	) {
		await page.evaluate(
			({ id, payload }) => {
				const surface = document.querySelector(
					`[data-testid="scenario-${id}"] .rk-editor__surface`,
				);
				if (!surface) {
					throw new Error("Editor surface not found");
				}
				const transfer = new DataTransfer();
				for (const [type, value] of Object.entries(payload)) {
					transfer.setData(type, value);
				}
				surface.dispatchEvent(
					new ClipboardEvent("paste", {
						clipboardData: transfer,
						bubbles: true,
						cancelable: true,
					}),
				);
			},
			{ id: scenarioId, payload: data },
		);
	}

	test("pastes plain text @chromium-only", async ({ page, editor }) => {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();

		await paste(page, "content-inspector", { "text/plain": "pasted plain" });

		await expect(surface).toContainText("pasted plain");
		await expect(page.getByTestId("json-output")).toContainText("pasted plain");
	});

	test("pastes supported rich text @chromium-only", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();

		await paste(page, "content-inspector", {
			"text/html": "<p><strong>Rich</strong> text</p>",
			"text/plain": "Rich text",
		});

		await expect(surface.locator("strong")).toHaveText("Rich");
		await expect(page.getByTestId("html-output")).toContainText("<strong>");
	});

	test("does not execute unsafe pasted HTML @chromium-only", async ({
		page,
		editor,
	}) => {
		await editor.goto("content-inspector");
		await page.getByTestId("content-clear").click();
		const surface = editor.surface("content-inspector");
		await surface.click();

		await paste(page, "content-inspector", {
			"text/html":
				'<p>safe</p><script>window.__pwned = true;</script><img src="x" onerror="window.__pwned = true">',
			"text/plain": "safe",
		});

		await expect(surface).toContainText("safe");
		await expect(
			surface.locator("script"),
			"no script element is inserted",
		).toHaveCount(0);
		const pwned = await page.evaluate(
			() => (window as unknown as Record<string, unknown>).__pwned,
		);
		expect(pwned).toBeFalsy();
	});
});
