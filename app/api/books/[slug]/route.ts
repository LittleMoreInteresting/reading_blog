import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT /api/books/[slug] - 更新书籍
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const body = await req.json();
    const { title, author, description, coverColor, spineColor, emoji } = body;

    const existingBook = await prisma.book.findUnique({
      where: { slug },
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = await prisma.book.update({
      where: { slug },
      data: {
        title: title !== undefined ? title : undefined,
        author: author !== undefined ? author : undefined,
        description: description !== undefined ? description : undefined,
        coverColor: coverColor !== undefined ? coverColor : undefined,
        spineColor: spineColor !== undefined ? spineColor : undefined,
        emoji: emoji !== undefined ? emoji : undefined,
      },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}
