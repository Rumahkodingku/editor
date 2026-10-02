import type { ComponentType } from "react";

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
	/** The scenario surface. */
	component: ComponentType;
};
