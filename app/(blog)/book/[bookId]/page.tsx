import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookDirectoryClient } from "@/components/blog/BookDirectoryClient";

interface BookPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;

  const book = await prisma.book.findUnique({
    where: { slug: bookId },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { tags: true },
      },
    },
  });

  if (!book) {
    notFound();
  }

  const formattedBook = {
    id: book.slug,
    title: book.title,
    author: book.author,
    coverColor: book.coverColor,
    spineColor: book.spineColor,
    emoji: book.emoji,
    totalNotes: book.posts.length,
    description: book.description,
  };

  const formattedNotes = book.posts.map((post, index) => ({
    id: post.slug,
    bookId: book.slug,
    title: post.title,
    content:
      typeof post.content === "string"
        ? tryParseContent(post.content)
        : post.content,
    pageNumber: post.pageNumber || index + 1,
    createdAt: post.createdAt.toLocaleDateString("zh-CN"),
    tags: post.tags.map((t) => t.name),
  }));

  return (
    <BookDirectoryClient book={formattedBook} notes={formattedNotes} />
  );
}

function tryParseContent(content: string): string {
  try {
    const parsed = JSON.parse(content);
    if (parsed.type === "doc" && Array.isArray(parsed.content)) {
      return parsed.content
        .map((node: any) => {
          if (node.type === "paragraph" && Array.isArray(node.content)) {
            return node.content.map((c: any) => c.text || "").join("");
          }
          return "";
        })
        .filter(Boolean)
        .join("\n\n");
    }
  } catch {
    // not JSON, return as-is
  }
  return content;
}
