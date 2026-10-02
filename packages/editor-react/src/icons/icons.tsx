import type { ReactNode } from "react";

/**
 * Inline SVG icons for the default toolbar.
 *
 * Icons are keyed by the `icon` field of a core `ToolbarItemDefinition`, so no
 * icon package is required and unknown icons simply render nothing.
 */
const ICONS: Record<string, ReactNode> = {
	bold: (
		<>
			<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7z" />
			<path d="M7 12h7a3.5 3.5 0 0 1 0 7H7z" />
		</>
	),
	italic: (
		<>
			<line x1="19" y1="5" x2="10" y2="5" />
			<line x1="14" y1="19" x2="5" y2="19" />
			<line x1="15" y1="5" x2="9" y2="19" />
		</>
	),
	underline: (
		<>
			<path d="M6 5v6a6 6 0 0 0 12 0V5" />
			<line x1="5" y1="20" x2="19" y2="20" />
		</>
	),
	strike: (
		<>
			<line x1="4" y1="12" x2="20" y2="12" />
			<path d="M17 7a5 5 0 0 0-4-2h-1a2.5 2.5 0 0 0-1 5h5a2.5 2.5 0 0 1-1 5h-2a5 5 0 0 1-4-2" />
		</>
	),
	code: (
		<>
			<polyline points="8 7 3 12 8 17" />
			<polyline points="16 7 21 12 16 17" />
		</>
	),
	"heading-1": (
		<>
			<path d="M4 6v12" />
			<path d="M12 6v12" />
			<path d="M4 12h8" />
			<path d="M17 10l2-1v9" />
		</>
	),
	"heading-2": (
		<>
			<path d="M4 6v12" />
			<path d="M12 6v12" />
			<path d="M4 12h8" />
			<path d="M16 11a2.5 2.5 0 1 1 4 2l-4 3h5" />
		</>
	),
	"heading-3": (
		<>
			<path d="M4 6v12" />
			<path d="M12 6v12" />
			<path d="M4 12h8" />
			<path d="M16 9h5l-2.5 3.5a2.5 2.5 0 1 1-2 4" />
		</>
	),
	list: (
		<>
			<line x1="9" y1="6" x2="20" y2="6" />
			<line x1="9" y1="12" x2="20" y2="12" />
			<line x1="9" y1="18" x2="20" y2="18" />
			<circle cx="4" cy="6" r="1" />
			<circle cx="4" cy="12" r="1" />
			<circle cx="4" cy="18" r="1" />
		</>
	),
	"list-ordered": (
		<>
			<line x1="10" y1="6" x2="20" y2="6" />
			<line x1="10" y1="12" x2="20" y2="12" />
			<line x1="10" y1="18" x2="20" y2="18" />
			<path d="M4 6h1v4" />
			<path d="M4 10h2" />
			<path d="M6 16a1 1 0 1 0-1 1 1 1 0 0 1-1 1h2" />
		</>
	),
	quote: (
		<>
			<path d="M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v1a2 2 0 0 1-2 2" />
			<path d="M19 7h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v1a2 2 0 0 1-2 2" />
		</>
	),
	"code-block": (
		<>
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<polyline points="9 10 7 12 9 14" />
			<polyline points="15 10 17 12 15 14" />
		</>
	),
	"horizontal-rule": <line x1="4" y1="12" x2="20" y2="12" />,
	undo: (
		<>
			<polyline points="9 14 4 9 9 4" />
			<path d="M20 20v-7a4 4 0 0 0-4-4H4" />
		</>
	),
	redo: (
		<>
			<polyline points="15 14 20 9 15 4" />
			<path d="M4 20v-7a4 4 0 0 1 4-4h12" />
		</>
	),
};

export type ToolbarIconProps = {
	/** Icon identifier from a core toolbar definition. */
	name: string;
};

/** Render an inline SVG icon for a toolbar definition id. */
export function ToolbarIcon({ name }: ToolbarIconProps) {
	const icon = ICONS[name];
	if (!icon) {
		return null;
	}

	return (
		<svg
			aria-hidden="true"
			focusable="false"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{icon}
		</svg>
	);
}
