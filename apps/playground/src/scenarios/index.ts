import { BasicScenario } from "./BasicScenario";
import { ConfigurationScenario } from "./ConfigurationScenario";
import { ConflictScenario } from "./ConflictScenario";
import { ContentInspectorScenario } from "./ContentInspectorScenario";
import { ControlledScenario } from "./ControlledScenario";
import { CustomExtensionsScenario } from "./CustomExtensionsScenario";
import { DisabledScenario } from "./DisabledScenario";
import { ImageUploadScenario } from "./ImageUploadScenario";
import { InitialContentScenario } from "./InitialContentScenario";
import { LabelsScenario } from "./LabelsScenario";
import { LinkSecurityScenario } from "./LinkSecurityScenario";
import { ReadOnlyScenario } from "./ReadOnlyScenario";
import { ToolbarScenario } from "./ToolbarScenario";
import type { PlaygroundScenario } from "./types";
import { UncontrolledScenario } from "./UncontrolledScenario";
import { UploadErrorScenario } from "./UploadErrorScenario";

/** Scenario shown when the URL hash does not name a known scenario. */
export const DEFAULT_SCENARIO_ID = "basic";

/** Single source of truth for the scenario navigation. */
export const scenarios: PlaygroundScenario[] = [
	{
		id: "basic",
		title: "Basic",
		description:
			"Baseline editor: rendering, editing, and the default toolbar.",
		component: BasicScenario,
	},
	{
		id: "initial-content",
		title: "Initial content",
		description: "Render a known JSON document and inspect it live.",
		component: InitialContentScenario,
	},
	{
		id: "read-only",
		title: "Read-only",
		description: "editable={false}: content stays visible, editing is blocked.",
		component: ReadOnlyScenario,
	},
	{
		id: "disabled",
		title: "Disabled",
		description: "disabled={true}: no focus or interaction.",
		component: DisabledScenario,
	},
	{
		id: "controlled",
		title: "Controlled",
		description: "value + onChange, with parent-owned content controls.",
		component: ControlledScenario,
	},
	{
		id: "uncontrolled",
		title: "Uncontrolled",
		description: "defaultValue with editor-owned state.",
		component: UncontrolledScenario,
	},
	{
		id: "conflict",
		title: "Controlled/uncontrolled conflict",
		description: "value and defaultValue together: warning and precedence.",
		component: ConflictScenario,
	},
	{
		id: "configuration",
		title: "Placeholder / editable / disabled",
		description: "Change placeholder, editable, and disabled at runtime.",
		component: ConfigurationScenario,
	},
	{
		id: "labels",
		title: "Labels",
		description: "Partial label overrides with core fallbacks.",
		component: LabelsScenario,
	},
	{
		id: "custom-extensions",
		title: "Custom extensions",
		description: "Compose a consumer-defined extension with the core preset.",
		component: CustomExtensionsScenario,
	},
	{
		id: "content-inspector",
		title: "Content inspector",
		description: "JSON and HTML output with content reset controls.",
		component: ContentInspectorScenario,
	},
	{
		id: "toolbar",
		title: "Toolbar composition",
		description: "Toolbar composition contract and live item state.",
		component: ToolbarScenario,
	},
	{
		id: "image-upload",
		title: "Image upload (mock)",
		description: "Upload through an injected mock handler, with progress.",
		component: ImageUploadScenario,
	},
	{
		id: "upload-error",
		title: "Upload error",
		description: "Failing upload: placeholder cleanup and error reporting.",
		component: UploadErrorScenario,
	},
	{
		id: "link-security",
		title: "Link security",
		description: "Core URL safety checks for links and images.",
		component: LinkSecurityScenario,
	},
];

/** Resolve a scenario by id, falling back to the first registered scenario. */
export function resolveScenario(id: string): PlaygroundScenario | undefined {
	return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}
