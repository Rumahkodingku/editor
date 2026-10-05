import Link from "next/link";

import { localePrefix } from "@/lib/layout.shared";

import { getLandingCopy } from "./copy";
import { Reveal } from "./Reveal";

function CodePanel({
	label,
	code,
	bordered,
}: {
	label: string;
	code: string;
	bordered?: boolean;
}) {
	return (
		<div className={bordered ? "border-white/10 border-t" : undefined}>
			<div className="flex items-center gap-2 border-white/10 border-b px-5 py-3">
				<span
					aria-hidden="true"
					className="size-2 rounded-[3px] bg-rk-primary-soft"
				/>
				<span className="font-medium text-[11px] text-white/60 uppercase tracking-[0.14em]">
					{label}
				</span>
			</div>
			<pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] text-white/90 leading-relaxed">
				<code>{code}</code>
			</pre>
		</div>
	);
}

export function CodeShowcase({ lang }: { lang: string }) {
	const copy = getLandingCopy(lang);
	const prefix = localePrefix(lang);

	return (
		<section className="border-rk-hairline border-b bg-rk-canvas py-20 md:py-24">
			<div className="rk-container">
				<Reveal className="max-w-2xl">
					<h2 className="font-light text-3xl text-rk-ink leading-[1.1] tracking-[-0.64px] md:text-[32px]">
						{copy.code.title}
					</h2>
					<p className="mt-4 font-light text-base text-rk-ink-muted">
						{copy.code.subtitle}
					</p>
				</Reveal>

				<Reveal delay={0.05} className="mt-10">
					<div className="rk-shadow-2 overflow-hidden rounded-xl bg-rk-brand-dark">
						<CodePanel
							label={copy.code.installLabel}
							code={copy.code.install}
						/>
						<CodePanel
							label={copy.code.usageLabel}
							code={copy.code.usage}
							bordered
						/>
					</div>
				</Reveal>

				<Reveal delay={0.1}>
					<p className="mt-6 text-rk-ink-muted text-sm">
						<Link
							href={`${prefix}/docs/getting-started/installation`}
							className="font-medium text-rk-primary underline-offset-4 hover:underline"
						>
							{copy.footer.documentation}
						</Link>
					</p>
				</Reveal>
			</div>
		</section>
	);
}
