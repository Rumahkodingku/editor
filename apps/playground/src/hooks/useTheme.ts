import { useCallback, useEffect, useState } from "react";

/**
 * Theme preference for the Playground shell.
 *
 * `system` follows the OS and is resolved to a concrete value before it is
 * applied, so the shell and the published editor stylesheet (which keys off
 * `[data-theme]`) always agree.
 */
export type ThemePreference = "system" | "light" | "dark";

/** Every state the theme control can be in, in cycle order. */
export const THEME_PREFERENCES: readonly ThemePreference[] = [
	"system",
	"light",
	"dark",
] as const;

const STORAGE_KEY = "rk-playground-theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function isPreference(value: unknown): value is ThemePreference {
	return THEME_PREFERENCES.includes(value as ThemePreference);
}

/** Read the stored preference. `null` on a first visit. */
function readPreference(): ThemePreference {
	if (typeof window === "undefined") {
		return "system";
	}
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		return isPreference(stored) ? stored : "system";
	} catch {
		// Storage access can throw in locked-down browsing modes.
		return "system";
	}
}

/** Resolve `system` against the OS preference. */
function readSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") {
		return "light";
	}
	return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * The preference a click lands on.
 *
 * This is a fixed rotation (`system → dark → light → system`) rather than
 * "the opposite of what is shown": an opposite-first rule makes `light`
 * unreachable for anyone whose OS is already light, and `dark` unreachable for
 * anyone whose OS is already dark. Starting the rotation at the state most
 * users are not already in means the first click almost always changes what is
 * on screen, and the icon changes in the case where it does not.
 */
export function nextTheme(preference: ThemePreference): ThemePreference {
	if (preference === "system") {
		return "dark";
	}
	return preference === "dark" ? "light" : "system";
}

/** Mirror the resolved theme onto `<html data-theme>` for CSS and the editor. */
function applyResolvedTheme(theme: "light" | "dark"): void {
	if (typeof document === "undefined") {
		return;
	}
	document.documentElement.dataset.theme = theme;
}

export type UseThemeResult = {
	/** What the user chose. */
	preference: ThemePreference;
	/** What is actually rendered after resolving `system`. */
	resolved: "light" | "dark";
	/** Advance to the next preference. */
	cycle: () => void;
};

/**
 * Read and change the Playground theme.
 *
 * The OS scheme is tracked in state rather than through `useSyncExternalStore`
 * on the stored preference: with the default `system` preference the stored
 * value never changes, so a snapshot-keyed store would bail out and the shell
 * would keep rendering the theme it started with while the OS switched.
 *
 * `index.html` runs the same resolution inline before the bundle loads, so the
 * attribute is already correct on first paint and the effect below only has to
 * keep it in sync.
 */
export function useTheme(): UseThemeResult {
	const [preference, setPreference] = useState<ThemePreference>(readPreference);
	const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
		readSystemTheme,
	);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		const query = window.matchMedia(DARK_QUERY);
		const sync = () => setSystemTheme(query.matches ? "dark" : "light");
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	const resolved: "light" | "dark" =
		preference === "system" ? systemTheme : preference;

	useEffect(() => {
		applyResolvedTheme(resolved);
	}, [resolved]);

	const cycle = useCallback(() => {
		setPreference((current) => {
			const next = nextTheme(current);
			try {
				window.localStorage.setItem(STORAGE_KEY, next);
			} catch {
				// Persisting is best-effort; the session still switches.
			}
			return next;
		});
	}, []);

	return { preference, resolved, cycle };
}
