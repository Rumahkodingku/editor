import {
	type Editor,
	type JSONContent,
	toHTML,
	toJSON,
} from "@rumahkodingku/editor-core";

import { useEditorRevision } from "./useEditorRevision";

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

function derive(editor: Editor): EditorSnapshot {
	return {
		json: toJSON(editor),
		html: toHTML(editor),
		editable: editor.isEditable,
		focused: editor.isFocused,
		empty: editor.isEmpty,
		docSize: editor.state.doc.content.size,
	};
}

/**
 * Subscribe to editor transactions and derive the values the inspectors show.
 *
 * The document stays owned by Tiptap/ProseMirror and no global store is
 * involved: the subscription only turns the editor's own `transaction`/`update`
 * events into a re-render, and every value is read from the live instance React
 * is currently rendering with.
 */
export function useEditorSnapshot(editor: Editor | null): EditorSnapshot {
	// The revision is the signal that the editor emitted a transaction; deriving
	// during render keeps the value consistent with the instance React holds.
	useEditorRevision(editor);

	return editor ? derive(editor) : EMPTY_SNAPSHOT;
}
