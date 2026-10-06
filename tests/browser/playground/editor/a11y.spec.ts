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

	/*
	 * Shell audits.
	 *
	 * The editor scans above are scoped to `.rk-editor*` so a violation in the
	 * surrounding application cannot mask — or be masked by — an editor one. The
	 * shell therefore gets its own whole-page scans. Nothing is excluded and no
	 * rule is disabled, because the shell is app code this repository owns.
	 */
	test("application shell scan is clean", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto("/#/content-inspector");
		await expect(page.getByTestId("scenario-content-inspector")).toBeVisible();

		await expectNoSevere(page, "body");
	});

	test("header controls scan is clean", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto("/#/basic");
		await expect(page.getByTestId("scenario-basic")).toBeVisible();

		await expectNoSevere(page, "header");
	});

	test("scenario navigation scan is clean", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto("/#/basic");
		await expect(page.getByTestId("scenario-nav")).toBeVisible();

		await expectNoSevere(page, '[data-testid="scenario-nav"]');
	});

	test("inspector panels scan is clean", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto("/#/content-inspector");
		await expect(page.getByTestId("state-panel")).toBeVisible();

		await expectNoSevere(page, '[data-testid="json-inspector"]');
		await expectNoSevere(page, '[data-testid="state-panel"]');
	});

	test("shell scan is clean in the dark theme", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/#/content-inspector");
		await expect(page.getByTestId("scenario-content-inspector")).toBeVisible();
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

		await expectNoSevere(page, "body");
	});
});
