import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { iconButtonClass } from "../lib/ui";

type CopyButtonProps = {
	/** Text placed on the clipboard. */
	value: string;
	/** Accessible name, e.g. "Copy JSON output". */
	label: string;
};

const RESET_AFTER_MS = 1500;

/**
 * Copy `value` to the clipboard and confirm it visually and to assistive tech.
 *
 * The confirmation is announced through a polite live region so the action
 * reports itself without moving focus. Clipboard failures are treated as
 * "nothing was copied" rather than throwing, because the Playground only ever
 * offers this on localhost.
 */
export function CopyButton({ value, label }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const copy = useCallback(() => {
		const clipboard = navigator.clipboard;
		if (!clipboard) {
			return;
		}
		void clipboard.writeText(value).then(
			() => {
				setCopied(true);
				window.clearTimeout(timer.current);
				timer.current = window.setTimeout(
					() => setCopied(false),
					RESET_AFTER_MS,
				);
			},
			() => setCopied(false),
		);
	}, [value]);

	const Icon = copied ? Check : Copy;

	return (
		<>
			<button
				aria-label={label}
				className={iconButtonClass}
				onClick={copy}
				title={label}
				type="button"
			>
				<Icon aria-hidden="true" className="size-4" strokeWidth={2} />
			</button>
			<span aria-live="polite" className="sr-only" role="status">
				{copied ? `${label} — copied` : ""}
			</span>
		</>
	);
}
