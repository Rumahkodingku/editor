import { defineConfig } from "fumadocs-mdx/config";

/**
 * Global MDX configuration.
 *
 * Code blocks are styled as deep-navy product surfaces in both themes (§24 of
 * the UI redesign spec). Using a high-contrast dark Shiki theme for both the
 * light and dark variants keeps the token colors light on that navy background
 * and preserves WCAG AA contrast.
 */
export default defineConfig({
	mdxOptions: {
		preset: "fumadocs",
		rehypeCodeOptions: {
			themes: {
				light: "github-dark-high-contrast",
				dark: "github-dark-high-contrast",
			},
		},
	},
});
