import Image from "next/image";

/**
 * RumahKodingku Editor brand mark.
 *
 * Uses the existing product icon (`/icon.svg`) as the symbol next to a text
 * wordmark. No new logo is drawn here; the symbol is the asset already shipped
 * by the application.
 */
export function Logo({ className }: { className?: string }) {
	return (
		<span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
			<Image
				src="/icon.svg"
				alt=""
				aria-hidden="true"
				width={26}
				height={26}
				unoptimized
				className="size-6.5 rounded-[7px]"
			/>
			<span className="font-medium tracking-[-0.2px]">
				RumahKodingku Editor
			</span>
		</span>
	);
}
