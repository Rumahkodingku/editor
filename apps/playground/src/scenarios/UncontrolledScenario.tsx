import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture, emptyFixture } from "../lib/fixtures";
import { buttonClass } from "../lib/ui";

/** Uncontrolled mode: the editor owns its state (Task 18). */
export function UncontrolledScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-uncontrolled">
			<ScenarioLayout
				controls={
					<>
						<button
							type="button"
							data-testid="uncontrolled-reset"
							className={buttonClass}
							disabled={!editor}
							onClick={() => editor?.commands.setContent(defaultFixture)}
						>
							Reset via editor API
						</button>
						<button
							type="button"
							data-testid="uncontrolled-clear"
							className={buttonClass}
							disabled={!editor}
							onClick={() => editor?.commands.setContent(emptyFixture)}
						>
							Clear
						</button>
					</>
				}
				inspector={<StatePanel snapshot={snapshot} />}
			>
				<Editor defaultValue={defaultFixture} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
