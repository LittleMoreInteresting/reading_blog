import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/blog/Header";
import { PostList } from "@/components/blog/PostList";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      tags: {
        some: { slug },
      },
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    createdAt: post.createdAt.toLocaleDateString("zh-CN"),
    views: post.views,
    tags: post.tags,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link
          href="/tags"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回标签云
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Tag className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            #{tag.name}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            共 {posts.length} 篇文章
          </span>
        </div>

        <PostList posts={formattedPosts} />
      </main>
    </div>
  );
}
