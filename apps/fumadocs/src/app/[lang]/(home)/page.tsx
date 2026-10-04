import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { CodeShowcase } from "@/components/landing/CodeShowcase";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { FinalCta } from "@/components/landing/FinalCta";
import { HeroSection } from "@/components/landing/HeroSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const metadata = {
	title: { absolute: "RumahKodingku Editor" },
	description:
		"A reusable, typed, composable WYSIWYG rich-text editor built on Tiptap and ProseMirror.",
};

export default async function HomePage({ params }: PageProps<"/[lang]">) {
	const { lang } = await params;

	return (
		<>
			<HeroSection lang={lang} />
			<FeatureGrid lang={lang} />
			<ArchitectureSection lang={lang} />
			<CodeShowcase lang={lang} />
			<FinalCta lang={lang} />
			<SiteFooter lang={lang} />
		</>
	);
}
