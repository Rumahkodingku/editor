import { useScenario } from "../hooks/useScenario";
import { scenarios } from "../scenarios";
import { ErrorBoundary } from "./ErrorBoundary";
import { ScenarioNav } from "./ScenarioNav";

/** Playground shell: header, scenario navigation, and the active scenario. */
export function AppShell() {
	const { activeId, scenario, selectScenario } = useScenario();
	const ActiveScenario = scenario?.component;

	return (
		<div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
			<header className="border-zinc-200 border-b px-4 py-3 dark:border-zinc-800">
				<h1 className="font-semibold text-lg">
					RumahKodingku Editor — Playground
				</h1>
				<p className="text-sm text-zinc-500">
					Internal validation environment. Public examples live in Fumadocs.
				</p>
			</header>
			<div className="flex min-h-0 flex-1">
				<aside className="w-64 shrink-0 overflow-y-auto border-zinc-200 border-r dark:border-zinc-800">
					<ScenarioNav
						scenarios={scenarios}
						activeId={activeId}
						onSelect={selectScenario}
					/>
				</aside>
				<main className="min-w-0 flex-1 overflow-y-auto p-6">
					{scenario && ActiveScenario ? (
						<>
							<div className="mb-4">
								<h2 className="font-semibold text-xl">{scenario.title}</h2>
								<p className="text-sm text-zinc-500">{scenario.description}</p>
							</div>
							<ErrorBoundary key={scenario.id}>
								<ActiveScenario />
							</ErrorBoundary>
						</>
					) : (
						<p className="text-sm text-zinc-500">Select a scenario.</p>
					)}
				</main>
			</div>
		</div>
	);
}
