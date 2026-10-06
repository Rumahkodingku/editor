import {
	createDefaultToolbar,
	Editor,
	EditorToolbar,
	type TiptapEditor,
} from "@rumahkodingku/editor-react";
import { useMemo, useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { ToolbarInspector } from "../components/ToolbarInspector";
import { defaultFixture } from "../lib/fixtures";

/**
 * Toolbar composition contract (Task 29).
 *
 * The `Editor` component always renders its default toolbar. To validate custom
 * composition, a second `EditorToolbar` is rendered from a caller-provided list
 * of core `ToolbarItemDefinition`s, bound to the same editor instance. This is
 * the current public contract; a headless surface that replaces the built-in
 * toolbar is a Phase 06 concern.
 */
export function ToolbarScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const items = useMemo(() => createDefaultToolbar().slice(0, 6), []);

	return (
		<div data-testid="scenario-toolbar">
			<ScenarioLayout
				inspector={<ToolbarInspector editor={editor} items={items} />}
			>
				<div className="flex flex-col gap-3">
					<Editor defaultValue={defaultFixture} onReady={setEditor} />
					{editor ? (
						<div className="flex flex-col gap-2 rounded-lg border border-rk-hairline-strong border-dashed p-2 dark:border-rk-brand-dark">
							<p className="font-semibold text-[0.6875rem] text-rk-ink-muted uppercase tracking-wide">
								Custom toolbar (first 6 items)
							</p>
							<EditorToolbar
								editor={editor}
								items={items}
								labels={{ editor: "Custom toolbar" }}
							/>
						</div>
					) : null}
				</div>
			</ScenarioLayout>
		</div>
	);
}
