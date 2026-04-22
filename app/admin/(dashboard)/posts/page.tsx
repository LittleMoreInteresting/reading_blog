import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine } from "lucide-react";
import { PostTable } from "@/components/admin/PostTable";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true, book: true },
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    published: post.published,
    views: post.views,
    createdAt: post.createdAt,
    tags: post.tags,
    book: post.book,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          文章管理
        </h1>
        <Link href="/admin/posts/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <PenLine className="w-4 h-4 mr-2" />
            写文章
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>文章列表</CardTitle>
        </CardHeader>
        <CardContent>
          <PostTable posts={formattedPosts} />
        </CardContent>
      </Card>
    </div>
  );
}
