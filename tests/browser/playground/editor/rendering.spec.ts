import { expect, test } from "../fixtures";

test.describe("editor rendering", () => {
	test("renders the editor, toolbar, and initial content @cross-browser", async ({
		page,
		editor,
	}) => {
		await editor.goto("basic");

		const root = page.locator('[data-testid="scenario-basic"] .rk-editor');
		await expect(root).toBeVisible();

		const toolbar = editor.toolbar();
		await expect(toolbar).toBeVisible();

		const surface = editor.surface("basic");
		await expect(surface).toBeVisible();
		await expect(surface).toHaveRole("textbox");
		await expect(surface).toHaveAttribute("aria-multiline", "true");
		await expect(surface).toHaveAttribute("aria-label", "Rich text editor");

		// Initial JSON content is rendered into the surface.
		await expect(surface).toContainText("Playground fixture");
		await expect(surface.getByRole("heading", { level: 2 })).toHaveText(
			"Playground fixture",
		);
	});

	test("shows the placeholder while the document is empty", async ({
		page,
		editor,
	}) => {
		await editor.goto("configuration");

		// The configuration scenario starts from an empty document.
		const surface = editor.surface("configuration");
		await expect(surface).toBeVisible();

		const placeholder = page.locator(
			'[data-testid="scenario-configuration"] [data-placeholder="Type something…"]',
		);
		await expect(placeholder).toHaveCount(1);
	});

	test("exposes the default toolbar controls", async ({ editor }) => {
		await editor.goto("basic");
		const toolbar = editor.toolbar();

		for (const name of [
			"Bold",
			"Italic",
			"Underline",
			"Heading 1",
			"Heading 6",
			"Bullet list",
			"Numbered list",
			"Blockquote",
			"Code block",
			"Horizontal rule",
			"Undo",
			"Redo",
			"Link",
			"Image",
			"Alt text",
		]) {
			await expect(toolbar.getByRole("button", { name })).toBeVisible();
		}
	});
});
