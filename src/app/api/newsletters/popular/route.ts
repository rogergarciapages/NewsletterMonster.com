import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let popularNewsletters = await prisma.newsletter.findMany({
      where: {
        OR: [{ likes_count: { gt: 0 } }, { you_rocks_count: { gt: 0 } }],
      },
      orderBy: [{ likes_count: "desc" }, { you_rocks_count: "desc" }, { created_at: "desc" }],
      take: 12,
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

    if (!popularNewsletters || popularNewsletters.length === 0) {
      popularNewsletters = await prisma.newsletter.findMany({
        orderBy: { created_at: "desc" },
        take: 12,
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
    }

    return NextResponse.json(popularNewsletters || []);
  } catch (error) {
    console.error("Error fetching popular newsletters:", error);
    return NextResponse.json([], { status: 200 });
  }
}
