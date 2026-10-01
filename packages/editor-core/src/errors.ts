/**
 * Base class for every error raised by `@rumahkodingku/editor-core`.
 *
 * Errors are typed so consumers can distinguish recoverable cases
 * (upload failures, unsupported schema versions) from programming
 * mistakes (invalid configuration, invalid content).
 */
export class EditorError extends Error {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = "EditorError";
	}
}

/** Raised when editor configuration is invalid or contradictory. */
export class EditorConfigError extends EditorError {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = "EditorConfigError";
	}
}

/** Raised when editor content is malformed or cannot be normalized. */
export class EditorContentError extends EditorError {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = "EditorContentError";
	}
}

/** Raised when persisted content uses an unsupported schema version. */
export class EditorSchemaVersionError extends EditorError {
	readonly schemaVersion: unknown;
	readonly supportedVersion: number;

	constructor(schemaVersion: unknown, supportedVersion: number) {
		super(
			`Unsupported persisted content schema version ${String(
				schemaVersion,
			)}. Supported version: ${supportedVersion}.`,
		);
		this.name = "EditorSchemaVersionError";
		this.schemaVersion = schemaVersion;
		this.supportedVersion = supportedVersion;
	}
}
