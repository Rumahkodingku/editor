import { expectTypeOf, test } from "vitest";
import type {
	AnyExtension,
	EditorContentProps,
	EditorLabels,
	EditorProps,
	EditorProviderProps,
	ImageAltPopoverProps,
	ImageControlProps,
	JSONContent,
	LinkControlProps,
	TiptapEditor,
	ToolbarGroupProps,
} from "./index";
import {
	Editor,
	EditorContent,
	EditorProvider,
	EditorToolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarIcon,
} from "./index";

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

test("EditorProviderProps extends EditorProps with children", () => {
	expectTypeOf<EditorProviderProps>().toMatchTypeOf<EditorProps>();
	expectTypeOf<EditorProviderProps>().toHaveProperty("children");
});

test("composable surfaces expose the expected props", () => {
	expectTypeOf<EditorContentProps>().toHaveProperty("editor");
	expectTypeOf<ToolbarGroupProps["label"]>().toEqualTypeOf<string>();
	expectTypeOf<LinkControlProps>().toHaveProperty("labels");
	expectTypeOf<ImageControlProps>().toHaveProperty("onProgress");
	expectTypeOf<ImageAltPopoverProps>().toHaveProperty("editor");
});

test("public components are usable values", () => {
	expectTypeOf(Editor).toBeFunction();
	expectTypeOf(EditorProvider).toBeFunction();
	expectTypeOf(EditorContent).toBeFunction();
	expectTypeOf(EditorToolbar).toBeFunction();
	expectTypeOf(ToolbarButton).toBeFunction();
	expectTypeOf(ToolbarGroup).toBeFunction();
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
