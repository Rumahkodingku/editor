/**
 * Localization-ready label model.
 *
 * Labels are framework-independent and consumed by toolbars/adapters.
 * Every user-facing string the core can describe has a stable key here.
 */
export type EditorLabels = {
	editor: string;
	bold: string;
	italic: string;
	underline: string;
	strike: string;
	code: string;
	codeBlock: string;
	blockquote: string;
	bulletList: string;
	orderedList: string;
	heading1: string;
	heading2: string;
	heading3: string;
	horizontalRule: string;
	link: string;
	unlink: string;
	image: string;
	undo: string;
	redo: string;
};

/** Default (English) labels. */
export const defaultLabels: EditorLabels = {
	editor: "Rich text editor",
	bold: "Bold",
	italic: "Italic",
	underline: "Underline",
	strike: "Strikethrough",
	code: "Inline code",
	codeBlock: "Code block",
	blockquote: "Blockquote",
	bulletList: "Bullet list",
	orderedList: "Numbered list",
	heading1: "Heading 1",
	heading2: "Heading 2",
	heading3: "Heading 3",
	horizontalRule: "Horizontal rule",
	link: "Link",
	unlink: "Remove link",
	image: "Image",
	undo: "Undo",
	redo: "Redo",
};

/**
 * Merge consumer overrides on top of the defaults.
 *
 * Always returns a new object so the shared {@link defaultLabels} can never be
 * mutated by a caller.
 */
export function resolveLabels(overrides?: Partial<EditorLabels>): EditorLabels {
	return { ...defaultLabels, ...overrides };
}
