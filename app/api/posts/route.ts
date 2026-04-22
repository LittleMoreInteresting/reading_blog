import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/posts - 文章列表
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";
  const publishedOnly = searchParams.get("published") !== "false";

  const skip = (page - 1) * limit;

  const where: any = {};

  if (publishedOnly) {
    where.published = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  if (tag) {
    where.tags = {
      some: {
        slug: tag,
      },
    };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/posts - 创建文章
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, excerpt, coverImage, published, tags, bookId } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug and content are required" },
        { status: 400 }
      );
    }

    // 如果没有指定 bookId，使用用户的第一个书籍或创建一个默认书籍
    let finalBookId = bookId;
    if (!finalBookId) {
      const firstBook = await prisma.book.findFirst({
        where: { userId: session.user.id as string },
        orderBy: { createdAt: "asc" },
      });
      if (firstBook) {
        finalBookId = firstBook.id;
      } else {
        const newBook = await prisma.book.create({
          data: {
            title: "未分类",
            slug: `uncategorized-${Date.now()}`,
            userId: session.user.id as string,
          },
        });
        finalBookId = newBook.id;
      }
    }

    // 处理标签
    let tagConnectOrCreate: any[] = [];
    if (tags && Array.isArray(tags)) {
      tagConnectOrCreate = tags.map((tag: string) => ({
        where: { slug: tag.toLowerCase().replace(/\s+/g, "-") },
        create: {
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, "-"),
        },
      }));
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id as string,
        bookId: finalBookId,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
