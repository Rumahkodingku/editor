import type { JSONContent } from "@rumahkodingku/editor-core";
import { useCallback, useState } from "react";

import { Panel } from "./Panel";

type JsonInspectorProps = {
	value: JSONContent;
};

const BUTTON_CLASS =
	"rounded-md border border-zinc-300 px-2 py-0.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

/** Live JSON output panel (Task 25). */
export function JsonInspector({ value }: JsonInspectorProps) {
	const [copied, setCopied] = useState(false);
	const text = JSON.stringify(value, null, 2);

	const copy = useCallback(() => {
		void navigator.clipboard?.writeText(text).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		});
	}, [text]);

	return (
		<Panel
			title="JSON output"
			testId="json-inspector"
			actions={
				<button type="button" onClick={copy} className={BUTTON_CLASS}>
					{copied ? "Copied" : "Copy"}
				</button>
			}
		>
			<pre
				data-testid="json-output"
				className="max-h-72 overflow-auto font-mono text-xs text-zinc-800 dark:text-zinc-200"
			>
				{text}
			</pre>
		</Panel>
	);
}
