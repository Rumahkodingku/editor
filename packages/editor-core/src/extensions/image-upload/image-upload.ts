import type { AnyExtension, Editor } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { Plugin, PluginKey } from "@tiptap/pm/state";

import { DEFAULT_IMAGE_PROTOCOLS, isSafeUrl } from "../../security/urls";
import {
	DEFAULT_IMAGE_ACCEPT,
	DEFAULT_IMAGE_MAX_SIZE,
	EditorUploadError,
	type ImageUploadOptions,
	type ImageUploadProgressHandler,
	type ImageUploadResult,
	toUploadError,
	validateImageFile,
} from "../../upload/upload";

/**
 * RumahKodingku-owned image extension.
 *
 * It owns the single upload pipeline used by paste, drag/drop, and programmatic
 * insertion. The storage provider is injected through {@link ImageUploadOptions};
 * the core never depends on a specific backend.
 */

/** Well-known extension name. */
export const IMAGE_UPLOAD_EXTENSION_NAME = "imageUpload";

/** 1x1 transparent GIF used as the in-document placeholder while uploading. */
const UPLOAD_PLACEHOLDER_SRC =
	"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export type ImageUploadExtensionOptions = Partial<ImageUploadOptions> & {
	/** Schemes accepted for the uploaded `src`. */
	allowedProtocols?: readonly string[];
};

export type InsertImageOptions = ImageUploadExtensionOptions & {
	/** Optional signal to cancel the upload. */
	signal?: AbortSignal;
	/** Optional progress callback forwarded to the upload handler. */
	onProgress?: ImageUploadProgressHandler;
};

const ImageWithUploadState = Image.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			uploadId: {
				default: null,
				parseHTML: (element: HTMLElement) =>
					element.getAttribute("data-rk-upload-id"),
				renderHTML: (attributes: Record<string, unknown>) =>
					attributes.uploadId
						? { "data-rk-upload-id": String(attributes.uploadId) }
						: {},
			},
		};
	},
});

function createUploadId(): string {
	if (typeof globalThis.crypto?.randomUUID === "function") {
		return `rk-image-${globalThis.crypto.randomUUID()}`;
	}
	return `rk-image-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2, 10)}`;
}

function pickImageFile(
	files: FileList | null | undefined,
	accept: readonly string[],
): File | null {
	if (!files || files.length === 0) {
		return null;
	}

	for (const file of Array.from(files)) {
		if (accept.length === 0 || accept.includes(file.type)) {
			return file;
		}
	}

	return null;
}

function findImagePosition(editor: Editor, uploadId: string): number | null {
	let found: number | null = null;

	editor.state.doc.descendants((node, position) => {
		if (found !== null) {
			return false;
		}
		if (node.type.name === "image" && node.attrs.uploadId === uploadId) {
			found = position;
			return false;
		}
		return true;
	});

	return found;
}

function insertImageNode(editor: Editor, attrs: Record<string, unknown>): void {
	editor.chain().focus().insertContent({ type: "image", attrs }).run();
}

function updateImageNode(
	editor: Editor,
	uploadId: string,
	attrs: Record<string, unknown>,
): void {
	const position = findImagePosition(editor, uploadId);
	if (position === null) {
		return;
	}

	editor
		.chain()
		.command(({ tr }) => {
			const node = tr.doc.nodeAt(position);
			if (!node) {
				return false;
			}
			tr.setNodeMarkup(position, undefined, { ...node.attrs, ...attrs });
			return true;
		})
		.run();
}

function removeImageNode(editor: Editor, uploadId: string): void {
	const position = findImagePosition(editor, uploadId);
	if (position === null) {
		return;
	}

	editor
		.chain()
		.command(({ tr, state }) => {
			const node = tr.doc.nodeAt(position);
			if (!node) {
				return false;
			}

			tr.delete(position, position + node.nodeSize);

			// The document requires at least one block node. If removing the
			// placeholder emptied it, restore an empty paragraph so the
			// transaction stays valid (otherwise it would be rejected and the
			// placeholder would survive).
			if (tr.doc.content.size === 0) {
				const paragraph = state.schema.nodes.paragraph;
				if (paragraph) {
					tr.insert(0, paragraph.create());
				}
			}

			return true;
		})
		.run();
}

function resolveUploadOptions(editor: Editor): ImageUploadExtensionOptions {
	const extension = editor.extensionManager.extensions.find(
		(item) => item.name === IMAGE_UPLOAD_EXTENSION_NAME,
	);
	return (extension?.options ?? {}) as ImageUploadExtensionOptions;
}

/**
 * Validate and upload a single image file, inserting a placeholder while the
 * upload runs.
 *
 * On success the placeholder is replaced with the uploaded image. On any
 * failure the placeholder is removed and the error is reported through
 * `onError`; the returned promise resolves to `null`.
 */
export async function insertImageFromFile(
	editor: Editor,
	file: File,
	options?: InsertImageOptions,
): Promise<ImageUploadResult | null> {
	const {
		upload,
		accept,
		maxSize,
		onError,
		allowedProtocols,
		signal,
		onProgress,
	} = { ...resolveUploadOptions(editor), ...options };

	try {
		validateImageFile(file, { accept, maxSize });
	} catch (error) {
		onError?.(toUploadError(error));
		return null;
	}

	if (!upload) {
		onError?.(
			new EditorUploadError(
				"upload-failed",
				"No image upload handler is configured.",
			),
		);
		return null;
	}

	const uploadId = createUploadId();
	insertImageNode(editor, { src: UPLOAD_PLACEHOLDER_SRC, uploadId });

	try {
		const result = await upload({
			file,
			signal: signal ?? new AbortController().signal,
			onProgress,
		});

		if (
			!isSafeUrl(result.src, {
				allowedProtocols: allowedProtocols ?? DEFAULT_IMAGE_PROTOCOLS,
				allowRelative: false,
			})
		) {
			throw new EditorUploadError(
				"unsafe-source",
				`Uploaded image source is not allowed: "${result.src}".`,
			);
		}

		updateImageNode(editor, uploadId, {
			src: result.src,
			alt: result.alt ?? null,
			width: result.width ?? null,
			height: result.height ?? null,
			uploadId: null,
		});

		return result;
	} catch (error) {
		removeImageNode(editor, uploadId);
		onError?.(toUploadError(error));
		return null;
	}
}

export const ImageUpload = Extension.create<ImageUploadExtensionOptions>({
	name: IMAGE_UPLOAD_EXTENSION_NAME,

	addOptions() {
		return {
			accept: [...DEFAULT_IMAGE_ACCEPT],
			maxSize: DEFAULT_IMAGE_MAX_SIZE,
			allowedProtocols: DEFAULT_IMAGE_PROTOCOLS,
		};
	},

	addExtensions(): AnyExtension[] {
		return [ImageWithUploadState.configure({ allowBase64: false })];
	},

	addProseMirrorPlugins() {
		const options = this.options;
		const handleFiles = (files: FileList | null | undefined): boolean => {
			if (!options.upload) {
				return false;
			}
			const file = pickImageFile(files, options.accept ?? DEFAULT_IMAGE_ACCEPT);
			if (!file) {
				return false;
			}
			void insertImageFromFile(this.editor, file, options);
			return true;
		};

		return [
			new Plugin({
				key: new PluginKey(IMAGE_UPLOAD_EXTENSION_NAME),
				props: {
					handlePaste: (_view, event) =>
						handleFiles(event.clipboardData?.files),
					handleDrop: (_view, event) => handleFiles(event.dataTransfer?.files),
				},
			}),
		];
	},
});
