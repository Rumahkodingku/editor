import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4000";

export default defineConfig({
	testDir: "tests/browser",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: [["list"], ["html", { open: "never" }]],
	outputDir: "test-results",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		// Browser tests run against the production build of the docs app: the dev
		// server compiles on demand and races with itself under parallel workers
		// (and after a production build), which produced broken pages.
		command:
			"pnpm --filter fumadocs run build && pnpm --filter fumadocs run start",
		url: baseURL,
		env: { PORT: "4000" },
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
