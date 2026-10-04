"use client";

import { Editor } from "@rumahkodingku/editor-react";

import { demoDocument } from "./fixtures";

/** Disabled editor: `disabled` blocks focus and interaction entirely. */
export function DisabledEditorDemo() {
	return (
		<Editor defaultValue={demoDocument} disabled immediatelyRender={false} />
	);
}
