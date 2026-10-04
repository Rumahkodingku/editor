import type {
	EditorLabels,
	ToolbarItemDefinition,
} from "@rumahkodingku/editor-core";

/** A named group of core toolbar item ids. */
export type ToolbarGroupDefinition = {
	id: string;
	labelKey: keyof EditorLabels;
	itemIds: readonly string[];
};

/**
 * Default grouping of the core toolbar.
 *
 * Groups are semantic only (`role="group"` + accessible name); they carry no
 * visual-design dependency. Items that are not listed fall into the trailing
 * `other` group, so consumer-defined items are still rendered.
 */
export const DEFAULT_TOOLBAR_GROUPS: readonly ToolbarGroupDefinition[] = [
	{
		id: "formatting",
		labelKey: "toolbarFormatting",
		itemIds: ["bold", "italic", "underline", "strike", "code"],
	},
	{
		id: "headings",
		labelKey: "toolbarHeadings",
		itemIds: [
			"heading-1",
			"heading-2",
			"heading-3",
			"heading-4",
			"heading-5",
			"heading-6",
		],
	},
	{
		id: "lists",
		labelKey: "toolbarLists",
		itemIds: ["bulletList", "orderedList"],
	},
	{
		id: "blocks",
		labelKey: "toolbarBlocks",
		itemIds: ["blockquote", "codeBlock", "horizontalRule"],
	},
	{
		id: "history",
		labelKey: "toolbarHistory",
		itemIds: ["undo", "redo"],
	},
];

export type ResolvedToolbarGroup = {
	id: string;
	labelKey: keyof EditorLabels;
	items: ToolbarItemDefinition[];
};

/**
 * Group toolbar definitions while preserving declaration order.
 *
 * Unknown ids are collected into a final `other` group so custom toolbars still
 * render every item they pass.
 */
export function groupToolbarItems(
	items: readonly ToolbarItemDefinition[],
): ResolvedToolbarGroup[] {
	const byId = new Map(items.map((item) => [item.id, item]));
	const grouped = new Set<string>();

	const groups: ResolvedToolbarGroup[] = [];
	for (const definition of DEFAULT_TOOLBAR_GROUPS) {
		const groupItems = definition.itemIds
			.map((id) => byId.get(id))
			.filter((item): item is ToolbarItemDefinition => item !== undefined);

		if (groupItems.length === 0) {
			continue;
		}

		for (const item of groupItems) {
			grouped.add(item.id);
		}

		groups.push({
			id: definition.id,
			labelKey: definition.labelKey,
			items: groupItems,
		});
	}

	const remaining = items.filter((item) => !grouped.has(item.id));
	if (remaining.length > 0) {
		groups.push({ id: "other", labelKey: "toolbarOther", items: remaining });
	}

	return groups;
}
