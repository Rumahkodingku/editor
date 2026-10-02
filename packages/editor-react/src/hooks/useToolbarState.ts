import type { ToolbarItemDefinition } from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

export type ToolbarItemState = {
	active: boolean;
	disabled: boolean;
};

function emptyStates(items: ToolbarItemDefinition[]): ToolbarItemState[] {
	return items.map(() => ({ active: false, disabled: true }));
}

/**
 * Derive toolbar active/disabled state from the editor.
 *
 * Backed by Tiptap's `useEditorState`, so the toolbar subscribes to editor
 * transactions and never needs a React global store.
 */
export function useToolbarState(
	editor: Editor | null,
	items: ToolbarItemDefinition[],
): ToolbarItemState[] {
	const states = useEditorState({
		editor,
		selector: ({ editor: current }) => {
			if (!current) {
				return emptyStates(items);
			}
			return items.map((item) => ({
				active: item.isActive(current),
				disabled: item.isDisabled(current),
			}));
		},
		equalityFn: (a, b) => {
			if (!a || !b || a.length !== b.length) {
				return false;
			}
			return a.every((item, index) => {
				const other = b[index];
				return (
					other !== undefined &&
					item.active === other.active &&
					item.disabled === other.disabled
				);
			});
		},
	});

	return states ?? emptyStates(items);
}
