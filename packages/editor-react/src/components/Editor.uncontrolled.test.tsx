import { act, render, screen } from "@testing-library/react";
import type { JSONContent, Editor as TiptapEditor } from "@tiptap/core";
import { expect, test, vi } from "vitest";

import { Editor } from "./Editor";

const first: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }],
};

const second: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text: "world" }] }],
};

test("renders defaultValue", () => {
	render(<Editor defaultValue={first} />);

	expect(screen.getByRole("textbox").textContent).toContain("hello");
});

test("does not reset the document when the parent rerenders with a new defaultValue", () => {
	const { rerender } = render(<Editor defaultValue={first} />);

	rerender(<Editor defaultValue={second} />);

	expect(screen.getByRole("textbox").textContent).toContain("hello");
});

test("keeps the document Tiptap-owned and reports changes through onChange", () => {
	const onChange = vi.fn();
	let editor: TiptapEditor | null = null;

	render(
		<Editor
			defaultValue={first}
			onChange={onChange}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	onChange.mockClear();

	act(() => {
		(editor as TiptapEditor).commands.insertContent(" more");
	});

	expect(onChange).toHaveBeenCalledTimes(1);
	expect(screen.getByRole("textbox").textContent).toContain("more");
});
