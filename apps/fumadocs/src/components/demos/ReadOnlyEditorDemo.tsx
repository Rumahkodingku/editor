"use client";

import { Editor } from "@rumahkodingku/editor-react";

import { demoDocument } from "./fixtures";

/** Read-only editor: `editable={false}`. Selection and copy work; edits do not. */
export function ReadOnlyEditorDemo() {
	return (
		<Editor
			defaultValue={demoDocument}
			editable={false}
			immediatelyRender={false}
		/>
	);
}
