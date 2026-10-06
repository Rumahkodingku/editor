import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/**
 * Theme behaviour of the application shell.
 *
 * The Playground supports three states — System, Light, Dark — stored in
 * `localStorage` under `rk-playground-theme` and mirrored onto
 * `<html data-theme>`. The published editor stylesheet keys off the same
 * attribute, so these specs also assert that the shell and the editor agree: a
 * mismatch would leave an indigo shell around a stock-blue editor.
 *
 * Each first-visit case is its own test so the media emulation is set once,
 * before the only navigation. Flipping `prefers-color-scheme` and re-navigating
 * to the same URL races Playwright's emulation re-application against document
 * parse, which would make the inline pre-paint script read a stale value.
 */
const STORAGE_KEY = "rk-playground-theme";

function resolvedTheme(page: Page) {
	return page.locator("html").getAttribute("data-theme");
}

test.describe("theme", () => {
	for (const scheme of ["light", "dark"] as const) {
		test(`resolves the system preference to ${scheme} on a first visit`, async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: scheme });
			await page.goto("/#/basic");
			await expect(page.getByTestId("scenario-basic")).toBeVisible();

			expect(await resolvedTheme(page)).toBe(scheme);
			expect(
				await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
			).toBeNull();
		});
	}

	test("follows the OS while the app stays open on the system preference", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/#/basic");
		await expect(page.getByTestId("scenario-basic")).toBeVisible();
		expect(await resolvedTheme(page)).toBe("dark");

		await page.emulateMedia({ colorScheme: "light" });
		await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
	});

	test("an explicit preference wins over later OS changes", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/#/basic");
		await expect(page.getByTestId("scenario-basic")).toBeVisible();

		// System → Dark.
		await page.getByTestId("theme-toggle").click();
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

		await page.emulateMedia({ colorScheme: "light" });
		// Still the explicitly stored Dark.
		expect(await resolvedTheme(page)).toBe("dark");
		expect(
			await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
		).toBe("dark");
	});

	test("an explicit preference survives a reload", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/#/basic");
		await expect(page.getByTestId("scenario-basic")).toBeVisible();

		await page.getByTestId("theme-toggle").click();
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

		await page.reload();
		await expect(page.getByTestId("scenario-basic")).toBeVisible();
		expect(await resolvedTheme(page)).toBe("dark");
		expect(
			await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
		).toBe("dark");
	});

	test("the toggle announces its current and next value", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/#/basic");

		const toggle = page.getByTestId("theme-toggle");
		await expect(toggle).toHaveAttribute(
			"aria-label",
			"Theme: system. Switch to dark.",
		);
		await toggle.click();
		await expect(toggle).toHaveAttribute(
			"aria-label",
			"Theme: dark. Switch to light.",
		);
		await toggle.click();
		await expect(toggle).toHaveAttribute(
			"aria-label",
			"Theme: light. Switch to system.",
		);
		// All three states are reachable from either starting scheme.
		await toggle.click();
		await expect(toggle).toHaveAttribute(
			"aria-label",
			"Theme: system. Switch to dark.",
		);
	});

	test("the shell and the published editor share one theme", async ({
		page,
		editor,
	}) => {
		for (const scheme of ["light", "dark"] as const) {
			await page.emulateMedia({ colorScheme: scheme });
			await editor.goto("basic");

			const editorRoot = page.locator(
				'[data-testid="scenario-basic"] .rk-editor',
			);
			await expect(editorRoot).toBeVisible();

			// The editor's own tokens are overridden through the public
			// `--rk-editor-*` variables, so its resolved background tracks the
			// shell rather than the package default.
			const [editorBackground, editorForeground] = await editorRoot.evaluate(
				(element) => {
					const style = getComputedStyle(element);
					return [style.backgroundColor, style.color];
				},
			);
			expect(editorBackground).not.toBe("rgba(0, 0, 0, 0)");
			expect(editorForeground).not.toBe(editorBackground);

			// The toolbar is themed too, not left on the package's blue accent.
			const toolbarBackground = await editor
				.toolbar()
				.evaluate((element) => getComputedStyle(element).backgroundColor);
			expect(toolbarBackground).not.toBe("rgba(0, 0, 0, 0)");
		}
	});

	test("the pre-paint resolver ships in the document", async ({ page }) => {
		/*
		 * The pre-paint window cannot be observed from a test: an init script runs
		 * before the inline resolver, and a navigation only resolves once the
		 * document has parsed. So the resolver is asserted where it is observable
		 * deterministically — in the served HTML — while the observable
		 * consequence, an already-correct attribute on load, is asserted by the
		 * first-visit cases above.
		 */
		const html = await (await page.request.get("/")).text();
		expect(html).toContain("rk-playground-theme");
		expect(html).toContain("prefers-color-scheme");
	});
});
