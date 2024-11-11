import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "15");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    const newsletters = await prisma.newsletter.findMany({
      where: {
        NewsletterTag: {
          some: {
            tag_id: parseInt(tagId),
          },
        },
      },
      orderBy: {
        created_at: "desc", // Latest newsletters first
      },
      skip,
      take,
      select: {
        newsletter_id: true,
        sender: true,
        subject: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        summary: true,
        NewsletterTag: {
          select: {
            Tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Error fetching newsletters by tag:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}
