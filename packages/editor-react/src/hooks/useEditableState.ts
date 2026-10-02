import type { Editor } from "@tiptap/core";
import { useEffect } from "react";

/**
 * Apply `editable`/`disabled` without recreating the editor.
 *
 * Tiptap's `setOptions` deliberately preserves the current editable state, so
 * editability must be toggled with `editor.setEditable`. ARIA state is mirrored
 * on the editing surface per ARCHITECTURE §7.2.
 */
export function useEditableState(
	editor: Editor | null,
	editable: boolean,
	disabled: boolean,
): void {
	useEffect(() => {
		if (!editor) {
			return;
		}

		const nextEditable = editable && !disabled;
		if (editor.isEditable !== nextEditable) {
			editor.setEditable(nextEditable, false);
		}

		const dom = editor.view.dom;
		if (disabled) {
			dom.setAttribute("aria-disabled", "true");
			dom.removeAttribute("aria-readonly");
		} else if (!nextEditable) {
			dom.setAttribute("aria-readonly", "true");
			dom.removeAttribute("aria-disabled");
		} else {
			dom.removeAttribute("aria-disabled");
			dom.removeAttribute("aria-readonly");
		}
	}, [editor, editable, disabled]);
}
