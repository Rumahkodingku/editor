import { useSyncExternalStore } from "react";

/**
 * Track a CSS media query from React.
 *
 * The Playground needs this because its scenario navigation must exist exactly
 * once in the document: rendering it into both a persistent `<aside>` and a
 * modal `<dialog>` would duplicate every navigation test id and give assistive
 * technology two identical lists. Choosing the container in JS keeps a single
 * instance whose ids stay unique.
 */
export function useMediaQuery(query: string): boolean {
	const subscribe = (onChange: () => void) => {
		if (typeof window === "undefined") {
			return () => {};
		}
		const list = window.matchMedia(query);
		list.addEventListener("change", onChange);
		return () => list.removeEventListener("change", onChange);
	};

	const getSnapshot = () => {
		if (typeof window === "undefined") {
			return false;
		}
		return window.matchMedia(query).matches;
	};

	return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
