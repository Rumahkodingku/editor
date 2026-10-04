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
export type { EditorContentProps } from "./components/EditorContent";
export { EditorContent } from "./components/EditorContent";
export type { EditorProviderProps } from "./components/EditorProvider";
export { EditorProvider } from "./components/EditorProvider";
export type { EditorToolbarProps } from "./components/EditorToolbar";
export { EditorToolbar } from "./components/EditorToolbar";
export type { ImageAltPopoverProps } from "./components/ImageAltPopover";
export { ImageAltPopover } from "./components/ImageAltPopover";
export type { ImageControlProps } from "./components/ImageControl";
export { ImageControl } from "./components/ImageControl";
export type { LinkControlProps } from "./components/LinkControl";
export { LinkControl } from "./components/LinkControl";
export type { ToolbarButtonProps } from "./components/ToolbarButton";
export { ToolbarButton } from "./components/ToolbarButton";
export type { ToolbarGroupProps } from "./components/ToolbarGroup";
export { ToolbarGroup } from "./components/ToolbarGroup";
// Context
export {
	type EditorContextValue,
	useEditorContext,
} from "./context/editor-context";
export type { ToolbarIconProps } from "./icons/icons";
// Icons
export { ToolbarIcon } from "./icons/icons";
// Types
export type { EditorProps } from "./types";
