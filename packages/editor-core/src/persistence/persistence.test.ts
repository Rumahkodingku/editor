import { expect, test } from "vitest";

import { EditorContentError, EditorSchemaVersionError } from "../errors";
import {
	createPersistenceEnvelope,
	EDITOR_SCHEMA_VERSION,
	isPersistenceEnvelope,
	isSupportedSchemaVersion,
	parsePersistenceEnvelope,
} from "./persistence";

const content = {
	type: "doc",
	content: [{ type: "paragraph", content: [{ type: "text", text: "hi" }] }],
};

test("exposes the current schema version", () => {
	expect(EDITOR_SCHEMA_VERSION).toBe(1);
});

test("createPersistenceEnvelope wraps content", () => {
	expect(createPersistenceEnvelope(content)).toEqual({
		schemaVersion: 1,
		content,
	});
});

test("isPersistenceEnvelope validates shape", () => {
	expect(isPersistenceEnvelope(createPersistenceEnvelope(content))).toBe(true);
	expect(isPersistenceEnvelope(null)).toBe(false);
	expect(isPersistenceEnvelope({ schemaVersion: "1", content })).toBe(false);
	expect(isPersistenceEnvelope({ schemaVersion: 1 })).toBe(false);
	expect(isPersistenceEnvelope({ schemaVersion: 1, content: 5 })).toBe(false);
});

test("isSupportedSchemaVersion accepts only the current version", () => {
	expect(isSupportedSchemaVersion(1)).toBe(true);
	expect(isSupportedSchemaVersion(2)).toBe(false);
	expect(isSupportedSchemaVersion("1")).toBe(false);
});

test("parsePersistenceEnvelope returns a defensive copy", () => {
	const envelope = createPersistenceEnvelope(content);
	const parsed = parsePersistenceEnvelope(envelope);

	expect(parsed.schemaVersion).toBe(1);
	parsed.content.content?.push({ type: "paragraph" });

	expect(content.content).toHaveLength(1);
});

test("parsePersistenceEnvelope rejects malformed input", () => {
	expect(() => parsePersistenceEnvelope({ schemaVersion: 1 })).toThrow(
		EditorContentError,
	);
});

test("parsePersistenceEnvelope rejects unsupported versions", () => {
	try {
		parsePersistenceEnvelope({ schemaVersion: 99, content });
		expect.unreachable("should have thrown");
	} catch (error) {
		expect(error).toBeInstanceOf(EditorSchemaVersionError);
		const schemaError = error as EditorSchemaVersionError;
		expect(schemaError.schemaVersion).toBe(99);
		expect(schemaError.supportedVersion).toBe(1);
	}
});
