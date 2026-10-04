import {
	test as base,
	expect,
	type Locator,
	type Page,
} from "@playwright/test";

/**
 * Selectors and navigation helpers shared by the playground editor specs.
 *
 * The playground is a hash-routed SPA: every scenario is deep-linkable via
 * `#/<scenarioId>`. Scenario roots expose `data-testid="scenario-<id>"`
 * (application-level hook); everything inside the editor is located through
 * accessible roles/names and the stable `rk-*` classes so the published package
 * needs no test-only attributes (Phase 07 conventions).
 */
export type EditorHelpers = {
	/** The page under test. */
	page: Page;
	/** Navigate to a scenario by id and wait until it has rendered. */
	goto: (id: string) => Promise<void>;
	/** Scenario root element. */
	scenario: (id: string) => Locator;
	/** ProseMirror editing surface inside a scenario. */
	surface: (id: string) => Locator;
	/** The editor toolbar, optionally by accessible name within a scope. */
	toolbar: (name?: string, scope?: Page | Locator) => Locator;
};

export const test = base.extend<{ editor: EditorHelpers }>({
	editor: async ({ page }, use) => {
		const helpers: EditorHelpers = {
			page,
			goto: async (id) => {
				await page.goto(`/#/${id}`);
				await expect(page.getByTestId(`scenario-${id}`)).toBeVisible();
			},
			scenario: (id) => page.getByTestId(`scenario-${id}`),
			surface: (id) =>
				page.locator(`[data-testid="scenario-${id}"] .rk-editor__surface`),
			toolbar: (name, scope) =>
				(scope ?? page).getByRole("toolbar", {
					name: name ?? "Rich text editor",
				}),
		};

		await use(helpers);
	},
});

export { expect };
