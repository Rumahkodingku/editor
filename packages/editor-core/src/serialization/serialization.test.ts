import { expect, test } from "vitest";

import { EditorContentError } from "../errors";
import { jsonToHTML } from "./serialization";

test("renders an empty document to HTML", () => {
	expect(jsonToHTML({ type: "doc", content: [{ type: "paragraph" }] })).toBe(
		"<p></p>",
	);
});

test("renders text and marks", () => {
	const html = jsonToHTML({
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{ type: "text", text: "hello " },
					{ type: "text", text: "world", marks: [{ type: "bold" }] },
				],
			},
		],
	});

	expect(html).toBe("<p>hello <strong>world</strong></p>");
});

test("is deterministic for equivalent content", () => {
	const content = {
		type: "doc",
		content: [
			{
				type: "heading",
				attrs: { level: 2 },
				content: [{ type: "text", text: "Title" }],
			},
		],
	};

	expect(jsonToHTML(content)).toBe(jsonToHTML(content));
	expect(jsonToHTML(content)).toBe("<h2>Title</h2>");
});

test("throws for invalid content", () => {
	// biome-ignore lint/suspicious/noExplicitAny: intentional invalid input.
	expect(() => jsonToHTML({ type: "doc", content: "nope" } as any)).toThrow(
		EditorContentError,
	);
});
