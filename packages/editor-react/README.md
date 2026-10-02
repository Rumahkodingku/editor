# @rumahkodingku/editor-react

React adapter for RumahKodingku Editor.

The adapter owns React integration only: component lifecycle, props, content
synchronization, callbacks, toolbar rendering and the published stylesheet.
Editor behavior lives in [`@rumahkodingku/editor-core`](../editor-core), and the
document stays owned by Tiptap/ProseMirror.

## Installation

```bash
pnpm add @rumahkodingku/editor-react @rumahkodingku/editor-core \
  @tiptap/core @tiptap/react react react-dom
```

Tiptap packages and React are peer dependencies so a single editor engine
instance exists in the application. Keep every `@tiptap/*` package on the same
version line.

Import the stylesheet once in your application entry:

```ts
import "@rumahkodingku/editor-react/styles.css";
```

## Quick start (uncontrolled)

```tsx
import { Editor } from "@rumahkodingku/editor-react";
import "@rumahkodingku/editor-react/styles.css";

export function MyEditor() {
	return (
		<Editor
			defaultValue={{
				type: "doc",
				content: [
					{ type: "paragraph", content: [{ type: "text", text: "Hello" }] },
				],
			}}
			onChange={(content) => saveDraft(content)}
		/>
	);
}
```

## Controlled mode

```tsx
<Editor value={content} onChange={setContent} />
```

`value` takes precedence over `defaultValue`. When both are supplied, the
adapter warns in development and ignores `defaultValue`. Controlled updates are
applied with `emitUpdate: false`, so an incoming `value` never re-triggers
`onChange` and equivalent content does not reset the document.

## Props

| Prop                | Type                             | Default | Notes                          |
| ------------------- | -------------------------------- | ------- | ------------------------------ |
| `value`             | `JSONContent`                    | —       | Controlled content.            |
| `defaultValue`      | `JSONContent`                    | empty   | Uncontrolled initial content.  |
| `onChange`          | `(content: JSONContent) => void` | —       | Fires on document changes.     |
| `onReady`           | `(editor: Editor) => void`       | —       | Fires once per instance.       |
| `placeholder`       | `string`                         | —       | Shown while empty.             |
| `editable`          | `boolean`                        | `true`  | Read-only when `false`.        |
| `disabled`          | `boolean`                        | `false` | No focus or interaction.       |
| `extensions`        | `AnyExtension[]`                 | —       | Composed with the core preset. |
| `labels`            | `Partial<EditorLabels>`          | —       | Label overrides.               |
| `immediatelyRender` | `boolean`                        | Tiptap  | Pass `false` under SSR.        |
| `className`         | `string`                         | —       | Applied to the editor root.    |

The `extensions` array must be referentially stable (for example module-level or
`useMemo`), otherwise the editor is recreated on renders.

## Read-only and disabled

`editable={false}` keeps the content selectable and sets `aria-readonly`.
`disabled` removes interaction entirely and sets `aria-disabled`. Both states
disable toolbar controls.

## Custom extensions and image upload

Extensions are composed with the core default preset through `composeExtensions`.
The image upload pipeline is configured by supplying a configured `ImageUpload`
extension — no provider is bundled:

```tsx
import { Editor, ImageUpload } from "@rumahkodingku/editor-react";

const upload = async ({ file, signal, onProgress }) => {
	const src = await myUpload(file, { signal, onProgress });
	return { src, alt: file.name };
};

<Editor
	extensions={[ImageUpload.configure({ upload, accept: ["image/png", "image/jpeg"] })]}
/>;
```

## Styling

The stylesheet is framework-agnostic and uses only `--rk-editor-*` custom
properties and `rk-*` classes. Override the variables to theme it, and use
`[data-theme="dark"]` or the system preference for dark mode:

```css
.my-app {
	--rk-editor-accent: #7c3aed;
	--rk-editor-radius: 0.5rem;
}
```

## SSR

The package is import-safe on the server. In SSR frameworks, render the editor
inside a client component and pass `immediatelyRender={false}` to avoid
hydration mismatches:

```tsx
"use client";
<Editor immediatelyRender={false} />
```

## Toolbar

`<Editor>` renders the core default toolbar. For custom composition, render
`EditorToolbar` with your own list of core `ToolbarItemDefinition`s:

```tsx
import { EditorToolbar, createDefaultToolbar } from "@rumahkodingku/editor-react";

<EditorToolbar editor={editor} items={createDefaultToolbar().slice(0, 5)} />;
```

## Public API

Components: `Editor`, `EditorToolbar`, `ToolbarButton`, `ToolbarIcon`.
Types: `EditorProps`, `EditorToolbarProps`, `ToolbarButtonProps`,
`ToolbarIconProps`, plus re-exported core types (`EditorLabels`,
`ToolbarItemDefinition`, `ImageUploadHandler`, `ImageUploadResult`,
`ImageUploadOptions`, `PersistenceEnvelope`) and Tiptap types (`JSONContent`,
`AnyExtension`, `TiptapEditor`).
