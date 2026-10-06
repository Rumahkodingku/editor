import { CircleAlert, CircleCheck, CloudUpload, Loader2 } from "lucide-react";

/** Lifecycle of an injected image upload. */
export type UploadPhase = "idle" | "uploading" | "done" | "error";

type UploadStatusProps = {
	status: UploadPhase;
	/** Completion percentage; only rendered while uploading. */
	progress?: number;
	/** Stable hook for the browser suite; see `tests/browser/README.md`. */
	testId: string;
};

const PRESENTATION: Record<
	UploadPhase,
	{ label: string; className: string; Icon: typeof Loader2 }
> = {
	idle: {
		label: "idle",
		className: "text-rk-ink-muted",
		Icon: CloudUpload,
	},
	uploading: {
		label: "uploading",
		className: "text-rk-primary-deep dark:text-rk-primary",
		Icon: Loader2,
	},
	done: {
		label: "uploaded",
		className: "text-rk-success",
		Icon: CircleCheck,
	},
	error: {
		label: "failed",
		className: "text-rk-danger",
		Icon: CircleAlert,
	},
};

/**
 * Visual state of an image upload.
 *
 * Progress is exposed as a `progressbar` while uploading so assistive
 * technology reports the percentage; the other phases use a `status` live
 * region so the transition is announced without stealing focus.
 */
export function UploadStatus({
	status,
	progress = 0,
	testId,
}: UploadStatusProps) {
	const { label, className, Icon } = PRESENTATION[status];
	const uploading = status === "uploading";

	return (
		<div className="flex items-center gap-2">
			<span
				aria-live="polite"
				className={`inline-flex items-center gap-1.5 text-sm ${className}`}
				data-testid={testId}
				data-status={status}
				role="status"
			>
				<Icon
					aria-hidden="true"
					className={`size-4 shrink-0 ${uploading ? "animate-spin" : ""}`}
					strokeWidth={2}
				/>
				<span className="font-mono">{label}</span>
				{uploading ? <span className="font-mono">({progress}%)</span> : null}
			</span>
			{uploading ? (
				<div
					aria-label="Upload progress"
					aria-valuemax={100}
					aria-valuemin={0}
					aria-valuenow={progress}
					className="h-1.5 w-24 overflow-hidden rounded-full bg-rk-hairline"
					role="progressbar"
				>
					<div
						className="h-full rounded-full bg-rk-primary transition-[width]"
						style={{ width: `${progress}%` }}
					/>
				</div>
			) : null}
		</div>
	);
}
