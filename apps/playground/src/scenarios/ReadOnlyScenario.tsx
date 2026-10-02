import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture } from "../lib/fixtures";

/** Read-only scenario: selection and copy work, editing does not (Task 13). */
export function ReadOnlyScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-read-only">
			<ScenarioLayout inspector={<StatePanel snapshot={snapshot} />}>
				<Editor
					editable={false}
					defaultValue={defaultFixture}
					onReady={setEditor}
				/>
			</ScenarioLayout>
		</div>
	);
}
