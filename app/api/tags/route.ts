import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/tags - 标签列表
export async function GET(req: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/tags - 创建标签
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
