import {
	ImageUpload,
	type ImageUploadHandler,
	type ImageUploadResult,
} from "@rumahkodingku/editor-core";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { expect, test, vi } from "vitest";

import { Editor } from "./Editor";

function hasImageNode(editor: TiptapEditor): boolean {
	return (editor.getJSON().content ?? []).some((node) => node.type === "image");
}

function fileInput(container: HTMLElement): HTMLInputElement {
	const input = container.querySelector<HTMLInputElement>('input[type="file"]');
	if (!input) {
		throw new Error("file input not found");
	}
	return input;
}

const file = new File(["data"], "photo.png", { type: "image/png" });

test("uploads the selected file through the core pipeline and inserts it", async () => {
	const upload = vi.fn(async () => ({ src: "https://example.com/a.png" }));
	let editor: TiptapEditor | null = null;
	const { container } = render(
		<Editor
			extensions={[ImageUpload.configure({ upload })]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	await act(async () => {
		fireEvent.change(fileInput(container), { target: { files: [file] } });
	});

	expect(upload).toHaveBeenCalledOnce();
	await waitFor(() => {
		expect(hasImageNode(editor as unknown as TiptapEditor)).toBe(true);
	});
});

test("derives the accept attribute from the configured extension", async () => {
	const upload: ImageUploadHandler = async () => ({
		src: "https://example.com/a.png",
	});
	const { container } = render(
		<Editor
			extensions={[
				ImageUpload.configure({ upload, accept: ["image/png", "image/webp"] }),
			]}
		/>,
	);

	expect(fileInput(container).getAttribute("accept")).toBe(
		"image/png,image/webp",
	);
});

test("reports progress and failure while keeping the editor usable", async () => {
	let rejectUpload: (error: unknown) => void = () => {};
	const upload: ImageUploadHandler = ({ onProgress }) =>
		new Promise<ImageUploadResult>((_resolve, reject) => {
			rejectUpload = reject;
			onProgress?.(25);
		});

	let editor: TiptapEditor | null = null;
	const { container } = render(
		<Editor
			extensions={[ImageUpload.configure({ upload })]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	await act(async () => {
		fireEvent.change(fileInput(container), { target: { files: [file] } });
	});

	const progress = await screen.findByRole("status");
	expect(progress.textContent).toBe("25%");

	await act(async () => {
		rejectUpload(new Error("boom"));
	});

	const alert = await screen.findByRole("alert");
	expect(alert.textContent).toContain("boom");
	expect((editor as unknown as TiptapEditor).isDestroyed).toBe(false);
	expect(hasImageNode(editor as unknown as TiptapEditor)).toBe(false);
});
