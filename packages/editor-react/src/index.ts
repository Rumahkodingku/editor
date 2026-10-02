"use client";

/**
 * React adapter for RumahKodingku Editor.
 *
 * The adapter consumes the public API of `@rumahkodingku/editor-core`; editor
 * behavior stays in core and the document stays owned by Tiptap. Only the
 * intentional public surface is exported here.
 */

/** Package identifier. */
export const EDITOR_REACT_PACKAGE_NAME = "@rumahkodingku/editor-react" as const;

// Core public types a consumer needs.
export type {
	EditorLabels,
	ImageUploadHandler,
	ImageUploadOptions,
	ImageUploadResult,
	PersistenceEnvelope,
	ToolbarItemDefinition,
} from "@rumahkodingku/editor-core";
// Convenience re-exports from editor-core so the common case needs one install
// (ARCHITECTURE §4.5). Values used by application code:
export {
	composeExtensions,
	createDefaultExtensions,
	createDefaultToolbar,
	defaultLabels,
	ImageUpload,
	resolveLabels,
} from "@rumahkodingku/editor-core";
// Tiptap types are part of the public contract (ARCHITECTURE §5.2). `Editor` is
// aliased to avoid colliding with the React `Editor` component.
export type {
	AnyExtension,
	Editor as TiptapEditor,
	JSONContent,
} from "@tiptap/core";
// Components
export { Editor } from "./components/Editor";
export type { EditorToolbarProps } from "./components/EditorToolbar";
export { EditorToolbar } from "./components/EditorToolbar";
export type { ToolbarButtonProps } from "./components/ToolbarButton";
export { ToolbarButton } from "./components/ToolbarButton";
export type { ToolbarIconProps } from "./icons/icons";
// Icons
export { ToolbarIcon } from "./icons/icons";
// Types
export type { EditorProps } from "./types";
