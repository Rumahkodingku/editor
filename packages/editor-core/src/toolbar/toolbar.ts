import type { Editor } from "@tiptap/core";

import type { EditorLabels } from "../labels";

/**
 * Framework-independent toolbar model.
 *
 * A definition describes behavior only: adapters render it, they never own the
 * command logic. `icon` is an identifier for an inline SVG owned by the adapter,
 * so no icon package is required.
 */
export type ToolbarItemDefinition = {
	id: string;
	labelKey: keyof EditorLabels;
	icon: string;
	shortcut?: string;
	isActive: (editor: Editor) => boolean;
	isDisabled: (editor: Editor) => boolean;
	run: (editor: Editor) => void;
};

type MarkName = "bold" | "italic" | "underline" | "strike" | "code";

function createMarkItem(
	id: string,
	labelKey: keyof EditorLabels,
	icon: string,
	mark: MarkName,
	shortcut?: string,
): ToolbarItemDefinition {
	return {
		id,
		labelKey,
		icon,
		shortcut,
		isActive: (editor) => editor.isActive(mark),
		isDisabled: (editor) =>
			!editor.isEditable || !editor.can().toggleMark(mark),
		run: (editor) => {
			editor.chain().focus().toggleMark(mark).run();
		},
	};
}

function createHeadingItem(
	level: 1 | 2 | 3 | 4 | 5 | 6,
	labelKey: keyof EditorLabels,
	shortcut?: string,
): ToolbarItemDefinition {
	return {
		id: `heading-${level}`,
		labelKey,
		icon: `heading-${level}`,
		shortcut,
		isActive: (editor) => editor.isActive("heading", { level }),
		isDisabled: (editor) =>
			!editor.isEditable || !editor.can().toggleHeading({ level }),
		run: (editor) => {
			editor.chain().focus().toggleHeading({ level }).run();
		},
	};
}

/**
 * The default MVP toolbar.
 *
 * Only commands that need no additional input are included. Link insertion and
 * image upload require a URL or file picker, so adapters compose those buttons
 * themselves using the core contracts.
 */
export function createDefaultToolbar(): ToolbarItemDefinition[] {
	return [
		createMarkItem("bold", "bold", "bold", "bold", "Mod-b"),
		createMarkItem("italic", "italic", "italic", "italic", "Mod-i"),
		createMarkItem("underline", "underline", "underline", "underline", "Mod-u"),
		createMarkItem("strike", "strike", "strike", "strike", "Mod-Shift-x"),
		createMarkItem("code", "code", "code", "code", "Mod-e"),
		createHeadingItem(1, "heading1", "Mod-Alt-1"),
		createHeadingItem(2, "heading2", "Mod-Alt-2"),
		createHeadingItem(3, "heading3", "Mod-Alt-3"),
		createHeadingItem(4, "heading4", "Mod-Alt-4"),
		createHeadingItem(5, "heading5", "Mod-Alt-5"),
		createHeadingItem(6, "heading6", "Mod-Alt-6"),
		{
			id: "bulletList",
			labelKey: "bulletList",
			icon: "list",
			shortcut: "Mod-Shift-8",
			isActive: (editor) => editor.isActive("bulletList"),
			isDisabled: (editor) =>
				!editor.isEditable || !editor.can().toggleBulletList(),
			run: (editor) => {
				editor.chain().focus().toggleBulletList().run();
			},
		},
		{
			id: "orderedList",
			labelKey: "orderedList",
			icon: "list-ordered",
			shortcut: "Mod-Shift-7",
			isActive: (editor) => editor.isActive("orderedList"),
			isDisabled: (editor) =>
				!editor.isEditable || !editor.can().toggleOrderedList(),
			run: (editor) => {
				editor.chain().focus().toggleOrderedList().run();
			},
		},
		{
			id: "blockquote",
			labelKey: "blockquote",
			icon: "quote",
			shortcut: "Mod-Shift-b",
			isActive: (editor) => editor.isActive("blockquote"),
			isDisabled: (editor) =>
				!editor.isEditable || !editor.can().toggleBlockquote(),
			run: (editor) => {
				editor.chain().focus().toggleBlockquote().run();
			},
		},
		{
			id: "codeBlock",
			labelKey: "codeBlock",
			icon: "code-block",
			shortcut: "Mod-Alt-c",
			isActive: (editor) => editor.isActive("codeBlock"),
			isDisabled: (editor) =>
				!editor.isEditable || !editor.can().toggleCodeBlock(),
			run: (editor) => {
				editor.chain().focus().toggleCodeBlock().run();
			},
		},
		{
			id: "horizontalRule",
			labelKey: "horizontalRule",
			icon: "horizontal-rule",
			isActive: () => false,
			isDisabled: (editor) =>
				!editor.isEditable || !editor.can().setHorizontalRule(),
			run: (editor) => {
				editor.chain().focus().setHorizontalRule().run();
			},
		},
		{
			id: "undo",
			labelKey: "undo",
			icon: "undo",
			shortcut: "Mod-z",
			isActive: () => false,
			isDisabled: (editor) => !editor.isEditable || !editor.can().undo(),
			run: (editor) => {
				editor.chain().focus().undo().run();
			},
		},
		{
			id: "redo",
			labelKey: "redo",
			icon: "redo",
			shortcut: "Mod-Shift-z",
			isActive: () => false,
			isDisabled: (editor) => !editor.isEditable || !editor.can().redo(),
			run: (editor) => {
				editor.chain().focus().redo().run();
			},
		},
	];
}
