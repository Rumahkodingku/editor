import { useEditorContext } from "../context/editor-context";
import { cx } from "../lib/cx";
import type { EditorProps } from "../types";
import { EditorContent } from "./EditorContent";
import { EditorProvider } from "./EditorProvider";
import { EditorToolbar } from "./EditorToolbar";
import { ImageAltPopover } from "./ImageAltPopover";
import { ImageControl } from "./ImageControl";
import { LinkControl } from "./LinkControl";
import { ToolbarGroup } from "./ToolbarGroup";

/**
 * The RumahKodingku React editor.
 *
 * An all-in-one default layout: it creates the editor through
 * {@link EditorProvider} and renders the default toolbar (core formatting plus
 * link/image controls) and the editing surface. For a custom layout, compose
 * `EditorProvider`, `EditorToolbar` and `EditorContent` directly.
 *
 * React owns the integration (lifecycle, props, callbacks, rendering); the
 * Tiptap/ProseMirror instance owns the document.
 */
export function Editor({ className, ...props }: EditorProps) {
	return (
		<EditorProvider {...props}>
			<EditorShell className={className} />
		</EditorProvider>
	);
}

function EditorShell({ className }: { className?: string }) {
	const { labels, editable, disabled } = useEditorContext();

	return (
		<div
			className={cx("rk-editor", className)}
			data-disabled={disabled ? "true" : undefined}
			data-readonly={!disabled && editable === false ? "true" : undefined}
		>
			<EditorToolbar>
				<ToolbarGroup label={labels.toolbarInsert}>
					<LinkControl />
					<ImageControl />
					<ImageAltPopover />
				</ToolbarGroup>
			</EditorToolbar>
			<EditorContent />
		</div>
	);
}
