import Link from "next/link";

export default function HomePage() {
	return (
		<div className="flex flex-1 flex-col justify-center text-center">
			<h1 className="mb-4 font-bold text-2xl">RumahKodingku Editor</h1>
			<p className="mb-2">
				A reusable, typed, composable WYSIWYG rich text editor built on Tiptap
				and ProseMirror.
			</p>
			<p>
				Open{" "}
				<Link href="/docs" className="font-medium underline">
					/docs
				</Link>{" "}
				to read the documentation.
			</p>
		</div>
	);
}
