import type { EditorSnapshot } from "../hooks/useEditorSnapshot";
import { Panel } from "./Panel";

type StatePanelProps = {
	snapshot: EditorSnapshot;
	disabled?: boolean;
};

const ROW_CLASS = "flex items-baseline justify-between gap-4 py-0.5";

/**
 * Development inspector for editor state.
 *
 * Values are read straight from the live editor instance, so the panel is a
 * debug view rather than a source of truth: nothing here feeds back into the
 * document.
 */
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
		<Panel
			description="Live values read from the editor instance."
			testId="state-panel"
			title="Editor state"
		>
			<dl className="flex flex-col text-sm">
				{rows.map(([key, value]) => (
					<div className={ROW_CLASS} key={key}>
						<dt className="text-rk-ink-muted">{key}</dt>
						<dd
							className="font-mono text-rk-ink"
							data-testid={`state-${key.replace(/\s+/g, "-")}`}
						>
							{value}
						</dd>
					</div>
				))}
			</dl>
		</Panel>
	);
}
