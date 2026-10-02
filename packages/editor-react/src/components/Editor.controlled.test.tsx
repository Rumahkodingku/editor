import { act, fireEvent, render, screen } from "@testing-library/react";
import type { JSONContent, Editor as TiptapEditor } from "@tiptap/core";
import { useState } from "react";
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

test("renders the controlled value", () => {
	render(<Editor value={first} onChange={() => {}} />);

	expect(screen.getByRole("textbox").textContent).toContain("hello");
});

test("applies an external value update without firing onChange", () => {
	const onChange = vi.fn();
	let setValue: (content: JSONContent) => void = () => {};

	function Harness() {
		const [value, update] = useState<JSONContent>(first);
		setValue = update;
		return <Editor value={value} onChange={onChange} />;
	}

	render(<Harness />);
	onChange.mockClear();

	act(() => {
		setValue(second);
	});

	expect(screen.getByRole("textbox").textContent).toContain("world");
	expect(onChange).not.toHaveBeenCalled();
});

test("keeps a stable editor instance across parent rerenders", () => {
	let editor: TiptapEditor | null = null;
	const { rerender } = render(
		<Editor
			value={first}
			onChange={() => {}}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	const instance = editor;
	rerender(<Editor value={first} onChange={() => {}} />);

	expect(editor).toBe(instance);
});

test("does not reset the document for a structurally equal new value", () => {
	const onChange = vi.fn();

	function Harness() {
		const [tick, setTick] = useState(0);
		const value = tick === 0 ? first : { ...first };
		return (
			<>
				<button type="button" onClick={() => setTick(1)}>
					rerender
				</button>
				<Editor value={value} onChange={onChange} />
			</>
		);
	}

	render(<Harness />);
	onChange.mockClear();

	act(() => {
		fireEvent.click(screen.getByText("rerender"));
	});

	expect(onChange).not.toHaveBeenCalled();
	expect(screen.getByRole("textbox").textContent).toContain("hello");
});
