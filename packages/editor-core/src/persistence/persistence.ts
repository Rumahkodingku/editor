import type { JSONContent } from "@tiptap/core";
import { isValidJSONContent, normalizeContent } from "../content/content";
import { EditorContentError, EditorSchemaVersionError } from "../errors";

/**
 * Persistence boundary for editor content.
 *
 * Persisted data outlives the code that produced it, so it is wrapped in an
 * explicit envelope carrying the editor schema version. This version is owned
 * here and is independent from Tiptap's internal version.
 */

/** Current persisted content schema version. */
export const EDITOR_SCHEMA_VERSION = 1;

export type EditorSchemaVersion = typeof EDITOR_SCHEMA_VERSION;

/** Canonical persisted shape: `{ schemaVersion, content }`. */
export type PersistenceEnvelope<TContent extends JSONContent = JSONContent> = {
	schemaVersion: number;
	content: TContent;
};

/** Wrap canonical content in a persistence envelope. */
export function createPersistenceEnvelope(
	content: JSONContent,
	schemaVersion: number = EDITOR_SCHEMA_VERSION,
): PersistenceEnvelope {
	return { schemaVersion, content };
}

/** Whether a value is a structurally valid persistence envelope. */
export function isPersistenceEnvelope(
	value: unknown,
): value is PersistenceEnvelope {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.schemaVersion === "number" &&
		isValidJSONContent(candidate.content)
	);
}

/** Whether a version is the one this build understands. */
export function isSupportedSchemaVersion(
	version: unknown,
): version is EditorSchemaVersion {
	return version === EDITOR_SCHEMA_VERSION;
}

/**
 * Validate and unwrap a persistence envelope.
 *
 * Throws {@link EditorContentError} for malformed input and
 * {@link EditorSchemaVersionError} for an unsupported version. Returns a copy
 * of the content so the caller cannot mutate the source.
 */
export function parsePersistenceEnvelope(value: unknown): PersistenceEnvelope {
	if (!isPersistenceEnvelope(value)) {
		throw new EditorContentError(
			"Invalid persistence envelope: expected { schemaVersion, content }.",
		);
	}

	if (!isSupportedSchemaVersion(value.schemaVersion)) {
		throw new EditorSchemaVersionError(
			value.schemaVersion,
			EDITOR_SCHEMA_VERSION,
		);
	}

	return {
		schemaVersion: value.schemaVersion,
		content: normalizeContent(value.content),
	};
}
