import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { BasicEditorDemo } from "./demos/BasicEditorDemo";
import { ControlledEditorDemo } from "./demos/ControlledEditorDemo";
import { CustomExtensionDemo } from "./demos/CustomExtensionDemo";
import { CustomToolbarDemo } from "./demos/CustomToolbarDemo";
import { DisabledEditorDemo } from "./demos/DisabledEditorDemo";
import { ImageUploadDemo } from "./demos/ImageUploadDemo";
import { ReadOnlyEditorDemo } from "./demos/ReadOnlyEditorDemo";
import { ThemingDemo } from "./demos/ThemingDemo";
import { UncontrolledEditorDemo } from "./demos/UncontrolledEditorDemo";

/**
 * Global MDX component map.
 *
 * The live examples are exported as components so documentation pages can embed
 * a runnable editor instead of a static code block. They consume the published
 * package APIs only.
 */
export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		BasicEditorDemo,
		ControlledEditorDemo,
		UncontrolledEditorDemo,
		ReadOnlyEditorDemo,
		DisabledEditorDemo,
		CustomToolbarDemo,
		CustomExtensionDemo,
		ImageUploadDemo,
		ThemingDemo,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
