import { expect, test } from "./fixtures";

/**
 * Application-level scenario integrations: content reset, custom extension
 * composition, toolbar composition, and the URL-safety helper.
 *
 * Editor behavior itself is covered by the specs under `editor/`.
 */
test("content can be cleared and reset", async ({ page, editor }) => {
	await editor.goto("content-inspector");

	await page.getByTestId("content-clear").click();
	await expect(page.getByTestId("json-output")).not.toContainText(
		"Playground fixture",
	);

	await page.getByTestId("content-reset").click();
	await expect(page.getByTestId("json-output")).toContainText(
		"Playground fixture",
	);
});

test("custom extension mark can be applied", async ({ page, editor }) => {
	await editor.goto("custom-extensions");

	const surface = editor.surface("custom-extensions");
	await surface.click();
	await page.keyboard.press("ControlOrMeta+a");
	await page.getByTestId("toggle-highlight").click();

	// The mark is applied per text node, so several `<mark>` elements appear.
	await expect(surface.locator("mark").first()).toBeVisible();

	await page.getByTestId("toggle-highlight").click();
	await expect(surface.locator("mark")).toHaveCount(0);
});

test("toolbar scenario renders the built-in and a custom toolbar", async ({
	page,
	editor,
}) => {
	await editor.goto("toolbar");

	await expect(page.getByTestId("toolbar-item-bold")).toBeVisible();
	await expect(
		page.locator('[data-testid="scenario-toolbar"] [role="toolbar"]'),
	).toHaveCount(2);
	await expect(editor.toolbar("Custom toolbar")).toBeVisible();
});

test("link security rejects unsafe schemes", async ({ page, editor }) => {
	await editor.goto("link-security");

	await page.getByTestId("security-url").fill("javascript:alert(1)");
	await expect(page.getByTestId("security-link-result")).toHaveText("false");

	await page.getByTestId("security-url").fill("https://example.com/docs");
	await expect(page.getByTestId("security-link-result")).toHaveText("true");
});
