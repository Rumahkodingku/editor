import {
	type EditorLabels,
	isSafeUrl,
	resolveLabels,
} from "@rumahkodingku/editor-core";
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

export type LinkControlProps = {
	/** Editor to act on. Falls back to the surrounding editor context. */
	editor?: Editor | null;
	/** Partial label overrides applied on top of the resolved/core defaults. */
	labels?: Partial<EditorLabels>;
	/** Class name applied to the control wrapper. */
	className?: string;
};

type LinkState = {
	active: boolean;
	disabled: boolean;
	href: string;
};

const INACTIVE: LinkState = { active: false, disabled: true, href: "" };

/**
 * Toolbar control for inserting, editing and removing links.
 *
 * The popover is positioned by the adapter with plain CSS (no floating-UI
 * dependency). URLs are validated with the core `isSafeUrl`, so unsafe schemes
 * such as `javascript:` are rejected before they reach the document.
 */
export function LinkControl({
	editor: editorProp,
	labels,
	className,
}: LinkControlProps) {
	const context = useContext(EditorContext);
	const editor = editorProp ?? context?.editor ?? null;
	const resolvedLabels = useMemo(
		() => resolveLabels(labels ?? context?.labels),
		[labels, context?.labels],
	);

	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const state =
		useEditorState({
			editor,
			selector: ({ editor: current }) => {
				if (!current) {
					return INACTIVE;
				}
				const active = current.isActive("link");
				return {
					active,
					disabled:
						!current.isEditable || (!active && current.state.selection.empty),
					href:
						(current.getAttributes("link").href as string | undefined) ?? "",
				};
			},
			equalityFn: (a, b) =>
				a?.active === b?.active &&
				a?.disabled === b?.disabled &&
				a?.href === b?.href,
		}) ?? INACTIVE;

	useEffect(() => {
		if (open) {
			inputRef.current?.focus();
		}
	}, [open]);

	const close = (restoreFocus: boolean) => {
		setOpen(false);
		setError(null);
		if (restoreFocus) {
			editor?.commands.focus();
		}
	};

	const openPopover = () => {
		setUrl(state.href);
		setError(null);
		setOpen(true);
	};

	const apply = () => {
		if (!editor) {
			return;
		}
		const value = url.trim();
		if (!isSafeUrl(value)) {
			setError("Enter a valid, safe URL.");
			return;
		}
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setMark("link", { href: value })
			.run();
		close(false);
	};

	const remove = () => {
		if (!editor) {
			return;
		}
		editor.chain().focus().extendMarkRange("link").unsetMark("link").run();
		close(false);
	};

	const handlePopoverKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			event.preventDefault();
			close(true);
		}
	};

	const isDisabled = state.disabled || !editor;

	return (
		<div className={cx("rk-editor__control", className)}>
			<button
				type="button"
				className={cx(
					"rk-editor__button",
					state.active && "rk-editor__button--active",
					isDisabled && "rk-editor__button--disabled",
				)}
				aria-label={state.active ? resolvedLabels.unlink : resolvedLabels.link}
				aria-pressed={state.active}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-disabled={isDisabled}
				disabled={isDisabled}
				onMouseDown={(event) => event.preventDefault()}
				onClick={() => (open ? close(false) : openPopover())}
			>
				<ToolbarIcon name={state.active ? "unlink" : "link"} />
			</button>
			{open ? (
				<div
					className="rk-editor__popover"
					role="dialog"
					aria-label={resolvedLabels.link}
					onKeyDown={handlePopoverKeyDown}
				>
					<label className="rk-editor__field">
						<span className="rk-editor__field-label">{resolvedLabels.url}</span>
						<input
							ref={inputRef}
							type="url"
							className="rk-editor__input"
							value={url}
							onChange={(event) => {
								setUrl(event.target.value);
								setError(null);
							}}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									apply();
								}
							}}
							aria-invalid={error ? true : undefined}
						/>
					</label>
					{error ? (
						<p className="rk-editor__error" role="alert">
							{error}
						</p>
					) : null}
					<div className="rk-editor__popover-actions">
						<button type="button" className="rk-editor__action" onClick={apply}>
							{resolvedLabels.apply}
						</button>
						{state.active ? (
							<button
								type="button"
								className="rk-editor__action"
								onClick={remove}
							>
								{resolvedLabels.unlink}
							</button>
						) : null}
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
