import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NoteReaderClient } from "@/components/blog/NoteReaderClient";

interface NotePageProps {
  params: Promise<{ bookId: string; noteId: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { bookId, noteId } = await params;

  const book = await prisma.book.findUnique({
    where: { slug: bookId },
  });

  if (!book) {
    notFound();
  }

  const note = await prisma.post.findUnique({
    where: { slug: noteId },
    include: { tags: true },
  });

  if (!note || note.bookId !== book.id) {
    notFound();
  }

  // Get all notes in this book for navigation
  const allNotes = await prisma.post.findMany({
    where: { bookId: book.id, published: true },
    orderBy: { createdAt: "desc" },
  });

  const currentIndex = allNotes.findIndex((n) => n.id === note.id);
  const prevNote = currentIndex > 0 ? allNotes[currentIndex - 1] : null;
  const nextNote =
    currentIndex < allNotes.length - 1 ? allNotes[currentIndex + 1] : null;

  const formattedBook = {
    id: book.slug,
    title: book.title,
    coverColor: book.coverColor,
    spineColor: book.spineColor,
    emoji: book.emoji,
  };

  const formattedNote = {
    id: note.slug,
    title: note.title,
    content:
      typeof note.content === "string"
        ? tryParseContent(note.content)
        : note.content,
    createdAt: note.createdAt.toLocaleDateString("zh-CN"),
    pageNumber: note.pageNumber || currentIndex + 1,
    tags: note.tags.map((t) => t.name),
  };

  return (
    <NoteReaderClient
      book={formattedBook}
      note={formattedNote}
      currentIndex={currentIndex}
      totalNotes={allNotes.length}
      prevNote={
        prevNote
          ? { id: prevNote.slug, title: prevNote.title }
          : null
      }
      nextNote={
        nextNote
          ? { id: nextNote.slug, title: nextNote.title }
          : null
      }
    />
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
