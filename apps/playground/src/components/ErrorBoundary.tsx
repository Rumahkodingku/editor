import { Component, type ErrorInfo, type ReactNode } from "react";

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
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error("[playground] scenario crashed", error, info.componentStack);
	}

	private readonly reset = () => {
		this.setState({ error: null });
	};

	render(): ReactNode {
		const { error } = this.state;

		if (error) {
			return (
				<div
					data-testid="scenario-error"
					className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900 text-sm"
				>
					<p className="font-semibold">This scenario crashed.</p>
					<pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
						{error.message}
					</pre>
					<button
						type="button"
						onClick={this.reset}
						className="mt-3 rounded-md border border-red-400 bg-white px-3 py-1 font-medium"
					>
						Reset scenario
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
