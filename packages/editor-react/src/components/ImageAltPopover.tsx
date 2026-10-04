import { type EditorLabels, resolveLabels } from "@rumahkodingku/editor-core";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
	type KeyboardEvent,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { EditorContext } from "../context/editor-context";
import { ToolbarIcon } from "../icons/icons";
import { cx } from "../lib/cx";

export type ImageAltPopoverProps = {
	/** Editor to act on. Falls back to the surrounding editor context. */
	editor?: Editor | null;
	/** Partial label overrides applied on top of the resolved/core defaults. */
	labels?: Partial<EditorLabels>;
	/** Class name applied to the control wrapper. */
	className?: string;
};

type AltState = {
	active: boolean;
	alt: string;
};

const INACTIVE: AltState = { active: false, alt: "" };

/**
 * Toolbar control for editing the alt text of the selected image.
 *
 * It only activates while an image node is selected and writes through the
 * engine's `updateAttributes`, so the alt text is preserved as document data.
 */
export function ImageAltPopover({
	editor: editorProp,
	labels,
	className,
}: ImageAltPopoverProps) {
	const context = useContext(EditorContext);
	const editor = editorProp ?? context?.editor ?? null;
	const resolvedLabels = useMemo(
		() => resolveLabels(labels ?? context?.labels),
		[labels, context?.labels],
	);

	const [open, setOpen] = useState(false);
	const [alt, setAlt] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const state =
		useEditorState({
			editor,
			selector: ({ editor: current }) => {
				if (!current) {
					return INACTIVE;
				}
				return {
					active: current.isActive("image"),
					alt: (current.getAttributes("image").alt as string | undefined) ?? "",
				};
			},
			equalityFn: (a, b) => a?.active === b?.active && a?.alt === b?.alt,
		}) ?? INACTIVE;

	useEffect(() => {
		if (open) {
			inputRef.current?.focus();
		}
	}, [open]);

	// Close the popover when the image selection is lost.
	useEffect(() => {
		if (open && !state.active) {
			setOpen(false);
		}
	}, [open, state.active]);

	const close = (restoreFocus: boolean) => {
		setOpen(false);
		if (restoreFocus) {
			editor?.commands.focus();
		}
	};

	const apply = () => {
		if (!editor) {
			return;
		}
		editor
			.chain()
			.focus()
			.updateAttributes("image", { alt: alt.trim() || null })
			.run();
		close(false);
	};

	const handlePopoverKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			event.preventDefault();
			close(true);
		}
	};

	const isDisabled = !state.active;

	return (
		<div className={cx("rk-editor__control", className)}>
			<button
				type="button"
				className={cx(
					"rk-editor__button",
					isDisabled && "rk-editor__button--disabled",
				)}
				aria-label={resolvedLabels.altText}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-disabled={isDisabled}
				disabled={isDisabled}
				onMouseDown={(event) => event.preventDefault()}
				onClick={() => {
					if (open) {
						close(false);
						return;
					}
					setAlt(state.alt);
					setOpen(true);
				}}
			>
				<ToolbarIcon name="image" />
			</button>
			{open ? (
				<div
					className="rk-editor__popover"
					role="dialog"
					aria-label={resolvedLabels.altText}
					onKeyDown={handlePopoverKeyDown}
				>
					<label className="rk-editor__field">
						<span className="rk-editor__field-label">
							{resolvedLabels.altText}
						</span>
						<input
							ref={inputRef}
							type="text"
							className="rk-editor__input"
							value={alt}
							onChange={(event) => setAlt(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									apply();
								}
							}}
						/>
					</label>
					<div className="rk-editor__popover-actions">
						<button type="button" className="rk-editor__action" onClick={apply}>
							{resolvedLabels.apply}
						</button>
						<button
							type="button"
							className="rk-editor__action"
							onClick={() => close(true)}
						>
							{resolvedLabels.cancel}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
