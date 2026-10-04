import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	MarkdownCopyButton,
	ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { i18n } from "@/lib/i18n";
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from "@/lib/shared";
import { source } from "@/lib/source";

export default async function Page(
	props: PageProps<"/[lang]/docs/[[...slug]]">,
) {
	const params = await props.params;
	const page = source.getPage(params.slug, params.lang);
	if (!page) notFound();

	const MDX = page.data.body;
	const markdownUrl = getPageMarkdownUrl(page).url;
	const docsPrefix =
		params.lang === i18n.defaultLanguage ? "" : `/${params.lang}`;

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<DocsTitle className="rk-docs-title">{page.data.title}</DocsTitle>
			<DocsDescription className="mb-0">
				{page.data.description}
			</DocsDescription>
			<div className="flex flex-row items-center gap-2 border-b pb-6">
				<MarkdownCopyButton markdownUrl={markdownUrl} />
				<ViewOptionsPopover
					markdownUrl={markdownUrl}
					githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/apps/fumadocs/content/docs/${page.path}`}
				/>
			</div>
			<DocsBody className="rk-docs">
				<MDX
					components={getMDXComponents({
						// Internal documentation links keep the active locale.
						a: ({ href, ...props }) => {
							const localized =
								typeof href === "string" && href.startsWith("/docs")
									? `${docsPrefix}${href}`
									: href;
							return <Link href={localized ?? "#"} {...props} />;
						},
					})}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(
	props: PageProps<"/[lang]/docs/[[...slug]]">,
): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug, params.lang);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			images: getPageImageUrl(page).url,
		},
	};
}
