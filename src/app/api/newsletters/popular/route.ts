// src/app/api/newsletters/popular/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const popularNewsletters = await prisma.newsletter.findMany({
      where: {
        OR: [
          { likes_count: { gt: 0 } },
          { you_rocks_count: { gt: 0 } },
        ],
      },
      orderBy: [
        { likes_count: "desc" },
        { you_rocks_count: "desc" },
        { created_at: "desc" },
      ],
      take: 12,  // Fixed number for homepage
      select: {
        newsletter_id: true,
        subject: true,
        top_screenshot_url: true,
        you_rocks_count: true,
        likes_count: true,
        sender: true,
        created_at: true,
        summary: true,
        user_id: true,
        html_file_url: true,
        full_screenshot_url: true,
      },
    });

    return NextResponse.json(popularNewsletters);
  } catch (error) {
    console.error("Error fetching popular newsletters:", error);
    return NextResponse.json(
      { error: "Error fetching popular newsletters" },
      { status: 500 }
    );
  }
}