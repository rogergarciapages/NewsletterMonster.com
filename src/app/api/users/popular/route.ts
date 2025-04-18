import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "3");

    const session = await getServerSession(authOptions);
    const userId = session?.user?.user_id;

    // Get brands the user already follows
    let brandsToExclude: string[] = [];
    if (userId) {
      const userFollows = await prisma.follow.findMany({
        where: {
          follower_id: userId,
        },
        select: {
          brand_id: true,
        },
      });

      brandsToExclude = userFollows.map(follow => follow.brand_id);
    }

    // Strategy 1: Find brands with most followers
    let popularBrands = await prisma.brand.findMany({
      select: {
        brand_id: true,
        name: true,
        logo: true,
        slug: true,
        description: true,
        _count: {
          select: {
            Follow: true,
          },
        },
      },
      orderBy: {
        Follow: {
          _count: "desc",
        },
      },
      take: limit + 10, // Fetch extra to filter out followed ones
    });

    // Filter out brands the user already follows (if logged in)
    if (userId && brandsToExclude.length > 0) {
      popularBrands = popularBrands.filter(brand => !brandsToExclude.includes(brand.brand_id));
    }

    // If we don't have enough results, get brands with popular newsletters
    if (popularBrands.length < limit) {
      const brandsWithPopularNewsletters = await prisma.brand.findMany({
        where: {
          Newsletter: {
            some: {
              OR: [{ likes_count: { gt: 0 } }, { you_rocks_count: { gt: 0 } }],
            },
          },
          // Exclude brands we already have and brands the user follows
          brand_id: {
            notIn: [...brandsToExclude, ...popularBrands.map(brand => brand.brand_id)].filter(
              Boolean
            ),
          },
        },
        select: {
          brand_id: true,
          name: true,
          logo: true,
          slug: true,
          description: true,
          _count: {
            select: {
              Follow: true,
            },
          },
          Newsletter: {
            orderBy: [{ likes_count: "desc" }, { you_rocks_count: "desc" }],
            take: 1,
            select: {
              likes_count: true,
              you_rocks_count: true,
            },
          },
        },
        orderBy: [
          {
            Newsletter: {
              _count: "desc",
            },
          },
        ],
        take: limit * 2,
      });

      // If we still don't have enough brands, use brands with any content
      if (popularBrands.length + brandsWithPopularNewsletters.length < limit) {
        const anyBrands = await prisma.brand.findMany({
          where: {
            brand_id: {
              notIn: [
                ...brandsToExclude,
                ...popularBrands.map(brand => brand.brand_id),
                ...brandsWithPopularNewsletters.map(brand => brand.brand_id),
              ].filter(Boolean),
            },
          },
          select: {
            brand_id: true,
            name: true,
            logo: true,
            slug: true,
            description: true,
            _count: {
              select: {
                Follow: true,
              },
            },
          },
          take: limit,
        });

        popularBrands = [...popularBrands, ...brandsWithPopularNewsletters, ...anyBrands];
      } else {
        popularBrands = [...popularBrands, ...brandsWithPopularNewsletters];
      }
    }

    // Format the response with the proper data structure
    const formattedBrands = popularBrands.slice(0, limit).map(brand => ({
      id: brand.brand_id,
      name: brand.name || "Unknown Brand",
      username: brand.slug || brand.brand_id,
      avatar: brand.logo,
      bio: brand.description,
      followerCount: brand._count.Follow,
    }));

    return NextResponse.json(formattedBrands);
  } catch (error) {
    console.error("Error fetching popular users:", error);
    return NextResponse.json({ error: "Failed to fetch popular users" }, { status: 500 });
  }
}
