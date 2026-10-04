import {
	DEFAULT_IMAGE_ACCEPT,
	type EditorLabels,
	type EditorUploadError,
	IMAGE_UPLOAD_EXTENSION_NAME,
	resolveLabels,
} from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { type ChangeEvent, useContext, useMemo, useRef } from "react";

import { EditorContext } from "../context/editor-context";
import { useImageUpload } from "../hooks/useImageUpload";
import { ToolbarIcon } from "../icons/icons";
import { cx } from "../lib/cx";

export type ImageControlProps = {
	/** Editor to act on. Falls back to the surrounding editor context. */
	editor?: Editor | null;
	/** Partial label overrides applied on top of the resolved/core defaults. */
	labels?: Partial<EditorLabels>;
	/** Class name applied to the control wrapper. */
	className?: string;
	/** Forwarded upload progress callback. */
	onProgress?: (percent: number) => void;
	/** Forwarded upload error callback. */
	onError?: (error: EditorUploadError) => void;
};

/**
 * Toolbar control that inserts an image through the core upload pipeline.
 *
 * It reuses the configured {@link ImageUpload} extension (accept, size limits,
 * allowed protocols, handler) instead of defining a second upload mechanism,
 * and surfaces progress and failure inline.
 */
export function ImageControl({
	editor: editorProp,
	labels,
	className,
	onProgress,
	onError,
}: ImageControlProps) {
	const context = useContext(EditorContext);
	const editor = editorProp ?? context?.editor ?? null;
	const resolvedLabels = useMemo(
		() => resolveLabels(labels ?? context?.labels),
		[labels, context?.labels],
	);

	const { status, progress, error, upload } = useImageUpload(editor, {
		onProgress,
		onError,
	});
	const inputRef = useRef<HTMLInputElement>(null);

	const accept = useMemo(() => {
		const extension = editor?.extensionManager.extensions.find(
			(entry) => entry.name === IMAGE_UPLOAD_EXTENSION_NAME,
		);
		const configured = (
			extension?.options as { accept?: readonly string[] } | undefined
		)?.accept;
		const types =
			configured && configured.length > 0 ? configured : DEFAULT_IMAGE_ACCEPT;
		return types.join(",");
	}, [editor]);

	const editable = context ? context.editable && !context.disabled : true;
	const isDisabled = !editor || !editable;

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (file) {
			void upload(file);
		}
	};

	return (
		<div className={cx("rk-editor__control", className)}>
			<button
				type="button"
				className={cx(
					"rk-editor__button",
					isDisabled && "rk-editor__button--disabled",
				)}
				aria-label={resolvedLabels.image}
				aria-disabled={isDisabled}
				disabled={isDisabled}
				onMouseDown={(event) => event.preventDefault()}
				onClick={() => inputRef.current?.click()}
			>
				<ToolbarIcon name="image" />
			</button>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="rk-editor__file-input"
				onChange={handleChange}
				tabIndex={-1}
				aria-hidden="true"
			/>
			{status === "uploading" ? (
				<span className="rk-editor__progress" role="status" aria-live="polite">
					{progress}%
				</span>
			) : null}
			{status === "error" && error ? (
				<span className="rk-editor__upload-error" role="alert">
					{error.message}
				</span>
			) : null}
		</div>
	);
}
