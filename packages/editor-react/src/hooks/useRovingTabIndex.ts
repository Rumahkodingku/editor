import { useEffect, useRef } from "react";

/**
 * Roving tabindex for a toolbar container.
 *
 * The toolbar exposes a single tab stop: exactly one enabled control has
 * `tabindex="0"` and the rest `-1`. Arrow keys move focus, Home/End jump to the
 * first/last control. Managing this from the DOM (rather than a React index)
 * keeps adapter-composed controls (link, image, custom children) in the same
 * tab sequence without extra bookkeeping.
 *
 * `dependency` re-runs the initial tab-stop assignment when the set of controls
 * changes (for example when a control is added or becomes disabled).
 */
export function useRovingTabIndex<T extends HTMLElement>(dependency?: unknown) {
	const ref = useRef<T>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: `dependency` is the intentional re-run key.
	useEffect(() => {
		const container = ref.current;
		if (!container) {
			return;
		}

		const getButtons = () =>
			Array.from(
				container.querySelectorAll<HTMLButtonElement>("button:not([disabled])"),
			);

		const setActive = (active: HTMLButtonElement | null) => {
			for (const button of container.querySelectorAll<HTMLButtonElement>(
				"button",
			)) {
				button.tabIndex = button === active ? 0 : -1;
			}
		};

		// Keep a single tab stop without stealing focus from an active control.
		const focusable = getButtons();
		const hasTabStop = focusable.some(
			(button) => button.getAttribute("tabindex") === "0",
		);
		if (!hasTabStop) {
			setActive(focusable[0] ?? null);
		}

		const handleFocus = (event: Event) => {
			const target = event.target;
			if (target instanceof HTMLButtonElement && container.contains(target)) {
				setActive(target);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			const buttons = getButtons();
			if (buttons.length === 0) {
				return;
			}

			const currentIndex = buttons.indexOf(
				document.activeElement as HTMLButtonElement,
			);
			if (currentIndex === -1) {
				return;
			}

			let nextIndex: number | null = null;
			if (event.key === "ArrowRight") {
				nextIndex = (currentIndex + 1) % buttons.length;
			} else if (event.key === "ArrowLeft") {
				nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
			} else if (event.key === "Home") {
				nextIndex = 0;
			} else if (event.key === "End") {
				nextIndex = buttons.length - 1;
			}

			if (nextIndex === null) {
				return;
			}

			event.preventDefault();
			buttons[nextIndex]?.focus();
		};

		container.addEventListener("focusin", handleFocus);
		// `focus` does not bubble; capture catches programmatic focus in tests.
		container.addEventListener("focus", handleFocus, true);
		container.addEventListener("keydown", handleKeyDown);

		return () => {
			container.removeEventListener("focusin", handleFocus);
			container.removeEventListener("focus", handleFocus, true);
			container.removeEventListener("keydown", handleKeyDown);
		};
	}, [dependency]);

	return ref;
}
