import { defineConfig } from "fumadocs-mdx/config";

/**
 * Global MDX configuration.
 *
 * The default Shiki theme (github-light) fails WCAG AA contrast on a few token
 * colors (keywords and constants). The high-contrast variants keep code examples
 * readable and accessible in both light and dark themes.
 */
export default defineConfig({
	mdxOptions: {
		preset: "fumadocs",
		rehypeCodeOptions: {
			themes: {
				light: "github-light-high-contrast",
				dark: "github-dark-high-contrast",
			},
		},
	},
});
