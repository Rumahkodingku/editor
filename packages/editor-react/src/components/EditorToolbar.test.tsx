import {
	createEditor,
	type ToolbarItemDefinition,
} from "@rumahkodingku/editor-core";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { JSONContent } from "@tiptap/core";
import { afterEach, expect, test, vi } from "vitest";

import { Editor } from "./Editor";
import { EditorToolbar } from "./EditorToolbar";

const document: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }],
};

const editors: ReturnType<typeof createEditor>[] = [];
afterEach(() => {
	for (const editor of editors.splice(0)) {
		editor.destroy();
	}
});

test("renders the default toolbar with accessible names", () => {
	render(<Editor />);

	expect(screen.getByRole("button", { name: "Bold" })).toBeDefined();
	expect(screen.getByRole("button", { name: "Italic" })).toBeDefined();
	expect(screen.getByRole("button", { name: "Undo" })).toBeDefined();
});

test("reflects active state after a command runs", () => {
	let editor: ReturnType<typeof createEditor> | null = null;
	render(
		<Editor
			defaultValue={document}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	act(() => {
		editor?.commands.selectAll();
	});

	const bold = screen.getByRole("button", { name: "Bold" });
	expect(bold.getAttribute("aria-pressed")).toBe("false");

	fireEvent.click(bold);

	expect(bold.getAttribute("aria-pressed")).toBe("true");
});

test("disables controls when the editor is read-only", () => {
	render(<Editor editable={false} />);

	const bold = screen.getByRole("button", {
		name: "Bold",
	}) as HTMLButtonElement;
	expect(bold.disabled).toBe(true);
	expect(bold.getAttribute("aria-disabled")).toBe("true");
});

test("disables undo/redo when there is nothing to undo", () => {
	render(<Editor />);

	const undo = screen.getByRole("button", {
		name: "Undo",
	}) as HTMLButtonElement;
	expect(undo.disabled).toBe(true);
});

test("applies label overrides", () => {
	render(<Editor labels={{ bold: "Tebal" }} />);

	expect(screen.getByRole("button", { name: "Tebal" })).toBeDefined();
});

test("renders consumer-provided toolbar items without mutating core defaults", () => {
	const editor = createEditor({ content: document });
	editors.push(editor);

	const run = vi.fn();
	const items: ToolbarItemDefinition[] = [
		{
			id: "custom",
			labelKey: "bold",
			icon: "bold",
			isActive: () => false,
			isDisabled: () => false,
			run,
		},
	];

	render(<EditorToolbar editor={editor} items={items} />);

	fireEvent.click(screen.getByRole("button", { name: "Bold" }));
	expect(run).toHaveBeenCalledTimes(1);
});

test("uses a roving tabindex across controls", () => {
	render(<Editor />);

	const bold = screen.getByRole("button", { name: "Bold" });
	const italic = screen.getByRole("button", { name: "Italic" });
	expect(bold.getAttribute("tabindex")).toBe("0");
	expect(italic.getAttribute("tabindex")).toBe("-1");

	fireEvent.focus(italic);

	expect(italic.getAttribute("tabindex")).toBe("0");
	expect(bold.getAttribute("tabindex")).toBe("-1");
});

test("exposes a single tab stop across grouped and adapter controls", () => {
	render(<Editor />);

	const buttons = screen.getAllByRole("button");
	const tabStops = buttons.filter(
		(button) => button.getAttribute("tabindex") === "0",
	);
	expect(tabStops).toHaveLength(1);
});

test("moves the tab stop with arrow keys, Home and End", () => {
	render(<Editor />);

	const toolbar = screen.getByRole("toolbar");
	const bold = screen.getByRole("button", { name: "Bold" });
	const italic = screen.getByRole("button", { name: "Italic" });
	const enabled = screen
		.getAllByRole("button")
		.filter((button) => !(button as HTMLButtonElement).disabled);
	const lastEnabled = enabled[enabled.length - 1];
	const activeStop = () =>
		screen
			.getAllByRole("button")
			.find((button) => button.getAttribute("tabindex") === "0");

	act(() => {
		bold.focus();
	});
	expect(activeStop()).toBe(bold);

	fireEvent.keyDown(toolbar, { key: "ArrowRight" });
	expect(activeStop()).toBe(italic);

	fireEvent.keyDown(toolbar, { key: "ArrowLeft" });
	expect(activeStop()).toBe(bold);

	fireEvent.keyDown(toolbar, { key: "End" });
	expect(activeStop()).toBe(lastEnabled);

	fireEvent.keyDown(toolbar, { key: "Home" });
	expect(activeStop()).toBe(bold);
});
