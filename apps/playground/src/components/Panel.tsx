import { type ReactNode, useId } from "react";

type PanelProps = {
	title: string;
	/** Optional line under the title, e.g. a hint about what the panel shows. */
	description?: ReactNode;
	testId?: string;
	actions?: ReactNode;
	children: ReactNode;
};

/**
 * Shared chrome for the development inspector panels.
 *
 * The heading is wired to the section with `aria-labelledby`, so assistive
 * technology announces each panel by name instead of an anonymous region.
 */
export function Panel({
	title,
	description,
	testId,
	actions,
	children,
}: PanelProps) {
	const headingId = useId();

	return (
		<section
			aria-labelledby={headingId}
			data-testid={testId}
			className="overflow-hidden rounded-lg border border-rk-hairline bg-rk-canvas shadow-rk-1 dark:bg-rk-canvas-soft"
		>
			<header className="flex items-start justify-between gap-3 border-rk-hairline border-b bg-rk-canvas-soft px-3 py-2 dark:bg-rk-canvas-raised">
				<div className="min-w-0">
					<h3
						className="font-semibold text-rk-ink-muted text-xs uppercase tracking-wide"
						id={headingId}
					>
						{title}
					</h3>
					{description ? (
						<p className="mt-0.5 text-rk-ink-muted text-xs">{description}</p>
					) : null}
				</div>
				{actions ? (
					<div className="flex shrink-0 items-center gap-1">{actions}</div>
				) : null}
			</header>
			<div className="p-3">{children}</div>
		</section>
	);
}
