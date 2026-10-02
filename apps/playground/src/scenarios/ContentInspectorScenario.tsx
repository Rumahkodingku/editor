import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { HtmlInspector } from "../components/HtmlInspector";
import { JsonInspector } from "../components/JsonInspector";
import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture, emptyFixture } from "../lib/fixtures";
import { buttonClass } from "../lib/ui";

/** JSON + HTML inspectors and content reset (Tasks 25–27). */
export function ContentInspectorScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-content-inspector">
			<ScenarioLayout
				controls={
					<>
						<button
							type="button"
							data-testid="content-reset"
							className={buttonClass}
							disabled={!editor}
							onClick={() => editor?.commands.setContent(defaultFixture)}
						>
							Reset to fixture
						</button>
						<button
							type="button"
							data-testid="content-clear"
							className={buttonClass}
							disabled={!editor}
							onClick={() => editor?.commands.setContent(emptyFixture)}
						>
							Clear
						</button>
					</>
				}
				inspector={
					<>
						<JsonInspector value={snapshot.json} />
						<HtmlInspector value={snapshot.html} />
						<StatePanel snapshot={snapshot} />
					</>
				}
			>
				<Editor defaultValue={defaultFixture} onReady={setEditor} />
			</ScenarioLayout>
		</div>
	);
}
