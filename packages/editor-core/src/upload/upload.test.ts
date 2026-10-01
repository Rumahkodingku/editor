import { expect, test } from "vitest";

import {
	DEFAULT_IMAGE_ACCEPT,
	DEFAULT_IMAGE_MAX_SIZE,
	EditorUploadError,
	toUploadError,
	validateImageFile,
} from "./upload";

function makeFile(name = "photo.png", type = "image/png", size = 1024): File {
	return new File([new Uint8Array(size)], name, { type });
}

test("accepts a supported image within the size limit", () => {
	expect(() => validateImageFile(makeFile())).not.toThrow();
});

test("rejects unsupported MIME types", () => {
	try {
		validateImageFile(makeFile("notes.txt", "text/plain"));
		expect.unreachable("should have thrown");
	} catch (error) {
		expect(error).toBeInstanceOf(EditorUploadError);
		expect((error as EditorUploadError).code).toBe("unsupported-type");
	}
});

test("rejects files larger than the maximum size", () => {
	try {
		validateImageFile(
			makeFile("big.png", "image/png", DEFAULT_IMAGE_MAX_SIZE + 1),
		);
		expect.unreachable("should have thrown");
	} catch (error) {
		expect((error as EditorUploadError).code).toBe("file-too-large");
	}
});

test("honors custom accept and maxSize options", () => {
	expect(() =>
		validateImageFile(makeFile("a.svg", "image/svg+xml"), {
			accept: ["image/svg+xml"],
		}),
	).not.toThrow();

	expect(() =>
		validateImageFile(makeFile("a.png", "image/png"), { accept: [] }),
	).not.toThrow();
});

test("exposes default accept list", () => {
	expect(DEFAULT_IMAGE_ACCEPT).toContain("image/png");
	expect(DEFAULT_IMAGE_ACCEPT).not.toContain("image/svg+xml");
});

test("toUploadError passes through EditorUploadError", () => {
	const original = new EditorUploadError("unsafe-source", "nope");
	expect(toUploadError(original)).toBe(original);
});

test("toUploadError maps abort errors", () => {
	const abort = new Error("aborted");
	abort.name = "AbortError";

	const mapped = toUploadError(abort);
	expect(mapped.code).toBe("aborted");
	expect(mapped.cause).toBe(abort);
});

test("toUploadError maps generic errors", () => {
	const mapped = toUploadError(new Error("network down"));
	expect(mapped.code).toBe("upload-failed");
	expect(mapped.message).toBe("network down");
});
