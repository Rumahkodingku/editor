import { RotateCcw, TriangleAlert } from "lucide-react";
import { Component, createRef, type ErrorInfo, type ReactNode } from "react";

import { buttonClass } from "../lib/ui";

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	error: Error | null;
};

/**
 * Application-level error boundary for development.
 *
 * A crash inside one scenario is contained here (the boundary is keyed by
 * scenario id, so switching scenarios resets it). No error-reporting service is
 * involved.
 *
 * The recovery affordance is more than a reset button: the crash message and
 * component stack stay on screen, because a scenario that throws is usually
 * being debugged rather than read.
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	private containerRef = createRef<HTMLDivElement>();

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error("[playground] scenario crashed", error, info.componentStack);
		// Move focus to the recovery UI so keyboard and screen-reader users are
		// not left on a surface that no longer exists.
		this.containerRef.current?.focus();
	}

	private readonly reset = () => {
		this.setState({ error: null });
	};

	render(): ReactNode {
		const { error } = this.state;

		if (error) {
			return (
				<div
					className="flex flex-col gap-3 rounded-lg border border-rk-danger/40 bg-rk-danger/5 p-4 text-sm"
					data-testid="scenario-error"
					ref={this.containerRef}
					role="alert"
					tabIndex={-1}
				>
					<div className="flex items-start gap-2.5">
						<TriangleAlert
							aria-hidden="true"
							className="mt-0.5 size-5 shrink-0 text-rk-danger"
							strokeWidth={2}
						/>
						<div className="min-w-0">
							<h3 className="font-semibold text-rk-danger">
								This scenario crashed
							</h3>
							<p className="mt-0.5 text-rk-ink-secondary">
								The rest of the Playground is still usable. Switch scenario, or
								reset this one to try again.
							</p>
						</div>
					</div>

					<pre
						className="rk-scroll max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md border border-rk-hairline bg-rk-canvas p-3 font-mono text-rk-ink-secondary text-xs dark:bg-rk-canvas"
						// biome-ignore lint/a11y/noNoninteractiveTabindex: axe needs scroll regions focusable
						tabIndex={0}
					>
						{error.stack ?? error.message}
					</pre>

					<div>
						<button
							className={buttonClass}
							data-testid="scenario-reset"
							onClick={this.reset}
							type="button"
						>
							<RotateCcw
								aria-hidden="true"
								className="size-4"
								strokeWidth={2}
							/>
							Reset scenario
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
