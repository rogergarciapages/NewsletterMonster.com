import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { brandname: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // First try to find brand by slug
    let brand = await prisma.brand.findUnique({
      where: { slug: params.brandname },
      include: {
        newsletters: {
          orderBy: { created_at: "desc" },
          skip: offset,
          take: limit,
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
          },
        },
      },
    });

    // If not found by slug, try to find by newsletter sender_slug
    if (!brand) {
      const newsletter = await prisma.newsletter.findFirst({
        where: { sender_slug: params.brandname },
        include: {
          Brand: {
            include: {
              newsletters: {
                orderBy: { created_at: "desc" },
                skip: offset,
                take: limit,
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
                },
              },
            },
          },
        },
      });

      brand = newsletter?.Brand || null;
    }

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({
      newsletters: brand.newsletters,
    });
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
