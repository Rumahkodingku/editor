import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "../hooks/useMediaQuery";
import { useScenario } from "../hooks/useScenario";
import { iconButtonClass } from "../lib/ui";
import { scenarios } from "../scenarios";
import { DocumentationLink } from "./DocumentationLink";
import { ErrorBoundary } from "./ErrorBoundary";
import { ScenarioNav } from "./ScenarioNav";
import { ThemeToggle } from "./ThemeToggle";

const DRAWER_ID = "playground-scenario-nav";

/** Matches Tailwind's `lg`, where the sidebar becomes persistent. */
const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * Playground shell: header, scenario navigation, and the active scenario.
 *
 * The scenario navigation is rendered exactly once. Above `lg` it lives in a
 * persistent `<aside>`; below that the same list is hosted by a native
 * `<dialog>`, which supplies the focus trap, Escape handling, and top-layer
 * stacking without a dependency. Picking the container in JS rather than
 * rendering both keeps every navigation test id unique.
 */
export function AppShell() {
	const { activeId, scenario, selectScenario } = useScenario();
	const ActiveScenario = scenario?.component;
	const isDesktop = useMediaQuery(DESKTOP_QUERY);
	const drawerRef = useRef<HTMLDialogElement>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const closeDrawer = useCallback(() => {
		drawerRef.current?.close();
	}, []);

	// `aria-expanded` and the scroll lock both need to observe the dialog's own
	// open state, which `showModal`/`close` toggle outside React. Unmounting the
	// dialog above the breakpoint runs this cleanup, which releases the lock.
	useEffect(() => {
		const drawer = drawerRef.current;
		if (!drawer) {
			return;
		}
		const sync = () => {
			setDrawerOpen(drawer.open);
			document.body.style.overflow = drawer.open ? "hidden" : "";
		};
		sync();
		drawer.addEventListener("toggle", sync);
		return () => {
			drawer.removeEventListener("toggle", sync);
			document.body.style.overflow = "";
		};
	}, []);

	const nav = (
		<ScenarioNav
			activeId={activeId}
			onNavigate={isDesktop ? undefined : closeDrawer}
			onSelect={selectScenario}
			scenarios={scenarios}
		/>
	);

	return (
		<div className="flex min-h-screen flex-col bg-rk-canvas-soft text-rk-ink lg:h-screen lg:overflow-hidden lg:dark:bg-rk-canvas">
			<header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-rk-hairline border-b bg-rk-canvas/85 px-3 backdrop-blur-sm lg:px-4 dark:bg-rk-canvas-soft/85">
				{isDesktop ? null : (
					<button
						aria-controls={DRAWER_ID}
						aria-expanded={drawerOpen}
						className={iconButtonClass}
						data-testid="nav-toggle"
						onClick={() => drawerRef.current?.showModal()}
						type="button"
					>
						<Menu aria-hidden="true" className="size-5" strokeWidth={2} />
						<span className="sr-only">Open scenario navigation</span>
					</button>
				)}

				<div className="flex min-w-0 flex-1 items-baseline gap-2">
					<h1 className="truncate font-semibold text-sm tracking-tight">
						<span className="hidden sm:inline">RumahKodingku Editor — </span>
						Playground
					</h1>
					<p className="sr-only lg:not-sr-only lg:truncate lg:text-rk-ink-muted lg:text-xs">
						Internal validation environment. Public examples live in the
						documentation.
					</p>
				</div>

				<div className="flex shrink-0 items-center gap-1.5">
					<ThemeToggle />
					<DocumentationLink />
				</div>
			</header>

			<div className="flex min-h-0 flex-1">
				{isDesktop ? (
					<aside
						className="rk-scroll w-64 shrink-0 overflow-y-auto border-rk-hairline border-r bg-rk-canvas dark:bg-rk-canvas-soft"
						// biome-ignore lint/a11y/noNoninteractiveTabindex: axe needs scroll regions focusable
						tabIndex={0}
					>
						{nav}
					</aside>
				) : null}

				<main
					className="rk-scroll min-w-0 flex-1 overflow-y-auto"
					// biome-ignore lint/a11y/noNoninteractiveTabindex: axe needs scroll regions focusable
					tabIndex={0}
				>
					{scenario && ActiveScenario ? (
						<div className="mx-auto flex w-full max-w-[100rem] flex-col gap-6 p-4 lg:p-6">
							<header className="flex flex-col gap-1">
								<h2 className="font-semibold text-xl tracking-tight">
									{scenario.title}
								</h2>
								<p className="max-w-prose text-rk-ink-muted text-sm">
									{scenario.description}
								</p>
							</header>
							<ErrorBoundary key={scenario.id}>
								<ActiveScenario />
							</ErrorBoundary>
						</div>
					) : (
						<p className="p-6 text-rk-ink-muted text-sm">Select a scenario.</p>
					)}
				</main>
			</div>

			{isDesktop ? null : (
				<dialog
					aria-label="Playground scenarios"
					className="m-0 h-full max-h-none w-[min(20rem,85vw)] max-w-none border-rk-hairline border-r bg-rk-canvas p-0 text-rk-ink backdrop:bg-rk-ink/40 backdrop:backdrop-blur-sm dark:bg-rk-canvas-soft"
					id={DRAWER_ID}
					ref={drawerRef}
				>
					<div className="flex h-full flex-col">
						<div className="flex h-14 shrink-0 items-center justify-between gap-2 border-rk-hairline border-b px-3">
							<span className="font-semibold text-sm">Scenarios</span>
							<button
								className={iconButtonClass}
								data-testid="nav-close"
								onClick={closeDrawer}
								type="button"
							>
								<X aria-hidden="true" className="size-5" strokeWidth={2} />
								<span className="sr-only">Close scenario navigation</span>
							</button>
						</div>
						<div
							className="rk-scroll min-h-0 flex-1 overflow-y-auto"
							// biome-ignore lint/a11y/noNoninteractiveTabindex: axe needs scroll regions focusable
							tabIndex={0}
						>
							{nav}
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}
