import type { Editor } from "@rumahkodingku/editor-core";
import { useEffect, useReducer } from "react";

/**
 * Re-render the caller whenever the editor emits a transaction or update.
 *
 * Returns a monotonically increasing revision that can be used as a cheap
 * dependency for derived values.
 *
 * Tiptap's own `useEditorState` is deliberately avoided. Its internal
 * `EditorStateManager.watch()` rebinds to a new editor instance without
 * invalidating its memoized snapshot, so any value derived while the editor was
 * still `null` is never recomputed. In this app that left the inspectors
 * showing an empty document, `editable: false`, and every toolbar item disabled
 * until the first transaction — which is exactly the state a freshly mounted
 * scenario starts in.
 */
export function useEditorRevision(editor: Editor | null): number {
	const [revision, bumpRevision] = useReducer((count: number) => count + 1, 0);

	useEffect(() => {
		if (!editor) {
			return;
		}
		const notify = () => bumpRevision();
		editor.on("transaction", notify);
		editor.on("update", notify);
		// An editor can be created, populated, and made editable before this
		// effect runs, so read once on attach rather than waiting for an event.
		notify();
		return () => {
			editor.off("transaction", notify);
			editor.off("update", notify);
		};
	}, [editor]);

	return revision;
}
