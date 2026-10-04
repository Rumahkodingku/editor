import { expect, test } from "../fixtures";

/** Small in-memory PNG used by the mock upload scenario. */
const IMAGE_FILE = {
	name: "mock.png",
	mimeType: "image/png",
	buffer: Buffer.from("playground-mock-image"),
};

const INVALID_FILE = {
	name: "notes.txt",
	mimeType: "text/plain",
	buffer: Buffer.from("not an image"),
};

/**
 * Image control: toolbar insertion, progress, failure, validation, alt text.
 */
test.describe("image control", () => {
	test("inserts an image through the toolbar control @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("image-upload");
		const toolbar = editor.toolbar();
		const surface = editor.surface("image-upload");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles(IMAGE_FILE);

		await expect(surface.locator("img")).toHaveAttribute(
			"src",
			/^data:image\/svg\+xml/,
		);
	});

	test("reports upload progress and completion", async ({ page, editor }) => {
		await editor.goto("image-upload");
		const toolbar = editor.toolbar();
		const surface = editor.surface("image-upload");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles(IMAGE_FILE);

		const progress = toolbar.getByRole("status");
		await expect(progress).toBeVisible();
		await expect(progress).toHaveText(/%/);

		await expect(surface.locator("img")).toHaveAttribute(
			"src",
			/^data:image\/svg\+xml/,
		);
		await expect(progress).toBeHidden();
	});

	test("reports upload failure and removes the placeholder @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("upload-error");
		const toolbar = editor.toolbar();
		const surface = editor.surface("upload-error");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles(IMAGE_FILE);

		await expect(toolbar.getByRole("alert")).toContainText(
			"Mock upload failed on purpose.",
		);
		await expect(surface.locator("img")).toHaveCount(0);

		// The editor stays usable after a failed upload.
		await surface.click();
		await page.keyboard.type("still editable");
		await expect(surface).toContainText("still editable");
	});

	test("rejects an invalid image file", async ({ page, editor }) => {
		await editor.goto("image-upload");
		const toolbar = editor.toolbar();
		const surface = editor.surface("image-upload");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles(INVALID_FILE);

		await expect(toolbar.getByRole("alert")).toContainText(
			"Unsupported image type",
		);
		await expect(surface.locator("img")).toHaveCount(0);
	});

	test("edits image alt text @cross-browser", async ({ page, editor }) => {
		await editor.goto("image-upload");
		const toolbar = editor.toolbar();
		const surface = editor.surface("image-upload");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles(IMAGE_FILE);
		const image = surface.locator("img").first();
		await expect(image).toBeVisible();

		await image.click();
		const altButton = toolbar.getByRole("button", { name: "Alt text" });
		await expect(altButton).toBeEnabled();
		await altButton.click();

		const dialog = page.getByRole("dialog", { name: "Alt text" });
		await expect(dialog).toBeVisible();
		await dialog.getByRole("textbox").fill("A mock image");
		await dialog.getByRole("button", { name: "Apply" }).click();

		await expect(dialog).toBeHidden();
		await expect(surface.locator("img").first()).toHaveAttribute(
			"alt",
			"A mock image",
		);
	});

	test("Escape closes the alt dialog and restores editor focus", async ({
		page,
		editor,
	}) => {
		await editor.goto("image-upload");
		const toolbar = editor.toolbar();
		const surface = editor.surface("image-upload");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles(IMAGE_FILE);
		const image = surface.locator("img").first();
		await expect(image).toBeVisible();
		await image.click();

		await toolbar.getByRole("button", { name: "Alt text" }).click();
		const dialog = page.getByRole("dialog", { name: "Alt text" });
		await expect(dialog).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
		await expect(surface).toBeFocused();
	});
});
