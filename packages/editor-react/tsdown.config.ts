import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	fixedExtension: false,
	copy: [{ from: "src/styles.css", to: "dist" }],
});
