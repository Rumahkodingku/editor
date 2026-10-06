import type { ReactNode } from "react";

type ScenarioLayoutProps = {
	/** Controls rendered above the scenario surface. */
	controls?: ReactNode;
	/** Inspector panels rendered in the right column. */
	inspector?: ReactNode;
	/** The scenario surface (usually an `<Editor>`). */
	children: ReactNode;
};

/**
 * Two-column scenario surface.
 *
 * The editor takes the remaining width and the inspector gets a fixed rail so
 * code output stays readable instead of shrinking with the editor. Below `xl`
 * the inspector stacks underneath, which keeps the editor at full width on
 * tablet and mobile.
 */
export function ScenarioLayout({
	controls,
	children,
	inspector,
}: ScenarioLayoutProps) {
	return (
		<div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-6">
			<div className="flex min-w-0 flex-col gap-3">
				{controls ? (
					<div className="flex flex-wrap items-center gap-2">{controls}</div>
				) : null}
				{children}
			</div>
			{inspector ? (
				<div className="flex min-w-0 flex-col gap-3">{inspector}</div>
			) : null}
		</div>
	);
}
