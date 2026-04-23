import { prisma } from "@/lib/prisma";
import { BookshelfClient } from "@/components/blog/BookshelfClient";

// Always render dynamically so new books appear immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  const formattedBooks = books.map((book) => ({
    id: book.slug,
    title: book.title,
    author: book.author,
    coverColor: book.coverColor,
    spineColor: book.spineColor,
    emoji: book.emoji,
    totalNotes: book._count.posts,
    description: book.description,
  }));

  return <BookshelfClient books={formattedBooks} />;
}
