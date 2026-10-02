import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { Mark } from "@tiptap/core";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { defaultFixture } from "../lib/fixtures";
import { buttonClass } from "../lib/ui";

/**
 * A consumer-defined extension. It is composed with the core default preset by
 * the adapter via `composeExtensions` — the package is never modified.
 */
const Highlight = Mark.create({
	name: "highlight",
	parseHTML() {
		return [{ tag: "mark" }];
	},
	renderHTML() {
		return ["mark", { "data-rk-highlight": "true" }, 0];
	},
});

/** Module-level so the array stays referentially stable across renders. */
const customExtensions = [Highlight];

/** Custom extension composition scenario (Task 24). */
export function CustomExtensionsScenario() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-custom-extensions">
			<ScenarioLayout
				controls={
					<button
						type="button"
						data-testid="toggle-highlight"
						className={buttonClass}
						disabled={!editor}
						onClick={() =>
							editor?.chain().focus().toggleMark("highlight").run()
						}
					>
						Toggle "highlight" mark
					</button>
				}
				inspector={<StatePanel snapshot={snapshot} />}
			>
				<Editor
					extensions={customExtensions}
					defaultValue={defaultFixture}
					onReady={setEditor}
				/>
			</ScenarioLayout>
		</div>
	);
}
