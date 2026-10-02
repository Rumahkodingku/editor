import { render, screen } from "@testing-library/react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { Mark } from "@tiptap/core";
import { expect, test } from "vitest";

import { Editor } from "./components/Editor";

const Highlight = Mark.create({
	name: "highlight",
});

test("core defaults, labels and the toolbar work together", () => {
	render(<Editor placeholder="Type here" labels={{ bold: "Tebal" }} />);

	expect(screen.getByRole("button", { name: "Tebal" })).toBeDefined();
	expect(
		document.querySelector('[data-placeholder="Type here"]'),
	).not.toBeNull();
});

test("composes consumer extensions with the core default preset", () => {
	let editor: TiptapEditor | null = null;
	render(
		<Editor
			extensions={[Highlight]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	const names = (
		editor as unknown as TiptapEditor
	).extensionManager.extensions.map((extension) => extension.name);
	expect(names).toContain("highlight");
	expect(names).toContain("bold");
});
