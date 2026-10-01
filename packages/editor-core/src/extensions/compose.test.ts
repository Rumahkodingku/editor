import { Extension } from "@tiptap/core";
import { expect, test } from "vitest";

import { EditorConfigError } from "../errors";
import { composeExtensions } from "./compose";

const ext = (name: string) => Extension.create({ name });

test("appends non-conflicting extensions, base first", () => {
	const base = [ext("a"), ext("b")];
	const custom = [ext("c")];

	const result = composeExtensions(base, custom);

	expect(result.map((item) => item.name)).toEqual(["a", "b", "c"]);
});

test("lets a custom extension override a base extension by name", () => {
	const baseExtension = ext("link");
	const customExtension = ext("link");
	const base = [ext("paragraph"), baseExtension];
	const custom = [customExtension];

	const result = composeExtensions(base, custom);

	expect(result).toHaveLength(2);
	expect(result[1]).toBe(customExtension);
});

test("strict mode throws on duplicate names", () => {
	expect(() =>
		composeExtensions([ext("link")], [ext("link")], { mode: "strict" }),
	).toThrow(EditorConfigError);
});

test("strict mode allows non-conflicting extensions", () => {
	expect(() =>
		composeExtensions([ext("a")], [ext("b")], { mode: "strict" }),
	).not.toThrow();
});

test("does not mutate the input arrays", () => {
	const base = [ext("a")];
	const custom = [ext("a"), ext("b")];

	composeExtensions(base, custom);

	expect(base).toHaveLength(1);
	expect(custom).toHaveLength(2);
});

test("supports an empty base", () => {
	const custom = [ext("a"), ext("b")];
	expect(composeExtensions([], custom).map((item) => item.name)).toEqual([
		"a",
		"b",
	]);
});
