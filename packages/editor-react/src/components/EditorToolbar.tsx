import {
	createDefaultToolbar,
	type EditorLabels,
	resolveLabels,
	type ToolbarItemDefinition,
} from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { type ReactNode, useContext, useMemo } from "react";

import { EditorContext } from "../context/editor-context";
import { useRovingTabIndex } from "../hooks/useRovingTabIndex";
import {
	type ToolbarItemState,
	useToolbarState,
} from "../hooks/useToolbarState";
import { cx } from "../lib/cx";
import { groupToolbarItems } from "./defaultToolbarGroups";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarGroup } from "./ToolbarGroup";

export type EditorToolbarProps = {
	/** Editor the toolbar controls. Falls back to the surrounding context. */
	editor?: Editor | null;
	/** Partial label overrides applied on top of the resolved/core defaults. */
	labels?: Partial<EditorLabels>;
	/** Items to render. Defaults to the core default toolbar. */
	items?: ToolbarItemDefinition[];
	/** Extra controls (link/image/custom) rendered after the grouped items. */
	children?: ReactNode;
	/** Class name applied to the toolbar root element. */
	className?: string;
};

const EMPTY_STATE: ToolbarItemState = { active: false, disabled: true };

/**
 * Render core toolbar definitions as React controls.
 *
 * Core formatting commands come from `createDefaultToolbar`; adapter-composed
 * controls (link, image) are passed as `children`, so a single toolbar can mix
 * both while the command logic stays in `editor-core`. The toolbar exposes a
 * single tab stop and arrow-key navigation (WAI-ARIA toolbar pattern).
 */
export function EditorToolbar({
	editor,
	labels,
	items,
	children,
	className,
}: EditorToolbarProps) {
	const context = useContext(EditorContext);
	const resolvedEditor = editor ?? context?.editor ?? null;
	const resolvedLabels = useMemo(
		() => resolveLabels(labels ?? context?.labels),
		[labels, context?.labels],
	);

	const toolbarItems = useMemo(() => items ?? createDefaultToolbar(), [items]);
	const groups = useMemo(() => groupToolbarItems(toolbarItems), [toolbarItems]);
	const states = useToolbarState(resolvedEditor, toolbarItems);

	const stateById = useMemo(() => {
		const map = new Map<string, ToolbarItemState>();
		toolbarItems.forEach((item, index) => {
			map.set(item.id, states[index] ?? EMPTY_STATE);
		});
		return map;
	}, [toolbarItems, states]);

	const dependency = useMemo(
		() =>
			`${toolbarItems
				.map((item) => (stateById.get(item.id)?.disabled ? "1" : "0"))
				.join("")}|${children ? "1" : "0"}`,
		[toolbarItems, stateById, children],
	);
	const containerRef = useRovingTabIndex<HTMLDivElement>(dependency);

	return (
		<div
			ref={containerRef}
			role="toolbar"
			aria-label={resolvedLabels.editor}
			aria-orientation="horizontal"
			className={cx("rk-editor__toolbar", className)}
		>
			{groups.map((group) => (
				<ToolbarGroup key={group.id} label={resolvedLabels[group.labelKey]}>
					{group.items.map((item) => (
						<ToolbarButton
							key={item.id}
							editor={resolvedEditor}
							item={item}
							label={resolvedLabels[item.labelKey]}
							active={stateById.get(item.id)?.active ?? false}
							disabled={stateById.get(item.id)?.disabled ?? true}
						/>
					))}
				</ToolbarGroup>
			))}
			{children}
		</div>
	);
}
