import { expect, test } from "vitest";

import { EditorContentError } from "../errors";
import {
	createEmptyDocument,
	isEmptyContent,
	isValidJSONContent,
	normalizeContent,
} from "./content";

const paragraph = (text: string) => ({
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text }] }],
});

test("createEmptyDocument returns a doc with one paragraph", () => {
	expect(createEmptyDocument()).toEqual({
		type: "doc",
		content: [{ type: "paragraph" }],
	});
});

test("isValidJSONContent accepts well-formed nodes", () => {
	expect(isValidJSONContent(createEmptyDocument())).toBe(true);
	expect(isValidJSONContent({ type: "text", text: "hi" })).toBe(true);
	expect(
		isValidJSONContent({
			type: "text",
			text: "hi",
			marks: [{ type: "bold" }],
		}),
	).toBe(true);
});

test("isValidJSONContent rejects malformed values", () => {
	expect(isValidJSONContent(null)).toBe(false);
	expect(isValidJSONContent([])).toBe(false);
	expect(isValidJSONContent("text")).toBe(false);
	expect(isValidJSONContent({ type: 1 })).toBe(false);
	expect(isValidJSONContent({ content: "nope" })).toBe(false);
	expect(isValidJSONContent({ content: [42] })).toBe(false);
	expect(isValidJSONContent({ marks: "bold" })).toBe(false);
});

test("isEmptyContent detects empty documents", () => {
	expect(isEmptyContent(createEmptyDocument())).toBe(true);
	expect(isEmptyContent(paragraph("   "))).toBe(true);
	expect(isEmptyContent(paragraph("hello"))).toBe(false);
	expect(
		isEmptyContent({
			type: "doc",
			content: [{ type: "image", attrs: { src: "https://x/y.png" } }],
		}),
	).toBe(false);
	expect(isEmptyContent("invalid")).toBe(false);
});

test("normalizeContent falls back to an empty document", () => {
	expect(normalizeContent(undefined)).toEqual(createEmptyDocument());
	expect(normalizeContent(null)).toEqual(createEmptyDocument());
});

test("normalizeContent throws for invalid content", () => {
	expect(() => normalizeContent(42)).toThrow(EditorContentError);
});

test("normalizeContent does not mutate the caller's content", () => {
	const source = paragraph("hello");
	const normalized = normalizeContent(source);

	normalized.content?.push({ type: "paragraph" });

	expect(source.content).toHaveLength(1);
	expect(normalized.content).toHaveLength(2);
	expect(normalized).not.toBe(source);
});
