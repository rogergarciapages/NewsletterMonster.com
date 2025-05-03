// src/app/api/follow/status/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json({ error: "Missing brandId" }, { status: 400 });
    }

    // Count followers
    const followersCount = await prisma.follow.count({
      where: {
        brand_id: brandId,
      },
    });

    // Check if current user follows this brand (if authenticated)
    const session = await getServerSession(authOptions);
    let isFollowing = false;

    if (session?.user?.user_id) {
      const follow = await prisma.follow.findUnique({
        where: {
          follower_id_brand_id: {
            follower_id: session.user.user_id,
            brand_id: brandId,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      isFollowing,
      followersCount,
    });
  } catch (error) {
    console.error("Error in follow status API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
