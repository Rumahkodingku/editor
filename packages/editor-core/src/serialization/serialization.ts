import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";

import { normalizeContent } from "../content/content";
import { createDefaultExtensions } from "../extensions/default-extensions";

/**
 * Serialization helpers.
 *
 * JSON stays canonical; HTML is an output format only. Nothing here accepts
 * HTML as input.
 */

/** Current canonical JSON content of an editor instance. */
export function toJSON(editor: Editor): JSONContent {
	return editor.getJSON() as JSONContent;
}

/** HTML output of an editor instance. */
export function toHTML(editor: Editor): string {
	return editor.getHTML();
}

/**
 * Render canonical JSON to HTML without an editor instance.
 *
 * Uses Tiptap's server-capable HTML generation, so it works in a Node/SSR
 * environment (requires the optional `happy-dom` peer at runtime).
 */
export function jsonToHTML(
	content: JSONContent,
	extensions?: AnyExtension[],
): string {
	return generateHTML(
		normalizeContent(content),
		extensions ?? createDefaultExtensions(),
	);
}
