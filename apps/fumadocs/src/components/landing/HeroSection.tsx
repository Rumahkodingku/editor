import Link from "next/link";

import { GithubIcon, githubUrl, localePrefix } from "@/lib/layout.shared";

import { getLandingCopy } from "./copy";
import { GradientMesh } from "./GradientMesh";
import { HeroEditorPreview } from "./HeroEditorPreview";
import { Reveal } from "./Reveal";

export function HeroSection({ lang }: { lang: string }) {
	const copy = getLandingCopy(lang);
	const prefix = localePrefix(lang);

	return (
		<section className="relative overflow-hidden border-rk-hairline border-b">
			<GradientMesh className="pointer-events-none absolute inset-x-0 top-0 h-115 w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(60% 55% at 50% 38%, color-mix(in srgb, var(--color-rk-canvas) 88%, transparent), transparent 72%)",
				}}
			/>
			<div className="rk-container relative pt-16 pb-20 md:pt-24 md:pb-28">
				<div className="mx-auto max-w-3xl text-center">
					<Reveal>
						<p className="font-medium text-[11px] text-rk-ink-muted uppercase tracking-[0.18em]">
							{copy.hero.eyebrow}
						</p>
					</Reveal>
					<Reveal delay={0.05}>
						<h1 className="mt-6 text-balance font-light text-4xl text-rk-ink leading-[1.06] tracking-[-1.2px] md:text-[56px] md:leading-[1.03] md:tracking-[-1.4px]">
							{copy.hero.title}
						</h1>
					</Reveal>
					<Reveal delay={0.1}>
						<p className="rk-hero-accent mt-5 text-lg">
							{copy.hero.subheadline}
						</p>
					</Reveal>
					<Reveal delay={0.15}>
						<p className="mx-auto mt-5 max-w-2xl font-light text-base text-rk-ink-muted leading-relaxed">
							{copy.hero.description}
						</p>
					</Reveal>
					<Reveal delay={0.2}>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<Link href={`${prefix}/docs`} className="rk-btn-primary">
								{copy.hero.primaryCta}
								<span aria-hidden="true">&#8594;</span>
							</Link>
							<a
								href={githubUrl}
								target="_blank"
								rel="noreferrer"
								className="rk-btn-secondary"
							>
								<GithubIcon />
								{copy.hero.secondaryCta}
							</a>
						</div>
					</Reveal>
				</div>
				<Reveal delay={0.25} className="mx-auto mt-14 max-w-3xl">
					<HeroEditorPreview />
				</Reveal>
			</div>
		</section>
	);
}
