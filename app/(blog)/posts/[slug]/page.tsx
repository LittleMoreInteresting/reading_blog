import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";
import { ContentRender } from "@/components/editor/ContentRender";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { tags: true, author: { select: { name: true } } },
  });

  if (!post) {
    notFound();
  }

  // increment views
  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {post.coverImage && (
            <div className="w-full h-56 md:h-72 bg-gray-100 dark:bg-gray-700">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views + 1} 阅读
              </span>
              {post.author?.name && (
                <span>作者：{post.author.name}</span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ContentRender content={post.content} />
            </div>

            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="text-sm text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
