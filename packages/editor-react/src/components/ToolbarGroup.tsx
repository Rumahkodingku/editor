import type { ReactNode } from "react";

import { cx } from "../lib/cx";

export type ToolbarGroupProps = {
	/** Accessible name for the group (WAI-ARIA toolbar pattern). */
	label: string;
	/** Controls in the group. */
	children: ReactNode;
	/** Class name applied to the group element. */
	className?: string;
};

/**
 * A semantic group of toolbar controls.
 *
 * Uses `role="group"` with an accessible name so assistive technology can
 * announce related controls, and stays independent of any visual design system.
 */
export function ToolbarGroup({
	label,
	children,
	className,
}: ToolbarGroupProps) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: toolbar groups use role="group" per the WAI-ARIA toolbar pattern; <fieldset> is not appropriate here.
		<div
			role="group"
			aria-label={label}
			className={cx("rk-editor__group", className)}
		>
			{children}
		</div>
	);
}
