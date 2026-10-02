import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { JsonInspector } from "../components/JsonInspector";
import { ScenarioLayout } from "../components/ScenarioLayout";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture } from "../lib/fixtures";

/** Initial JSON content scenario (Task 12). */
export function InitialContentScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-initial-content">
			<ScenarioLayout inspector={<JsonInspector value={snapshot.json} />}>
				<Editor defaultValue={defaultFixture} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
