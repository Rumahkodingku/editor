"use client";

import { Editor } from "@rumahkodingku/editor-react";
import type { CSSProperties } from "react";

import { demoDocument } from "./fixtures";

const theme = {
	"--rk-editor-background": "#0b1220",
	"--rk-editor-foreground": "#e2e8f0",
	"--rk-editor-border": "#1e293b",
	"--rk-editor-muted": "#94a3b8",
	"--rk-editor-toolbar-background": "#111c33",
	"--rk-editor-hover": "#1e293b",
	"--rk-editor-accent": "#38bdf8",
	"--rk-editor-accent-contrast": "#0b1220",
	"--rk-editor-radius": "0.75rem",
} as CSSProperties;

/** Theme the editor by overriding `--rk-editor-*` variables. */
export function ThemingDemo() {
	return (
		<div style={theme}>
			<Editor defaultValue={demoDocument} immediatelyRender={false} />
		</div>
	);
}
