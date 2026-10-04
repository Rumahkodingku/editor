"use client";

import { Editor } from "@rumahkodingku/editor-react";
import { useState } from "react";

import { demoDocument } from "./fixtures";

/** Controlled editor: the parent owns the JSON value via `value`/`onChange`. */
export function ControlledEditorDemo() {
	const [value, setValue] = useState(demoDocument);

	return (
		<div className="flex flex-col gap-3">
			<Editor value={value} onChange={setValue} immediatelyRender={false} />
			<details className="rounded-md border p-3 text-sm">
				<summary className="cursor-pointer font-medium">
					Current JSON value
				</summary>
				<pre className="mt-2 max-h-64 overflow-auto text-xs">
					{JSON.stringify(value, null, 2)}
				</pre>
			</details>
		</div>
	);
}
