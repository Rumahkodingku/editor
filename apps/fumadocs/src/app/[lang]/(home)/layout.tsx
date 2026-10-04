import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";

import { getLandingCopy } from "@/components/landing/copy";
import { baseOptions, localePrefix } from "@/lib/layout.shared";

export default async function Layout({
	params,
	children,
}: LayoutProps<"/[lang]">) {
	const { lang } = await params;
	const copy = getLandingCopy(lang);
	const prefix = localePrefix(lang);
	const base = baseOptions(lang);

	const links: LinkItemType[] = [
		{ type: "main", text: copy.nav.features, url: "#features" },
		...(base.links ?? []),
		// {
		// 	type: "custom",
		// 	secondary: true,
		// 	children: (
		// 		<a href={`${prefix}/docs`} className="rk-btn-primary">
		// 			{copy.nav.getStarted}
		// 		</a>
		// 	),
		// },
	];

	return (
		<HomeLayout {...base} links={links}>
			{children}
		</HomeLayout>
	);
}
