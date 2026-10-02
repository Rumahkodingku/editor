import {
	createEmptyDocument,
	type JSONContent,
} from "@rumahkodingku/editor-core";

/** Rich fixture used by the scenarios that need representative content. */
export const defaultFixture: JSONContent = {
	type: "doc",
	content: [
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Playground fixture" }],
		},
		{
			type: "paragraph",
			content: [
				{ type: "text", text: "This document proves that " },
				{ type: "text", marks: [{ type: "bold" }], text: "initial JSON" },
				{ type: "text", text: " renders through the public package API." },
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
							content: [
								{ type: "text", text: "Controlled and uncontrolled modes" },
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{ type: "text", text: "Read-only and disabled states" },
							],
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
						{ type: "text", text: "JSON is canonical; HTML is output." },
					],
				},
			],
		},
	],
};

/** Alternate fixture used to make controlled-mode changes obvious. */
export const altFixture: JSONContent = {
	type: "doc",
	content: [
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Alternate content" }],
		},
		{
			type: "paragraph",
			content: [
				{ type: "text", text: "Replaced by the controlled `value` prop." },
			],
		},
	],
};

/** Empty document fixture. */
export const emptyFixture: JSONContent = createEmptyDocument();
