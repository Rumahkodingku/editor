import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

import { expect, test } from "../fixtures";

/** Fails when axe reports a serious or critical violation. */
async function expectNoSevere(page: Page, include: string) {
	const results = await new AxeBuilder({ page }).include(include).analyze();
	const severe = results.violations.filter(
		(violation) =>
			violation.impact === "serious" || violation.impact === "critical",
	);

	expect(
		severe.map((violation) => `${violation.id} (${violation.impact})`),
	).toEqual([]);
}

const EDITOR = '[data-testid="scenario-basic"] .rk-editor';

/**
 * axe-core audits of the editor surfaces. Critical and serious violations must
 * be zero; these assertions are the accessibility CI gate.
 */
test.describe("axe-core accessibility", () => {
	test("global editor scan is clean", async ({ editor }) => {
		await editor.goto("basic");
		await expectNoSevere(editor.page, EDITOR);
	});

	test("toolbar scan is clean", async ({ editor }) => {
		await editor.goto("basic");
		await expectNoSevere(
			editor.page,
			'[data-testid="scenario-basic"] .rk-editor__toolbar',
		);
	});

	test("link dialog scan is clean", async ({ page, editor }) => {
		await editor.goto("content-inspector");
		await editor.surface("content-inspector").press("ControlOrMeta+a");
		await editor.toolbar().getByRole("button", { name: "Link" }).click();
		await expect(page.getByRole("dialog", { name: "Link" })).toBeVisible();

		await expectNoSevere(page, ".rk-editor__popover");
	});

	test("image alt dialog scan is clean", async ({ page, editor }) => {
		await editor.goto("image-upload");
		const toolbar = editor.toolbar();
		const surface = editor.surface("image-upload");

		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			toolbar.getByRole("button", { name: "Image" }).click(),
		]);
		await chooser.setFiles({
			name: "mock.png",
			mimeType: "image/png",
			buffer: Buffer.from("playground-mock-image"),
		});
		await surface.locator("img").first().click();
		await toolbar.getByRole("button", { name: "Alt text" }).click();
		await expect(page.getByRole("dialog", { name: "Alt text" })).toBeVisible();

		await expectNoSevere(page, ".rk-editor__popover");
	});

	test("read-only state scan is clean", async ({ editor }) => {
		await editor.goto("read-only");
		await expectNoSevere(
			editor.page,
			'[data-testid="scenario-read-only"] .rk-editor',
		);
	});

	test("disabled state scan is clean", async ({ editor }) => {
		await editor.goto("disabled");
		await expectNoSevere(
			editor.page,
			'[data-testid="scenario-disabled"] .rk-editor',
		);
	});
});
