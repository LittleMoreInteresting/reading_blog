import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=关键词
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ posts, query: q });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}
