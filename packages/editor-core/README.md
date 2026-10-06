# @rumahkodingku/editor-core

Framework-independent core for RumahKodingku Editor, built on Tiptap and
ProseMirror.

`editor-core` owns editor creation, the default extension preset, content
utilities, JSON/HTML serialization, persistence schema versioning, the image
upload contract, toolbar definitions, and editor labels. It does **not** depend
on React, Vue, or any UI framework — React integration lives in
[`@rumahkodingku/editor-react`](../editor-react).

## Installation

```bash
pnpm add @rumahkodingku/editor-core \
  @tiptap/core @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extensions @tiptap/html
```

Tiptap packages are peer dependencies so a single editor engine instance exists
in the application. Keep every `@tiptap/*` package on the same version line.

`@tiptap/html` requires a DOM to render server-side HTML; provide `happy-dom`
(an optional peer) when using `jsonToHTML` outside a browser.

## Quick start

```ts
import { createEditor, createDefaultExtensions } from "@rumahkodingku/editor-core";

const editor = createEditor({
	extensions: createDefaultExtensions(),
	content: { type: "doc", content: [] },
});
```

The document is owned by Tiptap/ProseMirror. JSON is the canonical content
format; HTML is an output format.

## Public API

- **Editor:** `createEditor`, `CreateEditorOptions`.
- **Extensions:** `createDefaultExtensions`, `composeExtensions`, `ImageUpload`,
  `insertImageFromFile`, and their option types.
- **Content:** `createEmptyDocument`, `isEmptyContent`, `isValidJSONContent`,
  `normalizeContent`.
- **Serialization:** `toJSON`, `toHTML`, `jsonToHTML` (server-safe).
- **Persistence:** `PersistenceEnvelope`, `createPersistenceEnvelope`,
  `parsePersistenceEnvelope`, `EDITOR_SCHEMA_VERSION`,
  `isSupportedSchemaVersion`, `isPersistenceEnvelope`.
- **Upload:** `ImageUploadHandler`, `ImageUploadResult`, `ImageUploadOptions`,
  `validateImageFile`, `EditorUploadError`, `toUploadError`.
- **Toolbar:** `createDefaultToolbar`, `ToolbarItemDefinition`.
- **Security:** `isSafeUrl`, `DEFAULT_LINK_PROTOCOLS`, `DEFAULT_IMAGE_PROTOCOLS`.
- **Labels:** `defaultLabels`, `resolveLabels`, `EditorLabels`.
- **Errors:** `EditorError`, `EditorConfigError`, `EditorContentError`,
  `EditorSchemaVersionError`.
- **Tiptap types:** `JSONContent`, `Editor`, `AnyExtension` (re-exported).

## Content model

Persisted content uses the envelope `{ schemaVersion, content }`, where `content`
is Tiptap/ProseMirror JSON. HTML is output-only and is never accepted as a
controlled value.

## License

MIT
