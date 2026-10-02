import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture } from "../lib/fixtures";

/** Baseline scenario: rendering, editing, toolbar, normal behaviour (Task 11). */
export function BasicScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-basic">
			<ScenarioLayout inspector={<StatePanel snapshot={snapshot} />}>
				<Editor defaultValue={defaultFixture} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
