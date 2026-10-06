import type { ComponentType } from "react";

/**
 * Navigation group a scenario belongs to.
 *
 * Groups exist to make the scenario list scannable; they carry no behaviour and
 * do not affect resolution. The order of `scenarioGroups` is the order the
 * navigation renders them in.
 */
export type ScenarioGroupId =
	| "editor"
	| "states"
	| "content"
	| "toolbar"
	| "extensions"
	| "uploads";

/** Group metadata for the scenario navigation. */
export type ScenarioGroup = {
	id: ScenarioGroupId;
	/** Section label shown above the scenarios in the group. */
	label: string;
	/** One-line explanation of what the group covers. */
	description: string;
};

/**
 * A Playground scenario.
 *
 * Scenarios are pure validation surfaces: each one is a self-contained React
 * component that consumes the published package APIs. Adding a scenario means
 * adding an entry to the registry in `./index.ts`.
 */
export type PlaygroundScenario = {
	/** Stable identifier, also used in the URL hash (`#/<id>`). */
	id: string;
	/** Human-readable name shown in the navigation and header. */
	title: string;
	/** Short description of what the scenario validates. */
	description: string;
	/** Navigation group this scenario is listed under. */
	group: ScenarioGroupId;
	/** The scenario surface. */
	component: ComponentType;
};
