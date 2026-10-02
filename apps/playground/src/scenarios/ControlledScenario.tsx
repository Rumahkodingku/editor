import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { JsonInspector } from "../components/JsonInspector";
import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { altFixture, defaultFixture, emptyFixture } from "../lib/fixtures";
import { buttonClass } from "../lib/ui";

/** Controlled mode: parent owns the value, `onChange` propagates (Task 17). */
export function ControlledScenario() {
	const [value, setValue] = useState(defaultFixture);
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-controlled">
			<ScenarioLayout
				controls={
					<>
						<button
							type="button"
							data-testid="controlled-reset"
							className={buttonClass}
							onClick={() => setValue(defaultFixture)}
						>
							Reset to fixture
						</button>
						<button
							type="button"
							data-testid="controlled-alternate"
							className={buttonClass}
							onClick={() => setValue(altFixture)}
						>
							Load alternate
						</button>
						<button
							type="button"
							data-testid="controlled-clear"
							className={buttonClass}
							onClick={() => setValue(emptyFixture)}
						>
							Clear
						</button>
					</>
				}
				inspector={
					<>
						<StatePanel snapshot={snapshot} />
						<JsonInspector value={value} />
					</>
				}
			>
				<Editor value={value} onChange={setValue} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
