import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { altFixture, defaultFixture } from "../lib/fixtures";

/**
 * Controlled/uncontrolled conflict (Task 19).
 *
 * Both `value` and `defaultValue` are supplied on purpose so the adapter's
 * development warning can be observed in the console. `value` wins.
 */
export function ConflictScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-conflict">
			<p className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 text-sm">
				Both <code>value</code> and <code>defaultValue</code> are passed. Open
				the browser console to see the adapter warning; the controlled{" "}
				<code>value</code> is rendered and <code>defaultValue</code> is ignored.
			</p>
			<ScenarioLayout inspector={<StatePanel snapshot={snapshot} />}>
				<Editor
					value={defaultFixture}
					defaultValue={altFixture}
					onReady={setEditor}
				/>
			</ScenarioLayout>
		</div>
	);
}
