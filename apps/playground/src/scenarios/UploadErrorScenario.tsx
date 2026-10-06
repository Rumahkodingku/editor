import {
	type EditorUploadError,
	ImageUpload,
	insertImageFromFile,
} from "@rumahkodingku/editor-core";
import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { type ChangeEvent, useMemo, useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { type UploadPhase, UploadStatus } from "../components/UploadStatus";
import { createMockUploadHandler } from "../lib/mockUpload";
import { buttonClass } from "../lib/ui";

/**
 * Upload failure scenario.
 *
 * The handler always fails, so the placeholder must be removed, `onError` must
 * be reported, and the editor must stay stable.
 */
export function UploadErrorScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const [status, setStatus] = useState<UploadPhase>("idle");
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
		setStatus(result ? "done" : "error");
	};

	return (
		<div data-testid="scenario-upload-error">
			<ScenarioLayout
				controls={
					<>
						<label className={buttonClass}>
							<TriangleAlert
								aria-hidden="true"
								className="size-4"
								strokeWidth={2}
							/>
							Trigger failing upload
							<input
								accept="image/*"
								className="hidden"
								data-testid="upload-error-input"
								onChange={handleFile}
								type="file"
							/>
						</label>
						<UploadStatus status={status} testId="upload-error-status" />
					</>
				}
				inspector={
					<div
						aria-live="polite"
						className="flex items-start gap-2.5 rounded-lg border border-rk-hairline bg-rk-canvas p-3 text-sm dark:bg-rk-canvas-soft"
						data-testid="upload-error-message"
						role={error ? "alert" : "status"}
					>
						<CircleAlert
							aria-hidden="true"
							className={`mt-0.5 size-4 shrink-0 ${error ? "text-rk-danger" : "text-rk-ink-muted/50"}`}
							strokeWidth={2}
						/>
						<span
							className={
								error
									? "break-words font-mono text-rk-danger"
									: "text-rk-ink-muted"
							}
						>
							{error ? error : "No error reported yet."}
						</span>
					</div>
				}
			>
				<Editor extensions={extensions} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
