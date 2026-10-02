import {
	composeExtensions,
	createDefaultExtensions,
	createEmptyDocument,
	type EditorLabels,
	toJSON,
} from "@rumahkodingku/editor-core";
import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { useMemo, useRef } from "react";

export type UseEditorInstanceOptions = {
	value?: JSONContent;
	defaultValue?: JSONContent;
	placeholder?: string;
	editable: boolean;
	disabled: boolean;
	extensions?: AnyExtension[];
	labels: EditorLabels;
	immediatelyRender?: boolean;
	onChange?: (content: JSONContent) => void;
};

/**
 * Create and own the Tiptap editor for one React component.
 *
 * Core owns the editor configuration (default preset + composition); React only
 * owns the lifecycle. The editor is created once and only recreated when the
 * composed extension array changes — ordinary renders never recreate it.
 */
export function useEditorInstance(
	options: UseEditorInstanceOptions,
): Editor | null {
	const {
		value,
		defaultValue,
		placeholder,
		editable,
		disabled,
		extensions,
		labels,
		immediatelyRender,
		onChange,
	} = options;

	const resolvedExtensions = useMemo(
		() =>
			composeExtensions(
				createDefaultExtensions({ placeholder }),
				extensions ?? [],
			),
		[placeholder, extensions],
	);

	const initialContentRef = useRef<JSONContent | undefined>(undefined);
	if (initialContentRef.current === undefined) {
		initialContentRef.current = value ?? defaultValue ?? createEmptyDocument();
	}

	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	const labelsRef = useRef(labels);
	labelsRef.current = labels;

	const handleUpdate = useMemo(
		() =>
			({ editor }: { editor: Editor }) => {
				onChangeRef.current?.(toJSON(editor));
			},
		[],
	);

	const editorOptions = useMemo(
		() => ({
			extensions: resolvedExtensions,
			content: initialContentRef.current,
			editable: editable && !disabled,
			immediatelyRender,
			editorProps: {
				attributes: {
					class: "rk-editor__surface",
					role: "textbox",
					"aria-multiline": "true",
					"aria-label": labelsRef.current.editor,
				},
			},
			onUpdate: handleUpdate,
		}),
		[resolvedExtensions, editable, disabled, immediatelyRender, handleUpdate],
	);

	return useEditor(editorOptions, [resolvedExtensions]) as Editor | null;
}
