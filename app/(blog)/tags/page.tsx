import { prisma } from "@/lib/prisma";
import { TagCloud } from "@/components/blog/TagCloud";
import { Header } from "@/components/blog/Header";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
          标签云
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10">
          按标签探索感兴趣的内容
        </p>
        <TagCloud tags={tags} />
      </main>
    </div>
  );
}
