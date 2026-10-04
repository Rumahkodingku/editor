// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";

import { createEditor } from "../editor/create-editor";
import { createDefaultToolbar } from "./toolbar";

const editors: ReturnType<typeof createEditor>[] = [];

function makeEditor(editable = true) {
	const editor = createEditor({
		editable,
		content: {
			type: "doc",
			content: [
				{ type: "paragraph", content: [{ type: "text", text: "hello" }] },
			],
		},
	});
	editors.push(editor);
	return editor;
}

afterEach(() => {
	for (const editor of editors.splice(0)) {
		editor.destroy();
	}
});

test("exposes definitions for the MVP formatting commands", () => {
	const ids = createDefaultToolbar().map((item) => item.id);

	expect(ids).toEqual([
		"bold",
		"italic",
		"underline",
		"strike",
		"code",
		"heading-1",
		"heading-2",
		"heading-3",
		"heading-4",
		"heading-5",
		"heading-6",
		"bulletList",
		"orderedList",
		"blockquote",
		"codeBlock",
		"horizontalRule",
		"undo",
		"redo",
	]);
});

test("run toggles the command and isActive reflects the state", () => {
	const editor = makeEditor();
	const bold = createDefaultToolbar().find((item) => item.id === "bold");
	if (!bold) {
		throw new Error("bold toolbar item missing");
	}

	editor.commands.selectAll();
	expect(bold.isActive(editor)).toBe(false);

	bold.run(editor);
	expect(bold.isActive(editor)).toBe(true);

	bold.run(editor);
	expect(bold.isActive(editor)).toBe(false);
});

test("isDisabled is false while the command can run", () => {
	const editor = makeEditor();
	const italic = createDefaultToolbar().find((item) => item.id === "italic");
	expect(italic?.isDisabled(editor)).toBe(false);
});

test("isDisabled is true when the editor is not editable", () => {
	const editor = makeEditor(false);
	const bold = createDefaultToolbar().find((item) => item.id === "bold");
	expect(bold?.isDisabled(editor)).toBe(true);
});

test("undo and redo are never reported as active and are disabled read-only", () => {
	const toolbar = createDefaultToolbar();
	const undo = toolbar.find((item) => item.id === "undo");
	const redo = toolbar.find((item) => item.id === "redo");
	if (!undo || !redo) {
		throw new Error("toolbar items missing");
	}

	const editable = makeEditor();
	expect(undo.isActive(editable)).toBe(false);
	expect(redo.isActive(editable)).toBe(false);

	const readOnly = makeEditor(false);
	expect(undo.isDisabled(readOnly)).toBe(true);
	expect(redo.isDisabled(readOnly)).toBe(true);
});

test("exposes heading levels 1 through 6 and toggles them", () => {
	const editor = makeEditor();
	const toolbar = createDefaultToolbar();

	for (const item of toolbar.filter((entry) =>
		entry.id.startsWith("heading-"),
	)) {
		expect(item.isActive(editor)).toBe(false);
		item.run(editor);
		expect(item.isActive(editor)).toBe(true);
		item.run(editor);
		expect(item.isActive(editor)).toBe(false);
	}

	expect(toolbar.filter((item) => item.id.startsWith("heading-"))).toHaveLength(
		6,
	);
});
