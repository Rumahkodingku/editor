import {
	type EditorUploadError,
	ImageUpload,
	insertImageFromFile,
} from "@rumahkodingku/editor-core";
import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { type ChangeEvent, useMemo, useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { createMockUploadHandler } from "../lib/mockUpload";
import { buttonClass } from "../lib/ui";

type UploadStatus = "idle" | "uploading" | "error";

/**
 * Upload failure scenario (Task 31).
 *
 * The handler always fails, so the placeholder must be removed, `onError` must
 * be reported, and the editor must stay stable.
 */
export function UploadErrorScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const [status, setStatus] = useState<UploadStatus>("idle");
	const [error, setError] = useState<string | null>(null);

	const uploadOptions = useMemo(
		() => ({
			upload: createMockUploadHandler({ fail: true, delayMs: 60 }),
			allowedProtocols: ["data:"],
			onError: (uploadError: EditorUploadError) => {
				setError(uploadError.message);
			},
		}),
		[],
	);
	const extensions = useMemo(
		() => [ImageUpload.configure(uploadOptions)],
		[uploadOptions],
	);

	const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file || !editor) {
			return;
		}
		setStatus("uploading");
		setError(null);
		const result = await insertImageFromFile(editor, file, uploadOptions);
		setStatus(result ? "idle" : "error");
	};

	return (
		<div data-testid="scenario-upload-error">
			<ScenarioLayout
				controls={
					<>
						<label className={buttonClass}>
							Trigger failing upload
							<input
								type="file"
								accept="image/*"
								data-testid="upload-error-input"
								className="hidden"
								onChange={handleFile}
							/>
						</label>
						<span
							data-testid="upload-error-status"
							className="text-sm text-zinc-500"
						>
							status: {status}
						</span>
					</>
				}
				inspector={
					<div
						data-testid="upload-error-message"
						className="rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
					>
						{error ? error : "No error reported yet."}
					</div>
				}
			>
				<Editor extensions={extensions} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
