import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/books - 书籍列表
export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST /api/books - 创建书籍
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, author, slug, description, coverColor, spineColor, emoji } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author: author || "",
        slug,
        description: description || "",
        coverColor: coverColor || "#FFD93D",
        spineColor: spineColor || "#F59E0B",
        emoji: emoji || "📚",
        userId: session.user.id as string,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/books] error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create book" },
      { status: 500 }
    );
  }
}

// DELETE /api/books?slug=xxx - 删除书籍
export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    // 检查是否有关联的文章
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book._count.posts > 0) {
      return NextResponse.json(
        { error: "Cannot delete book with associated posts" },
        { status: 409 }
      );
    }

    await prisma.book.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
