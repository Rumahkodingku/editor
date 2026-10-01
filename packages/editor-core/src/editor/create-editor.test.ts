// @vitest-environment jsdom

import StarterKit from "@tiptap/starter-kit";
import { afterEach, expect, test } from "vitest";

import { createEmptyDocument } from "../content/content";
import { toHTML, toJSON } from "../serialization/serialization";
import { createEditor } from "./create-editor";

const editors: ReturnType<typeof createEditor>[] = [];

function makeEditor(options: Parameters<typeof createEditor>[0] = {}) {
	const editor = createEditor(options);
	editors.push(editor);
	return editor;
}

afterEach(() => {
	for (const editor of editors.splice(0)) {
		editor.destroy();
	}
});

test("creates an editor with the default extension preset", () => {
	const editor = makeEditor({
		content: {
			type: "doc",
			content: [
				{ type: "paragraph", content: [{ type: "text", text: "hello" }] },
			],
		},
	});

	expect(editor.getJSON()).toEqual({
		type: "doc",
		content: [
			{ type: "paragraph", content: [{ type: "text", text: "hello" }] },
		],
	});
});

test("defaults to an empty document and editable state", () => {
	const editor = makeEditor();
	expect(editor.getJSON()).toEqual(createEmptyDocument());
	expect(editor.isEditable).toBe(true);
});

test("supports read-only mode", () => {
	const editor = makeEditor({ editable: false });
	expect(editor.isEditable).toBe(false);
});

test("accepts custom extensions instead of the preset", () => {
	const editor = makeEditor({
		extensions: [StarterKit.configure({})],
	});
	expect(editor.getJSON()).toEqual(createEmptyDocument());
});

test("throws when configured with no extensions", () => {
	expect(() => createEditor({ extensions: [] })).toThrow();
});

test("exposes canonical JSON and HTML output", () => {
	const editor = makeEditor({
		content: {
			type: "doc",
			content: [{ type: "paragraph", content: [{ type: "text", text: "hi" }] }],
		},
	});

	expect(toJSON(editor)).toEqual(editor.getJSON());
	expect(toHTML(editor)).toBe("<p>hi</p>");
});

test("keeps multiple editor instances independent", () => {
	const first = makeEditor({
		content: {
			type: "doc",
			content: [
				{ type: "paragraph", content: [{ type: "text", text: "first" }] },
			],
		},
	});
	const second = makeEditor({
		content: {
			type: "doc",
			content: [
				{ type: "paragraph", content: [{ type: "text", text: "second" }] },
			],
		},
	});

	first.commands.selectAll();
	first.chain().focus().toggleBold().run();

	expect(first.isActive("bold")).toBe(true);
	expect(second.isActive("bold")).toBe(false);
});
