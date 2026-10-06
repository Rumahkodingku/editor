#!/usr/bin/env node
/**
 * Clean consumer installation test (Phase 09, task 09.07).
 *
 * Proves the published packages work OUTSIDE the monorepo:
 *   1. build the packages,
 *   2. pack them with pnpm (which rewrites `workspace:*` to a real version),
 *   3. scaffold a fresh consumer in a temp directory,
 *   4. install the tarballs + documented peer dependencies with npm,
 *   5. import the packages in Node (ESM),
 *   6. type-check the consumer (TypeScript declarations),
 *   7. build the consumer with Vite (React + CSS integration).
 *
 * No workspace resolution is used; the tarballs are the only source of the
 * packages. The temp directory is removed on success unless KEEP=1.
 */

import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

const run = (cmd, args, cwd, env = process.env) => {
	console.log(`\n$ ${cmd} ${args.join(" ")}`);
	execFileSync(cmd, args, { cwd, stdio: "inherit", env });
};

// A consumer is a normal project, so install dev dependencies even when the
// ambient NODE_ENV is "production" (which would otherwise omit them).
const installEnv = { ...process.env, NODE_ENV: "development" };
const bin = (dir, name) => join(dir, "node_modules", ".bin", name);

const TIPTAP = "^3.31.4";
const peers = [
	"react@^19.3.0",
	"react-dom@^19.3.0",
	`@tiptap/core@${TIPTAP}`,
	`@tiptap/react@${TIPTAP}`,
	`@tiptap/pm@${TIPTAP}`,
	`@tiptap/starter-kit@${TIPTAP}`,
	`@tiptap/extension-image@${TIPTAP}`,
	`@tiptap/extensions@${TIPTAP}`,
	`@tiptap/html@${TIPTAP}`,
];
const devDeps = [
	"typescript@^6.0.3",
	"vite@^8.3.1",
	"@vitejs/plugin-react@^6.1.1",
	"@types/react@^19.3.0",
	"@types/react-dom@^19.3.0",
];

const packageJson = (name) => ({
	name,
	private: true,
	type: "module",
	version: "0.0.0",
});

async function main() {
	run("pnpm", ["run", "build"], repoRoot);

	const work = await mkdtemp(join(tmpdir(), "rk-editor-consumer-"));
	console.log(`\nConsumer workspace: ${work}`);

	try {
		const packDir = join(work, "tarballs");
		await mkdir(packDir, { recursive: true });
		run(
			"pnpm",
			["pack", "--pack-destination", packDir],
			join(repoRoot, "packages/editor-core"),
		);
		run(
			"pnpm",
			["pack", "--pack-destination", packDir],
			join(repoRoot, "packages/editor-react"),
		);

		const tarballs = (await readdir(packDir)).filter((f) => f.endsWith(".tgz"));
		const coreTgz = join(
			packDir,
			tarballs.find((f) => f.includes("editor-core")),
		);
		const reactTgz = join(
			packDir,
			tarballs.find((f) => f.includes("editor-react")),
		);
		if (!coreTgz || !reactTgz)
			throw new Error(`Missing tarballs: ${tarballs.join(", ")}`);

		const appDir = join(work, "app");
		await mkdir(join(appDir, "src"), { recursive: true });

		await writeFile(
			join(appDir, "package.json"),
			`${JSON.stringify(packageJson("rk-editor-consumer"), null, 2)}\n`,
		);
		await writeFile(join(appDir, "index.html"), HTML);
		await writeFile(join(appDir, "tsconfig.json"), TSCONFIG);
		await writeFile(join(appDir, "vite.config.ts"), VITE_CONFIG);
		await writeFile(join(appDir, "src/vite-env.d.ts"), VITE_ENV);
		await writeFile(join(appDir, "src/main.tsx"), MAIN);
		await writeFile(join(appDir, "src/App.tsx"), APP);
		await writeFile(join(appDir, "src/smoke.mjs"), SMOKE);

		run(
			"npm",
			[
				"install",
				"--no-audit",
				"--no-fund",
				"--include=dev",
				coreTgz,
				reactTgz,
				...peers,
			],
			appDir,
			installEnv,
		);
		run(
			"npm",
			[
				"install",
				"--no-audit",
				"--no-fund",
				"--include=dev",
				"--save-dev",
				...devDeps,
			],
			appDir,
			installEnv,
		);

		// 1. Node ESM import + non-DOM API (outside the workspace).
		run("node", ["src/smoke.mjs"], appDir);
		// 2. TypeScript declarations resolve.
		run(bin(appDir, "tsc"), ["--noEmit"], appDir);
		// 3. Production build (React + stylesheet + Tiptap).
		run(bin(appDir, "vite"), ["build"], appDir);

		console.log("\n✅ Clean consumer installation test passed.");
	} finally {
		if (process.argv.includes("--keep")) {
			console.log(`Kept consumer workspace: ${work}`);
		} else {
			await rm(work, { recursive: true, force: true });
		}
	}
}

const HTML = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>rk-editor-consumer</title>
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
`;

const TSCONFIG = `${JSON.stringify(
	{
		compilerOptions: {
			strict: true,
			module: "ESNext",
			moduleResolution: "bundler",
			target: "ES2022",
			lib: ["ES2022", "DOM", "DOM.Iterable"],
			jsx: "react-jsx",
			types: [],
			skipLibCheck: true,
			noEmit: true,
		},
		include: ["src"],
	},
	null,
	2,
)}\n`;

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({ plugins: [react()] });
`;

const VITE_ENV = `/// <reference types="vite/client" />
`;

const MAIN = `import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
`;

const APP = `import { Editor, ImageUpload } from "@rumahkodingku/editor-react";
import "@rumahkodingku/editor-react/styles.css";
import {
	createEmptyDocument,
	createPersistenceEnvelope,
	isPersistenceEnvelope,
	isValidJSONContent,
} from "@rumahkodingku/editor-core";

const defaultValue = createEmptyDocument();
const envelope = createPersistenceEnvelope(defaultValue);
const ok = isValidJSONContent(defaultValue) && isPersistenceEnvelope(envelope);

const upload = async ({ file }: { file: File }) => ({ src: URL.createObjectURL(file), alt: file.name });

export function App() {
	return (
		<div>
			<p data-ok={ok}>consumer</p>
			<Editor
				defaultValue={defaultValue}
				extensions={[ImageUpload.configure({ upload })]}
			/>
		</div>
	);
}
`;

const SMOKE = `import assert from "node:assert/strict";
import {
	createEmptyDocument,
	createPersistenceEnvelope,
	isPersistenceEnvelope,
	isValidJSONContent,
	parsePersistenceEnvelope,
	EDITOR_SCHEMA_VERSION,
} from "@rumahkodingku/editor-core";

const doc = createEmptyDocument();
assert.equal(isValidJSONContent(doc), true);

const envelope = createPersistenceEnvelope(doc);
assert.equal(envelope.schemaVersion, EDITOR_SCHEMA_VERSION);
assert.equal(isPersistenceEnvelope(envelope), true);

const parsed = parsePersistenceEnvelope(envelope);
assert.equal(parsed.schemaVersion, EDITOR_SCHEMA_VERSION);
assert.deepEqual(parsed.content, doc);

console.log("node ESM import + core API: OK");
`;

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
