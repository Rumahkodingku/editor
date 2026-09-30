import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		typecheck: {
			enabled: true,
			include: ["src/**/*.test-d.ts"],
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			include: ["src/**"],
			exclude: ["**/*.test.*", "**/*.test-d.ts", "**/*.config.*"],
		},
	},
});
