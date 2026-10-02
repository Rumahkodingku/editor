/**
 * Structural deep equality for canonical JSON content.
 *
 * Used to compare an incoming controlled `value` with the current editor
 * document so an unrelated render never resets the document.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) {
		return true;
	}

	if (typeof a !== typeof b) {
		return false;
	}

	if (a === null || b === null || typeof a !== "object") {
		return false;
	}

	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
			return false;
		}
		return a.every((item, index) => deepEqual(item, b[index]));
	}

	const aRecord = a as Record<string, unknown>;
	const bRecord = b as Record<string, unknown>;
	const aKeys = Object.keys(aRecord);
	const bKeys = Object.keys(bRecord);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	return aKeys.every(
		(key) => key in bRecord && deepEqual(aRecord[key], bRecord[key]),
	);
}
