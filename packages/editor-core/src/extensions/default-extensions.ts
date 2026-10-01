import type { AnyExtension } from "@tiptap/core";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";

import { DEFAULT_LINK_PROTOCOLS, isSafeUrl } from "../security/urls";
import {
	ImageUpload,
	type ImageUploadExtensionOptions,
} from "./image-upload/image-upload";

/**
 * Default MVP extension preset.
 *
 * StarterKit 3 already provides paragraphs, text, headings, bold, italic,
 * underline, strike, code, code block, blockquote, ordered/bullet lists,
 * horizontal rule, links, and undo/redo. Placeholder and image support are
 * added on top.
 *
 * The image node always comes from the RumahKodingku {@link ImageUpload}
 * extension so upload state can be tracked; configure `upload` to enable the
 * upload pipeline. Without a handler the node behaves like a plain image.
 */
export type DefaultExtensionsOptions = {
	/** Placeholder text. Omit to leave the placeholder out. */
	placeholder?: string;
	/** Image upload configuration. Omit for a plain image node. */
	upload?: ImageUploadExtensionOptions;
};

export function createDefaultExtensions(
	options: DefaultExtensionsOptions = {},
): AnyExtension[] {
	const { placeholder, upload } = options;

	const extensions: AnyExtension[] = [
		StarterKit.configure({
			link: {
				openOnClick: false,
				protocols: DEFAULT_LINK_PROTOCOLS.map((protocol) =>
					protocol.replace(":", ""),
				),
				isAllowedUri: (url: string) =>
					isSafeUrl(url, { allowedProtocols: DEFAULT_LINK_PROTOCOLS }),
			},
		}),
	];

	if (placeholder) {
		extensions.push(Placeholder.configure({ placeholder }));
	}

	extensions.push(ImageUpload.configure(upload ?? {}));

	return extensions;
}
