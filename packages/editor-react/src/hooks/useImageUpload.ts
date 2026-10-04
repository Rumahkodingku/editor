import {
	type EditorUploadError,
	insertImageFromFile,
} from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { useCallback, useEffect, useRef, useState } from "react";

export type ImageUploadStatus = "idle" | "uploading" | "done" | "error";

export type UseImageUploadOptions = {
	/** Forwarded progress callback (percent 0–100). */
	onProgress?: (percent: number) => void;
	/** Forwarded error callback. */
	onError?: (error: EditorUploadError) => void;
};

/**
 * Drive the core image upload pipeline from React.
 *
 * Wraps `insertImageFromFile` with local state for progress and failure so the
 * control can render feedback without depending on a storage provider. The
 * in-flight upload is aborted when the component unmounts.
 */
export function useImageUpload(
	editor: Editor | null,
	options: UseImageUploadOptions = {},
) {
	const { onProgress, onError } = options;
	const [status, setStatus] = useState<ImageUploadStatus>("idle");
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<EditorUploadError | null>(null);
	const controllerRef = useRef<AbortController | null>(null);

	useEffect(
		() => () => {
			controllerRef.current?.abort();
		},
		[],
	);

	const upload = useCallback(
		async (file: File) => {
			if (!editor) {
				return null;
			}

			const controller = new AbortController();
			controllerRef.current = controller;
			setStatus("uploading");
			setProgress(0);
			setError(null);

			const result = await insertImageFromFile(editor, file, {
				signal: controller.signal,
				onProgress: (percent) => {
					setProgress(percent);
					onProgress?.(percent);
				},
				onError: (uploadError) => {
					setError(uploadError.code === "aborted" ? null : uploadError);
					onError?.(uploadError);
				},
			});

			const aborted = controller.signal.aborted;
			controllerRef.current = null;
			setStatus(aborted ? "idle" : result ? "done" : "error");

			return result;
		},
		[editor, onProgress, onError],
	);

	const cancel = useCallback(() => {
		controllerRef.current?.abort();
	}, []);

	return { status, progress, error, upload, cancel };
}
