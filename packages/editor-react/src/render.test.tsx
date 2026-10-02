import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Editor } from "./index";

test("renders the editor root with a toolbar and editing surface", () => {
	render(<Editor />);

	expect(screen.getByRole("toolbar")).toBeDefined();
	expect(screen.getByRole("textbox")).toBeDefined();
});
