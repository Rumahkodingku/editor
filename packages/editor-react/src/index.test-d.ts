import { expectTypeOf, test } from "vitest";

import { EDITOR_REACT_PACKAGE_NAME } from "./index";

test("exposes a literal package name type", () => {
	expectTypeOf(
		EDITOR_REACT_PACKAGE_NAME,
	).toEqualTypeOf<"@rumahkodingku/editor-react">();
});
