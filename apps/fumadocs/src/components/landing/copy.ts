import { i18n } from "@/lib/i18n";

export type Feature = {
	title: string;
	body: string;
};

export type LandingCopy = {
	nav: {
		features: string;
		docs: string;
		examples: string;
		github: string;
		getStarted: string;
	};
	hero: {
		eyebrow: string;
		title: string;
		subheadline: string;
		description: string;
		primaryCta: string;
		secondaryCta: string;
		previewLabel: string;
	};
	features: {
		title: string;
		subtitle: string;
		items: Feature[];
	};
	architecture: {
		title: string;
		subtitle: string;
		app: string;
		react: string;
		reactPkg: string;
		corePkg: string;
		engine: string;
		tiptap: string;
		prosemirror: string;
		note: string;
	};
	code: {
		title: string;
		subtitle: string;
		installLabel: string;
		usageLabel: string;
		install: string;
		usage: string;
	};
	cta: {
		title: string;
		subtitle: string;
		action: string;
	};
	footer: {
		tagline: string;
		documentation: string;
		examples: string;
		apiReference: string;
		github: string;
		legal: string;
	};
};

const installCommand = `pnpm add @rumahkodingku/editor-react @rumahkodingku/editor-core \\
  @tiptap/core @tiptap/react @tiptap/pm @tiptap/starter-kit \\
  @tiptap/extension-image @tiptap/extensions @tiptap/html \\
  react react-dom`;

const usageSnippet = `import { useState } from "react";
import { Editor } from "@rumahkodingku/editor-react";
import type { JSONContent } from "@rumahkodingku/editor-core";
import "@rumahkodingku/editor-react/styles.css";

export function App({ initialContent }: { initialContent: JSONContent }) {
  const [content, setContent] = useState(initialContent);

  return <Editor defaultValue={content} onChange={setContent} />;
}`;

const en: LandingCopy = {
	nav: {
		features: "Features",
		docs: "Docs",
		examples: "Examples",
		github: "GitHub",
		getStarted: "Get Started",
	},
	hero: {
		eyebrow: "DEVELOPER TOOL",
		title: "A modern rich-text editor for the web.",
		subheadline: "Typed. Composable. Framework-ready.",
		description:
			"A reusable, typed, composable WYSIWYG rich-text editor built on Tiptap and ProseMirror for modern web applications.",
		primaryCta: "Get Started",
		secondaryCta: "View on GitHub",
		previewLabel: "Live editor preview",
	},
	features: {
		title: "Built for developers.",
		subtitle: "A rich-text editing foundation without the framework lock-in.",
		items: [
			{
				title: "Framework independent",
				body: "The core editor logic does not depend on React, so it can support additional frameworks without duplicating editor logic.",
			},
			{
				title: "Typed",
				body: "Type-safe APIs built for modern TypeScript applications.",
			},
			{
				title: "Composable",
				body: "Extend the editor with your own extensions, schemas, and custom UI.",
			},
		],
	},
	architecture: {
		title: "Built as an editor ecosystem.",
		subtitle:
			"A modular architecture with a framework-independent core and adapters for supported UI frameworks.",
		app: "Your application",
		react: "React",
		reactPkg: "@rumahkodingku/editor-react",
		corePkg: "@rumahkodingku/editor-core",
		engine: "Editor engine",
		tiptap: "Tiptap",
		prosemirror: "ProseMirror",
		note: "A Vue adapter is planned, not implemented yet.",
	},
	code: {
		title: "Write less editor infrastructure.",
		subtitle: "Get started with just a few lines of code.",
		installLabel: "Terminal",
		usageLabel: "React",
		install: installCommand,
		usage: usageSnippet,
	},
	cta: {
		title: "Ready to build?",
		subtitle: "Build rich editing experiences without rebuilding the editor.",
		action: "Get Started",
	},
	footer: {
		tagline: "Reusable rich-text editing infrastructure.",
		documentation: "Documentation",
		examples: "Examples",
		apiReference: "API Reference",
		github: "GitHub",
		legal: "© 2026 RumahKodingku. Released under the MIT License.",
	},
};

const id: LandingCopy = {
	nav: {
		features: "Fitur",
		docs: "Dokumentasi",
		examples: "Contoh",
		github: "GitHub",
		getStarted: "Mulai",
	},
	hero: {
		eyebrow: "ALAT DEVELOPER",
		title: "Editor rich-text modern untuk web.",
		subheadline: "Bertipe. Composable. Siap framework.",
		description:
			"Editor teks kaya (WYSIWYG) yang dapat digunakan ulang, bertipe, dan composable, dibangun di atas Tiptap dan ProseMirror untuk aplikasi web modern.",
		primaryCta: "Mulai",
		secondaryCta: "Lihat di GitHub",
		previewLabel: "Pratinjau editor langsung",
	},
	features: {
		title: "Dibuat untuk developer.",
		subtitle: "Fondasi penyuntingan teks kaya tanpa terikat framework.",
		items: [
			{
				title: "Bebas framework",
				body: "Logika inti editor tidak bergantung pada React, sehingga dapat mendukung framework lain tanpa menduplikasi logika editor.",
			},
			{
				title: "Bertipe",
				body: "API yang aman tipe untuk aplikasi TypeScript modern.",
			},
			{
				title: "Composable",
				body: "Perluas editor dengan extension, skema, dan UI kustom Anda sendiri.",
			},
		],
	},
	architecture: {
		title: "Dibangun sebagai ekosistem editor.",
		subtitle:
			"Arsitektur modular dengan inti yang tidak bergantung framework dan adapter untuk framework UI yang didukung.",
		app: "Aplikasi Anda",
		react: "React",
		reactPkg: "@rumahkodingku/editor-react",
		corePkg: "@rumahkodingku/editor-core",
		engine: "Mesin editor",
		tiptap: "Tiptap",
		prosemirror: "ProseMirror",
		note: "Adapter Vue direncanakan, belum diimplementasikan.",
	},
	code: {
		title: "Tulis lebih sedikit infrastruktur editor.",
		subtitle: "Mulai hanya dengan beberapa baris kode.",
		installLabel: "Terminal",
		usageLabel: "React",
		install: installCommand,
		usage: usageSnippet,
	},
	cta: {
		title: "Siap membangun?",
		subtitle:
			"Bangun pengalaman penyuntingan kaya tanpa membangun ulang editornya.",
		action: "Mulai",
	},
	footer: {
		tagline: "Infrastruktur penyuntingan teks kaya yang dapat digunakan ulang.",
		documentation: "Dokumentasi",
		examples: "Contoh",
		apiReference: "Referensi API",
		github: "GitHub",
		legal: "© 2026 RumahKodingku. Dirilis di bawah Lisensi MIT.",
	},
};

const dictionaries: Record<string, LandingCopy> = { en, id };

/** Landing-page copy for a locale, falling back to the default locale. */
export function getLandingCopy(lang: string): LandingCopy {
	return dictionaries[lang] ?? dictionaries[i18n.defaultLanguage] ?? en;
}
