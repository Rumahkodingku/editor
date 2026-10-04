"use client";

import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { Mark } from "@tiptap/core";
import { useState } from "react";

import { demoDocument } from "./fixtures";

/**
 * A consumer-defined extension. It is composed with the core default preset by
 * the adapter through the `extensions` prop — the package is never modified.
 */
const Highlight = Mark.create({
	name: "highlight",
	parseHTML() {
		return [{ tag: "mark" }];
	},
	renderHTML() {
		return ["mark", { "data-rk-highlight": "true" }, 0];
	},
});

/** Module-level so the array stays referentially stable across renders. */
const customExtensions = [Highlight];

/** Compose a custom extension with the default preset. */
export function CustomExtensionDemo() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);

	return (
		<div className="flex flex-col gap-3">
			<Editor
				extensions={customExtensions}
				defaultValue={demoDocument}
				immediatelyRender={false}
				onReady={setEditor}
			/>
			<button
				type="button"
				className="self-start rounded-md border px-3 py-1.5 text-sm"
				disabled={!editor}
				onClick={() => editor?.chain().focus().toggleMark("highlight").run()}
			>
				Toggle highlight mark
			</button>
		</div>
	);
}
