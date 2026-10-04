import { render, screen } from "@testing-library/react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { expect, test } from "vitest";

import { EditorContent } from "./EditorContent";
import { EditorProvider } from "./EditorProvider";
import { EditorToolbar } from "./EditorToolbar";

test("shares one editor across composed surfaces", () => {
	let editor: TiptapEditor | null = null;
	render(
		<EditorProvider
			onReady={(instance) => {
				editor = instance;
			}}
		>
			<EditorToolbar />
			<EditorContent />
		</EditorProvider>,
	);

	expect(screen.getByRole("toolbar")).toBeDefined();
	expect(screen.getByRole("textbox")).toBeDefined();
	expect(editor).not.toBeNull();
	expect(screen.getAllByRole("textbox")).toHaveLength(1);
});

test("EditorContent accepts an explicit editor without a provider", () => {
	// Composition without the provider is only valid when an editor is passed.
	render(<EditorContent editor={null} />);

	expect(screen.queryByRole("textbox")).toBeNull();
});
