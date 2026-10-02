import type { ImageUploadHandler } from "@rumahkodingku/editor-core";

/**
 * Offline, deterministic image source used by the mock upload handler.
 *
 * A data URI keeps the Playground self-contained (no network, no storage
 * provider). The scenarios that use this configure the image extension with
 * `allowedProtocols: ["data:"]`, which also exercises the public URL-safety
 * option.
 */
const MOCK_IMAGE_DATA_URL = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" fill="#e0e7ff"/><text x="120" y="76" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#3730a3">Mock upload</text></svg>',
)}`;

export type MockUploadOptions = {
	/** Reject every upload to exercise the failure path. */
	fail?: boolean;
	/** Simulated per-step delay in milliseconds. */
	delayMs?: number;
	/** Number of simulated progress steps. */
	steps?: number;
};

function delay(ms: number, signal: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		if (signal.aborted) {
			reject(new DOMException("Upload aborted", "AbortError"));
			return;
		}
		const timer = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		function onAbort() {
			clearTimeout(timer);
			reject(new DOMException("Upload aborted", "AbortError"));
		}
		signal.addEventListener("abort", onAbort, { once: true });
	});
}

/**
 * Create a development-only {@link ImageUploadHandler}.
 *
 * It simulates an asynchronous upload with progress, supports cancellation via
 * the signal, and returns a predictable local URL. No storage provider is
 * involved.
 */
export function createMockUploadHandler(
	options: MockUploadOptions = {},
): ImageUploadHandler {
	const { fail = false, delayMs = 120, steps = 4 } = options;

	return async ({ file, signal, onProgress }) => {
		for (let step = 1; step <= steps; step += 1) {
			await delay(delayMs, signal);
			onProgress?.(Math.round((step / steps) * 100));
		}

		if (fail) {
			throw new Error("Mock upload failed on purpose.");
		}

		return { src: MOCK_IMAGE_DATA_URL, alt: file.name };
	};
}
