import { expect, test } from "vitest";

import { isSafeUrl } from "./urls";

test("accepts safe link protocols", () => {
	expect(isSafeUrl("https://example.com")).toBe(true);
	expect(isSafeUrl("http://example.com/path?q=1")).toBe(true);
	expect(isSafeUrl("mailto:hello@example.com")).toBe(true);
});

test("rejects dangerous schemes", () => {
	expect(isSafeUrl("javascript:alert(1)")).toBe(false);
	expect(isSafeUrl("JavaScript:alert(1)")).toBe(false);
	expect(isSafeUrl("vbscript:msgbox(1)")).toBe(false);
	expect(isSafeUrl("file:///etc/passwd")).toBe(false);
});

test("rejects data URLs unless explicitly allowed", () => {
	expect(isSafeUrl("data:image/png;base64,AAAA")).toBe(false);
	expect(
		isSafeUrl("data:image/png;base64,AAAA", { allowDataImages: true }),
	).toBe(true);
	expect(
		isSafeUrl("data:text/html;base64,AAAA", { allowDataImages: true }),
	).toBe(false);
});

test("handles relative and protocol-relative values", () => {
	expect(isSafeUrl("/docs/page")).toBe(true);
	expect(isSafeUrl("#section")).toBe(true);
	expect(isSafeUrl("/docs/page", { allowRelative: false })).toBe(false);
	expect(isSafeUrl("//evil.com/x")).toBe(false);
});

test("rejects empty and non-string values", () => {
	expect(isSafeUrl("")).toBe(false);
	expect(isSafeUrl("   ")).toBe(false);
	expect(isSafeUrl(null)).toBe(false);
	expect(isSafeUrl(42)).toBe(false);
});

test("honors a custom protocol allow-list", () => {
	expect(isSafeUrl("ftp://example.com", { allowedProtocols: ["ftp:"] })).toBe(
		true,
	);
	expect(isSafeUrl("ftp://example.com")).toBe(false);
});
