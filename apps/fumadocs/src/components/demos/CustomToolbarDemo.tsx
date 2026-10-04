"use client";

import {
	createDefaultToolbar,
	EditorContent,
	EditorProvider,
	EditorToolbar,
} from "@rumahkodingku/editor-react";
import { useMemo } from "react";

import { demoDocument } from "./fixtures";

const VISIBLE_ITEMS = new Set([
	"bold",
	"italic",
	"underline",
	"bulletList",
	"orderedList",
	"undo",
	"redo",
]);

/** Compose a custom toolbar with `EditorProvider` + `EditorToolbar` + `EditorContent`. */
export function CustomToolbarDemo() {
	const items = useMemo(
		() => createDefaultToolbar().filter((item) => VISIBLE_ITEMS.has(item.id)),
		[],
	);

	return (
		<EditorProvider defaultValue={demoDocument} immediatelyRender={false}>
			<div className="rk-editor">
				<EditorToolbar items={items} labels={{ editor: "Custom toolbar" }} />
				<EditorContent />
			</div>
		</EditorProvider>
	);
}
