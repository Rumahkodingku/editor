import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Editor } from "./components/Editor";
import type { EditorProps } from "./types";

function renderEditor(props: EditorProps = {}) {
	return render(<Editor {...props} />);
}

test("exposes toolbar and textbox semantics", () => {
	renderEditor();

	const toolbar = screen.getByRole("toolbar");
	expect(toolbar.getAttribute("aria-label")).toBe("Rich text editor");
	expect(toolbar.getAttribute("aria-orientation")).toBe("horizontal");

	const textbox = screen.getByRole("textbox");
	expect(textbox.getAttribute("aria-multiline")).toBe("true");
	expect(textbox.getAttribute("aria-label")).toBe("Rich text editor");
});

test("marks the read-only surface with aria-readonly", () => {
	renderEditor({ editable: false });

	expect(screen.getByRole("textbox").getAttribute("aria-readonly")).toBe(
		"true",
	);
});

test("marks the disabled surface with aria-disabled", () => {
	renderEditor({ disabled: true });

	expect(screen.getByRole("textbox").getAttribute("aria-disabled")).toBe(
		"true",
	);
});

test("reflects label overrides on the editor surface", () => {
	renderEditor({ labels: { editor: "Editor konten" } });

	expect(screen.getByRole("textbox").getAttribute("aria-label")).toBe(
		"Editor konten",
	);
});

test("every toolbar control has an accessible name", () => {
	renderEditor();

	const buttons = screen.getAllByRole("button");
	expect(buttons.length).toBeGreaterThan(0);
	for (const button of buttons) {
		expect(button.getAttribute("aria-label")).toBeTruthy();
	}
});

test("does not expose aria-pressed for undo/redo", () => {
	renderEditor();

	expect(
		screen.getByRole("button", { name: "Undo" }).getAttribute("aria-pressed"),
	).toBeNull();
	expect(
		screen.getByRole("button", { name: "Redo" }).getAttribute("aria-pressed"),
	).toBeNull();
});

test("exposes named toolbar groups", () => {
	renderEditor();

	const groups = screen.getAllByRole("group");
	expect(groups.length).toBeGreaterThan(0);
	for (const group of groups) {
		expect(group.getAttribute("aria-label")).toBeTruthy();
	}
});

test("exposes accessible names for the link and image controls", () => {
	renderEditor();

	expect(screen.getByRole("button", { name: "Link" })).toBeDefined();
	expect(screen.getByRole("button", { name: "Image" })).toBeDefined();
	expect(screen.getByRole("button", { name: "Alt text" })).toBeDefined();
});

test("exposes heading controls up to level six", () => {
	renderEditor();

	for (let level = 1; level <= 6; level += 1) {
		expect(
			screen.getByRole("button", { name: `Heading ${level}` }),
		).toBeDefined();
	}
});
