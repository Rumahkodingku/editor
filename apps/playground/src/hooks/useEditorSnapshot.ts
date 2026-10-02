import {
	type Editor,
	type JSONContent,
	toHTML,
	toJSON,
} from "@rumahkodingku/editor-core";
import { useEditorState } from "@tiptap/react";

/** A point-in-time view of the editor used by the inspectors. */
export type EditorSnapshot = {
	json: JSONContent;
	html: string;
	editable: boolean;
	focused: boolean;
	empty: boolean;
	docSize: number;
};

const EMPTY_SNAPSHOT: EditorSnapshot = {
	json: { type: "doc", content: [] },
	html: "",
	editable: false,
	focused: false,
	empty: true,
	docSize: 0,
};

/**
 * Subscribe to editor transactions and derive the values the inspectors show.
 *
 * Uses Tiptap's `useEditorState`, so no global store is involved and the
 * document stays owned by Tiptap/ProseMirror.
 */
export function useEditorSnapshot(editor: Editor | null): EditorSnapshot {
	const snapshot = useEditorState({
		editor,
		selector: ({ editor: current }) => {
			if (!current) {
				return EMPTY_SNAPSHOT;
			}
			return {
				json: toJSON(current),
				html: toHTML(current),
				editable: current.isEditable,
				focused: current.isFocused,
				empty: current.isEmpty,
				docSize: current.state.doc.content.size,
			};
		},
	});

	return snapshot ?? EMPTY_SNAPSHOT;
}
