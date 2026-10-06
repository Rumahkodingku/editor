import { defineConfig, devices } from "@playwright/test";

const FUMADOCS_URL = "http://localhost:4000";
const PLAYGROUND_URL = "http://localhost:4100";

/**
 * Browser matrix.
 *
 * Chromium runs the full suite. Firefox and WebKit run only the critical editor
 * flows tagged `@cross-browser`, which keeps cross-browser validation
 * meaningful without duplicating the entire (paste/drag-drop/IME) suite.
 */
const CROSS_BROWSER = /@cross-browser/;

export default defineConfig({
	testDir: "tests/browser",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: [["list"], ["html", { open: "never" }]],
	outputDir: "test-results",
	use: {
		trace: "on-first-retry",
		// Failure-only artifacts: successful runs stay light (Phase 07 §07.67).
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "fumadocs-chromium",
			testMatch: "fumadocs/**/*.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: FUMADOCS_URL },
		},
		{
			name: "fumadocs-firefox",
			testMatch: "fumadocs/**/*.spec.ts",
			grep: CROSS_BROWSER,
			use: { ...devices["Desktop Firefox"], baseURL: FUMADOCS_URL },
		},
		{
			name: "fumadocs-webkit",
			testMatch: "fumadocs/**/*.spec.ts",
			grep: CROSS_BROWSER,
			use: { ...devices["Desktop Safari"], baseURL: FUMADOCS_URL },
		},
		{
			name: "playground-chromium",
			testMatch: "playground/**/*.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: PLAYGROUND_URL },
		},
		{
			name: "playground-firefox",
			testMatch: "playground/**/*.spec.ts",
			grep: CROSS_BROWSER,
			use: { ...devices["Desktop Firefox"], baseURL: PLAYGROUND_URL },
		},
		{
			name: "playground-webkit",
			testMatch: "playground/**/*.spec.ts",
			grep: CROSS_BROWSER,
			use: { ...devices["Desktop Safari"], baseURL: PLAYGROUND_URL },
		},
		{
			// Cross-app journey: documentation → Playground → documentation.
			// These specs address both origins explicitly, which is the single
			// documented exception to the suite's relative-`goto` convention; see
			// `tests/browser/README.md`.
			name: "integration-chromium",
			testMatch: "integration/**/*.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: FUMADOCS_URL },
		},
	],
	webServer: [
		{
			// Browser tests run against the production build of the docs app: the dev
			// server compiles on demand and races with itself under parallel workers
			// (and after a production build), which produced broken pages. The docs app
			// consumes the workspace editor packages, so build the dependency graph
			// (editor-core, editor-react, fumadocs) first.
			command:
				"pnpm exec turbo run build --filter=fumadocs && pnpm --filter fumadocs run start",
			url: FUMADOCS_URL,
			env: {
				PORT: "4000",
				// `NEXT_PUBLIC_*` is inlined at build time. The Playground CTA only
				// renders when this is set, so the integration specs require it.
				NEXT_PUBLIC_PLAYGROUND_URL: PLAYGROUND_URL,
			},
			reuseExistingServer: !process.env.CI,
			timeout: 240_000,
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
