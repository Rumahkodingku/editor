import {
	createDefaultToolbar,
	type EditorLabels,
	resolveLabels,
	type ToolbarItemDefinition,
} from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { type KeyboardEvent, useCallback, useMemo, useState } from "react";

import { useToolbarState } from "../hooks/useToolbarState";
import { cx } from "../lib/cx";
import { ToolbarButton } from "./ToolbarButton";

export type EditorToolbarProps = {
	/** Editor the toolbar controls. */
	editor: Editor | null;
	/** Partial label overrides applied on top of the core defaults. */
	labels?: Partial<EditorLabels>;
	/** Items to render. Defaults to the core default toolbar. */
	items?: ToolbarItemDefinition[];
	/** Class name applied to the toolbar root element. */
	className?: string;
};

/**
 * Render core toolbar definitions as React controls.
 *
 * The default toolbar is the core default; consumers can pass their own `items`
 * (composed from core definitions) without mutating global state.
 */
export function EditorToolbar({
	editor,
	labels,
	items,
	className,
}: EditorToolbarProps) {
	const resolvedLabels = useMemo(() => resolveLabels(labels), [labels]);
	const toolbarItems = useMemo(() => items ?? createDefaultToolbar(), [items]);
	const states = useToolbarState(editor, toolbarItems);
	const [focusIndex, setFocusIndex] = useState(0);

	const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
			return;
		}

		const buttons = Array.from(
			event.currentTarget.querySelectorAll<HTMLButtonElement>(
				"button:not([disabled])",
			),
		);
		if (buttons.length === 0) {
			return;
		}

		const currentIndex = buttons.indexOf(
			document.activeElement as HTMLButtonElement,
		);
		if (currentIndex === -1) {
			return;
		}

		event.preventDefault();
		const delta = event.key === "ArrowRight" ? 1 : -1;
		const nextIndex = (currentIndex + delta + buttons.length) % buttons.length;
		buttons[nextIndex]?.focus();
	}, []);

	return (
		<div
			role="toolbar"
			aria-label={resolvedLabels.editor}
			aria-orientation="horizontal"
			className={cx("rk-editor__toolbar", className)}
			onKeyDown={handleKeyDown}
		>
			{toolbarItems.map((item, index) => (
				<ToolbarButton
					key={item.id}
					editor={editor}
					item={item}
					label={resolvedLabels[item.labelKey]}
					active={states[index]?.active ?? false}
					disabled={states[index]?.disabled ?? true}
					tabIndex={focusIndex === index ? 0 : -1}
					onFocus={() => setFocusIndex(index)}
				/>
			))}
		</div>
	);
}
