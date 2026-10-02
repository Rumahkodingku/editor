import {
	createEditor,
	type ToolbarItemDefinition,
} from "@rumahkodingku/editor-core";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { ToolbarButton } from "./ToolbarButton";

const editors: ReturnType<typeof createEditor>[] = [];
afterEach(() => {
	for (const editor of editors.splice(0)) {
		editor.destroy();
	}
});

function makeItem(
	overrides: Partial<ToolbarItemDefinition> = {},
): ToolbarItemDefinition {
	return {
		id: "bold",
		labelKey: "bold",
		icon: "bold",
		isActive: () => false,
		isDisabled: () => false,
		run: vi.fn(),
		...overrides,
	};
}

test("runs the definition command on click", () => {
	const editor = createEditor({});
	editors.push(editor);
	const item = makeItem();

	render(
		<ToolbarButton
			editor={editor}
			item={item}
			label="Bold"
			active={false}
			disabled={false}
			tabIndex={0}
		/>,
	);

	fireEvent.click(screen.getByRole("button", { name: "Bold" }));

	expect(item.run).toHaveBeenCalledWith(editor);
});

test("exposes shortcut in the title and pressed state for toggles", () => {
	const editor = createEditor({});
	editors.push(editor);

	render(
		<ToolbarButton
			editor={editor}
			item={makeItem({ shortcut: "Mod-b" })}
			label="Bold"
			active={true}
			disabled={false}
			tabIndex={0}
		/>,
	);

	const button = screen.getByRole("button", { name: "Bold" });
	expect(button.getAttribute("title")).toBe("Bold (Mod-b)");
	expect(button.getAttribute("aria-pressed")).toBe("true");
});

test("does not expose aria-pressed for non-toggle actions", () => {
	const editor = createEditor({});
	editors.push(editor);

	render(
		<ToolbarButton
			editor={editor}
			item={makeItem({ id: "undo", labelKey: "undo", icon: "undo" })}
			label="Undo"
			active={false}
			disabled={false}
			tabIndex={-1}
		/>,
	);

	const button = screen.getByRole("button", { name: "Undo" });
	expect(button.getAttribute("aria-pressed")).toBeNull();
});

test("is disabled and exposes aria-disabled when unavailable", () => {
	const editor = createEditor({});
	editors.push(editor);

	render(
		<ToolbarButton
			editor={editor}
			item={makeItem()}
			label="Bold"
			active={false}
			disabled={true}
			tabIndex={0}
		/>,
	);

	const button = screen.getByRole("button", {
		name: "Bold",
	}) as HTMLButtonElement;
	expect(button.disabled).toBe(true);
	expect(button.getAttribute("aria-disabled")).toBe("true");
	expect(button.getAttribute("tabindex")).toBe("-1");
});
