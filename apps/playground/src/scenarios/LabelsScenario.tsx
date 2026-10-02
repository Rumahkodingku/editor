import { Editor } from "@rumahkodingku/editor-react";
import { useMemo } from "react";

import { ScenarioLayout } from "../components/ScenarioLayout";
import { defaultFixture } from "../lib/fixtures";

/** Labels override scenario (Task 23). */
export function LabelsScenario() {
	const labels = useMemo(
		() => ({
			editor: "Editor teks kaya",
			bold: "Tebal",
			italic: "Miring",
		}),
		[],
	);

	return (
		<div data-testid="scenario-labels">
			<p className="mb-3 text-sm text-zinc-500">
				Only three labels are overridden; the rest fall back to the core
				defaults through <code>resolveLabels</code>. Inspect the toolbar
				buttons' accessible names.
			</p>
			<ScenarioLayout>
				<Editor labels={labels} defaultValue={defaultFixture} />
			</ScenarioLayout>
		</div>
	);
}
