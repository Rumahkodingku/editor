"use client";

import { Editor } from "@rumahkodingku/editor-react";

import { heroDocument } from "@/components/demos/fixtures";

/**
 * Landing hero preview.
 *
 * Renders the real `Editor` component from `@rumahkodingku/editor-react` in a
 * read-only state, so the marketing surface shows the actual product instead of
 * a hand-built mock. The editor stays non-editable so it never competes with the
 * hero copy for focus.
 */
export function HeroEditorPreview() {
	return (
		<div className="rk-hero-editor rk-shadow-2 overflow-hidden">
			<Editor
				defaultValue={heroDocument}
				editable={false}
				immediatelyRender={false}
			/>
		</div>
	);
}
