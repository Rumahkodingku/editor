import { expect, test } from "vitest";

import { defaultLabels, resolveLabels } from "./labels";

test("provides default English labels", () => {
	expect(defaultLabels.bold).toBe("Bold");
	expect(defaultLabels.editor).toBeTruthy();
});

test("resolveLabels merges overrides on top of the defaults", () => {
	const labels = resolveLabels({ bold: "Tebal" });
	expect(labels.bold).toBe("Tebal");
	expect(labels.italic).toBe(defaultLabels.italic);
});

test("resolveLabels returns a fresh object and never mutates the defaults", () => {
	const labels = resolveLabels();
	expect(labels).not.toBe(defaultLabels);

	labels.bold = "changed";
	expect(defaultLabels.bold).toBe("Bold");
});
