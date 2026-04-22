import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditorForm } from "@/components/admin/PostEditorForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const [post, books] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑文章
      </h1>
      <PostEditorForm
        initialData={{
          ...post,
          bookId: post.bookId,
        }}
        books={books}
      />
    </div>
  );
}
