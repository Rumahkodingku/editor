import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";
import { Panel } from "./Panel";

type HtmlInspectorProps = {
	value: string;
};

/** HTML serialization output panel. */
export function HtmlInspector({ value }: HtmlInspectorProps) {
	return (
		<Panel
			description="Output-only serialization of the canonical JSON."
			testId="html-inspector"
			title="HTML output"
			actions={<CopyButton label="Copy HTML output" value={value} />}
		>
			<CodeBlock emptyFallback="(empty)" testId="html-output">
				{value}
			</CodeBlock>
		</Panel>
	);
}
