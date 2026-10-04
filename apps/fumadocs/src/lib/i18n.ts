import { defineI18n } from "fumadocs-core/i18n";

/**
 * Documentation locale configuration.
 *
 * Documentation is published in English (default) and Indonesian. `parser:
 * "dir"` maps locales to folders under `content/docs/<lang>/`, and
 * `hideLocale: "default-locale"` keeps the default locale out of the URL
 * (`/docs/...` is English, `/id/docs/...` is Indonesian).
 */
export const i18n = defineI18n({
	languages: ["en", "id"],
	defaultLanguage: "en",
	hideLocale: "default-locale",
	parser: "dir",
});
