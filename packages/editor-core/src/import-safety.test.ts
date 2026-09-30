import { expect, test } from "vitest";

test("imports without touching browser globals", async () => {
	expect("window" in globalThis).toBe(false);
	expect("document" in globalThis).toBe(false);

	const mod = await import("./index");

	expect(mod.EDITOR_CORE_PACKAGE_NAME).toBe("@rumahkodingku/editor-core");
});
