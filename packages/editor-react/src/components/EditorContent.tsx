import type { Editor } from "@tiptap/core";
import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { useContext } from "react";

import { EditorContext } from "../context/editor-context";
import { cx } from "../lib/cx";

export type EditorContentProps = {
	/** Editor to render. Falls back to the surrounding editor context. */
	editor?: Editor | null;
	/** Class name applied to the editing surface. */
	className?: string;
};

/**
 * The editing surface.
 *
 * A thin, composable wrapper over Tiptap's content surface: it renders the
 * document owned by the editor and never duplicates editor logic. Use it with
 * `<EditorProvider>` to build a custom layout, or rely on the all-in-one
 * `<Editor>`.
 */
export function EditorContent({ editor, className }: EditorContentProps) {
	const context = useContext(EditorContext);
	const resolvedEditor = editor ?? context?.editor ?? null;

	return (
		<TiptapEditorContent
			editor={resolvedEditor}
			className={cx("rk-editor__content", className)}
		/>
	);
}
