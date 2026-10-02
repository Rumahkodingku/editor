import { expect, test } from "@playwright/test";

/** A tiny in-memory file used by the mock upload scenarios. */
const IMAGE_FILE = {
	name: "mock.png",
	mimeType: "image/png",
	buffer: Buffer.from("playground-mock-image"),
};

test("typing updates the editor and the serialized output", async ({
	page,
}) => {
	await page.goto("/#/content-inspector");

	const surface = page.locator(
		'[data-testid="scenario-content-inspector"] .rk-editor__surface',
	);
	await surface.click();
	await page.keyboard.type("Hello browser");

	await expect(page.getByTestId("json-output")).toContainText("Hello browser");
	await expect(page.getByTestId("html-output")).toContainText("Hello browser");
});

test("content can be cleared and reset", async ({ page }) => {
	await page.goto("/#/content-inspector");

	await page.getByTestId("content-clear").click();
	await expect(page.getByTestId("json-output")).not.toContainText(
		"Playground fixture",
	);

	await page.getByTestId("content-reset").click();
	await expect(page.getByTestId("json-output")).toContainText(
		"Playground fixture",
	);
});

test("read-only scenario blocks typing", async ({ page }) => {
	await page.goto("/#/read-only");

	const surface = page.locator(
		'[data-testid="scenario-read-only"] .rk-editor__surface',
	);
	await expect(surface).toHaveAttribute("aria-readonly", "true");

	await surface.click();
	await page.keyboard.type("nope");
	await expect(surface).not.toContainText("nope");
});

test("configuration toggles the disabled state", async ({ page }) => {
	await page.goto("/#/configuration");

	await page.getByTestId("config-disabled").check();

	await expect(page.getByTestId("state-disabled")).toHaveText("true");
	await expect(page.locator('.rk-editor[data-disabled="true"]')).toBeVisible();
});

test("controlled mode propagates changes to the parent state", async ({
	page,
}) => {
	await page.goto("/#/controlled");

	const surface = page.locator(
		'[data-testid="scenario-controlled"] .rk-editor__surface',
	);
	await surface.click();
	await page.keyboard.type("XYZ");

	await expect(page.getByTestId("json-output")).toContainText("XYZ");
});

test("toolbar scenario renders the built-in and a custom toolbar", async ({
	page,
}) => {
	await page.goto("/#/toolbar");

	await expect(page.getByTestId("toolbar-item-bold")).toBeVisible();
	await expect(
		page.locator('[data-testid="scenario-toolbar"] [role="toolbar"]'),
	).toHaveCount(2);
});

test("custom extension mark can be applied", async ({ page }) => {
	await page.goto("/#/custom-extensions");

	const surface = page.locator(
		'[data-testid="scenario-custom-extensions"] .rk-editor__surface',
	);
	await surface.click();
	await page.keyboard.press("ControlOrMeta+a");
	await page.getByTestId("toggle-highlight").click();

	// The mark is applied per text node, so several `<mark>` elements appear.
	await expect(surface.locator("mark").first()).toBeVisible();

	await page.getByTestId("toggle-highlight").click();
	await expect(surface.locator("mark")).toHaveCount(0);
});

test("mock upload inserts an image", async ({ page }) => {
	await page.goto("/#/image-upload");

	await page.getByTestId("upload-input").setInputFiles(IMAGE_FILE);

	await expect(page.getByTestId("upload-status")).toContainText("done");
	await expect(
		page.locator(
			'[data-testid="scenario-image-upload"] .rk-editor__surface img',
		),
	).toHaveAttribute("src", /^data:image\/svg\+xml/);
});

test("failing upload reports an error and removes the placeholder", async ({
	page,
}) => {
	await page.goto("/#/upload-error");

	await page.getByTestId("upload-error-input").setInputFiles(IMAGE_FILE);

	await expect(page.getByTestId("upload-error-status")).toContainText("error");
	await expect(page.getByTestId("upload-error-message")).toContainText(
		"Mock upload failed on purpose.",
	);
	await expect(
		page.locator(
			'[data-testid="scenario-upload-error"] .rk-editor__surface img',
		),
	).toHaveCount(0);
});

test("link security rejects unsafe schemes", async ({ page }) => {
	await page.goto("/#/link-security");

	await page.getByTestId("security-url").fill("javascript:alert(1)");
	await expect(page.getByTestId("security-link-result")).toHaveText("false");

	await page.getByTestId("security-url").fill("https://example.com/docs");
	await expect(page.getByTestId("security-link-result")).toHaveText("true");
});
