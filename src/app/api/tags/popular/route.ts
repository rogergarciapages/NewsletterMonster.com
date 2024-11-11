import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma-client";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        count: {
          gt: 0,
        },
      },
      orderBy: {
        count: "desc",
      },
      take: 25,
      select: {
        id: true,
        name: true,
        slug: true,
        count: true,
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
