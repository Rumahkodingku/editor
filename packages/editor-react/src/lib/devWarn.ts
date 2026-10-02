/**
 * Development-only warnings.
 *
 * Warnings are deterministic and never reach a production bundle that replaces
 * `process.env.NODE_ENV`. They exist to make misuse visible without throwing.
 */
function isProduction(): boolean {
	return (
		typeof process !== "undefined" && process.env?.NODE_ENV === "production"
	);
}

export function devWarn(message: string): void {
	if (isProduction()) {
		return;
	}
	console.warn(`[editor-react] ${message}`);
}
