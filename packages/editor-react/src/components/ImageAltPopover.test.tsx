import { ImageUpload } from "@rumahkodingku/editor-core";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { JSONContent, Editor as TiptapEditor } from "@tiptap/core";
import { expect, test } from "vitest";

import { Editor } from "./Editor";

const imageDocument: JSONContent = {
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: [{ type: "text", text: "hello" }],
		},
		{
			type: "image",
			attrs: { src: "https://example.com/a.png", alt: "old alt" },
		},
	],
};

test("edits the alt text of the selected image", () => {
	let editor: TiptapEditor | null = null;
	render(
		<Editor
			defaultValue={imageDocument}
			extensions={[ImageUpload]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	const altButton = screen.getByRole("button", {
		name: "Alt text",
	}) as HTMLButtonElement;
	// The default selection is inside the paragraph, not on the image.
	expect(altButton.disabled).toBe(true);

	const current = editor as unknown as TiptapEditor;
	let imagePos = -1;
	current.state.doc.descendants((node, position) => {
		if (node.type.name === "image") {
			imagePos = position;
			return false;
		}
		return true;
	});

	act(() => {
		current.commands.setNodeSelection(imagePos);
	});
	expect(altButton.disabled).toBe(false);

	fireEvent.click(altButton);
	const dialog = screen.getByRole("dialog", { name: "Alt text" });
	const input = within(dialog).getByRole("textbox") as HTMLInputElement;
	expect(input.value).toBe("old alt");

	fireEvent.change(input, { target: { value: "new alt" } });
	fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));

	expect(current.getAttributes("image").alt).toBe("new alt");
});
