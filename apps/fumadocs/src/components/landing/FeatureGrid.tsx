import { getLandingCopy } from "./copy";
import { Reveal } from "./Reveal";

const facts = ["No React in the core", "SSR-safe imports", "JSON canonical"];
const extensions = [
	"StarterKit",
	"Placeholder",
	"ImageUpload",
	"Your extension",
];

function Chip({ children }: { children: string }) {
	return (
		<span className="rounded-full border border-rk-hairline bg-rk-canvas-soft px-3 py-1 text-rk-ink-secondary text-xs">
			{children}
		</span>
	);
}

export function FeatureGrid({ lang }: { lang: string }) {
	const copy = getLandingCopy(lang);
	const [framework, typed, composable] = copy.features.items;

	return (
		<section
			id="features"
			className="scroll-mt-20 border-rk-hairline border-b bg-rk-canvas-soft py-20 md:py-24"
		>
			<div className="rk-container">
				<Reveal className="max-w-2xl">
					<h2 className="font-light text-3xl text-rk-ink leading-[1.1] tracking-[-0.64px] md:text-[32px]">
						{copy.features.title}
					</h2>
					<p className="mt-4 font-light text-base text-rk-ink-muted">
						{copy.features.subtitle}
					</p>
				</Reveal>

				<div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12">
					<Reveal className="md:col-span-7">
						<article className="rk-card flex h-full flex-col p-8">
							<h3 className="font-medium text-rk-ink text-xl tracking-[-0.2px]">
								{framework.title}
							</h3>
							<p className="mt-3 max-w-[52ch] font-light text-[15px] text-rk-ink-muted leading-relaxed">
								{framework.body}
							</p>
							<div className="mt-6 flex flex-wrap gap-2">
								{facts.map((fact) => (
									<Chip key={fact}>{fact}</Chip>
								))}
							</div>
						</article>
					</Reveal>

					<Reveal className="md:col-span-5" delay={0.05}>
						<article className="rk-card flex h-full flex-col p-8">
							<h3 className="font-medium text-rk-ink text-xl tracking-[-0.2px]">
								{typed.title}
							</h3>
							<p className="mt-3 font-light text-[15px] text-rk-ink-muted leading-relaxed">
								{typed.body}
							</p>
							<pre className="mt-6 overflow-x-auto rounded-lg border border-rk-hairline bg-rk-canvas-soft p-4 font-mono text-rk-ink-secondary text-xs leading-relaxed">
								{`type EditorProps = {
  defaultValue?: JSONContent
  onChange?: (value: JSONContent) => void
}`}
							</pre>
						</article>
					</Reveal>

					<Reveal className="md:col-span-12" delay={0.1}>
						<article className="rk-card flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
							<div className="max-w-[60ch]">
								<h3 className="font-medium text-rk-ink text-xl tracking-[-0.2px]">
									{composable.title}
								</h3>
								<p className="mt-3 font-light text-[15px] text-rk-ink-muted leading-relaxed">
									{composable.body}
								</p>
							</div>
							<div className="flex flex-wrap gap-2">
								{extensions.map((extension) => (
									<Chip key={extension}>{extension}</Chip>
								))}
							</div>
						</article>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
