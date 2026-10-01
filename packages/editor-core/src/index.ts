/**
 * `@rumahkodingku/editor-core` — framework-independent editor core.
 *
 * Public surface, grouped by responsibility. Everything here is safe to import
 * in a server environment; browser APIs are only touched when an editor is
 * actually created or content is rendered.
 */

/** Package identifier. */
export const EDITOR_CORE_PACKAGE_NAME = "@rumahkodingku/editor-core" as const;

// Tiptap is part of the public contract (ARCHITECTURE §5.2).
export type { AnyExtension, Editor, JSONContent } from "@tiptap/core";
// Content
export {
	createEmptyDocument,
	isEmptyContent,
	isValidJSONContent,
	normalizeContent,
} from "./content/content";
// Editor
export { type CreateEditorOptions, createEditor } from "./editor/create-editor";
// Errors
export {
	EditorConfigError,
	EditorContentError,
	EditorError,
	EditorSchemaVersionError,
} from "./errors";
// Extensions
export {
	type ComposeExtensionsOptions,
	composeExtensions,
	createDefaultExtensions,
	type DefaultExtensionsOptions,
	type ExtensionCompositionMode,
	IMAGE_UPLOAD_EXTENSION_NAME,
	ImageUpload,
	type ImageUploadExtensionOptions,
	type InsertImageOptions,
	insertImageFromFile,
} from "./extensions";
// Labels
export { defaultLabels, type EditorLabels, resolveLabels } from "./labels";
// Persistence
export {
	createPersistenceEnvelope,
	EDITOR_SCHEMA_VERSION,
	type EditorSchemaVersion,
	isPersistenceEnvelope,
	isSupportedSchemaVersion,
	type PersistenceEnvelope,
	parsePersistenceEnvelope,
} from "./persistence/persistence";
// Security
export {
	DEFAULT_IMAGE_PROTOCOLS,
	DEFAULT_LINK_PROTOCOLS,
	isSafeUrl,
	type UrlValidationOptions,
} from "./security/urls";
// Serialization
export { jsonToHTML, toHTML, toJSON } from "./serialization/serialization";
// Toolbar
export {
	createDefaultToolbar,
	type ToolbarItemDefinition,
} from "./toolbar/toolbar";
// Upload
export {
	DEFAULT_IMAGE_ACCEPT,
	DEFAULT_IMAGE_MAX_SIZE,
	EditorUploadError,
	type ImageFileValidationOptions,
	type ImageUploadContext,
	type ImageUploadErrorCode,
	type ImageUploadHandler,
	type ImageUploadOptions,
	type ImageUploadProgressHandler,
	type ImageUploadResult,
	toUploadError,
	validateImageFile,
} from "./upload/upload";
