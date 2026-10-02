import { expectTypeOf, test } from "vitest";
import type {
	AnyExtension,
	EditorLabels,
	EditorProps,
	JSONContent,
	TiptapEditor,
} from "./index";
import { Editor, EditorToolbar, ToolbarButton, ToolbarIcon } from "./index";

test("EditorProps matches the approved contract", () => {
	expectTypeOf<EditorProps>().toHaveProperty("value");
	expectTypeOf<EditorProps>().toHaveProperty("defaultValue");
	expectTypeOf<EditorProps>().toHaveProperty("immediatelyRender");
	expectTypeOf<EditorProps["value"]>().toEqualTypeOf<JSONContent | undefined>();
	expectTypeOf<EditorProps["onChange"]>().toEqualTypeOf<
		((content: JSONContent) => void) | undefined
	>();
	expectTypeOf<EditorProps["labels"]>().toEqualTypeOf<
		Partial<EditorLabels> | undefined
	>();
	expectTypeOf<EditorProps["extensions"]>().toEqualTypeOf<
		AnyExtension[] | undefined
	>();
});

test("public components are usable values", () => {
	expectTypeOf(Editor).toBeFunction();
	expectTypeOf(EditorToolbar).toBeFunction();
	expectTypeOf(ToolbarButton).toBeFunction();
	expectTypeOf(ToolbarIcon).toBeFunction();
});

test("the Tiptap editor type is exported under a non-colliding name", () => {
	expectTypeOf<TiptapEditor>().toHaveProperty("getJSON");
});

test("nilai value harus canonical JSON, bukan string", () => {
	// @ts-expect-error `value` must be JSON content, not a string.
	const invalid: EditorProps = { value: "not-json" };
	expectTypeOf(invalid).toEqualTypeOf<EditorProps>();
});
