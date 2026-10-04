import { resolveLabels } from "@rumahkodingku/editor-core";
import { type ReactNode, useEffect, useMemo, useRef } from "react";

import {
	EditorContext,
	type EditorContextValue,
} from "../context/editor-context";
import { useControlledContent } from "../hooks/useControlledContent";
import { useEditableState } from "../hooks/useEditableState";
import { useEditorInstance } from "../hooks/useEditorInstance";
import { devWarn } from "../lib/devWarn";
import type { EditorProps } from "../types";

export type EditorProviderProps = EditorProps & {
	/** Surfaces that consume the shared editor instance. */
	children?: ReactNode;
};

const CONFLICT_WARNING =
	"Both `value` and `defaultValue` were provided. `value` takes precedence and `defaultValue` is ignored.";

/**
 * Own the editor lifecycle and share it through context.
 *
 * This is the headless half of the adapter: it creates the editor, wires
 * controlled/uncontrolled content, editability and `onReady`, and provides the
 * instance to composable surfaces (`EditorToolbar`, `EditorContent`, custom
 * controls). The all-in-one `Editor` renders a default layout around it.
 */
export function EditorProvider({
	value,
	defaultValue,
	onChange,
	onReady,
	placeholder,
	editable = true,
	disabled = false,
	extensions,
	labels: labelsProp,
	immediatelyRender,
	children,
}: EditorProviderProps) {
	const resolvedLabels = useMemo(() => resolveLabels(labelsProp), [labelsProp]);

	const warnedRef = useRef(false);
	useEffect(() => {
		if (
			value !== undefined &&
			defaultValue !== undefined &&
			!warnedRef.current
		) {
			warnedRef.current = true;
			devWarn(CONFLICT_WARNING);
		}
	}, [value, defaultValue]);

	const editor = useEditorInstance({
		value,
		defaultValue,
		placeholder,
		editable,
		disabled,
		extensions,
		labels: resolvedLabels,
		immediatelyRender,
		onChange,
	});

	useControlledContent(editor, value);
	useEditableState(editor, editable, disabled);

	const readyRef = useRef<typeof editor>(null);
	useEffect(() => {
		if (editor && readyRef.current !== editor) {
			readyRef.current = editor;
			onReady?.(editor);
		}
	}, [editor, onReady]);

	const contextValue = useMemo<EditorContextValue>(
		() => ({ editor, labels: resolvedLabels, editable, disabled }),
		[editor, resolvedLabels, editable, disabled],
	);

	return (
		<EditorContext.Provider value={contextValue}>
			{children}
		</EditorContext.Provider>
	);
}
