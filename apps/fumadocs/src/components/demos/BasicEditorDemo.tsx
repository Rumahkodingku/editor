"use client";

import { Editor } from "@rumahkodingku/editor-react";

import { demoDocument } from "./fixtures";

/** Minimal editor: default extensions and the default toolbar. */
export function BasicEditorDemo() {
	return <Editor defaultValue={demoDocument} immediatelyRender={false} />;
}
