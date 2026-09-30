import { expectTypeOf, test } from "vitest";

import { EDITOR_CORE_PACKAGE_NAME } from "./index";

test("exposes a literal package name type", () => {
	expectTypeOf(
		EDITOR_CORE_PACKAGE_NAME,
	).toEqualTypeOf<"@rumahkodingku/editor-core">();
});
