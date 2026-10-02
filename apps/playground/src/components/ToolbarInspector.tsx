import type { Editor, ToolbarItemDefinition } from "@rumahkodingku/editor-core";
import { useEditorState } from "@tiptap/react";

import { Panel } from "./Panel";

type ToolbarInspectorProps = {
	editor: Editor | null;
	items: ToolbarItemDefinition[];
};

type ToolbarRow = {
	id: string;
	active: boolean;
	disabled: boolean;
};

/** Read-only view of toolbar item state (Task 28). */
export function ToolbarInspector({ editor, items }: ToolbarInspectorProps) {
	const rows: ToolbarRow[] =
		useEditorState({
			editor,
			selector: ({ editor: current }) =>
				items.map((item) => ({
					id: item.id,
					active: current ? item.isActive(current) : false,
					disabled: current ? item.isDisabled(current) : true,
				})),
		}) ?? [];

	return (
		<Panel title="Toolbar state" testId="toolbar-inspector">
			<div className="flex flex-col gap-1 text-sm">
				{rows.map((row) => (
					<div
						key={row.id}
						data-testid={`toolbar-item-${row.id}`}
						className="flex items-center justify-between gap-4"
					>
						<code className="text-xs">{row.id}</code>
						<span className="flex gap-3 font-mono text-xs">
							<span className={row.active ? "text-blue-600" : "text-zinc-400"}>
								active: {String(row.active)}
							</span>
							<span className={row.disabled ? "text-zinc-400" : ""}>
								disabled: {String(row.disabled)}
							</span>
						</span>
					</div>
				))}
			</div>
		</Panel>
	);
}
