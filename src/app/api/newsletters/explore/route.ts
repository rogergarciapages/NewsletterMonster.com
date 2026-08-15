import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "15");

    const [newsletters, totalCount] = await Promise.all([
      prisma.newsletter.findMany({
        orderBy: {
          created_at: "desc",
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
          user_id: true,
          sender_slug: true,
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
      }),
      prisma.newsletter.count(),
    ]);

    return NextResponse.json({
      newsletters: newsletters || [],
      pagination: {
        total: totalCount || 0,
        skip,
        take,
        hasMore: skip + take < (totalCount || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching all newsletters:", error);
    return NextResponse.json({
      newsletters: [],
      pagination: { total: 0, skip: 0, take: 15, hasMore: false },
    });
  }
}
