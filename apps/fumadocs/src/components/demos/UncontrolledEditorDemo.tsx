"use client";

import { Editor, type TiptapEditor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { demoDocument } from "./fixtures";

/** Uncontrolled editor: the editor owns the document; read it on demand. */
export function UncontrolledEditorDemo() {
	const [editor, setEditor] = useState<TiptapEditor | null>(null);
	const [serialized, setSerialized] = useState("");

	return (
		<div className="flex flex-col gap-3">
			<Editor
				defaultValue={demoDocument}
				immediatelyRender={false}
				onReady={setEditor}
			/>
			<button
				type="button"
				className="self-start rounded-md border px-3 py-1.5 text-sm"
				disabled={!editor}
				onClick={() =>
					setSerialized(JSON.stringify(editor?.getJSON(), null, 2))
				}
			>
				Serialize document
			</button>
			{serialized ? (
				<pre className="max-h-64 overflow-auto rounded-md border bg-fd-muted p-3 text-xs">
					{serialized}
				</pre>
			) : null}
		</div>
	);
}
