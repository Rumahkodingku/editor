import { resolveLabels } from "@rumahkodingku/editor-core";
import { EditorContent } from "@tiptap/react";
import { useEffect, useMemo, useRef } from "react";

import { useControlledContent } from "../hooks/useControlledContent";
import { useEditableState } from "../hooks/useEditableState";
import { useEditorInstance } from "../hooks/useEditorInstance";
import { cx } from "../lib/cx";
import { devWarn } from "../lib/devWarn";
import type { EditorProps } from "../types";
import { EditorToolbar } from "./EditorToolbar";

const CONFLICT_WARNING =
	"Both `value` and `defaultValue` were provided. `value` takes precedence and `defaultValue` is ignored.";

/**
 * The RumahKodingku React editor.
 *
 * React owns the integration (lifecycle, props, callbacks, rendering); the
 * Tiptap/ProseMirror instance owns the document. See the package README for the
 * controlled vs. uncontrolled contract.
 */
export function Editor({
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
	className,
}: EditorProps) {
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

	return (
		<div
			className={cx("rk-editor", className)}
			data-disabled={disabled ? "true" : undefined}
			data-readonly={!disabled && editable === false ? "true" : undefined}
		>
			<EditorToolbar editor={editor} labels={resolvedLabels} />
			<EditorContent editor={editor} className="rk-editor__content" />
		</div>
	);
}
