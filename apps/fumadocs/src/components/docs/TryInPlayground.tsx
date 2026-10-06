import { ExternalLink } from "lucide-react";

import { playgroundCtaLabel, playgroundScenarioUrl } from "@/lib/playground";

type TryInPlaygroundProps = {
	/** Documentation locale, used to pick the label. */
	lang: string;
	/** Playground scenario id this page links to. */
	scenario: string;
};

/**
 * Optional link from a documentation page into the matching Playground scenario.
 *
 * Renders nothing unless `NEXT_PUBLIC_PLAYGROUND_URL` was set at build time —
 * see `src/lib/playground.ts` for why the link is opt-in.
 *
 * The Playground is a separate application on a different port, so the link
 * opens in a new tab and leaves the documentation in place.
 */
export function TryInPlayground({ lang, scenario }: TryInPlaygroundProps) {
	const href = playgroundScenarioUrl(scenario);
	if (!href) {
		return null;
	}

	return (
		<a
			className="rk-btn-secondary"
			data-testid="try-in-playground"
			href={href}
			rel="noreferrer"
			target="_blank"
		>
			{playgroundCtaLabel(lang)}
			<ExternalLink aria-hidden="true" className="size-4 shrink-0" />
		</a>
	);
}
