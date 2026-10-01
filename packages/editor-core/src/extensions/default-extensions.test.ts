import { expect, test } from "vitest";

import { createDefaultExtensions } from "./default-extensions";

const names = (extensions: { name: string }[]) =>
	extensions.map((extension) => extension.name);

test("provides starter kit and the image upload extension by default", () => {
	const extensions = createDefaultExtensions();
	expect(names(extensions)).toContain("starterKit");
	expect(names(extensions)).toContain("imageUpload");
});

test("adds a placeholder only when requested", () => {
	expect(names(createDefaultExtensions())).not.toContain("placeholder");
	expect(names(createDefaultExtensions({ placeholder: "Write..." }))).toContain(
		"placeholder",
	);
});

test("accepts image upload configuration", () => {
	const extensions = createDefaultExtensions({
		upload: { upload: async () => ({ src: "https://example.com/a.png" }) },
	});

	expect(names(extensions)).toContain("imageUpload");
});

test("never produces duplicate extension names", () => {
	const extensions = createDefaultExtensions({
		placeholder: "Write...",
		upload: { upload: async () => ({ src: "https://example.com/a.png" }) },
	});

	const listed = names(extensions);
	expect(new Set(listed).size).toBe(listed.length);
});
