import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, FileText, Eye, Clock } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

export default async function AdminDashboardPage() {
  const [totalPosts, publishedPosts, draftPosts, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { tags: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
        <Link href="/admin/posts/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <PenLine className="w-4 h-4 mr-2" />
            写文章
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="文章总数"
          value={totalPosts}
          icon={FileText}
          color="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="已发布"
          value={publishedPosts}
          icon={Eye}
          color="text-green-600 bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          label="草稿"
          value={draftPosts}
          icon={Clock}
          color="text-amber-600 bg-amber-50 dark:bg-amber-900/20"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近编辑的文章</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              还没有文章，快去写一篇吧！
            </p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700"
                        }`}
                      >
                        {post.published ? "已发布" : "草稿"}
                      </span>
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs text-amber-600 dark:text-amber-400"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      编辑
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
