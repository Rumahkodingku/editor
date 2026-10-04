import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { JSONContent, Editor as TiptapEditor } from "@tiptap/core";
import { expect, test } from "vitest";

import { Editor } from "./Editor";

const document: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }],
};

function renderWithSelection() {
	let editor: TiptapEditor | null = null;
	render(
		<Editor
			defaultValue={document}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	// The link control only enables for a non-empty selection (or an existing link).
	act(() => {
		(editor as unknown as TiptapEditor).commands.selectAll();
	});

	return () => editor as unknown as TiptapEditor;
}

function openDialog() {
	fireEvent.click(screen.getByRole("button", { name: "Link" }));
	return screen.getByRole("dialog", { name: "Link" });
}

test("applies a safe link to the current selection", () => {
	const getEditor = renderWithSelection();
	const dialog = openDialog();

	fireEvent.change(within(dialog).getByRole("textbox"), {
		target: { value: "https://example.com/docs" },
	});
	fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));

	expect(getEditor().isActive("link")).toBe(true);
	expect(getEditor().getAttributes("link").href).toBe(
		"https://example.com/docs",
	);
});

test("rejects an unsafe link scheme without applying it", () => {
	const getEditor = renderWithSelection();
	const dialog = openDialog();

	fireEvent.change(within(dialog).getByRole("textbox"), {
		target: { value: "javascript:alert(1)" },
	});
	fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));

	expect(within(dialog).getByRole("alert")).toBeDefined();
	expect(getEditor().isActive("link")).toBe(false);
});

test("edits an existing link", () => {
	const getEditor = renderWithSelection();

	fireEvent.click(screen.getByRole("button", { name: "Link" }));
	let dialog = screen.getByRole("dialog", { name: "Link" });
	fireEvent.change(within(dialog).getByRole("textbox"), {
		target: { value: "https://example.com/one" },
	});
	fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));
	expect(getEditor().getAttributes("link").href).toBe(
		"https://example.com/one",
	);

	// The toggle is now labelled "Remove link"; the first match is the toolbar button.
	fireEvent.click(
		screen.getAllByRole("button", { name: "Remove link" })[0] as HTMLElement,
	);
	dialog = screen.getByRole("dialog", { name: "Link" });
	fireEvent.change(within(dialog).getByRole("textbox"), {
		target: { value: "https://example.com/two" },
	});
	fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));

	expect(getEditor().getAttributes("link").href).toBe(
		"https://example.com/two",
	);
});

test("removes an applied link", () => {
	const getEditor = renderWithSelection();

	fireEvent.click(screen.getByRole("button", { name: "Link" }));
	let dialog = screen.getByRole("dialog", { name: "Link" });
	fireEvent.change(within(dialog).getByRole("textbox"), {
		target: { value: "https://example.com" },
	});
	fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));
	expect(getEditor().isActive("link")).toBe(true);

	fireEvent.click(
		screen.getAllByRole("button", { name: "Remove link" })[0] as HTMLElement,
	);
	dialog = screen.getByRole("dialog", { name: "Link" });
	fireEvent.click(within(dialog).getByRole("button", { name: "Remove link" }));

	expect(getEditor().isActive("link")).toBe(false);
});

test("closes the popover on cancel and on Escape", () => {
	renderWithSelection();

	fireEvent.click(screen.getByRole("button", { name: "Link" }));
	let dialog = screen.getByRole("dialog", { name: "Link" });
	fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
	expect(screen.queryByRole("dialog")).toBeNull();

	// Reopen and close with Escape.
	fireEvent.click(screen.getByRole("button", { name: "Link" }));
	dialog = screen.getByRole("dialog", { name: "Link" });
	fireEvent.keyDown(dialog, { key: "Escape" });
	expect(screen.queryByRole("dialog")).toBeNull();
});
