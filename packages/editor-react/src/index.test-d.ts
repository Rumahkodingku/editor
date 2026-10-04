import { expectTypeOf, test } from "vitest";

import {
	EDITOR_REACT_PACKAGE_NAME,
	Editor,
	EditorContent,
	EditorProvider,
	EditorToolbar,
	ImageAltPopover,
	ImageControl,
	LinkControl,
	ToolbarGroup,
	useEditorContext,
} from "./index";

test("exposes a literal package name type", () => {
	expectTypeOf(
		EDITOR_REACT_PACKAGE_NAME,
	).toEqualTypeOf<"@rumahkodingku/editor-react">();
});

test("exports the public components", () => {
	expectTypeOf(Editor).toBeFunction();
	expectTypeOf(EditorToolbar).toBeFunction();
	expectTypeOf(EditorProvider).toBeFunction();
	expectTypeOf(EditorContent).toBeFunction();
	expectTypeOf(ToolbarGroup).toBeFunction();
	expectTypeOf(LinkControl).toBeFunction();
	expectTypeOf(ImageControl).toBeFunction();
	expectTypeOf(ImageAltPopover).toBeFunction();
	expectTypeOf(useEditorContext).toBeFunction();
});
