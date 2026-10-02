import type { PlaygroundScenario } from "../scenarios/types";

type ScenarioNavProps = {
	scenarios: readonly PlaygroundScenario[];
	activeId: string;
	onSelect: (id: string) => void;
};

/** Scenario navigation. */
export function ScenarioNav({
	scenarios,
	activeId,
	onSelect,
}: ScenarioNavProps) {
	return (
		<nav
			aria-label="Playground scenarios"
			className="flex flex-col gap-1 p-2"
			data-testid="scenario-nav"
		>
			{scenarios.map((scenario) => {
				const active = scenario.id === activeId;
				return (
					<button
						key={scenario.id}
						type="button"
						data-testid={`scenario-nav-${scenario.id}`}
						aria-current={active ? "page" : undefined}
						onClick={() => onSelect(scenario.id)}
						className={[
							"rounded-md px-3 py-1.5 text-left text-sm transition-colors",
							active
								? "bg-blue-600 text-white"
								: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
						].join(" ")}
					>
						{scenario.title}
					</button>
				);
			})}
		</nav>
	);
}
