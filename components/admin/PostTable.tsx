"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { DeletePostButton } from "./DeletePostButton";

interface PostTableProps {
  posts: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    views: number;
    createdAt: Date;
    tags: { id: string; name: string }[];
    book?: { slug: string } | null;
  }[];
}

export function PostTable({ posts }: PostTableProps) {
  if (posts.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-12">
        还没有文章，快去写一篇吧！
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>标题</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>标签</TableHead>
          <TableHead>阅读量</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium max-w-xs truncate">
              {post.title}
            </TableCell>
            <TableCell>
              {post.published ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 hover:bg-green-100">
                  已发布
                </Badge>
              ) : (
                <Badge variant="secondary">草稿</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs text-amber-600 dark:text-amber-400"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>{post.views}</TableCell>
            <TableCell>
              {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={
                    post.book
                      ? `/book/${post.book.slug}/note/${post.slug}`
                      : `/posts/${post.slug}`
                  }
                  target="_blank"
                >
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <DeletePostButton slug={post.slug} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
