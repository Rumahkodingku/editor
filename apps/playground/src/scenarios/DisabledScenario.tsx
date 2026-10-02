import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture } from "../lib/fixtures";

/** Disabled scenario: no focus or interaction, toolbar disabled (Task 14). */
export function DisabledScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-disabled">
			<ScenarioLayout inspector={<StatePanel snapshot={snapshot} disabled />}>
				<Editor disabled defaultValue={defaultFixture} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
