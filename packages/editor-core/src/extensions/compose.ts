import type { AnyExtension } from "@tiptap/core";

import { EditorConfigError } from "../errors";

/**
 * Extension composition rules.
 *
 * Tiptap does not allow two extensions with the same `name`. Composition is
 * therefore explicit:
 *
 * - `"append"` (default): base extensions first, then consumer extensions.
 *   When a consumer extension reuses a base name, the consumer instance wins
 *   and the base instance is replaced in place (deterministic order).
 * - `"strict"`: duplicate names throw an {@link EditorConfigError} so the
 *   conflict is never resolved silently.
 *
 * Input arrays are never mutated.
 */
export type ExtensionCompositionMode = "append" | "strict";

export type ComposeExtensionsOptions = {
	mode?: ExtensionCompositionMode;
};

export function composeExtensions(
	base: readonly AnyExtension[] = [],
	custom: readonly AnyExtension[] = [],
	options: ComposeExtensionsOptions = {},
): AnyExtension[] {
	const mode = options.mode ?? "append";
	const result: AnyExtension[] = [...base];
	const indexByName = new Map<string, number>();
	base.forEach((extension, index) => {
		indexByName.set(extension.name, index);
	});

	for (const extension of custom) {
		const existingIndex = indexByName.get(extension.name);

		if (existingIndex === undefined) {
			indexByName.set(extension.name, result.length);
			result.push(extension);
			continue;
		}

		if (mode === "strict") {
			throw new EditorConfigError(
				`Duplicate extension name "${extension.name}". Disable the conflicting extension before composing.`,
			);
		}

		result[existingIndex] = extension;
	}

	return result;
}
