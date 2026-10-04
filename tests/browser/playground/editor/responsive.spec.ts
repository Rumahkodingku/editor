import { expect, test } from "../fixtures";

/**
 * Responsive viewport validation. This checks that the existing UI stays usable
 * and does not overflow; it is not a pixel-perfect or mobile-redesign suite.
 * Viewport math is Chromium-only.
 */
test.describe("responsive viewports", () => {
	const viewports = [
		{ name: "desktop", width: 1280, height: 800 },
		{ name: "tablet", width: 768, height: 1024 },
		{ name: "mobile", width: 390, height: 844 },
	];

	for (const viewport of viewports) {
		test(`editor stays usable at the ${viewport.name} viewport @chromium-only`, async ({
			page,
			editor,
		}) => {
			await page.setViewportSize({
				width: viewport.width,
				height: viewport.height,
			});
			await editor.goto("basic");

			const root = page.locator('[data-testid="scenario-basic"] .rk-editor');
			const toolbar = editor.toolbar();
			await expect(root).toBeVisible();
			await expect(toolbar).toBeVisible();

			// Core controls remain reachable at every size.
			await expect(toolbar.getByRole("button", { name: "Bold" })).toBeVisible();
			await expect(
				toolbar.getByRole("button", { name: "Image" }),
			).toBeVisible();

			// The toolbar does not overflow the viewport horizontally.
			const box = await toolbar.boundingBox();
			expect(box).not.toBeNull();
			if (box) {
				expect(box.x).toBeGreaterThanOrEqual(-1);
				expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
			}
		});
	}

	test("link dialog is usable on a mobile viewport @chromium-only", async ({
		page,
		editor,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await editor.goto("content-inspector");
		await editor.surface("content-inspector").press("ControlOrMeta+a");
		await editor.toolbar().getByRole("button", { name: "Link" }).click();

		const dialog = page.getByRole("dialog", { name: "Link" });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole("textbox")).toBeFocused();

		const box = await dialog.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeLessThanOrEqual(390);
		}
	});
});
