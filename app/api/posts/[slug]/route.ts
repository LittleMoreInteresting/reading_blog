import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/posts/[slug] - 文章详情
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
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

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 增加阅读量
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - 更新文章
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
    const { title, content, excerpt, coverImage, published, tags } = body;

    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 处理标签
    let tagOperations: any = {};
    if (tags && Array.isArray(tags)) {
      const tagConnectOrCreate = tags.map((tag: string) => ({
        where: { slug: tag.toLowerCase().replace(/\s+/g, "-") },
        create: {
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, "-"),
        },
      }));

      tagOperations = {
        set: [],
        connectOrCreate: tagConnectOrCreate,
      };
    }

    const post = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt: excerpt !== undefined ? excerpt || null : undefined,
        coverImage: coverImage !== undefined ? coverImage || null : undefined,
        published: published !== undefined ? published : undefined,
        publishedAt:
          published && !existingPost.publishedAt
            ? new Date()
            : published === false
            ? null
            : undefined,
        ...(tags && { tags: tagOperations }),
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

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - 删除文章
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await prisma.post.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
