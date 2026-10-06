import { ExternalLink } from "lucide-react";

import { docsUrl } from "../lib/config";
import { buttonClass } from "../lib/ui";

/**
 * Link back to the public documentation.
 *
 * The documentation is the canonical home for examples (`ARCHITECTURE.md`
 * §20.2); this is the return leg of the Documentation → Playground →
 * Documentation journey. It opens in a new tab because the Playground is a
 * separate application on a different port.
 */
export function DocumentationLink() {
	return (
		<a
			className={buttonClass}
			data-testid="docs-link"
			href={docsUrl}
			rel="noreferrer"
			target="_blank"
		>
			<ExternalLink aria-hidden="true" className="size-4" strokeWidth={2} />
			<span className="hidden sm:inline">Documentation</span>
			<span className="sr-only sm:hidden">Documentation</span>
		</a>
	);
}
