import Link from "next/link";

import { localePrefix } from "@/lib/layout.shared";

import { getLandingCopy } from "./copy";
import { Reveal } from "./Reveal";

export function FinalCta({ lang }: { lang: string }) {
	const copy = getLandingCopy(lang);
	const prefix = localePrefix(lang);

	return (
		<section className="bg-rk-brand-dark py-16 text-center text-white md:py-20">
			<div className="rk-container">
				<Reveal>
					<h2 className="font-light text-3xl text-white leading-[1.1] tracking-[-0.64px] md:text-[32px]">
						{copy.cta.title}
					</h2>
					<p className="mx-auto mt-4 max-w-xl font-light text-base text-white/70 leading-relaxed">
						{copy.cta.subtitle}
					</p>
					<div className="mt-8 flex justify-center">
						<Link href={`${prefix}/docs`} className="rk-btn-on-dark">
							{copy.cta.action}
							<span aria-hidden="true">&#8594;</span>
						</Link>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
