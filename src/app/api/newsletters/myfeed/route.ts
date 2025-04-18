import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // If user is not authenticated, return unauthorized
    if (!session?.user?.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Get brands that the user follows
    const followedBrands = await prisma.follow.findMany({
      where: {
        follower_id: session.user.user_id,
      },
      select: {
        brand_id: true,
      },
    });

    const brandIds = followedBrands.map(follow => follow.brand_id);

    // If user doesn't follow any brands, return empty array
    if (brandIds.length === 0) {
      return NextResponse.json({ newsletters: [], hasMore: false });
    }

    // Get newsletters from followed brands with pagination
    const newsletters = await prisma.newsletter.findMany({
      where: {
        brand_id: {
          in: brandIds,
        },
      },
      include: {
        Brand: {
          select: {
            name: true,
            logo: true,
            slug: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip: offset,
      take: limit + 1, // Take one extra to check if there are more
    });

    const hasMore = newsletters.length > limit;
    const paginatedNewsletters = hasMore ? newsletters.slice(0, limit) : newsletters;

    return NextResponse.json({
      newsletters: paginatedNewsletters,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching my feed:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}
