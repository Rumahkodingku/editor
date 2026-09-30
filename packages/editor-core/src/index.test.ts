import { expect, test } from "vitest";

import { EDITOR_CORE_PACKAGE_NAME } from "./index";

test("exposes the package name", () => {
	expect(EDITOR_CORE_PACKAGE_NAME).toBe("@rumahkodingku/editor-core");
});
