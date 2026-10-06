import type { Editor, ToolbarItemDefinition } from "@rumahkodingku/editor-core";

import { useEditorRevision } from "../hooks/useEditorRevision";
import { Panel } from "./Panel";

type ToolbarInspectorProps = {
	editor: Editor | null;
	items: ToolbarItemDefinition[];
};

/**
 * Read-only view of toolbar item state.
 *
 * `active` and `disabled` are computed from the live editor on every render
 * rather than cached in state, so the panel matches the toolbar from the first
 * paint instead of only after a transaction.
 */
export function ToolbarInspector({ editor, items }: ToolbarInspectorProps) {
	useEditorRevision(editor);

	return (
		<Panel
			description="Live state of each toolbar item."
			testId="toolbar-inspector"
			title="Toolbar state"
		>
			<dl className="flex flex-col text-sm">
				{items.map((item) => {
					const active = editor ? item.isActive(editor) : false;
					const disabled = editor ? item.isDisabled(editor) : true;
					return (
						<div
							className="flex items-baseline justify-between gap-4 py-0.5"
							data-testid={`toolbar-item-${item.id}`}
							key={item.id}
						>
							<dt>
								<code className="font-mono text-rk-ink text-xs">{item.id}</code>
							</dt>
							<dd className="flex gap-3 font-mono text-xs">
								<span
									className={
										active ? "text-rk-success" : "text-rk-ink-muted/60"
									}
								>
									active: {String(active)}
								</span>
								<span
									className={
										disabled ? "text-rk-ink-muted/60" : "text-rk-ink-secondary"
									}
								>
									disabled: {String(disabled)}
								</span>
							</dd>
						</div>
					);
				})}
			</dl>
		</Panel>
	);
}
