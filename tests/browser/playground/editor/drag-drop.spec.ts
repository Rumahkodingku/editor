import type { Page } from "@playwright/test";

import { expect, test } from "../fixtures";

/**
 * File drag-and-drop into the editor. Synthetic `DataTransfer` is
 * engine-specific, so these run on Chromium only.
 */
test.describe("drag and drop", () => {
	async function dropFile(
		page: Page,
		scenarioId: string,
		file: { name: string; type: string; bytes: number[] },
	) {
		await page.evaluate(
			({ id, name, type, bytes }) => {
				const surface = document.querySelector(
					`[data-testid="scenario-${id}"] .rk-editor__surface`,
				);
				if (!surface) {
					throw new Error("Editor surface not found");
				}
				const transfer = new DataTransfer();
				transfer.items.add(new File([new Uint8Array(bytes)], name, { type }));
				const rect = surface.getBoundingClientRect();
				const init: DragEventInit = {
					dataTransfer: transfer,
					bubbles: true,
					cancelable: true,
					clientX: rect.left + 10,
					clientY: rect.top + 10,
				};
				for (const eventType of ["dragenter", "dragover", "drop"]) {
					surface.dispatchEvent(new DragEvent(eventType, init));
				}
			},
			{ id: scenarioId, ...file },
		);
	}

	test("uploads a dropped image through the same pipeline @chromium-only", async ({
		page,
		editor,
	}) => {
		await editor.goto("image-upload");
		const surface = editor.surface("image-upload");

		await dropFile(page, "image-upload", {
			name: "drop.png",
			type: "image/png",
			bytes: [137, 80, 78, 71, 13, 10, 26, 10],
		});

		await expect(surface.locator("img")).toHaveAttribute(
			"src",
			/^data:image\/svg\+xml/,
		);
	});

	test("reports a dropped image that fails to upload @chromium-only", async ({
		page,
		editor,
	}) => {
		await editor.goto("upload-error");
		const surface = editor.surface("upload-error");

		await dropFile(page, "upload-error", {
			name: "drop.png",
			type: "image/png",
			bytes: [137, 80, 78, 71, 13, 10, 26, 10],
		});

		// The drop pipeline reports through the extension's `onError`, wired to
		// the scenario's error panel for this flow.
		await expect(page.getByTestId("upload-error-message")).toContainText(
			"Mock upload failed on purpose.",
		);
		await expect(surface.locator("img")).toHaveCount(0);
	});

	test("ignores an invalid dropped file without crashing @chromium-only", async ({
		page,
		editor,
	}) => {
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));

		await editor.goto("image-upload");
		const surface = editor.surface("image-upload");

		await dropFile(page, "image-upload", {
			name: "notes.txt",
			type: "text/plain",
			bytes: [110, 111, 116],
		});

		await expect(surface.locator("img")).toHaveCount(0);
		await expect(surface).toBeVisible();
		expect(errors).toEqual([]);
	});
});
