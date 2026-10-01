import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";
import { expectTypeOf, test } from "vitest";

import {
	type CreateEditorOptions,
	composeExtensions,
	createDefaultExtensions,
	createEditor,
	createPersistenceEnvelope,
	type EditorLabels,
	type ImageUploadHandler,
	type ImageUploadResult,
	jsonToHTML,
	type PersistenceEnvelope,
	parsePersistenceEnvelope,
	type ToolbarItemDefinition,
	toHTML,
	toJSON,
} from "./index";

test("createEditor returns a Tiptap Editor", () => {
	expectTypeOf(createEditor).returns.toEqualTypeOf<Editor>();
});

test("CreateEditorOptions uses Tiptap types directly", () => {
	expectTypeOf<CreateEditorOptions["content"]>().toEqualTypeOf<
		JSONContent | undefined
	>();
	expectTypeOf<CreateEditorOptions["extensions"]>().toEqualTypeOf<
		AnyExtension[] | undefined
	>();
});

test("CreateEditorOptions rejects React-specific props", () => {
	// @ts-expect-error `onChange` belongs to the framework adapter, not the core.
	createEditor({ onChange: () => {} });
});

test("extension helpers are typed", () => {
	expectTypeOf(createDefaultExtensions).returns.toEqualTypeOf<AnyExtension[]>();
	expectTypeOf(createDefaultExtensions).toBeCallableWith({});
	expectTypeOf(composeExtensions).returns.toEqualTypeOf<AnyExtension[]>();
});

test("upload contract matches the documented shape", () => {
	expectTypeOf<ImageUploadHandler>().toBeFunction();
	expectTypeOf<Parameters<ImageUploadHandler>[0]>().toHaveProperty("file");
	expectTypeOf<Parameters<ImageUploadHandler>[0]>().toHaveProperty("signal");
	expectTypeOf<ReturnType<ImageUploadHandler>>().toEqualTypeOf<
		Promise<ImageUploadResult>
	>();
	expectTypeOf<ImageUploadResult["src"]>().toEqualTypeOf<string>();
});

test("persistence envelope is typed", () => {
	expectTypeOf(
		createPersistenceEnvelope,
	).returns.toEqualTypeOf<PersistenceEnvelope>();
	expectTypeOf(
		parsePersistenceEnvelope,
	).returns.toEqualTypeOf<PersistenceEnvelope>();
	expectTypeOf<PersistenceEnvelope["schemaVersion"]>().toEqualTypeOf<number>();
});

test("toolbar label keys are constrained to EditorLabels", () => {
	expectTypeOf<ToolbarItemDefinition["labelKey"]>().toEqualTypeOf<
		keyof EditorLabels
	>();
	expectTypeOf<ToolbarItemDefinition["run"]>().toEqualTypeOf<
		(editor: Editor) => void
	>();
});

test("serialization helpers are typed", () => {
	expectTypeOf(toJSON).returns.toEqualTypeOf<JSONContent>();
	expectTypeOf(toHTML).returns.toEqualTypeOf<string>();
	expectTypeOf(jsonToHTML).returns.toEqualTypeOf<string>();
});
