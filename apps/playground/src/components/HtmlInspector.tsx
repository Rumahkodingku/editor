import { useCallback, useState } from "react";

import { Panel } from "./Panel";

type HtmlInspectorProps = {
	value: string;
};

const BUTTON_CLASS =
	"rounded-md border border-zinc-300 px-2 py-0.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

/** HTML serialization output panel (Task 26). */
export function HtmlInspector({ value }: HtmlInspectorProps) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(() => {
		void navigator.clipboard?.writeText(value).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		});
	}, [value]);

	return (
		<Panel
			title="HTML output"
			testId="html-inspector"
			actions={
				<button type="button" onClick={copy} className={BUTTON_CLASS}>
					{copied ? "Copied" : "Copy"}
				</button>
			}
		>
			<pre
				data-testid="html-output"
				className="max-h-72 overflow-auto font-mono text-xs text-zinc-800 dark:text-zinc-200"
			>
				{value || "(empty)"}
			</pre>
		</Panel>
	);
}
