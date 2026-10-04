import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { isMarkdownPreferred } from "fumadocs-core/negotiation";
import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

import { i18n } from "@/lib/i18n";
import { docsContentRoute, docsRoute } from "@/lib/shared";

const i18nMiddleware = createI18nMiddleware(i18n);

const docsSegment = docsRoute.replace(/^\//, "");

/**
 * Split a docs pathname into its optional locale and the remaining slug.
 *
 * `/docs/a/b` → `{ rest: "a/b" }` (default locale, hidden)
 * `/id/docs/a` → `{ locale: "id", rest: "a" }`
 */
function parseDocsPath(pathname: string) {
	const segments = pathname.split("/").filter(Boolean);
	let index = 0;
	let locale: string | undefined;

	if (
		segments[0] &&
		i18n.languages.some((language) => language === segments[0])
	) {
		locale = segments[0];
		index = 1;
	}

	if (segments[index] !== docsSegment) return undefined;

	return { locale, rest: segments.slice(index + 1).join("/") };
}

function toContentUrl(locale: string | undefined, rest: string) {
	const lang = locale ?? i18n.defaultLanguage;

	return `/${lang}${docsContentRoute}${rest.length > 0 ? `/${rest}` : ""}/content.md`;
}

/**
 * Rewrite markdown requests for documentation pages to the generated markdown
 * content route, preserving the active locale.
 *
 * A page is treated as markdown when its path ends with `.md` or the client
 * sends an `Accept` header that prefers markdown.
 */
function resolveMarkdown(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSuffix = pathname.endsWith(".md");
	const normalized = hasSuffix ? pathname.slice(0, -3) : pathname;
	const parsed = parseDocsPath(normalized);

	if (!parsed) return undefined;
	if (!hasSuffix && !isMarkdownPreferred(request)) return undefined;

	return toContentUrl(parsed.locale, parsed.rest);
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
	const markdownUrl = resolveMarkdown(request);

	if (markdownUrl) {
		return NextResponse.rewrite(new URL(markdownUrl, request.nextUrl));
	}

	return i18nMiddleware(request, event);
}

export const config = {
	// Ignore API, Next internals, and root-level machine files so the locale
	// middleware only handles documentation and application routes.
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
	],
};
