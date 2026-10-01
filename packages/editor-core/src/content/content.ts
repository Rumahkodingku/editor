import type { JSONContent } from "@tiptap/core";

import { EditorContentError } from "../errors";

/**
 * Framework-independent helpers for working with canonical editor content
 * (Tiptap/ProseMirror JSON).
 */

/** Create a fresh empty document (`doc` with a single empty paragraph). */
export function createEmptyDocument(): JSONContent {
	return { type: "doc", content: [{ type: "paragraph" }] };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Structural validation of Tiptap/ProseMirror JSON.
 *
 * This intentionally checks shape only: it does not know the schema, so it
 * cannot tell whether a node type exists. Use the editor itself for
 * schema-level validation.
 */
export function isValidJSONContent(value: unknown): value is JSONContent {
	if (!isPlainObject(value)) {
		return false;
	}

	if (value.type !== undefined && typeof value.type !== "string") {
		return false;
	}

	if (value.text !== undefined && typeof value.text !== "string") {
		return false;
	}

	if (value.attrs !== undefined && !isPlainObject(value.attrs)) {
		return false;
	}

	if (value.marks !== undefined) {
		if (!Array.isArray(value.marks)) {
			return false;
		}
		if (!value.marks.every((mark) => isPlainObject(mark))) {
			return false;
		}
	}

	if (value.content !== undefined) {
		if (!Array.isArray(value.content)) {
			return false;
		}
		if (!value.content.every(isValidJSONContent)) {
			return false;
		}
	}

	return true;
}

function countContentNodes(node: JSONContent): number {
	if (typeof node.text === "string") {
		return node.text.trim() === "" ? 0 : 1;
	}

	if (Array.isArray(node.content)) {
		const children = node.content.reduce(
			(total, child) => total + countContentNodes(child),
			0,
		);
		return children;
	}

	// A leaf node without text (image, horizontal rule, ...) is content;
	// an empty paragraph/heading is not.
	return node.type === "paragraph" || node.type === "heading" ? 0 : 1;
}

/**
 * Whether content carries no visible content.
 *
 * Invalid content is reported as not-empty so the caller can surface the
 * validation error instead of silently treating it as blank.
 */
export function isEmptyContent(content: unknown): boolean {
	if (!isValidJSONContent(content)) {
		return false;
	}
	return countContentNodes(content) === 0;
}

/**
 * Return a deep copy of `content`, falling back to an empty document when the
 * value is `undefined`/`null`.
 *
 * Throws {@link EditorContentError} for invalid content. The input is never
 * mutated.
 */
export function normalizeContent(content?: unknown): JSONContent {
	if (content === undefined || content === null) {
		return createEmptyDocument();
	}

	if (!isValidJSONContent(content)) {
		throw new EditorContentError(
			"Invalid editor content: expected Tiptap/ProseMirror JSON.",
		);
	}

	return structuredClone(content);
}
