/**
 * URL safety helpers.
 *
 * Editor content is untrusted input. Link and image sources must be checked
 * before they enter the document so schemes like `javascript:` can never be
 * persisted or rendered.
 */

export type UrlValidationOptions = {
	/** Schemes that are accepted. Include the trailing colon, e.g. `"https:"`. */
	allowedProtocols?: readonly string[];
	/** Whether scheme-less values (relative paths, fragments, queries) are allowed. */
	allowRelative?: boolean;
	/** Whether `data:image/*` URLs are allowed (opt-in; off by default). */
	allowDataImages?: boolean;
};

/** Safe defaults for links: web and email only. */
export const DEFAULT_LINK_PROTOCOLS: readonly string[] = [
	"http:",
	"https:",
	"mailto:",
];

/** Safe defaults for images: web only. */
export const DEFAULT_IMAGE_PROTOCOLS: readonly string[] = ["http:", "https:"];

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const DATA_IMAGE_PATTERN = /^data:image\/[a-z0-9.+-]+[;,]/i;
// biome-ignore lint/suspicious/noControlCharactersInRegex: control characters must be rejected.
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

/**
 * Returns `true` when `url` may be used as a link or image source.
 *
 * Scheme-less values are rejected when `allowRelative` is `false`, which is the
 * recommended setting for upload results.
 */
export function isSafeUrl(
	url: unknown,
	options: UrlValidationOptions = {},
): boolean {
	if (typeof url !== "string") {
		return false;
	}

	const value = url.trim();
	if (value === "") {
		return false;
	}

	const {
		allowedProtocols = DEFAULT_LINK_PROTOCOLS,
		allowRelative = true,
		allowDataImages = false,
	} = options;

	if (allowDataImages && DATA_IMAGE_PATTERN.test(value)) {
		return true;
	}

	// Protocol-relative URLs ("//host") are ambiguous; treat them as unsafe.
	if (value.startsWith("//")) {
		return false;
	}

	// No scheme: a relative path, fragment, or query.
	if (!SCHEME_PATTERN.test(value)) {
		return allowRelative && !CONTROL_CHARACTER_PATTERN.test(value);
	}

	try {
		const { protocol } = new URL(value);
		return allowedProtocols.includes(protocol);
	} catch {
		return false;
	}
}
