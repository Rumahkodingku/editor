import { RootProvider } from "fumadocs-ui/provider/next";
import "@rumahkodingku/editor-react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { i18nUI } from "@/lib/layout.shared";
import { appName } from "@/lib/shared";
import "../global.css";

const inter = Inter({
	subsets: ["latin"],
});

const description =
	"Reusable, typed, composable WYSIWYG rich text editor for modern web applications, built on Tiptap and ProseMirror.";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	: process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:4000";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: appName,
		template: `%s | ${appName}`,
	},
	description,
	applicationName: appName,
	icons: {
		icon: "/icon.svg",
	},
	openGraph: {
		type: "website",
		siteName: appName,
		title: appName,
		description,
	},
};

export default async function Layout({
	params,
	children,
}: LayoutProps<"/[lang]">) {
	const { lang } = await params;

	return (
		<html lang={lang} className={inter.className} suppressHydrationWarning>
			<body className="flex min-h-screen flex-col">
				<RootProvider i18n={i18nUI.provider(lang)}>{children}</RootProvider>
			</body>
		</html>
	);
}
