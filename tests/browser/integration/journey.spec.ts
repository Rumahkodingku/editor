import { expect, test } from "@playwright/test";

import {
	DEEP_LINK_CASES,
	FUMADOCS_ORIGIN,
	PLAYGROUND_ORIGIN,
} from "./fixtures";

/**
 * Documentation → Playground → Documentation.
 *
 * The CTA is environment-gated (`NEXT_PUBLIC_PLAYGROUND_URL`), and this project
 * builds the documentation app with it set — see `playwright.config.ts`. If the
 * CTA is ever made unconditional, the first assertion below is the one that
 * documents it.
 */
test.describe("Fumadocs ↔ Playground journey", () => {
	for (const { docsPath, scenario } of DEEP_LINK_CASES) {
		test(`documentation CTA for ${docsPath} opens the ${scenario} scenario`, async ({
			page,
		}) => {
			await page.goto(docsPath);

			const cta = page.getByTestId("try-in-playground");
			await expect(cta).toBeVisible();
			await expect(cta).toHaveAttribute(
				"href",
				`${PLAYGROUND_ORIGIN}/#/${scenario}`,
			);

			/*
			 * The waiter is registered before the click. The CTA opens a new tab,
			 * so awaiting the click first can miss the event entirely — which is
			 * how this spec was originally flaky on a cold server.
			 */
			const [playground] = await Promise.all([
				page.context().waitForEvent("page"),
				cta.click(),
			]);

			// The Playground opens in a new tab, leaving the docs page in place.
			await playground.waitForLoadState();
			await expect(playground).toHaveURL(`${PLAYGROUND_ORIGIN}/#/${scenario}`);
			await expect(
				playground.getByTestId(`scenario-${scenario}`),
			).toBeVisible();
			await expect(
				playground.locator(`[data-testid="scenario-${scenario}"] .rk-editor`),
			).toBeVisible();
		});
	}

	test("the playground header links back to the documentation", async ({
		page,
	}) => {
		await page.goto(`${PLAYGROUND_ORIGIN}/#/basic`);

		const docsLink = page.getByTestId("docs-link");
		await expect(docsLink).toBeVisible();
		await expect(docsLink).toHaveAttribute("href", `${FUMADOCS_ORIGIN}/docs`);

		// Registered before the click, for the same reason as above.
		const [docs] = await Promise.all([
			page.context().waitForEvent("page"),
			docsLink.click(),
		]);
		await docs.waitForLoadState();
		await expect(docs).toHaveURL(`${FUMADOCS_ORIGIN}/docs`);
		await expect(
			docs.getByRole("heading", { level: 1, name: "Introduction" }),
		).toBeVisible();
	});
});
