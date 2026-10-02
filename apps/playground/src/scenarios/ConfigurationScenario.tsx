import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { StatePanel } from "../components/StatePanel";
import { useEditorSnapshot } from "../hooks/useEditorSnapshot";
import { emptyFixture } from "../lib/fixtures";
import { inputClass, labelClass } from "../lib/ui";

/**
 * Placeholder / editable / disabled controls (Tasks 20–22).
 *
 * Changing the placeholder reconfigures the default preset, which recreates the
 * editor; that is expected behaviour of the public API.
 */
export function ConfigurationScenario() {
	const [placeholder, setPlaceholder] = useState("Type something…");
	const [editable, setEditable] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const snapshot = useEditorSnapshot(editor);

	return (
		<div data-testid="scenario-configuration">
			<ScenarioLayout
				controls={
					<>
						<label className={labelClass}>
							Placeholder
							<input
								type="text"
								data-testid="config-placeholder"
								className={inputClass}
								value={placeholder}
								onChange={(event) => setPlaceholder(event.target.value)}
							/>
						</label>
						<label className={labelClass}>
							<input
								type="checkbox"
								data-testid="config-editable"
								checked={editable}
								onChange={(event) => setEditable(event.target.checked)}
							/>
							editable
						</label>
						<label className={labelClass}>
							<input
								type="checkbox"
								data-testid="config-disabled"
								checked={disabled}
								onChange={(event) => setDisabled(event.target.checked)}
							/>
							disabled
						</label>
					</>
				}
				inspector={<StatePanel snapshot={snapshot} disabled={disabled} />}
			>
				<Editor
					placeholder={placeholder}
					editable={editable}
					disabled={disabled}
					defaultValue={emptyFixture}
					onReady={setEditor}
				/>
			</ScenarioLayout>
		</div>
	);
}
