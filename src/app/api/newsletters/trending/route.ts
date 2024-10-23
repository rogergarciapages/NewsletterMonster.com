// src/app/api/newsletters/trending/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "10");

    console.log("Fetching trending newsletters with conditions:", { skip, take });

    const newsletters = await prisma.newsletter.findMany({
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
      skip,
      take,
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

    console.log("Fetched newsletters:", newsletters);

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json(
      { error: "Error fetching newsletters" },
      { status: 500 }
    );
  }
}