import { act, render, screen, waitFor } from "@testing-library/react";
import type { JSONContent, Editor as TiptapEditor } from "@tiptap/core";
import { StrictMode } from "react";
import { expect, test, vi } from "vitest";

import { Editor } from "./Editor";

const helloDocument: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }],
};

test("renders an empty editor and exposes the instance through onReady", () => {
	let editor: TiptapEditor | null = null;

	render(
		<Editor
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	expect(editor).not.toBeNull();
	expect((editor as TiptapEditor | null)?.getJSON()).toEqual({
		type: "doc",
		content: [{ type: "paragraph" }],
	});
});

test("renders initial content", () => {
	render(<Editor defaultValue={helloDocument} />);

	expect(screen.getByRole("textbox").textContent).toContain("hello");
});

test("calls onChange with canonical JSON when the document changes", () => {
	const onChange = vi.fn();
	let editor: TiptapEditor | null = null;

	render(
		<Editor
			defaultValue={helloDocument}
			onChange={onChange}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	onChange.mockClear();

	act(() => {
		(editor as TiptapEditor).commands.insertContent("!");
	});

	expect(onChange).toHaveBeenCalled();
	const lastCall = onChange.mock.calls.at(-1);
	expect(lastCall?.[0]?.type).toBe("doc");
});

test("calls onReady once per editor instance", () => {
	const onReady = vi.fn();
	const { rerender } = render(<Editor onReady={onReady} />);

	rerender(<Editor onReady={onReady} />);

	expect(onReady).toHaveBeenCalledTimes(1);
});

test("destroys the editor on unmount", async () => {
	let editor: TiptapEditor | null = null;
	const { unmount } = render(
		<Editor
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	unmount();

	await waitFor(() => {
		expect((editor as TiptapEditor | null)?.isDestroyed).toBe(true);
	});
});

test("does not duplicate onReady or leak the editor under StrictMode", () => {
	const onReady = vi.fn();

	render(
		<StrictMode>
			<Editor onReady={onReady} />
		</StrictMode>,
	);

	expect(onReady).toHaveBeenCalledTimes(1);
});

test("warns deterministically when value and defaultValue are both provided", () => {
	const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

	render(<Editor value={helloDocument} defaultValue={helloDocument} />);

	expect(warn).toHaveBeenCalledTimes(1);
	expect(warn).toHaveBeenCalledWith(
		expect.stringContaining("`value` takes precedence"),
	);

	warn.mockRestore();
});
