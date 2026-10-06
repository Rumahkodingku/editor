import type { JSONContent } from "@rumahkodingku/editor-core";

import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";
import { Panel } from "./Panel";

type JsonInspectorProps = {
	value: JSONContent;
};

/** Live JSON output panel. */
export function JsonInspector({ value }: JsonInspectorProps) {
	const text = JSON.stringify(value, null, 2);

	return (
		<Panel
			description="Canonical document content."
			testId="json-inspector"
			title="JSON output"
			actions={<CopyButton label="Copy JSON output" value={text} />}
		>
			<CodeBlock emptyFallback="(empty)" testId="json-output">
				{text}
			</CodeBlock>
		</Panel>
	);
}
