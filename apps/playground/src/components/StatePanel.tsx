import type { EditorSnapshot } from "../hooks/useEditorSnapshot";
import { Panel } from "./Panel";

type StatePanelProps = {
	snapshot: EditorSnapshot;
	disabled?: boolean;
};

/** Development inspector for editor state (Task 16). */
export function StatePanel({ snapshot, disabled = false }: StatePanelProps) {
	const rows: Array<[string, string]> = [
		["editable", String(snapshot.editable)],
		["disabled", String(disabled)],
		["focused", String(snapshot.focused)],
		["empty", String(snapshot.empty)],
		["doc size", String(snapshot.docSize)],
		["json length", String(JSON.stringify(snapshot.json).length)],
		["html length", String(snapshot.html.length)],
	];

	return (
		<Panel title="Editor state" testId="state-panel">
			<div className="flex flex-col gap-1 text-sm">
				{rows.map(([key, value]) => (
					<div key={key} className="flex justify-between gap-4">
						<span className="text-zinc-500">{key}</span>
						<span
							data-testid={`state-${key.replace(/\s+/g, "-")}`}
							className="font-mono"
						>
							{value}
						</span>
					</div>
				))}
			</div>
		</Panel>
	);
}
