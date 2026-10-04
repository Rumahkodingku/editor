import type { ImageUploadHandler } from "@rumahkodingku/editor-core";

/**
 * Offline, deterministic image source used by the documentation examples.
 *
 * A data URI keeps the examples self-contained (no network, no storage
 * provider). The examples configure the image extension with
 * `allowedProtocols: ["data:"]`.
 */
const MOCK_IMAGE_DATA_URL = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" fill="#e0e7ff"/><text x="120" y="76" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#3730a3">Mock upload</text></svg>',
)}`;

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
 * Create a documentation-only {@link ImageUploadHandler} that simulates an
 * asynchronous upload with progress and supports cancellation.
 */
export function createMockUploadHandler(): ImageUploadHandler {
	return async ({ file, signal, onProgress }) => {
		const steps = 4;
		for (let step = 1; step <= steps; step += 1) {
			await delay(120, signal);
			onProgress?.(Math.round((step / steps) * 100));
		}

		return { src: MOCK_IMAGE_DATA_URL, alt: file.name };
	};
}
