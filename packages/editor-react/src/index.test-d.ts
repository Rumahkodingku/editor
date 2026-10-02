import { expectTypeOf, test } from "vitest";

import { EDITOR_REACT_PACKAGE_NAME, Editor, EditorToolbar } from "./index";

test("exposes a literal package name type", () => {
	expectTypeOf(
		EDITOR_REACT_PACKAGE_NAME,
	).toEqualTypeOf<"@rumahkodingku/editor-react">();
});

test("exports the public components", () => {
	expectTypeOf(Editor).toBeFunction();
	expectTypeOf(EditorToolbar).toBeFunction();
});
