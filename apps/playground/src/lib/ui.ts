/**
 * Shared control classes for the Playground shell.
 *
 * Every value resolves to a `@theme` token declared in `src/app.css`, so the
 * shell follows the brand palette and the three-state theme without repeating
 * colour values in components. App-local only: nothing here is exported by a
 * published package.
 */

/** Secondary action button. */
export const buttonClass = [
	"inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border",
	"border-rk-hairline-strong bg-rk-canvas px-3 py-1.5 text-sm font-medium",
	"text-rk-ink-secondary shadow-rk-1 transition-colors",
	"hover:bg-rk-canvas-soft hover:text-rk-ink",
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rk-primary",
	"disabled:pointer-events-none disabled:opacity-50",
	"dark:bg-rk-canvas-soft dark:text-rk-ink dark:hover:bg-rk-brand-dark",
].join(" ");

/** Primary action button — at most one filled accent per view. */
export const primaryButtonClass = [
	"inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md",
	"bg-rk-primary px-3 py-1.5 text-sm font-medium text-white",
	"transition-colors hover:bg-rk-primary-deep",
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rk-primary",
	"disabled:pointer-events-none disabled:opacity-50",
].join(" ");

/** Square icon-only control sized for touch. */
export const iconButtonClass = [
	"inline-flex size-9 shrink-0 items-center justify-center rounded-md",
	"border border-transparent text-rk-ink-secondary transition-colors",
	"hover:bg-rk-canvas-soft hover:text-rk-ink",
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rk-primary",
	"disabled:pointer-events-none disabled:opacity-50",
	"dark:text-rk-ink-secondary dark:hover:bg-rk-brand-dark",
].join(" ");

export const inputClass = [
	"min-h-9 rounded-md border border-rk-hairline-strong bg-rk-canvas px-2 py-1",
	"text-sm text-rk-ink placeholder:text-rk-ink-muted",
	"focus-visible:border-rk-primary focus-visible:outline-2 focus-visible:outline-offset-0",
	"focus-visible:outline-rk-primary",
	"dark:bg-rk-canvas-soft dark:text-rk-ink",
].join(" ");

export const labelClass =
	"flex items-center gap-2 text-sm text-rk-ink-secondary";

/** Read-only document surface (JSON/HTML output). */
export const codeSurfaceClass = [
	"rk-scroll max-h-72 overflow-auto rounded-md border border-rk-hairline",
	"bg-rk-canvas-soft p-3 font-mono text-xs leading-relaxed break-words",
	"text-rk-ink-secondary",
	"dark:bg-rk-brand-dark dark:text-rk-ink-secondary",
].join(" ");
