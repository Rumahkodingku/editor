import { defineConfig } from "vitest/config";

// A test run must never resolve production builds of React: `React.act` (used by
// React Testing Library) only exists in development builds, and some developer
// shells export NODE_ENV=production. Vitest defaults to "test" only when unset.
process.env.NODE_ENV = "test";

export default defineConfig({
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.{ts,tsx}"],
		setupFiles: ["test/setup.ts"],
		typecheck: {
			enabled: true,
			include: ["src/**/*.test-d.ts"],
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			include: ["src/**"],
			exclude: ["**/*.test.*", "**/*.test-d.ts", "**/*.config.*", "**/*.css"],
		},
	},
});
