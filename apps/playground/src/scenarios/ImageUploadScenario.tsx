import {
	ImageUpload,
	type ImageUploadExtensionOptions,
	insertImageFromFile,
} from "@rumahkodingku/editor-core";
import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { ImageUp } from "lucide-react";
import { type ChangeEvent, useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { type UploadPhase, UploadStatus } from "../components/UploadStatus";
import { createMockUploadHandler } from "../lib/mockUpload";
import { buttonClass } from "../lib/ui";

const mockUpload = createMockUploadHandler();
const imageUploadOptions = {
	upload: mockUpload,
	allowedProtocols: ["data:"],
} satisfies ImageUploadExtensionOptions;
const imageExtensions = [ImageUpload.configure(imageUploadOptions)];

/**
 * Mock image upload scenario.
 *
 * The editor routes toolbar insertion, drag/drop, and paste through the same
 * injected handler. No storage provider is involved, and the upload contract is
 * exercised exactly as a consumer would receive it.
 */
export function ImageUploadScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const [status, setStatus] = useState<UploadPhase>("idle");
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
							<ImageUp aria-hidden="true" className="size-4" strokeWidth={2} />
							Insert image
							<input
								accept="image/*"
								className="hidden"
								data-testid="upload-input"
								onChange={handleFile}
								type="file"
							/>
						</label>
						<UploadStatus
							progress={progress}
							status={status}
							testId="upload-status"
						/>
					</>
				}
			>
				<Editor extensions={imageExtensions} onReady={setEditor} />
				<p className="text-rk-ink-muted text-sm">
					Drag and drop or paste an image directly into the editor — both use
					the same upload pipeline.
				</p>
			</ScenarioLayout>
		</div>
	);
}
