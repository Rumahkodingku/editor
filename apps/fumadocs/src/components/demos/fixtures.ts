import {
	createEmptyDocument,
	type JSONContent,
} from "@rumahkodingku/editor-core";

/** Representative document used by the live examples. */
export const demoDocument: JSONContent = {
	type: "doc",
	content: [
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "RumahKodingku Editor" }],
		},
		{
			type: "paragraph",
			content: [
				{ type: "text", text: "This document is canonical " },
				{ type: "text", marks: [{ type: "bold" }], text: "JSON" },
				{
					type: "text",
					text: " content. HTML is produced from it as an output format.",
				},
			],
		},
		{
			type: "bulletList",
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", text: "Framework-independent core" }],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", text: "Thin React adapter" }],
						},
					],
				},
			],
		},
		{
			type: "blockquote",
			content: [
				{
					type: "paragraph",
					content: [
						{ type: "text", text: "Send me a message with the toolbar." },
					],
				},
			],
		},
	],
};

/** Empty document fixture. */
export const emptyDocument: JSONContent = createEmptyDocument();
