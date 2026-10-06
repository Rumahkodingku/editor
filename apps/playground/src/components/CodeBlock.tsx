import { codeSurfaceClass } from "../lib/ui";

type CodeBlockProps = {
	/** Rendered verbatim inside the block. */
	children: string;
	/** Stable hook for the browser suite; see `tests/browser/README.md`. */
	testId?: string;
	/** Shown when `children` is empty. */
	emptyFallback?: string;
};

/**
 * Read-only code surface shared by the JSON and HTML inspectors.
 *
 * It is a scroll container rather than a growing element so a long document
 * cannot push the rest of the workbench off-screen. A scrollable region has to
 * be reachable from the keyboard (axe `scrollable-region-focusable`), hence
 * `tabIndex`; the surrounding `Panel` supplies the accessible name, so the
 * block itself carries no ARIA.
 */
export function CodeBlock({ children, testId, emptyFallback }: CodeBlockProps) {
	return (
		<pre
			className={codeSurfaceClass}
			data-empty={children ? undefined : "true"}
			data-testid={testId}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: axe needs scroll regions focusable
			tabIndex={0}
		>
			{children || emptyFallback}
		</pre>
	);
}
