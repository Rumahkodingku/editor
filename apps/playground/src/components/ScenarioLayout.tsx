import type { ReactNode } from "react";

type ScenarioLayoutProps = {
	/** Controls rendered above the scenario surface. */
	controls?: ReactNode;
	/** Inspector panels rendered in the right column. */
	inspector?: ReactNode;
	/** The scenario surface (usually an `<Editor>`). */
	children: ReactNode;
};

/** Two-column scenario surface: editor on the left, inspectors on the right. */
export function ScenarioLayout({
	controls,
	children,
	inspector,
}: ScenarioLayoutProps) {
	return (
		<div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
			<div className="flex min-w-0 flex-col gap-3">
				{controls ? (
					<div className="flex flex-wrap items-center gap-3">{controls}</div>
				) : null}
				{children}
			</div>
			{inspector ? (
				<div className="flex min-w-0 flex-col gap-3">{inspector}</div>
			) : null}
		</div>
	);
}
