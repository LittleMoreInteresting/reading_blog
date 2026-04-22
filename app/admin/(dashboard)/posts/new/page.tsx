import { prisma } from "@/lib/prisma";
import { PostEditorForm } from "@/components/admin/PostEditorForm";

export default async function NewPostPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        写文章
      </h1>
      <PostEditorForm books={books} />
    </div>
  );
}
