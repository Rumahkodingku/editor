import { isSafeUrl } from "@rumahkodingku/editor-core";
import { useState } from "react";

import { Panel } from "../components/Panel";
import { buttonClass, inputClass } from "../lib/ui";

const PRESETS = [
	"https://example.com/docs",
	"mailto:hello@example.com",
	"javascript:alert(1)",
	"data:image/svg+xml,<svg/>",
	"//evil.example.com",
	"/relative/path",
];

const IMAGE_OPTIONS = {
	allowedProtocols: ["http:", "https:"],
	allowRelative: false,
} as const;

/** URL/security behaviour exposed by the core API (Task 32). */
export function LinkSecurityScenario() {
	const [url, setUrl] = useState(PRESETS[0] ?? "");

	const linkResult = isSafeUrl(url);
	const imageResult = isSafeUrl(url, IMAGE_OPTIONS);

	return (
		<div data-testid="scenario-link-security">
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<input
					type="text"
					data-testid="security-url"
					className={`${inputClass} w-80`}
					value={url}
					onChange={(event) => setUrl(event.target.value)}
				/>
			</div>
			<div className="mb-3 flex flex-wrap gap-2">
				{PRESETS.map((preset) => (
					<button
						key={preset}
						type="button"
						className={buttonClass}
						onClick={() => setUrl(preset)}
					>
						{preset}
					</button>
				))}
			</div>
			<Panel title="isSafeUrl result" testId="security-result">
				<div className="flex flex-col gap-1 text-sm">
					<div className="flex justify-between gap-4">
						<span className="text-zinc-500">link (default protocols)</span>
						<span
							data-testid="security-link-result"
							className={linkResult ? "text-green-600" : "text-red-600"}
						>
							{String(linkResult)}
						</span>
					</div>
					<div className="flex justify-between gap-4">
						<span className="text-zinc-500">
							image (http/https only, no relative)
						</span>
						<span
							data-testid="security-image-result"
							className={imageResult ? "text-green-600" : "text-red-600"}
						>
							{String(imageResult)}
						</span>
					</div>
				</div>
			</Panel>
		</div>
	);
}
