import { getLandingCopy } from "./copy";
import { Reveal } from "./Reveal";

function Node({ children, accent }: { children: string; accent?: boolean }) {
	return (
		<div
			className={
				accent
					? "rounded-xl border border-transparent bg-rk-primary px-5 py-3 text-center font-medium font-mono text-[13px] text-white"
					: "rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-center font-mono text-[13px] text-white/90"
			}
		>
			{children}
		</div>
	);
}

function Connector() {
	return <div aria-hidden="true" className="mx-auto h-7 w-px bg-white/20" />;
}

export function ArchitectureSection({ lang }: { lang: string }) {
	const copy = getLandingCopy(lang);

	return (
		<section className="bg-rk-brand-dark py-20 text-white md:py-24">
			<div className="rk-container grid items-center gap-12 md:grid-cols-2">
				<Reveal>
					<h2 className="font-light text-3xl text-white leading-[1.1] tracking-[-0.64px] md:text-[32px]">
						{copy.architecture.title}
					</h2>
					<p className="mt-4 max-w-[52ch] font-light text-base text-white/70 leading-relaxed">
						{copy.architecture.subtitle}
					</p>
					<p className="mt-6 text-sm text-white/60">{copy.architecture.note}</p>
				</Reveal>

				<Reveal delay={0.05}>
					<div className="mx-auto w-full max-w-sm">
						<Node>{copy.architecture.react}</Node>
						<Connector />
						<Node>{copy.architecture.reactPkg}</Node>
						<Connector />
						<Node accent>{copy.architecture.corePkg}</Node>
						<Connector />
						<div className="grid grid-cols-2 gap-3">
							<Node>{copy.architecture.tiptap}</Node>
							<Node>{copy.architecture.prosemirror}</Node>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
