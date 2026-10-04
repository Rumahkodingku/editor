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
	heading4: string;
	heading5: string;
	heading6: string;
	horizontalRule: string;
	link: string;
	unlink: string;
	image: string;
	undo: string;
	redo: string;
	toolbarFormatting: string;
	toolbarHeadings: string;
	toolbarLists: string;
	toolbarBlocks: string;
	toolbarInsert: string;
	toolbarHistory: string;
	toolbarOther: string;
	apply: string;
	cancel: string;
	url: string;
	altText: string;
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
	heading4: "Heading 4",
	heading5: "Heading 5",
	heading6: "Heading 6",
	horizontalRule: "Horizontal rule",
	link: "Link",
	unlink: "Remove link",
	image: "Image",
	undo: "Undo",
	redo: "Redo",
	toolbarFormatting: "Text formatting",
	toolbarHeadings: "Headings",
	toolbarLists: "Lists",
	toolbarBlocks: "Blocks",
	toolbarInsert: "Insert",
	toolbarHistory: "History",
	toolbarOther: "More",
	apply: "Apply",
	cancel: "Cancel",
	url: "URL",
	altText: "Alt text",
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
