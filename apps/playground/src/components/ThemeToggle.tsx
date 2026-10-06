import { Monitor, Moon, Sun } from "lucide-react";

import { nextTheme, useTheme } from "../hooks/useTheme";
import { iconButtonClass } from "../lib/ui";

const ICONS = {
	system: Monitor,
	light: Sun,
	dark: Moon,
} as const;

/**
 * Cycles the shell between the system preference, light, and dark.
 *
 * A single control keeps the header compact; the accessible name states the
 * current value and the value the control switches to, so the button is
 * meaningful without seeing the icon.
 */
export function ThemeToggle() {
	const { preference, cycle } = useTheme();
	const Icon = ICONS[preference];

	return (
		<button
			aria-label={`Theme: ${preference}. Switch to ${nextTheme(preference)}.`}
			className={iconButtonClass}
			data-testid="theme-toggle"
			onClick={cycle}
			title={`Theme: ${preference}`}
			type="button"
		>
			<Icon aria-hidden="true" className="size-4" strokeWidth={2} />
		</button>
	);
}
