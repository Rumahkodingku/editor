import { ImageUpload, insertImageFromFile } from "@rumahkodingku/editor-core";
import { act, render } from "@testing-library/react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import { expect, test, vi } from "vitest";

import { Editor } from "./components/Editor";

function hasImageNode(editor: TiptapEditor): boolean {
	return (editor.getJSON().content ?? []).some((node) => node.type === "image");
}

test("inserts an image through the core upload contract", async () => {
	const onProgress = vi.fn();
	const upload = vi.fn(async () => {
		onProgress(50);
		return { src: "https://example.com/image.png", alt: "uploaded" };
	});

	let editor: TiptapEditor | null = null;
	render(
		<Editor
			extensions={[ImageUpload.configure({ upload, accept: ["image/png"] })]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	const file = new File(["data"], "image.png", { type: "image/png" });
	await act(async () => {
		await insertImageFromFile(editor as unknown as TiptapEditor, file);
	});

	expect(upload).toHaveBeenCalledTimes(1);
	expect(onProgress).toHaveBeenCalledWith(50);
	expect(hasImageNode(editor as unknown as TiptapEditor)).toBe(true);
});

test("rejects a file that fails validation without inserting a node", async () => {
	const onError = vi.fn();
	const upload = vi.fn();

	let editor: TiptapEditor | null = null;
	render(
		<Editor
			extensions={[
				ImageUpload.configure({ upload, accept: ["image/png"], onError }),
			]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	const file = new File(["data"], "image.jpg", { type: "image/jpeg" });
	await act(async () => {
		await insertImageFromFile(editor as unknown as TiptapEditor, file);
	});

	expect(upload).not.toHaveBeenCalled();
	expect(onError).toHaveBeenCalledTimes(1);
	expect(hasImageNode(editor as unknown as TiptapEditor)).toBe(false);
});

test("cleans up the placeholder when the upload fails", async () => {
	const onError = vi.fn();
	const upload = vi.fn(async () => {
		throw new Error("upload failed");
	});

	let editor: TiptapEditor | null = null;
	render(
		<Editor
			extensions={[
				ImageUpload.configure({ upload, accept: ["image/png"], onError }),
			]}
			onReady={(instance) => {
				editor = instance;
			}}
		/>,
	);

	const file = new File(["data"], "image.png", { type: "image/png" });
	await act(async () => {
		await insertImageFromFile(editor as unknown as TiptapEditor, file);
	});

	expect(onError).toHaveBeenCalledTimes(1);
	expect(hasImageNode(editor as unknown as TiptapEditor)).toBe(false);
});
