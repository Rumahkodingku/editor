import type {
	AnyExtension,
	Editor,
	EditorOptions,
	JSONContent,
} from "@tiptap/core";
import { Editor as TiptapEditor } from "@tiptap/core";

import { createEmptyDocument } from "../content/content";
import { EditorConfigError } from "../errors";
import { createDefaultExtensions } from "../extensions/default-extensions";

/**
 * Configuration for {@link createEditor}.
 *
 * Deliberately free of React/UI concepts (`onChange`, upload handlers, etc.).
 * Upload behavior is configured through the image extension, and application
 * state integration belongs to the framework adapter.
 */
export type CreateEditorOptions = {
	/** DOM element to mount into. `null` (default) keeps the editor unmounted. */
	element?: EditorOptions["element"];
	/** Initial canonical content. Defaults to an empty document. */
	content?: JSONContent;
	/** Extensions to use. Defaults to {@link createDefaultExtensions}. */
	extensions?: AnyExtension[];
	/** Placeholder text used by the default preset. */
	placeholder?: string;
	/** Whether the editor accepts input. Defaults to `true`. */
	editable?: boolean;
	/** ProseMirror editor props (paste/drop handlers, attributes, ...). */
	editorProps?: EditorOptions["editorProps"];
	/** Whether Tiptap should inject its base CSS. Defaults to `false`. */
	injectCSS?: boolean;
};

/**
 * Create a Tiptap editor configured with the RumahKodingku core.
 *
 * The returned editor owns its own state; no module-level state is involved, so
 * multiple independent instances can coexist.
 */
export function createEditor(options: CreateEditorOptions = {}): Editor {
	const {
		element = null,
		content,
		extensions,
		placeholder,
		editable = true,
		editorProps,
		injectCSS = false,
	} = options;

	const resolvedExtensions =
		extensions ?? createDefaultExtensions({ placeholder });

	if (resolvedExtensions.length === 0) {
		throw new EditorConfigError(
			"createEditor requires at least one extension.",
		);
	}

	return new TiptapEditor({
		element,
		content: content ?? createEmptyDocument(),
		extensions: resolvedExtensions,
		editable,
		editorProps,
		injectCSS,
	});
}
