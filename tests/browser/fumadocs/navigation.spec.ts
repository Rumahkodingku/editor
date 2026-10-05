import { expect, type Locator, test } from "@playwright/test";

/**
 * Sidebar items rendered from the Fumadocs page tree.
 *
 * Collapsible sections are the only expandable buttons inside `#nd-sidebar`:
 * the search trigger and the language switcher open a dialog
 * (`aria-haspopup`), while the collapse trigger owns the sidebar
 * (`aria-controls`).
 */
const SIDEBAR = "#nd-sidebar";
const SIDEBAR_SECTION_TRIGGER =
	"button[aria-expanded]:not([aria-haspopup]):not([aria-controls])";
const SIDEBAR_SECTIONS = `${SIDEBAR} ${SIDEBAR_SECTION_TRIGGER}`;

const TOP_LEVEL_SECTIONS = [
	"Getting Started",
	"Fundamentals",
	"Features",
	"Guides",
	"Accessibility",
	"API Reference",
	"Examples",
];

/**
 * Open a collapsed sidebar section by its visible label.
 *
 * The sidebar is a client component rendered from server HTML, so the click is
 * retried until React has hydrated and can handle it.
 */
async function expandSection(sidebar: Locator, name: string) {
	const trigger = sidebar.getByRole("button", { name, exact: true });

	await expect(trigger).toHaveAttribute("aria-expanded", "false");

	await expect(async () => {
		await trigger.click();
		await expect(trigger).toHaveAttribute("aria-expanded", "true");
	}).toPass({ timeout: 15_000 });
}

test("quick start page renders @cross-browser", async ({ page }) => {
	await page.goto("/docs/getting-started/quick-start");

	await expect(
		page.getByRole("heading", { level: 1, name: "Quick Start" }),
	).toBeVisible();
});

test("API reference page renders", async ({ page }) => {
	await page.goto("/docs/api/react");

	await expect(
		page.getByRole("heading", { level: 1, name: "React API" }),
	).toBeVisible();
});

test("examples embed a live editor @cross-browser", async ({ page }) => {
	await page.goto("/docs/examples/basic-editor");

	await expect(page.locator(".rk-editor__surface").first()).toBeVisible();
});

test("internal links keep the active locale", async ({ page }) => {
	await page.goto("/id/docs");

	await page
		.locator('a[href="/id/docs/getting-started/installation"]')
		.first()
		.click();

	await expect(page).toHaveURL(/\/id\/docs\/getting-started\/installation/);
});

test("search index returns documentation results", async ({ request }) => {
	const response = await request.get(
		"/api/search?query=installation&locale=en",
	);

	expect(response.ok()).toBeTruthy();

	const results = await response.json();
	expect(Array.isArray(results)).toBeTruthy();
	expect(results.length).toBeGreaterThan(0);

	const urls = results.map((result: { url: string }) => result.url);
	expect(urls).toContain("/docs/getting-started/installation");
	expect(urls.join(" ")).not.toContain("/docs/introduction/");
});

test("sidebar has exactly one Introduction entry @cross-browser", async ({
	page,
}) => {
	await page.goto("/docs");

	const introduction = page
		.locator(SIDEBAR)
		.getByRole("link", { name: "Introduction", exact: true });

	await expect(introduction).toHaveCount(1);
	await expect(introduction).toHaveAttribute("href", "/docs");
});

test("sidebar keeps the intended top-level order @cross-browser", async ({
	page,
}) => {
	await page.goto("/docs");

	await expect(page.locator(SIDEBAR_SECTIONS)).toHaveText(TOP_LEVEL_SECTIONS);

	// The canonical Introduction is the root `/docs` page, so it is a page entry
	// above the first section instead of a duplicated section label.
	const introductionFirst = await page
		.locator(SIDEBAR)
		.evaluate((sidebar, sectionSelector) => {
			const introduction = [...sidebar.querySelectorAll("a")].find(
				(link) => link.textContent?.trim() === "Introduction",
			);
			const section = sidebar.querySelector(sectionSelector);

			if (!introduction || !section) return false;

			return Boolean(
				introduction.compareDocumentPosition(section) &
					Node.DOCUMENT_POSITION_FOLLOWING,
			);
		}, SIDEBAR_SECTION_TRIGGER);

	expect(introductionFirst).toBe(true);
});

test("Getting Started expands to its onboarding pages @cross-browser", async ({
	page,
}) => {
	await page.goto("/docs");

	const sidebar = page.locator(SIDEBAR);
	await expandSection(sidebar, "Getting Started");

	await expect(
		sidebar.getByRole("link", { name: "Installation", exact: true }),
	).toHaveAttribute("href", "/docs/getting-started/installation");
	await expect(
		sidebar.getByRole("link", { name: "Quick Start", exact: true }),
	).toHaveAttribute("href", "/docs/getting-started/quick-start");
});

test("active sidebar entry marks the current page @cross-browser", async ({
	page,
}) => {
	await page.goto("/docs/getting-started/quick-start");

	const sidebar = page.locator(SIDEBAR);

	await expect(
		sidebar.getByRole("link", { name: "Quick Start", exact: true }),
	).toHaveAttribute("data-active", "true");
	await expect(
		sidebar.getByRole("link", { name: "Introduction", exact: true }),
	).toHaveAttribute("data-active", "false");
});

test("Indonesian navigation groups onboarding under Memulai @cross-browser", async ({
	page,
}) => {
	await page.goto("/id/docs");

	const sidebar = page.locator(SIDEBAR);
	const introduction = sidebar.getByRole("link", {
		name: "Pengantar",
		exact: true,
	});

	await expect(introduction).toHaveCount(1);

	await expandSection(sidebar, "Memulai");

	await expect(
		sidebar.getByRole("link", { name: "Instalasi", exact: true }),
	).toHaveAttribute("href", "/id/docs/getting-started/installation");
	await expect(
		sidebar.getByRole("link", { name: "Mulai Cepat", exact: true }),
	).toHaveAttribute("href", "/id/docs/getting-started/quick-start");
});
