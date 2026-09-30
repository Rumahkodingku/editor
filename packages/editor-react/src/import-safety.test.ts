// @vitest-environment node
import { expect, test } from "vitest";

test("imports editor-react without browser globals", async () => {
	expect("window" in globalThis).toBe(false);

	const mod = await import("./index");

	expect(mod.EDITOR_REACT_PACKAGE_NAME).toBe("@rumahkodingku/editor-react");
});
