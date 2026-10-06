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

/** URL/security behaviour exposed by the core API. */
export function LinkSecurityScenario() {
	const [url, setUrl] = useState(PRESETS[0] ?? "");

	const linkResult = isSafeUrl(url);
	const imageResult = isSafeUrl(url, IMAGE_OPTIONS);

	return (
		<div data-testid="scenario-link-security">
			<div className="flex flex-col gap-3">
				<label className="flex flex-col gap-1.5 text-sm">
					<span className="text-rk-ink-muted">URL to test</span>
					<input
						className={`${inputClass} font-mono sm:max-w-md`}
						data-testid="security-url"
						onChange={(event) => setUrl(event.target.value)}
						type="text"
						value={url}
					/>
				</label>
				<div className="flex flex-wrap gap-2">
					{PRESETS.map((preset) => (
						<button
							className={`${buttonClass} font-mono text-xs`}
							key={preset}
							onClick={() => setUrl(preset)}
							type="button"
						>
							{preset}
						</button>
					))}
				</div>
				<Panel
					description="Core URL validation with the default and image option sets."
					testId="security-result"
					title="isSafeUrl result"
				>
					<dl className="flex flex-col text-sm">
						<div className="flex items-baseline justify-between gap-4 py-0.5">
							<dt className="text-rk-ink-muted">link (default protocols)</dt>
							<dd
								className={`font-medium font-mono ${linkResult ? "text-rk-success" : "text-rk-danger"}`}
								data-testid="security-link-result"
							>
								{String(linkResult)}
							</dd>
						</div>
						<div className="flex items-baseline justify-between gap-4 py-0.5">
							<dt className="text-rk-ink-muted">
								image (http/https only, no relative)
							</dt>
							<dd
								className={`font-medium font-mono ${imageResult ? "text-rk-success" : "text-rk-danger"}`}
								data-testid="security-image-result"
							>
								{String(imageResult)}
							</dd>
						</div>
					</dl>
				</Panel>
			</div>
		</div>
	);
}
