import { expect, test } from "../fixtures";

/**
 * Responsive validation for the application shell.
 *
 * Two concerns are separated on purpose: the editor's own usability at each
 * size (below), and the shell's layout behaviour — sidebar versus drawer, and
 * horizontal overflow.
 *
 * Viewport math is Chromium-only, matching the other specs that assert on
 * geometry.
 */
const viewports = [
	{ name: "wide desktop", width: 1440, height: 900 },
	{ name: "desktop", width: 1280, height: 800 },
	{ name: "small desktop", width: 1024, height: 768 },
	{ name: "tablet", width: 834, height: 1112 },
	{ name: "tablet portrait", width: 768, height: 1024 },
	{ name: "large mobile", width: 412, height: 915 },
	{ name: "mobile", width: 390, height: 844 },
	{ name: "small mobile", width: 375, height: 667 },
];

/** Tailwind's `lg`, above which the sidebar is persistent. */
const SIDEBAR_BREAKPOINT = 1024;

test.describe("responsive viewports", () => {
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

		test(`shell does not overflow at the ${viewport.name} viewport @chromium-only`, async ({
			page,
		}) => {
			await page.setViewportSize({
				width: viewport.width,
				height: viewport.height,
			});
			await page.goto("/#/content-inspector");
			await expect(
				page.getByTestId("scenario-content-inspector"),
			).toBeVisible();

			// The shell must never scroll sideways. A one-pixel tolerance absorbs
			// sub-pixel rounding.
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
			expect(overflow).toBeLessThanOrEqual(1);

			// Long, unbroken output must not widen the page either.
			const code = page.getByTestId("json-output");
			await expect(code).toBeVisible();
			const codeBox = await code.boundingBox();
			expect(codeBox).not.toBeNull();
			if (codeBox) {
				expect(codeBox.x + codeBox.width).toBeLessThanOrEqual(
					viewport.width + 1,
				);
			}
		});
	}

	test(`sidebar is persistent at or above ${SIDEBAR_BREAKPOINT}px and collapses below it @chromium-only`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: SIDEBAR_BREAKPOINT, height: 800 });
		await page.goto("/#/basic");
		await expect(
			page.getByRole("navigation", { name: "Playground scenarios" }),
		).toBeVisible();
		await expect(page.getByTestId("nav-toggle")).toHaveCount(0);

		await page.setViewportSize({ width: SIDEBAR_BREAKPOINT - 1, height: 800 });
		await expect(page.getByTestId("nav-toggle")).toBeVisible();
		await expect(
			page.getByRole("navigation", { name: "Playground scenarios" }),
		).toHaveCount(0);
	});

	test("the mobile drawer opens, navigates, and closes @chromium-only", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/#/basic");
		await expect(page.getByTestId("scenario-basic")).toBeVisible();

		const toggle = page.getByTestId("nav-toggle");
		await expect(toggle).toHaveAttribute("aria-expanded", "false");
		await expect(toggle).toHaveAttribute(
			"aria-controls",
			"playground-scenario-nav",
		);

		await toggle.click();

		const drawer = page.locator("#playground-scenario-nav");
		await expect(drawer).toBeVisible();
		await expect(toggle).toHaveAttribute("aria-expanded", "true");

		// Exactly one navigation exists in the document, so ids stay unique.
		await expect(
			page.getByRole("navigation", { name: "Playground scenarios" }),
		).toHaveCount(1);

		await page.getByTestId("scenario-nav-controlled").click();

		// Choosing a scenario closes the drawer and applies the deep link.
		await expect(drawer).toBeHidden();
		await expect(toggle).toHaveAttribute("aria-expanded", "false");
		await expect(page).toHaveURL(/#\/controlled$/);
		await expect(page.getByTestId("scenario-controlled")).toBeVisible();
	});

	test("the mobile drawer closes on Escape and returns focus @chromium-only", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/#/basic");

		const toggle = page.getByTestId("nav-toggle");
		await toggle.click();
		await expect(page.locator("#playground-scenario-nav")).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(page.locator("#playground-scenario-nav")).toBeHidden();
		await expect(toggle).toBeFocused();
	});

	test("the mobile drawer closes with its close button @chromium-only", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/#/basic");

		await page.getByTestId("nav-toggle").click();
		await expect(page.locator("#playground-scenario-nav")).toBeVisible();

		await page.getByTestId("nav-close").click();
		await expect(page.locator("#playground-scenario-nav")).toBeHidden();
		await expect(page.getByTestId("scenario-basic")).toBeVisible();
	});

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
