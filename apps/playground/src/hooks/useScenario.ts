import { useCallback, useEffect, useState } from "react";

import { DEFAULT_SCENARIO_ID, resolveScenario } from "../scenarios";
import type { PlaygroundScenario } from "../scenarios/types";

function readScenarioId(): string {
	if (typeof window === "undefined") {
		return DEFAULT_SCENARIO_ID;
	}
	const raw = window.location.hash.replace(/^#\/?/, "");
	return raw || DEFAULT_SCENARIO_ID;
}

export type UseScenarioResult = {
	activeId: string;
	scenario: PlaygroundScenario | undefined;
	selectScenario: (id: string) => void;
};

/**
 * Keep the active scenario in sync with the URL hash so scenarios are
 * deep-linkable and browser tests can navigate deterministically.
 */
export function useScenario(): UseScenarioResult {
	const [activeId, setActiveId] = useState<string>(readScenarioId);

	useEffect(() => {
		const onHashChange = () => setActiveId(readScenarioId());
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, []);

	const selectScenario = useCallback((id: string) => {
		window.location.hash = `/${id}`;
		setActiveId(id);
	}, []);

	return {
		activeId,
		scenario: resolveScenario(activeId),
		selectScenario,
	};
}
