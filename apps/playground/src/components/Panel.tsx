import type { ReactNode } from "react";

type PanelProps = {
	title: string;
	testId?: string;
	actions?: ReactNode;
	children: ReactNode;
};

/** Shared chrome for the development inspector panels. */
export function Panel({ title, testId, actions, children }: PanelProps) {
	return (
		<section
			data-testid={testId}
			className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<header className="flex items-center justify-between gap-2 border-zinc-200 border-b px-3 py-2 dark:border-zinc-800">
				<h3 className="font-semibold text-xs text-zinc-500 uppercase tracking-wide">
					{title}
				</h3>
				{actions}
			</header>
			<div className="p-3">{children}</div>
		</section>
	);
}
