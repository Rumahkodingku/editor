import Link from "next/link";

export const metadata = {
	title: "RumahKodingku Editor",
};

export default async function HomePage({ params }: PageProps<"/[lang]">) {
	const { lang } = await params;
	const isId = lang === "id";

	return (
		<div className="flex flex-1 flex-col justify-center text-center">
			<h1 className="mb-4 font-bold text-2xl">RumahKodingku Editor</h1>
			<p className="mb-2">
				{isId
					? "Editor teks kaya (WYSIWYG) yang dapat digunakan ulang, bertipe, dan composable, dibangun di atas Tiptap dan ProseMirror."
					: "A reusable, typed, composable WYSIWYG rich text editor built on Tiptap and ProseMirror."}
			</p>
			<p>
				<Link href={`/${lang}/docs`} className="font-medium underline">
					{isId ? "Buka dokumentasi" : "Open the documentation"}
				</Link>
			</p>
		</div>
	);
}
