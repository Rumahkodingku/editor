import type { EditorLabels } from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { createContext, useContext } from "react";

/**
 * Shared editor state for the composable React surfaces.
 *
 * The editor instance is owned by {@link EditorProvider} (or the all-in-one
 * `Editor`) and shared through React context. There is no global store: the
 * document still lives in Tiptap/ProseMirror (ARCHITECTURE §13).
 */
export type EditorContextValue = {
	/** The Tiptap instance, or `null` before it is created. */
	editor: Editor | null;
	/** Resolved labels for the current editor. */
	labels: EditorLabels;
	/** Whether the editor accepts input (`editable` and not `disabled`). */
	editable: boolean;
	/** Whether the editor is fully disabled. */
	disabled: boolean;
};

export const EditorContext = createContext<EditorContextValue | null>(null);

/**
 * Read the current editor context.
 *
 * Throws when used outside an `<EditorProvider>` (or `<Editor>`) so a
 * misconfiguration fails fast instead of rendering a silently dead surface.
 */
export function useEditorContext(): EditorContextValue {
	const value = useContext(EditorContext);
	if (!value) {
		throw new Error(
			"useEditorContext must be used within an <EditorProvider> or <Editor>.",
		);
	}
	return value;
}
