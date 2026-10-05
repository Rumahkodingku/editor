import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

type RevealProps = {
	children: ReactNode;
	className?: string;
	/** Entrance delay in seconds, forwarded to the CSS animation. */
	delay?: number;
};

/**
 * Entrance-animation wrapper for landing sections.
 *
 * The animation is pure CSS (`.rk-reveal` in `global.css`), so the wrapper stays
 * a server component and the content ships visible in the server-rendered HTML.
 * A previous JS-driven variant hid the content with an inline `opacity: 0` until
 * the section hydrated and entered the viewport, which left the whole landing
 * page invisible whenever hydration was delayed or interrupted. Reduced-motion
 * preferences are handled in CSS.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
	return (
		<div
			className={cn("rk-reveal", className)}
			style={{ "--rk-reveal-delay": `${delay * 1000}ms` } as CSSProperties}
		>
			{children}
		</div>
	);
}
