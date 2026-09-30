import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { EDITOR_CORE_PACKAGE_NAME, EDITOR_REACT_PACKAGE_NAME } from "./index";

function Dummy() {
	return <div>{EDITOR_REACT_PACKAGE_NAME}</div>;
}

test("renders a React component with jsdom and React Testing Library", () => {
	render(<Dummy />);

	expect(screen.getByText("@rumahkodingku/editor-react")).toBeDefined();
});

test("re-exports the core package contract", () => {
	expect(EDITOR_CORE_PACKAGE_NAME).toBe("@rumahkodingku/editor-core");
});
