// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";

import { createEditor } from "../../editor/create-editor";
import {
	EditorUploadError,
	type ImageUploadHandler,
} from "../../upload/upload";
import { createDefaultExtensions } from "../default-extensions";
import { insertImageFromFile } from "./image-upload";

const editors: ReturnType<typeof createEditor>[] = [];

function makeEditor(upload?: ImageUploadHandler) {
	const editor = createEditor({
		extensions: createDefaultExtensions(upload ? { upload: { upload } } : {}),
	});
	editors.push(editor);
	return editor;
}

function makeFile(type = "image/png", size = 16): File {
	return new File([new Uint8Array(size)], "photo.png", { type });
}

function imageNodes(editor: ReturnType<typeof createEditor>) {
	return (editor.getJSON().content ?? []).filter(
		(node) => node.type === "image",
	);
}

afterEach(() => {
	for (const editor of editors.splice(0)) {
		editor.destroy();
	}
});

test("uploads a file and inserts the resulting image", async () => {
	const editor = makeEditor(async () => ({
		src: "https://cdn.example.com/a.png",
		alt: "A photo",
	}));

	const result = await insertImageFromFile(editor, makeFile());

	expect(result?.src).toBe("https://cdn.example.com/a.png");
	const images = imageNodes(editor);
	expect(images).toHaveLength(1);
	expect(images[0]?.attrs?.src).toBe("https://cdn.example.com/a.png");
	expect(images[0]?.attrs?.alt).toBe("A photo");
	expect(images[0]?.attrs?.uploadId).toBeNull();
});

test("reports unsupported file types without inserting anything", async () => {
	const editor = makeEditor();
	const onError = vi.fn();

	await insertImageFromFile(editor, makeFile("text/plain"), {
		upload: async () => ({ src: "https://cdn.example.com/a.png" }),
		onError,
	});

	expect(onError).toHaveBeenCalledOnce();
	expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(EditorUploadError);
	expect(onError.mock.calls[0]?.[0].code).toBe("unsupported-type");
	expect(imageNodes(editor)).toHaveLength(0);
});

test("removes the placeholder and reports a failed upload", async () => {
	const editor = makeEditor();
	const onError = vi.fn();

	const result = await insertImageFromFile(editor, makeFile(), {
		upload: async () => {
			throw new Error("network down");
		},
		onError,
	});

	expect(result).toBeNull();
	expect(onError.mock.calls[0]?.[0].code).toBe("upload-failed");
	expect(imageNodes(editor)).toHaveLength(0);
});

test("rejects an unsafe uploaded source", async () => {
	const editor = makeEditor();
	const onError = vi.fn();

	await insertImageFromFile(editor, makeFile(), {
		upload: async () => ({ src: "javascript:alert(1)" }),
		onError,
	});

	expect(onError.mock.calls[0]?.[0].code).toBe("unsafe-source");
	expect(imageNodes(editor)).toHaveLength(0);
});

test("forwards progress reporting", async () => {
	const editor = makeEditor();
	const onProgress = vi.fn();

	await insertImageFromFile(editor, makeFile(), {
		upload: async (ctx) => {
			ctx.onProgress?.(50);
			return { src: "https://cdn.example.com/a.png" };
		},
		onProgress,
	});

	expect(onProgress).toHaveBeenCalledWith(50);
});

test("maps aborts to a dedicated error code", async () => {
	const editor = makeEditor();
	const onError = vi.fn();

	await insertImageFromFile(editor, makeFile(), {
		upload: async () => {
			const error = new Error("stopped");
			error.name = "AbortError";
			throw error;
		},
		onError,
	});

	expect(onError.mock.calls[0]?.[0].code).toBe("aborted");
	expect(imageNodes(editor)).toHaveLength(0);
});

test("reports a missing upload handler", async () => {
	const editor = makeEditor();
	const onError = vi.fn();

	await insertImageFromFile(editor, makeFile(), { onError });

	expect(onError.mock.calls[0]?.[0].code).toBe("upload-failed");
});
