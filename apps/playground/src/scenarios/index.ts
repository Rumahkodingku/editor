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
import type { PlaygroundScenario, ScenarioGroup } from "./types";
import { UncontrolledScenario } from "./UncontrolledScenario";
import { UploadErrorScenario } from "./UploadErrorScenario";

/** Scenario shown when the URL hash does not name a known scenario. */
export const DEFAULT_SCENARIO_ID = "basic";

/**
 * Navigation groups, in render order.
 *
 * The groups mirror what the registered scenarios actually validate; adding a
 * scenario means adding it to one of these, never to a new ad-hoc group.
 */
export const scenarioGroups: readonly ScenarioGroup[] = [
	{
		id: "editor",
		label: "Editor",
		description: "Core rendering and content ownership.",
	},
	{
		id: "states",
		label: "States",
		description: "Editable, read-only, and disabled behavior.",
	},
	{
		id: "content",
		label: "Content",
		description: "Serialization and URL safety.",
	},
	{
		id: "toolbar",
		label: "Toolbar",
		description: "Toolbar composition and live item state.",
	},
	{
		id: "extensions",
		label: "Extensions",
		description: "Consumer-defined editor behavior.",
	},
	{
		id: "uploads",
		label: "Uploads",
		description: "Injected image upload handlers.",
	},
] as const;

/** Single source of truth for the scenario navigation. */
export const scenarios: PlaygroundScenario[] = [
	{
		id: "basic",
		title: "Basic",
		description:
			"Baseline editor: rendering, editing, and the default toolbar.",
		group: "editor",
		component: BasicScenario,
	},
	{
		id: "initial-content",
		title: "Initial content",
		description: "Render a known JSON document and inspect it live.",
		group: "editor",
		component: InitialContentScenario,
	},
	{
		id: "controlled",
		title: "Controlled",
		description: "value + onChange, with parent-owned content controls.",
		group: "editor",
		component: ControlledScenario,
	},
	{
		id: "uncontrolled",
		title: "Uncontrolled",
		description: "defaultValue with editor-owned state.",
		group: "editor",
		component: UncontrolledScenario,
	},
	{
		id: "conflict",
		title: "Controlled/uncontrolled conflict",
		description: "value and defaultValue together: warning and precedence.",
		group: "editor",
		component: ConflictScenario,
	},
	{
		id: "configuration",
		title: "Placeholder / editable / disabled",
		description: "Change placeholder, editable, and disabled at runtime.",
		group: "editor",
		component: ConfigurationScenario,
	},
	{
		id: "read-only",
		title: "Read-only",
		description: "editable={false}: content stays visible, editing is blocked.",
		group: "states",
		component: ReadOnlyScenario,
	},
	{
		id: "disabled",
		title: "Disabled",
		description: "disabled={true}: no focus or interaction.",
		group: "states",
		component: DisabledScenario,
	},
	{
		id: "labels",
		title: "Labels",
		description: "Partial label overrides with core fallbacks.",
		group: "states",
		component: LabelsScenario,
	},
	{
		id: "content-inspector",
		title: "Content inspector",
		description: "JSON and HTML output with content reset controls.",
		group: "content",
		component: ContentInspectorScenario,
	},
	{
		id: "link-security",
		title: "Link security",
		description: "Core URL safety checks for links and images.",
		group: "content",
		component: LinkSecurityScenario,
	},
	{
		id: "toolbar",
		title: "Toolbar composition",
		description: "Toolbar composition contract and live item state.",
		group: "toolbar",
		component: ToolbarScenario,
	},
	{
		id: "custom-extensions",
		title: "Custom extensions",
		description: "Compose a consumer-defined extension with the core preset.",
		group: "extensions",
		component: CustomExtensionsScenario,
	},
	{
		id: "image-upload",
		title: "Image upload (mock)",
		description: "Upload through an injected mock handler, with progress.",
		group: "uploads",
		component: ImageUploadScenario,
	},
	{
		id: "upload-error",
		title: "Upload error",
		description: "Failing upload: placeholder cleanup and error reporting.",
		group: "uploads",
		component: UploadErrorScenario,
	},
];

/** Resolve a scenario by id, falling back to the first registered scenario. */
export function resolveScenario(id: string): PlaygroundScenario | undefined {
	return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}
