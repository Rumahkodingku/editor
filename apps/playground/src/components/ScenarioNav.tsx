import { scenarioGroups } from "../scenarios";
import type { PlaygroundScenario, ScenarioGroupId } from "../scenarios/types";

type ScenarioNavProps = {
	scenarios: readonly PlaygroundScenario[];
	activeId: string;
	onSelect: (id: string) => void;
	/** Called after a scenario is chosen, so a drawer can close itself. */
	onNavigate?: () => void;
};

/**
 * Scenario navigation, grouped by what each scenario validates.
 *
 * Entries are links rather than buttons because the active scenario already
 * lives in the URL hash: `href="#/<id>"` makes every scenario deep-linkable,
 * middle-clickable, and keyboard-navigable without an extra handler. The click
 * handler still calls `onSelect` so React state updates without waiting for the
 * native `hashchange` to round-trip.
 *
 * Each group is a list, so the grouping is conveyed by the document structure
 * rather than by an ARIA role, and the labels stay out of the page's heading
 * order.
 */
export function ScenarioNav({
	scenarios,
	activeId,
	onSelect,
	onNavigate,
}: ScenarioNavProps) {
	const byGroup = new Map<ScenarioGroupId, PlaygroundScenario[]>();
	for (const group of scenarioGroups) {
		byGroup.set(group.id, []);
	}
	for (const scenario of scenarios) {
		byGroup.get(scenario.group)?.push(scenario);
	}

	return (
		<nav
			aria-label="Playground scenarios"
			className="flex flex-col gap-4 p-3"
			data-testid="scenario-nav"
		>
			{scenarioGroups.map((group) => {
				const items = byGroup.get(group.id) ?? [];
				if (items.length === 0) {
					return null;
				}
				return (
					<div className="flex flex-col gap-1" key={group.id}>
						<p
							className="px-2 font-semibold text-[0.6875rem] text-rk-ink-muted uppercase tracking-wide"
							title={group.description}
						>
							{group.label}
						</p>
						<ul className="flex flex-col gap-0.5">
							{items.map((scenario) => {
								const active = scenario.id === activeId;
								return (
									<li key={scenario.id}>
										<a
											aria-current={active ? "page" : undefined}
											className={[
												"flex min-h-9 items-center rounded-md px-2 py-1.5 text-sm transition-colors",
												"focus-visible:outline-2 focus-visible:outline-rk-primary focus-visible:outline-offset-2",
												active
													? "bg-rk-primary-subdued font-medium text-rk-primary-deep dark:text-rk-primary"
													: "text-rk-ink-secondary hover:bg-rk-canvas-soft hover:text-rk-ink dark:text-rk-ink-secondary dark:hover:bg-rk-brand-dark dark:hover:text-rk-ink",
											].join(" ")}
											data-testid={`scenario-nav-${scenario.id}`}
											href={`#/${scenario.id}`}
											onClick={() => {
												onSelect(scenario.id);
												onNavigate?.();
											}}
										>
											{scenario.title}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</nav>
	);
}
