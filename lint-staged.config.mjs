export default {
	"*.{js,jsx,ts,tsx,mjs,cjs}": ["biome check --write --no-errors-on-unmatched"],
	"*.{json,jsonc,css}": ["biome check --write --no-errors-on-unmatched"],
};
