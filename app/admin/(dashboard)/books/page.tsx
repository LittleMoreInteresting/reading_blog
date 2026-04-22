import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Edit } from "lucide-react";
import { DeleteBookButton } from "@/components/admin/DeleteBookButton";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          书籍管理
        </h1>
        <Link href="/admin/books/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            添加书籍
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>书籍列表</CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">
              还没有书籍，快去添加一本吧！
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>封面</TableHead>
                  <TableHead>书名</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead>笔记数</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div
                        className="w-10 h-14 rounded shadow-sm flex items-center justify-center text-lg"
                        style={{
                          background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                        }}
                      >
                        {book.emoji}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {book.title}
                    </TableCell>
                    <TableCell>{book.author || "-"}</TableCell>
                    <TableCell>{book._count.posts}</TableCell>
                    <TableCell>
                      {new Date(book.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/book/${book.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <BookOpen className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/books/${book.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        {book._count.posts === 0 && (
                          <DeleteBookButton slug={book.slug} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
