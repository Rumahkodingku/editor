import {
	ImageUpload,
	type ImageUploadExtensionOptions,
	insertImageFromFile,
} from "@rumahkodingku/editor-core";
import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { type ChangeEvent, useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { createMockUploadHandler } from "../lib/mockUpload";
import { buttonClass } from "../lib/ui";

const mockUpload = createMockUploadHandler();
const imageUploadOptions = {
	upload: mockUpload,
	allowedProtocols: ["data:"],
} satisfies ImageUploadExtensionOptions;
const imageExtensions = [ImageUpload.configure(imageUploadOptions)];

type UploadStatus = "idle" | "uploading" | "done" | "error";

/**
 * Mock image upload scenario (Task 30).
 *
 * The editor routes toolbar insertion, drag/drop, and paste through the same
 * injected handler. No storage provider is involved.
 */
export function ImageUploadScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const [status, setStatus] = useState<UploadStatus>("idle");
	const [progress, setProgress] = useState(0);

	const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file || !editor) {
			return;
		}
		setStatus("uploading");
		setProgress(0);
		const result = await insertImageFromFile(editor, file, {
			...imageUploadOptions,
			onProgress: setProgress,
		});
		setStatus(result ? "done" : "error");
	};

	return (
		<div data-testid="scenario-image-upload">
			<ScenarioLayout
				controls={
					<>
						<label className={buttonClass}>
							Insert image
							<input
								type="file"
								accept="image/*"
								data-testid="upload-input"
								className="hidden"
								onChange={handleFile}
							/>
						</label>
						<span data-testid="upload-status" className="text-sm text-zinc-500">
							status: {status} ({progress}%)
						</span>
					</>
				}
			>
				<Editor extensions={imageExtensions} onReady={setEditor} />
				<p className="text-sm text-zinc-500">
					Drag and drop or paste an image directly into the editor — both use
					the same upload pipeline.
				</p>
			</ScenarioLayout>
		</div>
	);
}
