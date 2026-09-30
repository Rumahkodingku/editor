/**
 * React adapter for RumahKodingku Editor.
 *
 * Phase 01 only establishes the package boundary, dependency direction, and
 * stylesheet artifact. The `Editor` component, hooks, and toolbar rendering
 * are implemented in Phase 04.
 */

import { EDITOR_CORE_PACKAGE_NAME } from "@rumahkodingku/editor-core";

export const EDITOR_REACT_PACKAGE_NAME = "@rumahkodingku/editor-react" as const;

export { EDITOR_CORE_PACKAGE_NAME };
