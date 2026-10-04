import { expect, test } from "@playwright/test";

test("hero renders the real editor preview @cross-browser", async ({
	page,
}) => {
	await page.goto("/");

	await expect(page.locator(".rk-editor__surface").first()).toBeVisible();
});

test("primary call to action points at the documentation", async ({ page }) => {
	await page.goto("/");

	await expect(page.locator(".rk-btn-primary").first()).toHaveAttribute(
		"href",
		"/docs",
	);
});

test("landing sections are present", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { level: 2, name: "Built for developers." }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", {
			level: 2,
			name: "Built as an editor ecosystem.",
		}),
	).toBeVisible();
	await expect(
		page.getByRole("heading", {
			level: 2,
			name: "Write less editor infrastructure.",
		}),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { level: 2, name: "Ready to build?" }),
	).toBeVisible();
	await expect(
		page.getByText("Reusable rich-text editing infrastructure."),
	).toBeVisible();
});

test("dark mode follows the system preference", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/");

	await expect(page.locator("html")).toHaveClass(/dark/);
});

test("landing page does not overflow horizontally on mobile", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 720 });
	await page.goto("/");

	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "A modern rich-text editor for the web.",
		}),
	).toBeVisible();

	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBeLessThanOrEqual(1);
});

test("landing page has no uncaught errors", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));

	await page.goto("/");
	await expect(page.locator(".rk-editor__surface").first()).toBeVisible();

	expect(errors).toEqual([]);
});
