// src/app/api/newsletters/trending/route.ts
import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "15");

    const newsletters = await prisma.newsletter.findMany({
      skip,
      take,
      orderBy: [{ likes_count: "desc" }, { you_rocks_count: "desc" }, { created_at: "desc" }],
      select: {
        newsletter_id: true,
        sender: true,
        subject: true,
        html_file_url: true,
        full_screenshot_url: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        products_link: true,
        summary: true,
        tags: true,
      },
    });

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Error fetching trending newsletters:", error);
    return NextResponse.json({ error: "Failed to fetch trending newsletters" }, { status: 500 });
  }
}
