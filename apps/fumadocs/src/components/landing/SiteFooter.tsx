import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { githubUrl, localePrefix } from "@/lib/layout.shared";

import { getLandingCopy } from "./copy";

export function SiteFooter({ lang }: { lang: string }) {
	const copy = getLandingCopy(lang);
	const prefix = localePrefix(lang);

	const links = [
		{ label: copy.footer.documentation, href: `${prefix}/docs` },
		{
			label: copy.footer.examples,
			href: `${prefix}/docs/examples/basic-editor`,
		},
		{ label: copy.footer.apiReference, href: `${prefix}/docs/api/react` },
	];

	return (
		<footer className="bg-rk-canvas py-16">
			<div className="rk-container">
				<div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
					<div>
						<Logo />
						<p className="mt-3 max-w-xs font-light text-rk-ink-muted text-sm">
							{copy.footer.tagline}
						</p>
					</div>
					<nav
						aria-label="Footer"
						className="flex flex-col gap-3 text-sm md:items-end"
					>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-rk-ink-secondary underline-offset-4 hover:text-rk-primary hover:underline"
							>
								{link.label}
							</Link>
						))}
						<a
							href={githubUrl}
							target="_blank"
							rel="noreferrer"
							className="text-rk-ink-secondary underline-offset-4 hover:text-rk-primary hover:underline"
						>
							{copy.footer.github}
						</a>
					</nav>
				</div>
				<div className="mt-12 border-rk-hairline border-t pt-6 text-rk-ink-muted text-xs">
					{copy.footer.legal}
				</div>
			</div>
		</footer>
	);
}
