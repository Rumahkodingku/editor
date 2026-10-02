import { normalizeContent } from "@rumahkodingku/editor-core";
import type { Editor, JSONContent } from "@tiptap/core";
import { useEffect, useRef } from "react";

import { deepEqual } from "../lib/deepEqual";

/**
 * Synchronize a controlled `value` into the editor.
 *
 * The incoming value is only compared when its reference changes, and it is
 * applied with `emitUpdate: false` so it neither fires `onChange` nor creates a
 * React → editor → React loop. Selection is untouched when content is equal.
 */
export function useControlledContent(
	editor: Editor | null,
	value?: JSONContent,
): void {
	const lastValueRef = useRef<JSONContent | undefined>(value);

	useEffect(() => {
		if (!editor || value === undefined) {
			lastValueRef.current = value;
			return;
		}

		if (lastValueRef.current === value) {
			return;
		}

		lastValueRef.current = value;

		const normalized = normalizeContent(value);
		if (!deepEqual(editor.getJSON(), normalized)) {
			editor.commands.setContent(normalized, { emitUpdate: false });
		}
	}, [editor, value]);
}
