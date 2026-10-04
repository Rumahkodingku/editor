import type { ToolbarItemDefinition } from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";

import { ToolbarIcon } from "../icons/icons";
import { cx } from "../lib/cx";

/** Items whose active state is a toggle (`aria-pressed`) rather than an action. */
const TOGGLE_ITEM_IDS = new Set([
	"bold",
	"italic",
	"underline",
	"strike",
	"code",
	"heading-1",
	"heading-2",
	"heading-3",
	"heading-4",
	"heading-5",
	"heading-6",
	"bulletList",
	"orderedList",
	"blockquote",
	"codeBlock",
]);

export type ToolbarButtonProps = {
	/** Editor instance the command runs against. */
	editor: Editor | null;
	/** Core toolbar definition this button renders. */
	item: ToolbarItemDefinition;
	/** Resolved, localized accessible name. */
	label: string;
	/** Whether the item is currently active. */
	active: boolean;
	/** Whether the item is currently unavailable. */
	disabled: boolean;
	/**
	 * Explicit tabindex. Omit to let the toolbar's roving-tabindex hook manage
	 * the single tab stop.
	 */
	tabIndex?: number;
	/** Called when the button receives focus. */
	onFocus?: () => void;
};

/**
 * A single toolbar control. All command logic comes from the core definition;
 * this component only renders and forwards the click.
 */
export function ToolbarButton({
	editor,
	item,
	label,
	active,
	disabled,
	tabIndex,
	onFocus,
}: ToolbarButtonProps) {
	const isDisabled = disabled || !editor;
	const isToggle = TOGGLE_ITEM_IDS.has(item.id);

	return (
		<button
			type="button"
			className={cx(
				"rk-editor__button",
				active && "rk-editor__button--active",
				isDisabled && "rk-editor__button--disabled",
			)}
			aria-label={label}
			aria-pressed={isToggle ? active : undefined}
			aria-disabled={isDisabled}
			disabled={isDisabled}
			tabIndex={isDisabled ? -1 : tabIndex}
			title={item.shortcut ? `${label} (${item.shortcut})` : label}
			onFocus={onFocus}
			onMouseDown={(event) => {
				// Keep the editor selection when the toolbar is clicked.
				event.preventDefault();
			}}
			onClick={() => {
				if (editor) {
					item.run(editor);
				}
			}}
		>
			<ToolbarIcon name={item.icon} />
		</button>
	);
}
