"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
};

/**
 * Enter-on-scroll wrapper.
 *
 * Isolated as a client leaf so the surrounding sections stay server components.
 * `whileInView` fires once and collapses to a static render when the user
 * prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
	const reduce = useReducedMotion();

	if (reduce) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
		>
			{children}
		</motion.div>
	);
}
