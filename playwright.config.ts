import { defineConfig, devices } from "@playwright/test";

const FUMADOCS_URL = "http://localhost:4000";
const PLAYGROUND_URL = "http://localhost:4100";

export default defineConfig({
	testDir: "tests/browser",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: [["list"], ["html", { open: "never" }]],
	outputDir: "test-results",
	use: {
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "fumadocs",
			testMatch: "fumadocs/**/*.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: FUMADOCS_URL },
		},
		{
			name: "playground",
			testMatch: "playground/**/*.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: PLAYGROUND_URL },
		},
	],
	webServer: [
		{
			// Browser tests run against the production build of the docs app: the dev
			// server compiles on demand and races with itself under parallel workers
			// (and after a production build), which produced broken pages.
			command:
				"pnpm --filter fumadocs run build && pnpm --filter fumadocs run start",
			url: FUMADOCS_URL,
			env: { PORT: "4000" },
			reuseExistingServer: !process.env.CI,
			timeout: 180_000,
		},
		{
			// The playground consumes the built workspace packages, so build the
			// dependency graph (editor-core, editor-react, playground) first.
			command:
				"pnpm exec turbo run build --filter=playground && pnpm --filter playground run preview",
			url: PLAYGROUND_URL,
			reuseExistingServer: !process.env.CI,
			timeout: 180_000,
		},
	],
});
