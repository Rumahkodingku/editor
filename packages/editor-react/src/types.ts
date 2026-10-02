import type { EditorLabels } from "@rumahkodingku/editor-core";
import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";

/**
 * Props for the RumahKodingku React `Editor` component.
 *
 * The component owns React integration only: Tiptap/ProseMirror remains the
 * source of truth for the document. `value` selects controlled mode,
 * `defaultValue` selects uncontrolled mode (see the package README).
 */
export type EditorProps = {
	/** Controlled canonical JSON content. Takes precedence over `defaultValue`. */
	value?: JSONContent;
	/** Initial content for uncontrolled mode. */
	defaultValue?: JSONContent;
	/** Called with canonical JSON whenever a document-changing transaction runs. */
	onChange?: (content: JSONContent) => void;
	/** Called once per editor instance after it is created. */
	onReady?: (editor: Editor) => void;
	/** Placeholder shown while the document is empty. */
	placeholder?: string;
	/** Whether the editor accepts input. Defaults to `true`. */
	editable?: boolean;
	/** Disables the editor entirely (no focus/selection). Defaults to `false`. */
	disabled?: boolean;
	/** Additional Tiptap extensions, composed with the core default preset. */
	extensions?: AnyExtension[];
	/** Partial overrides for the core label set. */
	labels?: Partial<EditorLabels>;
	/** Render immediately on the first render. Pass `false` for SSR. */
	immediatelyRender?: boolean;
	/** Class name applied to the editor root element. */
	className?: string;
};
