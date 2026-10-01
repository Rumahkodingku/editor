import { EditorError } from "../errors";

/**
 * Provider-independent image upload contract.
 *
 * The core never talks to a storage provider. Consumers implement
 * {@link ImageUploadHandler} and hand it to the image extension.
 */

/** Result of a successful upload. */
export type ImageUploadResult = {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
};

/** Progress callback receiving a percentage between 0 and 100. */
export type ImageUploadProgressHandler = (percent: number) => void;

/** Context handed to an {@link ImageUploadHandler}. */
export type ImageUploadContext = {
	file: File;
	signal: AbortSignal;
	onProgress?: ImageUploadProgressHandler;
};

/** Consumer-provided upload implementation. */
export type ImageUploadHandler = (
	ctx: ImageUploadContext,
) => Promise<ImageUploadResult>;

/** Machine-readable upload failure reasons. */
export type ImageUploadErrorCode =
	| "unsupported-type"
	| "file-too-large"
	| "upload-failed"
	| "aborted"
	| "unsafe-source";

/** Typed upload error. Preserves the underlying cause when one exists. */
export class EditorUploadError extends EditorError {
	readonly code: ImageUploadErrorCode;

	constructor(
		code: ImageUploadErrorCode,
		message: string,
		options?: { cause?: unknown },
	) {
		super(message, options);
		this.name = "EditorUploadError";
		this.code = code;
	}
}

/** Configuration for the image upload pipeline. */
export type ImageUploadOptions = {
	upload: ImageUploadHandler;
	accept?: readonly string[];
	maxSize?: number;
	onError?: (error: EditorUploadError) => void;
};

/** Default accepted image MIME types. */
export const DEFAULT_IMAGE_ACCEPT: readonly string[] = [
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
];

/** Default maximum upload size (5 MiB). */
export const DEFAULT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export type ImageFileValidationOptions = {
	accept?: readonly string[];
	maxSize?: number;
};

/**
 * Validate a file against the configured type/size rules.
 *
 * Throws {@link EditorUploadError} with a specific code so callers can surface
 * actionable feedback.
 */
export function validateImageFile(
	file: File,
	options: ImageFileValidationOptions = {},
): void {
	const accept = options.accept ?? DEFAULT_IMAGE_ACCEPT;
	const maxSize = options.maxSize ?? DEFAULT_IMAGE_MAX_SIZE;

	if (accept.length > 0 && !accept.includes(file.type)) {
		throw new EditorUploadError(
			"unsupported-type",
			`Unsupported image type "${file.type || "unknown"}". Accepted: ${accept.join(
				", ",
			)}.`,
		);
	}

	if (file.size > maxSize) {
		throw new EditorUploadError(
			"file-too-large",
			`Image is too large (${file.size} bytes). Maximum: ${maxSize} bytes.`,
		);
	}
}

/**
 * Normalize any thrown value into an {@link EditorUploadError}.
 *
 * Abort errors (`AbortError`) become the `"aborted"` code so consumers can
 * ignore intentional cancellations.
 */
export function toUploadError(error: unknown): EditorUploadError {
	if (error instanceof EditorUploadError) {
		return error;
	}

	if (
		typeof error === "object" &&
		error !== null &&
		"name" in error &&
		(error as { name?: unknown }).name === "AbortError"
	) {
		return new EditorUploadError("aborted", "Image upload was aborted.", {
			cause: error,
		});
	}

	if (error instanceof Error) {
		return new EditorUploadError("upload-failed", error.message, {
			cause: error,
		});
	}

	return new EditorUploadError("upload-failed", "Image upload failed.", {
		cause: error,
	});
}
