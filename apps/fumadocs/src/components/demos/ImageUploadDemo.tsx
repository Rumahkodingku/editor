"use client";

import {
	ImageUpload,
	type ImageUploadExtensionOptions,
	insertImageFromFile,
} from "@rumahkodingku/editor-core";
import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { type ChangeEvent, useState } from "react";

import { createMockUploadHandler } from "./mock-upload";

const mockUpload = createMockUploadHandler();
const imageUploadOptions = {
	upload: mockUpload,
	allowedProtocols: ["data:"],
} satisfies ImageUploadExtensionOptions;
const imageExtensions = [ImageUpload.configure(imageUploadOptions)];

type UploadStatus = "idle" | "uploading" | "done" | "error";

/** Image upload through a consumer-provided handler; no storage provider. */
export function ImageUploadDemo() {
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
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<label className="cursor-pointer rounded-md border px-3 py-1.5 text-sm">
					Insert image
					<input
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFile}
					/>
				</label>
				<span className="text-sm">
					status: {status} ({progress}%)
				</span>
			</div>
			<Editor
				extensions={imageExtensions}
				immediatelyRender={false}
				onReady={setEditor}
			/>
			<p className="text-sm">
				Drag and drop or paste an image — every path uses the same handler.
			</p>
		</div>
	);
}
